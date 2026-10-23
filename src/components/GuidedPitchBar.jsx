import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause,
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Volume2, 
  Maximize2,
  Minimize2,
  ShieldAlert,
  ArrowRight,
  Zap,
  Bot,
  RotateCcw,
  BookOpen
} from 'lucide-react';

/**
 * GuidedPitchBar (Guided Pitch Mode 2.0):
 * Sempurna untuk presentasi eksekutif 7 menit di hadapan Dewan Direksi:
 * - 8 Tahapan Terstruktur (0:00 s.d. 7:00 menit)
 * - Timer aktif mundur/maju 7:00 menit
 * - Fullscreen toggle
 * - Keyboard navigation (Space, Panah Kanan/Kiri, F untuk Fullscreen, Esc untuk keluar)
 * - Presenter Teleprompter Notes & Audience Cues
 * - Progress bar visual
 */
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
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const pitchSteps = [
    {
      step: 1,
      timing: "0:00 - 1:00",
      targetSeconds: 60,
      title: "Paradoks Energi & Defisit 547k Ton CO2e",
      tab: "overview",
      targetAudience: "Direktur Utama & Dewan Direksi",
      keyPill: "1,885 Miliar kWh Listrik (63,6% Emisi)",
      cue: "Buka Executive Summary, sorot beban listrik nasional & defisit Scope 2 Telkomsel.",
      script: "Bapak/Ibu Direksi yang terhormat, di balik kepemimpinan Telkomsel dengan 293.000 BTS, beban listrik RAN telah menembus 1,885 Miliar kWh (63,6% total emisi). Menuju target Net Zero 2030, Telkomsel menghadapi defisit dekarbonisasi 547.000 ton CO2e. ImpactGrid hadir memecahkan dilema efisiensi biaya vs dekarbonisasi tanpa mengorbankan SLA jaringan.",
      presenterTips: "Tatap langsung Direktur Utama. Tekankan bahwa ini bukan sekadar software greenwashing, melainkan instrumen mitigasi risiko finansial dan regulasi OJK."
    },
    {
      step: 2,
      timing: "1:00 - 1:50",
      targetSeconds: 110,
      title: "Digital Twin Fisika BTS & Carrier Sleep",
      tab: "digitaltwin",
      targetAudience: "VP Network Ops & Chief Architect",
      keyPill: "Massive MIMO Sleep • PUE 1.18",
      cue: "Pindah ke Digital Twin BTS, tunjukkan carrier 700MHz terkunci aktif & 2.3GHz deep sleep.",
      script: "Sistem kami memodelkan perangkat keras hingga level carrier radio dan termodinamika shelter. Carrier 700 & 900 MHz selalu dipertahankan aktif untuk panggilan darurat 112, sementara carrier kapasitas 1.8GHz hingga 2.3GHz Massive MIMO dapat ditidurkan otonom saat trafik sepi, menghemat daya hingga 58% dan menekan suhu shelter secara presisi.",
      presenterTips: "Arahkan perhatian juri pada skema intervensi perangkat radio tanpa mematikan baseband utama."
    },
    {
      step: 3,
      timing: "1:50 - 2:40",
      targetSeconds: 160,
      title: "O-RAN Autonomous AI Multi-Agent Swarm",
      tab: "agents",
      targetAudience: "Direktur Network / CTO & R&D",
      keyPill: "4 Agen AI • Konsensus Closed-Loop",
      cue: "Buka AI Swarm Tab, perlihatkan Prophet-RAN, ThermoOptima, Sentinel-SLA, dan GreenLedger.",
      script: "ImpactGrid digerakkan oleh 4 agen AI otonom: Prophet-RAN memprediksi deret waktu trafik 6 jam ke depan, ThermoOptima mengontrol pendinginan shelter AC, Sentinel-SLA menjamin interupsi darurat <120ms, dan GreenLedger mengunci audit hash. Mereka bernegosiasi tertutup tanpa intervensi manual manusia.",
      presenterTips: "Sebutkan bahwa ini mematuhi standar O-RAN Alliance Non-RT RIC architecture."
    },
    {
      step: 4,
      timing: "2:40 - 3:30",
      targetSeconds: 210,
      title: "Telemetri Multi-Vendor & Validitas Smart Meter",
      tab: "telemetry",
      targetAudience: "Chief Architect & NOC",
      keyPill: "Vendor-Agnostic + PLN Smart Meter",
      cue: "Pindah ke Network Data Hub, perlihatkan integrasi Ericsson, Huawei, ZTE, Nokia.",
      script: "Sistem kami menyelesaikan masalah silo teknologi melalui Network Data Hub yang mengintegrasikan data dari 4 vendor besar secara vendor-agnostic dan merekonsiliasikannya 100% dengan smart meter PLN secara transparan.",
      presenterTips: "Tunjukkan tabel korelasi telemetri AMR dan toleransi rekonsiliasi nol deviasi."
    },
    {
      step: 5,
      timing: "3:30 - 4:20",
      targetSeconds: 260,
      title: "AI Prioritizer & CTO Safety Guardrail 112",
      tab: "optimization",
      targetAudience: "Direktur Network / CTO",
      keyPill: "120ms Wake-up • 112 Guaranteed",
      cue: "Tunjukkan tabel portofolio investasi & klik tombol Simulasi Darurat (Emergency Drill).",
      script: "Kekuatan utama Modul 3 adalah optimasi portofolio dengan kendali keselamatan berlapis. Keamanan jaringan adalah prioritas mutlak. Dengan jaminan wake-up latency 120 milidetik dan prioritas panggilan darurat 112, transmisi otomatis kembali ke daya penuh saat terjadi anomali beban tanpa interupsi.",
      presenterTips: "Tunjukkan tombol Stress Drill jika juri meragukan aspek availability SLA 99,99%."
    },
    {
      step: 6,
      timing: "4:20 - 5:20",
      targetSeconds: 320,
      title: "Mekanisme Swadana & Monte Carlo 1.000 Run",
      tab: "financial",
      targetAudience: "Direktur Keuangan / CFO",
      keyPill: "NPV Rp41,48 Miliar • P10 Rp34,2 M",
      cue: "Buka Financial Model Tab, perlihatkan grafik distribusi Monte Carlo & reinvestasi mandiri.",
      script: "Dari kacamata finansial, ImpactGrid tidak membebani kas korporat dengan anggaran berulang. Penghematan OpEx pilot mendanai fase regional, lalu mendanai ekspansi 10.000+ BTS nasional secara mandiri. Simulasi Monte Carlo 1.000 iterasi membuktikan 99,8% kepastian NPV positif dengan ekspansi EBITDA marjin +0,38%.",
      presenterTips: "Arahkan pandangan ke Direktur Keuangan. Tekankan bahwa Payback Period hanya 1,78 tahun."
    },
    {
      step: 7,
      timing: "5:20 - 6:15",
      targetSeconds: 375,
      title: "MRV Anti-Greenwashing (ITU-T L.1331 & SHA-256)",
      tab: "esg",
      targetAudience: "Komite ESG & Investor",
      keyPill: "Audit-Ready • Standar Internasional",
      cue: "Buka ESG Tab, tunjukkan log transaksi SHA-256 & sertifikat kepatuhan POJK 51.",
      script: "Seluruh klaim reduksi karbon dihitung berdasarkan metodologi standar internasional ITU-T L.1331 yang memisahkan pengaruh fluktuasi cuaca dan payload trafik. Log audit kami terenkripsi SHA-256, menjadikan laporan keberlanjutan Telkomsel bebas dari tuduhan greenwashing dan audit-ready untuk BEI & OJK.",
      presenterTips: "Tekankan sertifikasi siap audit BPK / auditor eksternal Big 4."
    },
    {
      step: 8,
      timing: "6:15 - 7:00",
      targetSeconds: 420,
      title: "Executive Memo & Kesiapan Pertahanan BoD",
      tab: "overview",
      targetAudience: "Dewan Penguji & BoD",
      keyPill: "Siap Dieksekusi Q1 2027",
      cue: "Buka Executive Memo (P) atau BoD Defense (Q) untuk sesi tanya jawab juri.",
      script: "Kesimpulannya, ImpactGrid adalah solusi end-to-end yang realistis, tervalidasi secara teknis, dan menguntungkan secara finansial. Kami siap menjawab pertanyaan mendalam dari dewan juri terkait mitigasi risiko, integrasi arsitektur, maupun reliabilitas jangka panjang. Terima kasih!",
      presenterTips: "Tutup dengan senyum percaya diri dan siap membuka modal Tanya Jawab BoD (Hotkey Q)."
    }
  ];

  // Live Timer Effect
  useEffect(() => {
    let timer;
    if (isActive && isTimerRunning) {
      timer = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, isTimerRunning]);

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
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isActive, currentStep]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isActive) return null;

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} / 7:00`;
  const isOvertime = secondsElapsed > 420;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/98 text-white border-t-2 border-[#ED0226] shadow-2xl backdrop-blur-md px-4 py-3 transition-all animate-fade-in font-sans">
      <div className="max-w-6xl mx-auto space-y-2.5">
        {/* Main Pitch Bar Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Step Info & Timing Badge */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#ED0226] text-white font-black text-sm shrink-0 shadow-xs">
              {current.step}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white">{current.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-red-300 border border-slate-700">
                  {current.keyPill}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal truncate max-w-md">
                🎯 Sasaran: <strong className="text-slate-200">{current.targetAudience}</strong> • Cue: {current.cue}
              </p>
            </div>
          </div>

          {/* Controls: Timer, Step Switcher, Fullscreen */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            {/* Live 7-Minute Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
              isOvertime 
                ? 'bg-red-950 text-red-400 border-red-700 animate-pulse' 
                : 'bg-slate-900 text-slate-200 border-slate-800'
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{timeFormatted}</span>
              <button 
                onClick={() => setIsTimerRunning(prev => !prev)}
                className="hover:text-white ml-1 cursor-pointer"
                title={isTimerRunning ? "Pause" : "Play"}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button 
                onClick={() => setSecondsElapsed(0)}
                className="hover:text-white ml-0.5 cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Teleprompter Notes Toggle */}
            <button
              onClick={() => setIsNotesExpanded(prev => !prev)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                isNotesExpanded 
                  ? 'bg-amber-400 text-slate-950 border-amber-300' 
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Presenter Notes</span>
            </button>

            {/* Navigation buttons */}
            <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 0}
                className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Sebelumnya (ArrowLeft)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-xs font-bold text-slate-300 font-mono">
                {currentStep + 1}/{pitchSteps.length}
              </span>
              <button
                onClick={() => goToStep(currentStep + 1)}
                disabled={currentStep === pitchSteps.length - 1}
                className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                title="Berikutnya (Space / ArrowRight)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
              title="Toggle Fullscreen (F)"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
              title="Keluar Mode Pitch (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
          {pitchSteps.map((s, idx) => (
            <div
              key={idx}
              onClick={() => goToStep(idx)}
              className={`h-full flex-1 border-r border-slate-950 transition-all cursor-pointer ${
                idx < currentStep 
                  ? 'bg-emerald-500' 
                  : idx === currentStep 
                    ? 'bg-[#ED0226]' 
                    : 'bg-slate-700/60 hover:bg-slate-600'
              }`}
              title={`Step ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Expanded Presenter Teleprompter Notes */}
        {isNotesExpanded && (
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-400 text-xs flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" />
                Teleprompter Skrip Presenter ({current.timing})
              </span>
              <span className="text-[10px] text-slate-400">Tekan Spasi untuk lanjut</span>
            </div>
            <p className="text-white text-xs leading-relaxed font-medium bg-slate-950 p-3 rounded-lg border border-slate-800">
              "{current.script}"
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span><strong>Tips Penyampaian:</strong> {current.presenterTips}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
