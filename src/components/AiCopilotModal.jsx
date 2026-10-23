import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  ChevronDown, 
  ShieldAlert, 
  Cpu, 
  Zap, 
  TrendingDown, 
  HelpCircle,
  Key,
  Settings,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Sliders,
  Radio,
  FileCheck,
  DollarSign
} from 'lucide-react';

const PRESET_QUESTIONS = [
  {
    q: "Lihat simulasi efisiensi energi shelter dengan asumsi yang tersedia.",
    category: "Simulasi",
    action: {
      type: 'APPLY_OPTIMIZATION',
      label: 'Lihat simulasi lokal',
    }
  },
  {
    q: "Lihat skenario ilustratif gangguan listrik.",
    category: "Simulasi",
    action: {
      type: 'SWITCH_SCENARIO',
      label: 'Lihat skenario gangguan (konsep)',
      scenarioKey: 'blackout_sumatera'
    }
  },
  {
    q: "Apa nilai tambah ImpactGrid dibanding fitur efisiensi energi RAN yang sudah tersedia?",
    category: "Architecture",
    tab: "telemetry"
  },
  {
    q: "Bagaimana cara sistem mendeteksi Phantom Load / Kebocoran Daya Shelter?",
    category: "Anomaly",
    tab: "telemetry"
  },
  {
    q: "Apakah penurunan daya ini berisiko menurunkan SLA panggilan darurat 112?",
    category: "Network SLA",
    tab: "overview"
  },
  {
    q: "Bagaimana bukti bahwa proyek ini Self-Funding dan bukan bakar CapEx?",
    category: "Financial",
    tab: "financial"
  },
  {
    q: "Bagaimana ITU-T L.1331 dapat menjadi rujukan pengukuran efisiensi energi jaringan?",
    category: "ESG Audit",
    tab: "esg"
  },
  {
    q: "Bagaimana rancangan prioritisasi dapat mempertimbangkan biaya, layanan, dan ESG?",
    category: "DSS Knapsack",
    tab: "optimization"
  }
];

function readSavedApiKey() {
  try { return localStorage.getItem('impactgrid_gemini_api_key') || ''; } catch { return ''; }
}

function saveApiKey(value) {
  try { localStorage.setItem('impactgrid_gemini_api_key', value); } catch { /* The local assistant remains available without storage. */ }
}

const LOCAL_KNOWLEDGE_BASE = {
  vendor: {
    title: "Integrasi vendor: konsep yang perlu dikaji",
    answer: "ImpactGrid adalah rancangan sistem pendukung keputusan. Prototype ini belum terhubung ke sistem vendor atau antarmuka O-RAN. Ketersediaan API, hak akses, lisensi, keamanan, dan kewenangan aset perlu dikaji bersama operator dan vendor sebelum integrasi dirancang.",
    suggestedTab: "telemetry",
    suggestedTabLabel: "Buka rancangan konsolidasi data"
  },
  phantom: {
    title: "Deteksi anomali: kebutuhan data dan validasi",
    answer: "Prototype menampilkan contoh alur deteksi, bukan temuan lapangan. Deteksi memerlukan data meter dan sub-meter yang sinkron, baseline yang disetujui, aturan kualitas data, serta pemeriksaan teknisi. Penyebab anomali tidak dapat disimpulkan dari contoh sintetis.",
    suggestedTab: "telemetry",
    suggestedTabLabel: "Lihat rancangan konsolidasi data"
  },
  sla: {
    title: "Keselamatan jaringan dan layanan darurat",
    answer: "Prototype tidak terhubung ke jaringan dan tidak menguji QoS, latency, rollback, cakupan, atau layanan darurat 112. Sebelum pilot, operator harus menetapkan batas keselamatan dan prosedur rollback, lalu meninjau serta menguji semuanya dalam lingkungan yang disetujui. Tidak ada jaminan kinerja pada tahap ini.",
    suggestedTab: "overview",
    suggestedTabLabel: "Lihat daftar validasi yang diperlukan"
  },
  financial: {
    title: "Kelayakan finansial: hasil masih berupa sensitivitas",
    answer: "CapEx Rp450 juta dan OpEx Rp60 juta per tahun adalah asumsi proposal, bukan penawaran atau biaya aktual. Dengan asumsi hemat 8%, biaya energi yang dihindari Rp1.500/kWh, diskonto 10%, serta jadwal arus kas model, NPV indikatif sekitar minus Rp391,5 juta untuk baseline 50 kWh/lokasi/hari dan plus Rp82,3 juta untuk baseline 50 MWh/lokasi/tahun. Kedua baseline belum diverifikasi; angka ini bukan forecast atau bukti proyek layak. Periksa meter, tagihan, kontrak, biaya, dan pembagian manfaat terlebih dahulu.",
    suggestedTab: "financial",
    suggestedTabLabel: "Buka model sensitivitas"
  },
  esg: {
    title: "Rancangan pengukuran energi dan emisi",
    answer: "Pengukuran sebelum/sesudah dengan lokasi pembanding dapat dikaji sebagai rancangan evaluasi, dengan penyesuaian trafik, cuaca, dan karakter lokasi. Proposal mengusulkan merujuk ITU-T L.1331 untuk indikator konsumsi energi jaringan. Belum ada hasil DiD atau reduksi emisi pilot. Faktor emisi harus dipilih dari sumber resmi yang sesuai periode dan batas inventaris; kesesuaian pengungkapan perlu ditelaah tim ESG. Hash hanya membantu memeriksa integritas berkas, bukan membuktikan kebenaran sumber datanya.",
    suggestedTab: "esg",
    suggestedTabLabel: "Buka kerangka validasi ESG"
  },
  knapsack: {
    title: "Prioritisasi: rancangan metode, belum rekomendasi",
    answer: "Prototype memperagakan pemeringkatan portofolio dengan data sintetis. Metode nyata memerlukan data lokasi, biaya, manfaat, kelayakan teknis, dan batas layanan yang disahkan pemilik data. Bobot, batas, dan persetujuan manusia harus ditetapkan sebelum penggunaan; prototype tidak mengirim konfigurasi atau keputusan ke jaringan.",
    suggestedTab: "optimization",
    suggestedTabLabel: "Buka simulasi prioritisasi"
  }
};

const SYSTEM_PROMPT = "Anda adalah asisten untuk prototype proposal ImpactGrid oleh Tim AWAKENING Reborn. Jawab ringkas, profesional, dan dalam bahasa Indonesia.\\n\\n" +
  "ATURAN FAKTA:\\n" +
  "- Prototype ini demonstrasi lokal dan tidak memiliki dataset site operasional. Beberapa input atau log hanya contoh dan asumsi. Prototype tidak terhubung ke sistem, jaringan, meter, vendor, BMKG, PLN, atau data operasional Telkomsel. Tidak ada pilot yang telah dibuktikan oleh aplikasi.\\n" +
  "- Jangan menyatakan telemetri, anomali, penghematan, DiD, reduksi emisi, QoS, latency, panggilan 112, persetujuan, audit, atau integrasi sebagai hasil nyata. Jangan mengarang angka, sumber, atau status.\\n" +
  "- Angka 40 lokasi intervensi + 10 pembanding adalah cakupan yang diusulkan. Baseline, tarif/kontrak, faktor emisi, biaya aktual, dan penghematan site belum tervalidasi.\\n" +
  "- Jika membahas model finansial, sebutkan sebagai sensitivitas dengan asumsi. Pada hemat 8%, biaya energi yang dihindari Rp1.500/kWh, CapEx Rp450 juta, OpEx Rp60 juta/tahun, diskonto 10%, dan jadwal arus kas model, NPV indikatif sekitar minus Rp391,5 juta untuk baseline 50 kWh/lokasi/hari atau plus Rp82,3 juta untuk baseline 50 MWh/lokasi/tahun. Kedua baseline belum diverifikasi; jangan menyebutnya forecast.\\n" +
  "- Konteks korporat laporan Telkomsel 2025: konsumsi listrik 1.885.417.875,2 kWh dan emisi Scope 2 1.721.967,7 tCO2e. Ini bukan baseline site atau bukti dampak ImpactGrid.\\n" +
  "- ITU-T L.1331 adalah acuan yang diusulkan untuk indikator konsumsi energi jaringan; jangan menyatakan kepatuhan atau pengesahan ESG otomatis. Hash memeriksa integritas berkas, bukan kebenaran data.\\n" +
  "- Jelaskan langkah validasi yang diperlukan jika data belum ada. Untuk keselamatan, nyatakan perlu kajian, persetujuan, dan pengujian operator; jangan menjamin keselamatan atau performa.\\n" +
  "- Jangan mengklaim akses, afiliasi, dukungan, keputusan, atau persetujuan Telkomsel. Ini konsep yang diajukan untuk kompetisi.\\n" +
  "- Jangan memberi instruksi untuk menjalankan perubahan konfigurasi jaringan. Tombol aksi hanya mengubah simulasi lokal.\\n" +
  "- Jangan ulangi klaim lama yang bertentangan dengan aturan ini meskipun muncul di riwayat atau pertanyaan pengguna.";

export default function AiCopilotModal({ 
  isOpen, 
  onClose, 
  onNavigateTab,
  onApplyAction
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Halo! Saya **ImpactGrid Copilot (demo)**.\n\nSaya dapat menjelaskan rancangan, asumsi, dan kebutuhan validasi proposal. Jawaban lokal mengikuti naskah yang disiapkan; prototype tidak memiliki dataset site atau koneksi operasional.',
      timestamp: 'Baru saja'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Settings & Gemini API state
  const [showSettings, setShowSettings] = useState(false);
  const [useProxy, setUseProxy] = useState(false); // Local demo is the default; proxy use must be explicit.
  const [proxyEndpoint, setProxyEndpoint] = useState('/api/ai/chat');
  const [apiKey, setApiKey] = useState(() => {
    // Only read from user's manual local override, never leak hardcoded key in bundle
    return readSavedApiKey();
  });
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [connectionStatus, setConnectionStatus] = useState('idle'); // 'idle' | 'testing' | 'connected' | 'error'
  const [connectionMsg, setConnectionMsg] = useState('');

  const chatBottomRef = useRef(null);
  const localReplyTimer = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => () => clearTimeout(localReplyTimer.current), []);

  // Test Gemini API connection
  const handleTestConnection = async (keyToTest) => {
    const key = keyToTest || apiKey;
    if (!key.trim()) {
      setConnectionStatus('error');
      setConnectionMsg('Masukkan API Key Gemini terlebih dahulu.');
      return;
    }

    setConnectionStatus('testing');
    setConnectionMsg('Menghubungkan ke server Google Gemini...');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Ping. Balas satu kata: 'Connected'." }] }]
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP error ${response.status}`);
      }

      setConnectionStatus('connected');
      setConnectionMsg(`Uji koneksi API berhasil (${selectedModel}).`);
      saveApiKey(key);
    } catch (err) {
      console.warn("Gemini connection test failed:", err);
      setConnectionStatus('error');
      setConnectionMsg(`Uji koneksi gagal: ${err.message}. Jawaban lokal berbasis aturan tetap tersedia.`);
    }
  };

  const handleSaveApiKey = () => {
    saveApiKey(apiKey.trim());
    if (apiKey.trim()) {
      handleTestConnection(apiKey.trim());
    } else {
      setConnectionStatus('idle');
      setConnectionMsg('Jawaban lokal berbasis aturan digunakan.');
    }
    setShowSettings(false);
  };

  if (!isOpen) return null;

  // Local fallback response router
  const getLocalResponse = (query) => {
    const lower = query.toLowerCase();
    
    if (lower.includes('optimalkan') || lower.includes('rekomendasi ai') || lower.includes('efisiensi energi shelter')) {
      return {
        title: "Simulasi lokal: bukan rekomendasi operasional",
        answer: "Prototype hanya mengubah tampilan simulasi lokal. Belum ada data site, hasil penghematan, pemeriksaan QoS, atau rekomendasi yang dapat diterapkan. Untuk menghitung peluang nyata, validasi data meter, trafik, cuaca, biaya, dan batas layanan terlebih dahulu.",
        suggestedTab: 'optimization',
        suggestedTabLabel: 'Lihat simulasi prioritisasi',
        actionData: {
          type: 'APPLY_OPTIMIZATION',
          label: 'Lihat simulasi lokal',
          payload: { carrierSleepActive: true, tempC: 26, plnTariffIDR: 1500 }
        }
      };
    } else if (lower.includes('blackout') || lower.includes('sumatera') || lower.includes('grid collapse')) {
      return {
        title: "Skenario gangguan listrik ilustratif",
        answer: "Skenario ini hanya mengubah parameter tampilan prototype. Ia tidak memodelkan ketahanan sistem secara tervalidasi, tidak berkomunikasi dengan PLN atau operator, dan tidak membuktikan kontinuitas layanan maupun panggilan darurat.",
        suggestedTab: 'scenariolab',
        suggestedTabLabel: 'Buka Scenario Lab',
        actionData: {
          type: 'SWITCH_SCENARIO',
          label: 'Lihat skenario lokal',
          scenarioKey: 'blackout_sumatera'
        }
      };
    } else if (lower.includes('vendor') || lower.includes('huawei') || lower.includes('ericsson') || lower.includes('zte') || lower.includes('nokia') || lower.includes('bawaan') || lower.includes('diferensiasi') || lower.includes('o-ran') || lower.includes('smo')) {
      return LOCAL_KNOWLEDGE_BASE.vendor;
    } else if (lower.includes('phantom') || lower.includes('bocor') || lower.includes('rectifier') || lower.includes('pln') || lower.includes('theft') || lower.includes('anomali') || lower.includes('curi')) {
      return LOCAL_KNOWLEDGE_BASE.phantom;
    } else if (lower.includes('sla') || lower.includes('112') || lower.includes('darurat') || lower.includes('qos') || lower.includes('drop call') || lower.includes('mati') || lower.includes('keandalan') || lower.includes('resiko') || lower.includes('risiko')) {
      return LOCAL_KNOWLEDGE_BASE.sla;
    } else if (lower.includes('biaya') || lower.includes('capex') || lower.includes('cfo') || lower.includes('duit') || lower.includes('dana') || lower.includes('self-funding') || lower.includes('bakar') || lower.includes('opex') || lower.includes('npv') || lower.includes('irr') || lower.includes('payback')) {
      return LOCAL_KNOWLEDGE_BASE.financial;
    } else if (lower.includes('esg') || lower.includes('did') || lower.includes('difference') || lower.includes('itu-t') || lower.includes('karbon') || lower.includes('co2') || lower.includes('pojk') || lower.includes('ifrs') || lower.includes('audit') || lower.includes('sha-256')) {
      return LOCAL_KNOWLEDGE_BASE.esg;
    } else if (lower.includes('knapsack') || lower.includes('prioritas') || lower.includes('dss') || lower.includes('alokasi') || lower.includes('anggaran') || lower.includes('pareto') || lower.includes('lensa')) {
      return LOCAL_KNOWLEDGE_BASE.knapsack;
    } else {
      return {
        title: "Rancangan ImpactGrid",
        answer: "ImpactGrid adalah konsep sistem pendukung keputusan dengan empat area: konsolidasi data, simulasi, prioritisasi, dan kerangka pengukuran ESG. Prototype memakai data sintetis, belum terhubung ke sumber operasional, dan belum menghasilkan rekomendasi atau bukti dampak. Tinjau asumsi serta kebutuhan validasinya di tab terkait.",
        suggestedTab: 'telemetry',
        suggestedTabLabel: 'Eksplorasi Modul di Tab Telemetri'
      };
    }
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text: query, timestamp: timeStr };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const activeKey = apiKey.trim() || readSavedApiKey();

    // 1. Try secure backend proxy first if enabled
    if (useProxy) {
      try {
        const proxyRes = await fetch(proxyEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            model: selectedModel,
            history: messages.slice(-4),
            systemInstruction: SYSTEM_PROMPT
          })
        });

        if (proxyRes.ok) {
          const proxyData = await proxyRes.json();
          if (proxyData?.reply) {
            setMessages(prev => [...prev, {
              sender: 'ai',
              text: proxyData.reply,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              source: 'gemini-proxy'
            }]);
            setIsTyping(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend AI proxy unavailable, trying client key or local fallback:', err);
      }
    }

    // 2. Direct client call ONLY if user explicitly input a manual personal key in settings
    if (activeKey) {
      try {
        // Build multi-turn contents
        const historyContents = messages.slice(-4).map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

        const bodyPayload = {
          contents: [
            ...historyContents,
            { role: 'user', parts: [{ text: query }] }
          ],
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600
          }
        };

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${activeKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload)
        });

        if (res.ok) {
          const data = await res.json();
          const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            setMessages(prev => [...prev, {
              sender: 'ai',
              text: generatedText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              source: 'gemini-direct'
            }]);
            setIsTyping(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Direct Gemini API call failed, falling back to local engine:", err);
      }
    }

    // FALLBACK: INSTANT ON-DEVICE TELECOM LOCAL EXPERT ENGINE
    localReplyTimer.current = setTimeout(() => {
      const localResult = getLocalResponse(query);
      const formatted = `**${localResult.title}**\n\n${localResult.answer}`;
      
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: formatted,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'local',
        suggestedTab: localResult.suggestedTab,
        suggestedTabLabel: localResult.suggestedTabLabel,
        actionData: localResult.actionData
      }]);
      setIsTyping(false);
    }, 450);
  };

  const hasExternalReply = messages.some((message) => ['gemini-proxy', 'gemini-direct'].includes(message.source));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl flex flex-col h-[620px] max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ED0226]/20 border border-[#ED0226]/50 flex items-center justify-center text-[#ED0226] shadow-inner shrink-0">
              <Bot className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">ImpactGrid AI Reasoning Copilot</span>
                {hasExternalReply ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Model eksternal telah memberi jawaban
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    Jawaban lokal berbasis naskah
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-2">
                <span>Data sintetis • QoS belum diuji • model sensitivitas</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                showSettings 
                  ? 'bg-slate-800 text-white border border-slate-700' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Pengaturan Koneksi Google Gemini API"
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-[11px] text-slate-300">API Key</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible API Settings Bar */}
        {showSettings && (
          <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 text-xs text-white animate-in slide-in-from-top-2 duration-150 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-slate-200 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Pengaturan model eksternal (opsional)</span>
              </div>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 underline font-medium"
              >
              <span>Buka Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-slate-200">
                <input type="checkbox" checked={useProxy} onChange={(event) => setUseProxy(event.target.checked)} />
                <span>Izinkan koneksi backend AI (opsional)</span>
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Tempel Google Gemini API Key di sini (AIzaSy...)"
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
              />
              <button
                type="button"
                onClick={() => handleTestConnection()}
                disabled={connectionStatus === 'testing' || !apiKey.trim()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer transition shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus === 'testing' ? 'animate-spin text-amber-400' : ''}`} />
                <span>Tes Koneksi</span>
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-3.5 py-1.5 rounded-lg bg-[#ED0226] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            </div>

            {connectionMsg && (
              <div className={`mt-2 text-[11px] flex items-center gap-1.5 ${
                connectionStatus === 'connected' ? 'text-emerald-400' : 
                connectionStatus === 'error' ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {connectionStatus === 'connected' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{connectionMsg}</span>
              </div>
            )}
            <p className="mt-1.5 text-[10px] text-slate-400">
              API key disimpan di browser perangkat ini. Jika layanan eksternal tidak tersedia, aplikasi memakai jawaban lokal berbasis aturan; ketersediaan jawaban tidak dijamin.
            </p>
          </div>
        )}

        {/* Preset Quick Chips */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar shrink-0">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#ED0226]" /> Tanya Cepat:
          </span>
          {PRESET_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.q)}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-red-300 text-slate-700 hover:text-[#ED0226] text-[11px] font-medium shrink-0 cursor-pointer transition shadow-2xs hover:bg-red-50/50"
            >
              <strong className="text-slate-900">{item.category}:</strong> {item.q.slice(0, 30)}...
            </button>
          ))}
        </div>

        {/* Message Viewport */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/60 text-xs">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex gap-2.5 sm:gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-red-100 border border-red-200 text-[#ED0226] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              
              <div className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-4 py-3 leading-relaxed shadow-2xs ${
                msg.sender === 'user' 
                  ? 'bg-[#ED0226] text-white rounded-tr-xs' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
              }`}>
                {msg.sender === 'ai' && msg.source && (
                  <div className="flex items-center gap-1 mb-1.5">
                    {['gemini', 'gemini-proxy', 'gemini-direct'].includes(msg.source) ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                        Jawaban model eksternal
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                        <Cpu className="w-2.5 h-2.5 text-blue-600" />
                        Jawaban lokal berbasis naskah
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-line text-[12px] font-sans">
                  {msg.text}
                </div>

                {/* Interactive Action Button (Showstopper Feature) */}
                {msg.actionData && onApplyAction && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        onApplyAction(msg.actionData);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-[11px] cursor-pointer transition shadow-xs hover:shadow-md animate-pulse"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>{msg.actionData.label || 'Eksekusi Aksi'}</span>
                    </button>
                    <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Hanya membuka tampilan demo lokal
                    </span>
                  </div>
                )}

                {/* Suggested Tab Action Pill */}
                {msg.suggestedTab && onNavigateTab && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        onNavigateTab(msg.suggestedTab);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] cursor-pointer transition shadow-2xs"
                    >
                      <span>{msg.suggestedTabLabel || 'Buka Layar Terkait'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <span className="text-[9px] text-slate-400">1-Klik ke Modul</span>
                  </div>
                )}

                <div className={`text-[9px] mt-1.5 flex justify-end ${msg.sender === 'user' ? 'text-red-100' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 shadow-2xs">
                  BoD
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-slate-400 text-xs italic">
              <div className="w-7 h-7 rounded-xl bg-red-50 border border-red-100 text-[#ED0226] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 text-[11px] text-slate-500 shadow-2xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                <span>Menyiapkan jawaban dari informasi yang tersedia...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tanyakan tentang rancangan, asumsi, atau data yang perlu divalidasi..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ED0226] font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#ED0226] hover:bg-[#c80220] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Jawaban lokal tersedia; koneksi model eksternal bersifat opsional
            </span>
            <span>Shortcut: <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200 font-mono">Enter</kbd></span>
          </div>
        </div>

      </div>
    </div>
  );
}
