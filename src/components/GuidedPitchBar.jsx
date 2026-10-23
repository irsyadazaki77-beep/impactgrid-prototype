import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Volume2, 
  Maximize2,
  ShieldAlert,
  ArrowRight,
  Zap,
  Bot
} from 'lucide-react';

export default function GuidedPitchBar({ 
  isActive, 
  onClose, 
  activeTab, 
  setActiveTab,
  onNavigateTab,
  onOpenEmergencyModal,
  onOpenExecutiveMemo,
  onOpenBodDefense
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const pitchSteps = [
    {
      step: 1,
      timing: "0:00 - 1:00",
      title: "Paradoks Energi & Defisit 547k Ton CO2e",
      tab: "overview",
      targetAudience: "Direktur Utama & Dewan Direksi",
      keyPill: "1,885 Miliar kWh Listrik (63,6% Emisi)",
      cue: "Buka Overview Tab, sorot beban listrik nasional & defisit Scope 2 Telkomsel.",
      script: "Bapak/Ibu Direksi yang terhormat, di balik kepemimpinan Telkomsel dengan 293.000 BTS, beban listrik RAN telah menembus 1,885 Miliar kWh (63,6% total emisi). Menuju target Net Zero 2030, Telkomsel menghadapi defisit dekarbonisasi 547.000 ton CO2e. ImpactGrid hadir memecahkan dilema efisiensi biaya vs dekarbonisasi tanpa mengorbankan SLA jaringan."
    },
    {
      step: 2,
      timing: "1:00 - 1:50",
      title: "Digital Twin Fisika BTS & Carrier Sleep",
      tab: "digitaltwin",
      targetAudience: "VP Network Ops & Chief Architect",
      keyPill: "Massive MIMO Sleep • PUE 1.18",
      cue: "Pindah ke Digital Twin BTS, tunjukkan carrier 700MHz terkunci aktif & 2.3GHz deep sleep.",
      script: "Sistem kami memodelkan perangkat keras hingga level carrier radio dan termodinamika shelter. Carrier 700 & 900 MHz selalu dipertahankan aktif untuk panggilan darurat 112, sementara carrier kapasitas 1.8GHz hingga 2.3GHz Massive MIMO dapat ditidurkan otonom saat trafik sepi, menghemat daya hingga 58% dan menekan suhu shelter secara presisi."
    },
    {
      step: 3,
      timing: "1:50 - 2:40",
      title: "O-RAN Autonomous AI Multi-Agent Swarm",
      tab: "agents",
      targetAudience: "Direktur Network / CTO & R&D",
      keyPill: "4 Agen AI • Konsensus Closed-Loop",
      cue: "Buka AI Swarm Tab, perlihatkan Prophet-RAN, ThermoOptima, Sentinel-SLA, dan GreenLedger.",
      script: "ImpactGrid digerakkan oleh 4 agen AI otonom: Prophet-RAN memprediksi deret waktu trafik 6 jam ke depan, ThermoOptima mengontrol pendinginan shelter AC, Sentinel-SLA menjamin interupsi darurat <120ms, dan GreenLedger mengunci audit hash. Mereka bernegosiasi tertutup tanpa intervensi manual manusia."
    },
    {
      step: 4,
      timing: "2:40 - 3:30",
      title: "Telemetri Multi-Vendor & Validitas Smart Meter",
      tab: "telemetry",
      targetAudience: "Chief Architect & NOC",
      keyPill: "Vendor-Agnostic + PLN Smart Meter",
      cue: "Pindah ke Network Data Hub, perlihatkan integrasi Ericsson, Huawei, ZTE, Nokia.",
      script: "Sistem kami menyelesaikan masalah silo teknologi melalui Network Data Hub yang mengintegrasikan data dari 4 vendor besar secara vendor-agnostic dan merekonsiliasikannya 100% dengan smart meter PLN secara transparan."
    },
    {
      step: 5,
      timing: "3:30 - 4:20",
      title: "AI Prioritizer & CTO Safety Guardrail 112",
      tab: "optimization",
      targetAudience: "Direktur Network / CTO",
      keyPill: "120ms Wake-up • 112 Guaranteed",
      cue: "Tunjukkan tabel portofolio investasi & klik tombol Simulasi Darurat (Emergency Drill).",
      script: "Kekuatan utama Modul 3 adalah optimasi portofolio dengan kendali keselamatan berlapis. Keamanan jaringan adalah prioritas mutlak. Dengan jaminan wake-up latency 120 milidetik dan prioritas panggilan darurat 112, transmisi otomatis kembali ke daya penuh saat terjadi anomali beban tanpa interupsi."
    },
    {
      step: 6,
      timing: "4:20 - 5:20",
      title: "Mekanisme Swadana & Monte Carlo 1.000 Run",
      tab: "financial",
      targetAudience: "Direktur Keuangan / CFO",
      keyPill: "NPV Rp41,48 Miliar • P10 Rp34,2 M",
      cue: "Buka Financial Model Tab, perlihatkan grafik distribusi Monte Carlo & reinvestasi mandiri.",
      script: "Dari kacamata finansial, ImpactGrid tidak membebani kas korporat dengan anggaran berulang. Penghematan OpEx pilot mendanai fase regional, lalu mendanai ekspansi 10.000+ BTS nasional secara mandiri. Simulasi Monte Carlo 1.000 iterasi membuktikan 99,8% kepastian NPV positif dengan ekspansi EBITDA marjin +0,38%."
    },
    {
      step: 7,
      timing: "5:20 - 6:15",
      title: "MRV Anti-Greenwashing (ITU-T L.1331 & SHA-256)",
      tab: "esg",
      targetAudience: "Komite ESG & Investor",
      keyPill: "Audit-Ready • Standar Internasional",
      cue: "Buka ESG Tab, tunjukkan log transaksi SHA-256 & sertifikat kepatuhan POJK 51.",
      script: "Seluruh klaim reduksi karbon dihitung berdasarkan metodologi standar internasional ITU-T L.1331 yang memisahkan pengaruh fluktuasi cuaca dan payload trafik. Log audit kami terenkripsi SHA-256, menjadikan laporan keberlanjutan Telkomsel bebas dari tuduhan greenwashing dan audit-ready untuk BEI & OJK."
    },
    {
      step: 8,
      timing: "6:15 - 7:00",
      title: "Executive Memo & Kesiapan Pertahanan BoD",
      tab: "overview",
      targetAudience: "Dewan Penguji & BoD",
      keyPill: "Siap Dieksekusi Q1 2027",
      cue: "Buka Executive Memo (P) atau BoD Defense (Q) untuk sesi tanya jawab juri.",
      script: "Kesimpulannya, ImpactGrid adalah solusi end-to-end yang realistis, tervalidasi secara teknis, dan menguntungkan secara finansial. Kami siap menjawab pertanyaan mendalam dari dewan juri terkait mitigasi risiko, integrasi arsitektur, maupun reliabilitas jangka panjang. Terima kasih!"
    }
  ];

  const current = pitchSteps[currentStep];

  // Sync tab on step change
  const goToStep = (idx) => {
    if (idx >= 0 && idx < pitchSteps.length) {
      setCurrentStep(idx);
      const target = pitchSteps[idx].tab;
      if (onNavigateTab) {
        onNavigateTab(target);
      } else if (setActiveTab && target !== activeTab) {
        setActiveTab(target);
      }
    }
  };

  // Keyboard navigation for presentation mode
  useEffect(() => {
    if (!isActive) return;

    const handleKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToStep(Math.min(pitchSteps.length - 1, currentStep + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToStep(Math.max(0, currentStep - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isActive, currentStep]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 text-white border-t-2 border-[#ED0226] shadow-2xl backdrop-blur-md px-4 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Step Info & Timing Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#ED0226] text-white font-black text-sm shrink-0">
            {current.step}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" /> {current.timing}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[11px] text-slate-300 font-medium bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                Audience: {current.targetAudience}
              </span>
            </div>
            <h4 className="text-sm font-black text-white truncate max-w-xs sm:max-w-md">
              {current.title}
            </h4>
          </div>
        </div>

        {/* Teleprompter Script */}
        <div className="flex-1 max-w-2xl bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 hidden lg:block">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span className="font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Naskah Bicara
            </span>
            <span className="text-emerald-400 font-semibold">{current.cue}</span>
          </div>
          <p className="line-clamp-2 italic leading-relaxed text-slate-300 font-normal">
            "{current.script}"
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => goToStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`p-1.5 rounded-lg border border-slate-700 transition cursor-pointer ${
              currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Langkah Sebelumnya (Panah Kiri)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-400 px-1">
            {currentStep + 1}/{pitchSteps.length}
          </span>

          <button
            onClick={() => goToStep(Math.min(pitchSteps.length - 1, currentStep + 1))}
            disabled={currentStep === pitchSteps.length - 1}
            className={`p-1.5 rounded-lg border border-slate-700 transition cursor-pointer ${
              currentStep === pitchSteps.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Langkah Selanjutnya (Panah Kanan / Spasi)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer ml-2"
            title="Tutup Walkthrough (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
