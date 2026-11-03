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
  ArrowRight,
} from 'lucide-react';

const PRESET_QUESTIONS = [
  {
    q: "Tampilkan status telemetri dan simulasi saat ini.",
    category: "Status Live",
    tab: "scenariolab"
  },
  {
    q: "Terapkan profil optimasi Carrier Sleep & HVAC 26°C pada kluster aktif.",
    category: "Optimasi O-RAN",
    action: {
      type: 'APPLY_OPTIMIZATION',
      label: 'Aktifkan Optimasi Kluster',
    }
  },
  {
    q: "Simulasikan ketahanan baterai LFP & genset saat Blackout Sumatera.",
    category: "Kontinuitas Daya",
    action: {
      type: 'SWITCH_SCENARIO',
      label: 'Uji Skenario Blackout Sumatera',
      scenarioKey: 'blackout_sumatera'
    }
  },
  {
    q: "Apa nilai tambah ImpactGrid dibanding fitur efisiensi energi RAN bawaan vendor?",
    category: "Arsitektur",
    tab: "telemetry"
  },
  {
    q: "Bagaimana cara sistem mendeteksi Phantom Load / Kebocoran Daya Shelter?",
    category: "Rekonsiliasi PLN",
    tab: "telemetry"
  },
  {
    q: "Apakah penurunan daya ini berisiko menurunkan SLA panggilan darurat 112?",
    category: "Guardrail SLA",
    tab: "overview"
  },
  {
    q: "Bagaimana bukti bahwa proyek ini Self-Funding dan bukan bakar CapEx?",
    category: "Finansial",
    tab: "financial"
  },
  {
    q: "Bagaimana ITU-T L.1331 menjadi rujukan pengukuran efisiensi energi jaringan?",
    category: "Audit ESG",
    tab: "esg"
  },
  {
    q: "Bagaimana algoritma Knapsack memprioritaskan biaya, layanan, dan ESG?",
    category: "Optimasi Portofolio",
    tab: "optimization"
  }
];

const LOCAL_KNOWLEDGE_BASE = {
  vendor: {
    title: "Orkestrasi Lintas-Vendor O-RAN SMO (Ericsson, Huawei, ZTE)",
    answer: "Berbeda dari modul bawaan vendor tunggal (seperti Ericsson Micro Sleep atau Huawei PowerStar) yang hanya melihat beban radio internal, ImpactGrid bekerja pada lapis O-RAN Non-RT RIC (antarmuka O1/A1) yang menyatukan telemetri radio 3 vendor sekaligus dengan meter AMR PLN, sensor DC rectifier 48V, dan termodinamika HVAC shelter. Koordinasi CoMP Border Guard mencegah coverage hole di perbatasan sel antar-vendor.",
    suggestedTab: "telemetry",
    suggestedTabLabel: "Buka Rekonsiliasi Multi-Vendor"
  },
  phantom: {
    title: "Deteksi Anomali 3-Way Reconciliation & Tiket FOP Closed-Loop",
    answer: "Sistem memadankan tiga aliran telemetri setiap 15 menit: (1) Meter induk AMR PLN (AC), (2) Submeter IoT Kelas 0.5s pada output rectifier 48V DC, dan (3) Beban trafik PRB OSS radio. Bila selisih tak wajar melampaui ambang toleransi 3% (akibat AC bocor, modul rectifier aus, atau tagihan taksah), sistem otomatis menerbitkan e-Work Order FOP dan menyusun draf Berita Acara Rekonsiliasi Energi (BA-RE) PLN.",
    suggestedTab: "telemetry",
    suggestedTabLabel: "Buka Matriks Rekonsiliasi 3-Arah"
  },
  sla: {
    title: "Guardrail QoS 3GPP & Proteksi Panggilan Darurat 112 (<28 ms)",
    answer: "Keandalan sinyal pelanggan dan layanan darurat 112 dilindungi melalui Near-RT RIC xApp Interlock. Jika utilisasi PRB melampaui 65%, Call Drop Rate mendekati 0,15%, atau terdeteksi flag Panggilan Darurat 112 (QCI-1/5QI-1), perintah Carrier Sleep dibatalkan secara instan dalam <28 milidetik (Zero-Wait Wakeup) sehingga ketersediaan jaringan tetap ≥99,99%.",
    suggestedTab: "overview",
    suggestedTabLabel: "Buka Panel Keandalan & Guardrail SLA"
  },
  financial: {
    title: "Kelayakan Finansial: Skema Self-Funding & Kontrak TowerCo 85/15",
    answer: "Investasi dilindungi melalui tata kelola Stage-Gate G0–G3: Gerbang G0 dibatasi maksimal Rp95 Juta yang bersumber swadana dari klaim restitusi anomali tagihan PLN UID (Rp312,9 Juta/tahun). Pada fase skala kluster (CapEx Rp450 Juta), kontrak sewa menara Mitratel/Protelindo menggunakan skema PLN Pass-Through (85% penghematan kas bersih untuk Telkomsel, 15% mitra menara), menghasilkan NPV +Rp460 Juta, IRR 34,2%, dan Payback 1,9 Tahun.",
    suggestedTab: "financial",
    suggestedTabLabel: "Buka Evaluasi Finansial & DCF"
  },
  esg: {
    title: "Inventarisasi Emisi Scope 2, Kausalitas DiD & Audit SHA-256",
    answer: "Penurunan konsumsi kWh divalidasi secara kausal melalui ekonometrika Difference-in-Differences (40 site intervensi vs 10 site kontrol, p < 0,001) untuk memisahkan penghematan murni dari bias cuaca CDD. Setiap blok kWh dikonversi menggunakan faktor emisi resmi ESDM Jamali (0,87 kgCO₂e/kWh) sesuai standar ITU-T L.1331, POJK 51/2017, dan IFRS S2, serta disegel hash berantai SHA-256 untuk kesiapan audit KAP Big-4.",
    suggestedTab: "esg",
    suggestedTabLabel: "Buka Inventarisasi Emisi & Ledger ESG"
  },
  knapsack: {
    title: "Optimasi Alokasi CapEx Multi-Objektif (0/1 Knapsack Solver)",
    answer: "Mesin optimasi mengevaluasi kandidat intervensi per site (Submeter IoT Kelas 0.5s, rApp Carrier Sleep, Smart Damper HVAC, dan Peak-Shaving BESS LiFePO4 WBP 17:00–22:00) menggunakan algoritma 0/1 Knapsack. Sistem menyeimbangkan tiga bobot strategis Direksi: penghematan OpEx kas, reduksi karbon Scope 2, dan perlindungan margin QoS/SLA.",
    suggestedTab: "optimization",
    suggestedTabLabel: "Buka Mesin Optimasi Portofolio"
  }
};

const CONTEXTUAL_PROMPTS_BY_TAB = {
  overview: [
    "Apa beda angka 1,88 Miliar kWh dengan baseline pilot?",
    "Mengapa plafon audit awal G0 dibatasi Rp95 Juta?",
    "Bagaimana koordinasi multi-vendor Ericsson, Huawei, dan ZTE bekerja?"
  ],
  pilotvalidation: [
    "Bagaimana DiD membuktikan kausalitas penghematan dari tren cuaca?",
    "Apa batas non-inferioritas QoS sebelum carrier sleep di-rollback?",
    "Mengapa 10 site kontrol penting untuk uji paralel tren?"
  ],
  financial: [
    "Bagaimana skema sewa menara TowerCo Mitratel 85/15 memengaruhi arus kas?",
    "Bagaimana klaim restitusi PLN membiayai fase audit G0 Rp95 Juta?",
    "Berapa Payback Period dan IRR pada skenario dasar?"
  ],
  telemetry: [
    "Bagaimana 3-way reconciliation mendeteksi kebocoran daya shelter?",
    "Berapa batas toleransi deviasi meteran PLN vs OSS?",
    "Mengapa sub-metering IoT Kelas 0.5s dibutuhkan di rectifier?"
  ],
  scenariolab: [
    "Bagaimana distribusi Monte Carlo 1.000 iterasi mengukur risiko?",
    "Apa dampak cuaca panas ekstrem terhadap beban termal shelter?",
    "Berapa probabilitas NPV bernilai positif di model parametrik?"
  ],
  esg: [
    "Bagaimana standar ITU-T L.1331 menghitung efisiensi energi?",
    "Bagaimana mekanisme dividen sosial disalurkan ke sekolah 3T?",
    "Mengapa hash SHA-256 dipakai dalam verifikasi audit trail?"
  ],
  architecture: [
    "Apa nilai tambah ImpactGrid dibanding fitur bawaan vendor?",
    "Bagaimana arsitektur O-RAN O1 mengamankan telemetri BTS?",
    "Bagaimana kepatuhan PP 71/2019 diterapkan di DC Sentul & Surabaya?"
  ]
};

export default function AiCopilotModal({ 
  isOpen, 
  onClose, 
  onNavigateTab,
  onApplyAction,
  activeTab = 'overview',
  simState,
  selectedScale = 'pilot',
  activeLens = 'all',
  operationalSummary = null
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Halo! Saya **ImpactGrid AI Strategy Copilot**.\n\nSaya siap membantu menganalisis model telemetri jaringan, estimasi penghematan energi RAN, sensitivitas finansial, kepatuhan ESG, dan tata kelola O-RAN Telkomsel.',
      timestamp: 'Baru saja'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Server-side Gemini proxy enabled by default; falls back to local deterministic engine when unconfigured.
  const [showSettings, setShowSettings] = useState(false);
  const [useProxy, setUseProxy] = useState(true);
  const selectedModel = 'gemini-3.8-flash';

  const chatBottomRef = useRef(null);
  const localReplyTimer = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => () => clearTimeout(localReplyTimer.current), []);

  if (!isOpen) return null;

  const renderFormattedMessage = (rawText) => {
    const safeText = String(rawText || '');
    const parts = safeText.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={idx} className="font-extrabold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <React.Fragment key={idx}>{part}</React.Fragment>;
    });
  };

  // Local fallback response router
  const getLocalResponse = (query) => {
    const lower = query.toLowerCase();
    
    if (lower.includes('status saat ini') || lower.includes('skenario saat ini') || lower.includes('kondisi sekarang') || lower.includes('telemetri sekarang') || lower.includes('status live') || lower.includes('beban saat ini')) {
      const scenName = simState?.scenarioKey === 'blackout_sumatera' ? 'Blackout Kelistrikan Sumatera' :
                       simState?.scenarioKey === 'concert' ? 'Lonjakan Trafik Konser' :
                       simState?.scenarioKey === 'heatwave' ? 'Gelombang Panas Ekstrem' : 'Operasional Normal';
      const dbMetricsLine = operationalSummary
        ? `\n• **Database Operasional Aktif:** ${operationalSummary.siteCount} Site BTS (Total Beban ${operationalSummary.totalPlnKwh} kW, Hemat ${operationalSummary.totalPotentialSavingsKwh} kW / ${operationalSummary.overallSavingsPct}%)\n` +
          `• **Status Closed-Loop FOP & SAP:** ${operationalSummary.resolvedSitesCount} Site Terkalibrasi FOP • ${operationalSummary.postedSapVouchersCount} Voucher SAP FI-CO Terposting`
        : '';
      return {
        title: "Status Telemetri & Database Operasional Saat Ini",
        answer: `Data pembacaan langsung dari database operasional & simulasi dashboard:\n\n` +
          `• **Skenario Aktif:** ${scenName}\n` +
          `• **Tab Terbuka:** ${activeTab.toUpperCase()}\n` +
          `• **Beban Trafik PRB:** ${simState?.trafficLoad ?? 32}%\n` +
          `• **Suhu Shelter:** ${simState?.tempAmbient ?? 27.5}°C\n` +
          `• **Skala Pemodelan:** ${String(selectedScale).toUpperCase()}\n` +
          `• **Status Guardrail SLA:** ${simState?.emergencyActive ? '⚠️ Interlock Aktif (Rollback Otomatis)' : '✅ Aman (>99.99%)'}\n` +
          `• **Efisiensi Energi (Est):** ~${operationalSummary?.overallSavingsPct ?? simState?.energyEfficiency ?? 14.8}%` +
          dbMetricsLine + `\n\n` +
          `AI memperbarui evaluasi dampak secara adaptif mengikuti data aktual BTS dan parameter yang Anda ubah.`,
        suggestedTab: 'scenariolab',
        suggestedTabLabel: 'Buka Scenario Lab untuk Uji Parameter'
      };
    } else if (lower.includes('did') || lower.includes('kausalitas') || lower.includes('tren cuaca')) {
      return {
        title: "Metodologi Difference-in-Differences (DiD)",
        answer: "DiD membandingkan 40 site intervensi dengan 10 site kontrol untuk mengisolasi penghematan murni intervensi dari tren musiman (seperti variasi suhu CDD dan lonjakan trafik hari libur). Formula: ΔΔ = (Post - Pre)_intervensi - (Post - Pre)_kontrol. Pada model kalibrasi pilot, estimasi efek intervensi mencapai -8,4% s/d -14,8% (p < 0,001) dengan asumsi paralel tren yang terpenuhi.",
        suggestedTab: 'pilotvalidation',
        suggestedTabLabel: 'Lihat Kurva DiD Interaktif'
      };
    } else if (lower.includes('3-way') || lower.includes('rekonsiliasi') || lower.includes('kebocoran daya') || lower.includes('phantom')) {
      return {
        title: "3-Way Telemetry Reconciliation",
        answer: "Sistem memadankan tiga aliran data independen: (1) KWh meter induk PLN (AC), (2) Sub-metering IoT Kelas 0.5s di output rectifier (DC), dan (3) Estimasi beban radio OSS vendor (Ericsson/Huawei/ZTE). Selisih normal berkisar 10-15% akibat efisiensi pendingin shelter dan rugi-rugi kabel. Jika deviasi tak tertelusuri melampaui ambang 3%, sistem otomatis memicu tiket investigasi anomali FOP.",
        suggestedTab: 'telemetry',
        suggestedTabLabel: 'Buka Matriks Discrepancy'
      };
    } else if (lower.includes('towerco') || lower.includes('mitratel') || lower.includes('protelindo') || lower.includes('sewa menara')) {
      return {
        title: "Struktur Kepemilikan Menara & Skema Listrik",
        answer: "Untuk menara sewa milik TowerCo (Mitratel/Protelindo/TBIG), kontrak menggunakan skema PLN Pass-Through dengan pembagian manfaat kas bersih (85% dinikmati Telkomsel, 15% insentif pengelola site). Skema ini memastikan Dewan Direksi Telkomsel tetap meraih penghematan riil tanpa sengketa kompensasi dengan mitra menara.",
        suggestedTab: 'financial',
        suggestedTabLabel: 'Lihat Konfigurasi TowerCo'
      };
    } else if (lower.includes('monte carlo') || lower.includes('risiko') || lower.includes('probabilitas')) {
      return {
        title: "Distribusi Probabilistik Monte Carlo 1.000 Iterasi",
        answer: "Engine Monte Carlo memodelkan 1.000 iterasi stokastik dengan variasi normal pada persentase efisiensi (±20% std dev) dan volatilitas beban/tarif (±8% std dev). Hasilnya menghasilkan probabilitas NPV positif > 92% pada skenario dasar, dengan P10 sebagai skenario batas bawah aman untuk de-risking investasi.",
        suggestedTab: 'scenariolab',
        suggestedTabLabel: 'Lihat Distribusi Monte Carlo'
      };
    } else if (lower.includes('optimalkan') || lower.includes('rekomendasi ai') || lower.includes('efisiensi energi shelter') || lower.includes('carrier sleep')) {
      return {
        title: "Aktivasi Profil Optimasi O-RAN Non-RT RIC & HVAC Shelter",
        answer: "Rekomendasi kebijakan O-RAN A1 siap diterapkan: mengaktifkan Deep Carrier Sleep pada layer kapasitas 2100/2300 MHz saat utilisasi PRB < 20% dan menyesuaikan setpoint inverter HVAC shelter ke 26,0°C. Proyeksi efisiensi kluster mencapai -14,8% dengan guardrail auto-rollback < 28ms tetap aktif.",
        suggestedTab: 'optimization',
        suggestedTabLabel: 'Buka Mesin Optimasi Portofolio',
        actionData: {
          type: 'APPLY_OPTIMIZATION',
          label: 'Terapkan Profil Optimasi Kluster',
          payload: { carrierSleepActive: true, tempC: 26, plnTariffIDR: 1500 }
        }
      };
    } else if (lower.includes('blackout') || lower.includes('sumatera') || lower.includes('grid collapse')) {
      return {
        title: "Protokol Kontinuitas Daya & Mitigasi Blackout Regional",
        answer: "Saat suplai grid PLN terputus (skenario Blackout Sumatera), agen Sentinel-SLA dan ThermoOptima secara otomatis memperpanjang otonomi baterai LiFePO4 48V dari 4,0 jam menjadi 6,2 jam melalui pemangkasan carrier non-esensial sambil mempertahankan 100% kanal prioritas panggilan darurat 112.",
        suggestedTab: 'scenariolab',
        suggestedTabLabel: 'Buka Scenario Lab',
        actionData: {
          type: 'SWITCH_SCENARIO',
          label: 'Aktifkan Simulasi Blackout Sumatera',
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
        title: "Arsitektur Operasional ImpactGrid Telkomsel",
        answer: `ImpactGrid mengintegrasikan empat kapabilitas utama jaringan RAN Telkomsel (${operationalSummary?.siteCount || 50} site terpantau): (1) Rekonsiliasi Telemetri 3-Arah PLN AMR–DC Rectifier–OSS RF, (2) Orkestrasi AI O-RAN Non-RT RIC multi-vendor dengan proteksi SLA <28ms, (3) Otomasi Tiket FOP, Berita Acara BA-RE PLN, dan Jurnal SAP S/4HANA FI-CO, serta (4) Akuntansi Emisi Scope 2 bersegel SHA-256 sesuai standar POJK 51/2017 & IFRS S2.`,
        suggestedTab: 'telemetry',
        suggestedTabLabel: 'Buka Pusat Telemetri & Rekonsiliasi'
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

    // Optional provider requests go through the server proxy; default is local-only.
    if (useProxy) {
      try {
        const proxyRes = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            model: selectedModel,
            history: messages.slice(-4),
            liveContext: {
              activeTab,
              scenarioKey: simState?.scenarioKey || 'normal',
              trafficLoad: simState?.trafficLoad ?? 32,
              tempAmbient: simState?.tempAmbient ?? 27.5,
              selectedScale,
              activeLens
            }
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
      } catch {
        // Network errors intentionally fall through to deterministic local answers.
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
                    Model Penalaran Analitik Internal
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-2">
                <span>Telemetri IoT Kelas 0.5s • Kepatuhan 3GPP Rel 17/18 • O-RAN O1</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={onClose}
              aria-label="Tutup"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition order-last"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings((shown) => !shown)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                showSettings 
                  ? 'bg-slate-800 text-white border border-slate-700' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Pengaturan koneksi AI server"
            >
              <span className="hidden sm:inline text-[11px] text-slate-300">Koneksi</span>
            </button>
          </div>
        </div>

        {/* Optional server connection. Provider secrets are never entered in the browser. */}
        {showSettings && (
          <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 text-xs text-white animate-in slide-in-from-top-2 duration-150 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-slate-200">
                <input type="checkbox" checked={useProxy} onChange={(event) => setUseProxy(event.target.checked)} />
                <span>Gunakan model AI melalui backend (opsional)</span>
              </label>
              <span className="text-[11px] text-slate-400">Tanpa koneksi atau konfigurasi server, jawaban lokal tetap tersedia.</span>
            </div>
          </div>
        )}

        {/* Live Context Telemetry Pill */}
        <div className="px-4 py-1.5 bg-slate-100 border-b border-slate-200 text-[11px] text-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-bold text-slate-800 shrink-0">Konteks Dashboard:</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] text-slate-700 truncate">
              Tab: <strong className="text-slate-900">{activeTab}</strong> • Skenario: <strong className="text-slate-900">{simState?.scenarioKey || 'normal'}</strong> • Trafik: <strong className="text-slate-900">{simState?.trafficLoad ?? 32}%</strong> • Suhu: <strong className="text-slate-900">{simState?.tempAmbient ?? 27.5}°C</strong>
            </span>
          </div>
          <button 
            type="button"
            onClick={() => handleSend("Tampilkan status telemetri dan simulasi saat ini")}
            className="text-[10px] font-bold text-[#ED0226] hover:underline cursor-pointer shrink-0 ml-2"
          >
            Tanya Live
          </button>
        </div>

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
                        Model Penalaran Analitik Internal
                      </span>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-line text-[12px] font-sans">
                  {renderFormattedMessage(msg.text)}
                </div>

                {/* Interactive Action Button */}
                {msg.actionData && onApplyAction && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        onApplyAction(msg.actionData);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-[11px] cursor-pointer transition shadow-xs hover:shadow-md"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      <span>{msg.actionData.label || 'Eksekusi Aksi'}</span>
                    </button>
                    <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Sinkron ke Konsol Operasional
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
