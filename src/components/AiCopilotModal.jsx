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
    q: "Optimalkan efisiensi energi shelter sekarang dengan rekomendasi AI!",
    category: "⚡ Action",
    action: {
      type: 'APPLY_OPTIMIZATION',
      label: 'Terapkan Rekomendasi AI',
      payload: { carrierSleepActive: true, tempC: 26, plnTariffIDR: 1500 }
    }
  },
  {
    q: "Simulasikan skenario Blackout PLN Grid Sumatera untuk melihat resiliensi sistem!",
    category: "⚡ Action",
    action: {
      type: 'SWITCH_SCENARIO',
      label: 'Simulasi Blackout Sumatera',
      scenarioKey: 'blackout_sumatera'
    }
  },
  {
    q: "Apa diferensiasi ImpactGrid dibanding fitur sleep mode bawaan vendor Telkomsel?",
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
    q: "Bagaimana metodologi Difference-in-Differences (DiD) ITU-T L.1331 memverifikasi audit ESG?",
    category: "ESG Audit",
    tab: "esg"
  },
  {
    q: "Bagaimana algoritma Knapsack DSS menyeimbangkan trade-off CFO, CTO, dan ESG?",
    category: "DSS Knapsack",
    tab: "optimization"
  }
];

const LOCAL_KNOWLEDGE_BASE = {
  vendor: {
    title: "Orkestrasi Vendor-Agnostic vs Silo Vendor (O-RAN O1)",
    answer: `**Perbedaan Mendasar:**
• **Fitur Vendor Bawaan (Huawei iMaster MAE, Ericsson ENM, ZTE NetNumen, Nokia NetAct):** Bekerja secara terisolasi (*vendor silo*). Tiap vendor hanya mengoptimalkan radionya sendiri, tidak tahu telemetri smart meter PLN, tidak ada rekonsiliasi beban shelter HVAC, dan tidak saling bicara jika satu cluster terdiri dari vendor campuran.
• **ImpactGrid (Cross-Domain SMO / Non-RT RIC):** Bekerja di lapisan atas menggunakan standar antarmuka **O-RAN O1 (Netconf/YANG)**. Mengorkestrasi kebijakan penghematan seragam di 293.000 BTS, menggabungkan data cuaca BMKG real-time, rekonsiliasi tagihan PLN AMR, dan mengeliminasi ketergantungan *vendor lock-in*.`,
    suggestedTab: 'telemetry',
    suggestedTabLabel: 'Buka Tab Telemetri (Modul 1)'
  },
  phantom: {
    title: "Deteksi Phantom Load & Inefisiensi Rectifier Shelter",
    answer: `**Mekanisme Deteksi Anomali Daya:**
• ImpactGrid membandingkan telemetri daya dari Smart Meter PLN (AMR/AMI) dengan daya riil yang dikonsumsi sub-sistem Radio (RU/DU).
• **Kondisi Normal:** Saat radio masuk sleep-mode, konsumsi daya total shelter harus turun proporsional.
• **Indikasi Phantom Load:** Jika radio sleep namun kWh PLN tetap tinggi (>100 Watt di atas baseline), algoritma menandai *⚠️ Phantom Load Anomaly*.
• **Akar Masalah Terdeteksi:** Penurunan efisiensi konversi rectifier (<88%), kompresor AC inverter bocor refrigerant, atau indikasi penyalahgunaan listrik cadangan genset di shelter remote.`,
    suggestedTab: 'telemetry',
    suggestedTabLabel: 'Lihat Deteksi Anomali di Tab Telemetri'
  },
  sla: {
    title: "Multi-Layer Safety Guardrail & Panggilan Darurat 112",
    answer: `**Jaminan Keandalan Telekomunikasi (Zero QoS Degradation):**
• **Hard-Locked Emergency Channels:** Kanal darurat nasional 112 dan carrier VIP prioritas dikunci 100% aktif (non-sleepable permanent).
• **Fast-Wakeup O-RAN (<120ms):** Jika terjadi lonjakan beban trafik mendadak >15% atau pemicu sinyal gempa/bencana BMKG, seluruh power amplifier yang tidur dibangunkan kembali dalam waktu kurang dari 120 milidetik.
• **Strict QoS Threshold:** Batas probabilitas *Drop Call Rate* dijaga ketat di bawah 0,001% (SLA availability 99,98%). Jika threshold terlampaui, sistem otomatis *rollback* ke daya penuh.`,
    suggestedTab: 'overview',
    suggestedTabLabel: 'Uji Respon di CTO Stress-Test (Hotkey S)'
  },
  financial: {
    title: "Self-Funding Reinvestment Loop (Bebas Beban Kas Korporat)",
    answer: `**Struktur Finansial Mandiri (Tanpa Bakar Uang):**
• **Fase 1 Pilot (40 BTS, CapEx Rp450 Juta):** Menghemat listrik 201.500 kWh/tahun = OpEx turun Rp240 Juta/tahun. Periode *Payback* hanya 1,9 tahun.
• **Mekanisme Reinvestment Loop:** 50% dari penghematan kas operasional ditahan ke dalam *Green Reinvestment Pool* untuk mendanai CapEx Fase 2 (5.000 BTS, Rp6,5 M) dan Fase 3 (10.000 BTS, Rp15 M).
• **Nilai Finansial 5 Tahun:** Menghasilkan Net Present Value (NPV) kumulatif **+Rp41,48 Miliar** dan Internal Rate of Return (IRR) **42,3%** pada WACC 9,5%.`,
    suggestedTab: 'financial',
    suggestedTabLabel: 'Buka Model Finansial & Proyeksi 5 Tahun'
  },
  esg: {
    title: "Metodologi Difference-in-Differences (DiD) ITU-T L.1331",
    answer: `**Verifikasi Ilmiah Penurunan Emisi Tanpa Bias:**
• **Tantangan Verifikasi Konvensional:** Penurunan daya sering diklaim karena sleep-mode, padahal bisa jadi karena trafik turun atau cuaca sedang dingin.
• **Solusi DiD ImpactGrid:** Menguji **40 site intervensi** terhadap **10 site kontrol** dengan profil iklim dan demografi identik di periode pra-uji vs pasca-uji.
• **Hasil Bersih:** Membuktikan penghematan riil sebesar **201.500 kWh/tahun** dan penurunan emisi **175,3 ton CO2e/tahun**, diakui penuh untuk pelaporan POJK 51, IFRS S1/S2, dan IDX ESG. Seluruh log transaksi ditandatangani secara kriptografis dengan SHA-256 tamper-proof.`,
    suggestedTab: 'esg',
    suggestedTabLabel: 'Buka Tab ESG & Log Verifikasi SHA-256'
  },
  knapsack: {
    title: "Multi-Objective Knapsack DSS: Penyeimbang CFO, CTO & ESG",
    answer: `**Algoritma Optimasi Alokasi CapEx:**
• **Formulasi Masalah:** Telkomsel memiliki ribuan BTS kandidat namun anggaran modal (CapEx) terbatas.
• **Scoring Multi-Dimensi:** Algoritma menghitung:
  1. *CFO Score:* Efisiensi penghematan biaya listrik (Rp/kWh & payback).
  2. *ESG Score:* Reduksi karbon riil (tCO2e per Rp CapEx).
  3. *CTO Score:* Margin keamanan QoS dan stabilitas trafik historis.
• **Human-in-the-Loop:** Pimpinan teknik dapat melakukan *override* ('Force In' untuk site strategis VIP atau 'Exclude' untuk site kritis) sebelum jadwal retrofit dieksekusi.`,
    suggestedTab: 'optimization',
    suggestedTabLabel: 'Buka Modul 3: Prioritasi Investasi'
  }
};

const SYSTEM_PROMPT = `Anda adalah ImpactGrid AI Copilot, asisten kecerdasan buatan tingkat eksekutif untuk sistem Telkomsel ImpactGrid (dikembangkan oleh Tim AWAKENING Reborn untuk TDC Summit Fest / TSF 2026 bersama PT Telekomunikasi Selular).

Karakter Anda:
- Sangat memahami telekomunikasi seluler Indonesia, arsitektur RAN (Ericsson, Huawei, ZTE, Nokia), standar O-RAN O1 (Netconf/YANG), efisiensi energi BTS (ITU-T L.1331), regulasi POJK 51, IFRS S1/S2, dan model finansial korporat Telkomsel.
- Bersikap profesional, tajam, berbasis data numerik valid, percaya diri di hadapan Dewan Direksi (CEO, CTO, CFO, Direktur Network, Head of ESG).
- Singkat, padat, terstruktur dengan bullet point jika diperlukan.
- Selalu tegaskan bahwa ImpactGrid adalah AI Decision Support System (DSS) dan Cyber-Physical Energy System, BUKAN pemutus daya sembarangan. Keandalan QoS dan kanal darurat 112 selalu terproteksi mutlak (<120ms fast wakeup).

Data Kunci Proposal:
- Total BTS Telkomsel: 293.000 sites nasional dengan beban listrik korporat ~Rp 3,2 Triliun/tahun.
- Distribusi daya per tower: Radio 65%, Pendingin/HVAC 25%, Rectifier & Aux 10%.
- Fase Pilot: 50 sites (40 intervensi + 10 kontrol) dengan CapEx Rp 450 Juta, menghasilkan penghematan Rp 240 Juta/tahun (payback 1,9 tahun).
- DiD ITU-T L.1331: Menghasilkan reduksi bersih 201.500 kWh/tahun dan 175,3 ton CO2e/tahun.
- Model 5 Tahun: Reinvestment Pool 50% mendanai ekspansi 5.000 hingga 10.000 BTS, menghasilkan NPV kumulatif +Rp 41,48 Miliar.`;

export default function AiCopilotModal({ 
  isOpen, 
  onClose, 
  onNavigateTab,
  onApplyAction
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Halo Dewan Direksi & Dewan Juri Telkomsel! Saya **ImpactGrid AI Copilot**.\n\nSistem saya terhubung dengan data telemetri 50 site uji coba, model finansial 5 tahun, dan guardrail O-RAN. Silakan tanyakan hal teknis, mitigasi risiko QoS 112, deteksi kebocoran shelter, hingga audit ESG!',
      timestamp: 'Baru saja'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Settings & Gemini API state
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('impactgrid_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [connectionStatus, setConnectionStatus] = useState('idle'); // 'idle' | 'testing' | 'connected' | 'error'
  const [connectionMsg, setConnectionMsg] = useState('');

  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
        // Try fallback to gemini-1.5-flash
        const fallbackRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Ping." }] }]
          })
        });

        if (fallbackRes.ok) {
          setSelectedModel('gemini-1.5-flash');
          setConnectionStatus('connected');
          setConnectionMsg('Tersambung via Gemini 1.5 Flash!');
          localStorage.setItem('impactgrid_gemini_api_key', key);
          return;
        }

        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP error ${response.status}`);
      }

      setConnectionStatus('connected');
      setConnectionMsg(`Tersambung aktif ke Google Gemini (${selectedModel})!`);
      localStorage.setItem('impactgrid_gemini_api_key', key);
    } catch (err) {
      console.warn("Gemini connection test failed:", err);
      setConnectionStatus('error');
      setConnectionMsg(`Koneksi gagal: ${err.message}. Mode Failsafe Lokal tetap aktif.`);
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('impactgrid_gemini_api_key', apiKey.trim());
    if (apiKey.trim()) {
      handleTestConnection(apiKey.trim());
    } else {
      setConnectionStatus('idle');
      setConnectionMsg('Mode Failsafe Lokal aktif.');
    }
    setShowSettings(false);
  };

  if (!isOpen) return null;

  // Local fallback response router
  const getLocalResponse = (query) => {
    const lower = query.toLowerCase();
    
    if (lower.includes('optimalkan') || lower.includes('rekomendasi ai') || lower.includes('efisiensi energi shelter')) {
      return {
        title: "⚡ Rekomendasi AI Optimization Engine Aktif",
        answer: `Algoritma Knapsack DSS & Non-RT RIC merekomendasikan:
• **Carrier Sleep:** Aktifkan Advanced Micro-Sleep pada carrier non-esensial saat beban trafik <45%.
• **Dynamic HVAC Setpoint:** Set suhu shelter optimal ke **26°C** (PUE turun dari 1.42 ke 1.28).
• **Proyeksi Penghematan:** Efisiensi daya **+18.4%** tanpa penurunan indikator QoS/SLA.`,
        suggestedTab: 'optimization',
        suggestedTabLabel: 'Lihat Kurva Pareto Frontier',
        actionData: {
          type: 'APPLY_OPTIMIZATION',
          label: '⚡ Eksekusi Rekomendasi Ini ke Sistem',
          payload: { carrierSleepActive: true, tempC: 26, plnTariffIDR: 1500 }
        }
      };
    } else if (lower.includes('blackout') || lower.includes('sumatera') || lower.includes('grid collapse')) {
      return {
        title: "⚠️ Resiliensi Bencana: Protokol Blackout Grid PLN Sumatera",
        answer: `Saat grid PLN terputus (blackout regional):
• **Microgrid Islanding:** Shelter memutus jalur PLN seketika untuk mencegah *backfeed surge*.
• **Hybrid Power Switch:** Beralih ke bank baterai LiFePO4 dan solar PV atap secara *bumpless*.
• **Traffic Prioritization:** Carrier 1800/2100MHz masuk sleep-mode, mengunci kanal 900MHz & darurat 112 aktif 100%.`,
        suggestedTab: 'scenariolab',
        suggestedTabLabel: 'Buka Scenario Lab Digital Twin',
        actionData: {
          type: 'SWITCH_SCENARIO',
          label: '⚠️ Terapkan Mode Blackout Sumatera Sekarang',
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
        title: "Analisis Arsitektur Cyber-Physical Telkomsel ImpactGrid",
        answer: `Pertanyaan Anda sangat relevan dengan operasional 293.000 BTS Telkomsel!\n\nImpactGrid mengintegrasikan 4 modul terpadu:\n1. **Network Data Hub (Modul 1):** Ingesti O-RAN O1 & Smart Meter PLN untuk deteksi Phantom Load.\n2. **Scenario Lab (Modul 2):** Digital Twin konsumsi energi BTS dengan modifikasi cuaca BMKG.\n3. **Investment Prioritizer (Modul 3):** Knapsack DSS alokasi CapEx berbasis Lensa CFO, CTO, dan ESG.\n4. **ESG Verification (Modul 4):** Validasi DiD ITU-T L.1331 dengan jejak audit kriptografis SHA-256.\n\nAnda dapat mengeksplorasi modul-modul ini langsung melalui navigasi tab di layar utama!`,
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

    const activeKey = apiKey.trim() || localStorage.getItem('impactgrid_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;

    // IF WE HAVE A GEMINI API KEY, CALL LIVE GOOGLE GEMINI API!
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
              source: 'gemini'
            }]);
            setIsTyping(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Live Gemini API call failed, falling back smoothly to local engine:", err);
      }
    }

    // FALLBACK: INSTANT ON-DEVICE TELECOM LOCAL EXPERT ENGINE
    setTimeout(() => {
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

  const isGeminiActive = Boolean(apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY);

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
                {isGeminiActive ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Gemini AI Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    Telecom Local Engine (Failsafe)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-2">
                <span>O-RAN O1 • Guardrail QoS 112 • Financial Model 5Y</span>
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
                <span>Konfigurasi Google Gemini API (Live Generative Reasoning)</span>
              </div>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 underline font-medium"
              >
                <span>Dapatkan API Key Gratis di Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
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
              *Catatan Presentasi: Jika tidak memasukkan API Key, sistem otomatis beralih ke <strong>Mode Failsafe Lokal</strong> berbasis proposal resmi, sehingga demo tidak akan pernah gagal di depan juri.
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
                    {msg.source === 'gemini' ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                        Google Gemini Live
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                        <Cpu className="w-2.5 h-2.5 text-blue-600" />
                        On-Device Telecom Engine
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
                      Live Telemetri Update
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
                <span>ImpactGrid AI sedang menganalisis telemetri & model keputusan...</span>
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
              placeholder="Tanyakan hal teknis O-RAN, proteksi 112, DiD ESG, atau kelayakan finansial..."
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
              Dual Engine: Google Gemini API Live + On-Device Telecom Failsafe
            </span>
            <span>Shortcut: <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200 font-mono">Enter</kbd></span>
          </div>
        </div>

      </div>
    </div>
  );
}
