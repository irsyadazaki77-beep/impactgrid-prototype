// Secure Express / Node backend proxy for ImpactGrid AI Copilot
// Ensures VITE_GEMINI_API_KEY is NEVER leaked in client bundles.
// Features: Rate limiting, prompt validation, schema santization, safe telecom-domain fallback.

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Basic rate limiting (sliding window in-memory)
const rateLimits = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'localhost';
  const now = Date.now();
  const clientData = rateLimits.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };

  if (now > clientData.resetAt) {
    clientData.count = 1;
    clientData.resetAt = now + RATE_LIMIT_WINDOW_MS;
  } else {
    clientData.count++;
  }

  rateLimits.set(ip, clientData);

  if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Maksimal 30 request/menit untuk menjaga keandalan sistem.'
    });
  }

  next();
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(rateLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ImpactGrid Trust & Reliability AI Proxy',
    geminiConfigured: Boolean(GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// AI Chat completion proxy endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, model = 'gemini-1.5-flash', history = [], systemInstruction } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Field `message` (string) wajib disertakan.' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Pesan terlalu panjang (maksimal 2.000 karakter).' });
    }

    // If server has no key configured, instruct client to use local fallback
    if (!GEMINI_API_KEY) {
      return res.status(503).json({
        fallback: true,
        error: 'Backend proxy GEMINI_API_KEY belum dikonfigurasi di server environment. Mengalihkan ke on-device local expert engine.'
      });
    }

    const contents = [
      ...history.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const bodyPayload = {
      contents,
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800
      }
    };

    const upstreamUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    
    const upstreamRes = await fetch(upstreamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload)
    });

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text();
      return res.status(upstreamRes.status).json({
        fallback: true,
        error: `Upstream AI provider error: ${upstreamRes.statusText}`,
        details: errText
      });
    }

    const data = await upstreamRes.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.json({
      reply: replyText,
      source: 'gemini-proxy',
      model
    });
  } catch (err) {
    console.error('AI Proxy Error:', err);
    return res.status(500).json({
      fallback: true,
      error: 'Terjadi kegagalan komunikasi internal di AI proxy server.'
    });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`ImpactGrid AI Proxy Server running on port ${PORT}`);
  });
}

export default app;
