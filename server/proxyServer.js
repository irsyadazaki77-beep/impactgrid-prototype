// Optional server-side AI proxy. The browser never receives the provider key.
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const ALLOWED_MODELS = new Set(['gemini-2.5-flash']);
const MAX_REQUESTS_PER_WINDOW = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateLimits = new Map();
const configuredOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean);
const SYSTEM_INSTRUCTION = `Anda adalah asisten untuk prototype proposal ImpactGrid. Jawab ringkas dan profesional dalam bahasa Indonesia. Prototype ini memakai contoh dan asumsi, tidak memiliki dataset lokasi operasional, tidak terhubung ke jaringan, dan tidak membuktikan hasil pilot, penghematan, QoS, SLA, emisi, audit, atau persetujuan. Jangan mengarang fakta atau angka, jangan mengklaim kemampuan operasional nyata. Angka dan skenario yang terlihat adalah simulasi. Jelaskan bahwa baseline, biaya, kontrak, data, dan faktor emisi perlu diverifikasi.`;

app.disable('x-powered-by');
app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false);
app.use(cors({
  origin(origin, callback) {
    if (!origin || configuredOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  maxAge: 600,
}));
app.use(express.json({ limit: '16kb', strict: true }));

function rateLimiter(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  let client = rateLimits.get(key);
  if (!client || now >= client.resetAt) {
    client = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimits.set(key, client);
  }
  client.count += 1;
  if (client.count > MAX_REQUESTS_PER_WINDOW) {
    res.set('Retry-After', String(Math.ceil((client.resetAt - now) / 1000)));
    return res.status(429).json({ fallback: true, error: 'Batas permintaan sementara tercapai. Gunakan jawaban lokal atau coba lagi nanti.' });
  }
  return next();
}

app.use('/api', rateLimiter);

app.get('/api/health', (_req, res) => res.json({
  status: 'ok',
  service: 'ImpactGrid optional AI proxy',
  aiAvailable: Boolean(GEMINI_API_KEY),
}));

app.post('/api/ai/chat', async (req, res) => {
  const { message, model = 'gemini-2.5-flash', history = [] } = req.body ?? {};
  if (typeof message !== 'string' || !message.trim() || message.length > 2000) {
    return res.status(400).json({ fallback: true, error: 'Pesan wajib berupa teks 1–2.000 karakter.' });
  }
  if (typeof model !== 'string' || !ALLOWED_MODELS.has(model)) {
    return res.status(400).json({ fallback: true, error: 'Model yang diminta tidak diizinkan.' });
  }
  if (!Array.isArray(history) || history.length > 6 || history.some((item) =>
    !item || !['user', 'ai', 'model'].includes(item.sender) || typeof item.text !== 'string' || item.text.length > 2000
  )) {
    return res.status(400).json({ fallback: true, error: 'Riwayat percakapan tidak valid.' });
  }
  if (!GEMINI_API_KEY) {
    return res.status(503).json({ fallback: true, error: 'Layanan model eksternal tidak dikonfigurasi. Jawaban lokal tetap tersedia.' });
  }

  const contents = [
    ...history.map(({ sender, text }) => ({
      role: sender === 'user' ? 'user' : 'model',
      parts: [{ text: text.slice(0, 2000) }],
    })),
    { role: 'user', parts: [{ text: message.trim() }] },
  ];
  try {
    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!upstream.ok) {
      return res.status(502).json({ fallback: true, error: 'Layanan AI eksternal sedang tidak tersedia. Jawaban lokal tetap tersedia.' });
    }
    const data = await upstream.json();
    const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
    if (!reply) return res.status(502).json({ fallback: true, error: 'Layanan AI tidak mengembalikan jawaban. Jawaban lokal tetap tersedia.' });
    return res.json({ reply, source: 'gemini-proxy', model });
  } catch {
    return res.status(502).json({ fallback: true, error: 'Layanan AI eksternal tidak dapat dijangkau. Jawaban lokal tetap tersedia.' });
  }
});

app.use((err, _req, res, _next) => {
  if (err?.type === 'entity.too.large' || err instanceof SyntaxError) {
    return res.status(400).json({ fallback: true, error: 'Permintaan tidak valid atau terlalu besar.' });
  }
  return res.status(500).json({ fallback: true, error: 'Terjadi kegagalan internal. Jawaban lokal tetap tersedia.' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`ImpactGrid optional AI proxy listening on port ${PORT}`));
}

export default app;
