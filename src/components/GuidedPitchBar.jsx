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
  ArrowRight
} from 'lucide-react';

export default function GuidedPitchBar({ 
  isActive, 
  onClose, 
  activeTab, 
  setActiveTab,
  onOpenEmergencyModal,
  onOpenExecutiveMemo,
  onOpenBodDefense
}) {
  const [currentStep, setCurrentStep] = useState(0);

  const pitchSteps = [
    {
      step: 1,
      timing: "0:00 - 1:15",
      title: "Paradoks Energi & Defisit 547k Ton CO2e",
      tab: "overview",
      targetAudience: "Direktur Utama & Dewan Direksi",
      keyPill: "1,885 Miliar kWh Listrik (63,6% Emisi)",
      cue: "Buka Overview Tab, sorot beban listrik nasional & defisit Scope 2 Telkomsel.",
      script: "Bapak/Ibu Direksi yang terhormat, di balik kepemimpinan Telkomsel dengan 293.000 BTS, beban listrik RAN telah menembus 1,885 Miliar kWh (63,6% total emisi). Menuju target Net Zero 2030, Telkomsel menghadapi defisit dekarbonisasi 547.000 ton CO2e. ImpactGrid hadir memecahkan dilema efisiensi biaya vs dekarbonisasi tanpa mengorbankan SLA jaringan."
    },
    {
      step: 2,
      timing: "1:15 - 2:30",
      title: "Telemetri Multi-Vendor & Digital Twin",
      tab: "telemetry",
      targetAudience: "Chief Architect & VP Network Ops",
      keyPill: "Vendor-Agnostic + PLN Smart Meter",
      cue: "Pindah ke Telemetry, lalu simulasikan penyesuaian suhu shelter di Scenario Lab.",
      script: "Sistem kami menyelesaikan masalah silo teknologi melalui Network Data Hub yang mengintegrasikan data dari 4 vendor besar (Ericsson, Huawei, Nokia, ZTE) dan tervalidasi langsung dengan smart meter PLN. Di Scenario Lab Digital Twin, kita buktikan penyesuaian suhu shelter AC ke 26°C menghemat 200 MWh di fase pilot secara aman."
    },
    {
      step: 3,
      timing: "2:30 - 3:45",
      title: "AI Prioritizer & CTO Safety Guardrail 112",
      tab: "optimization",
      targetAudience: "Direktur Network / CTO",
      keyPill: "120ms Wake-up • 112 Guaranteed",
      cue: "Tunjukkan tabel portofolio investasi & klik tombol Simulasi Darurat (Emergency Drill).",
      script: "Kekuatan utama Modul 3 adalah optimasi portofolio dengan kendali keselamatan berlapis. Keamanan jaringan adalah prioritas mutlak. Dengan jaminan wake-up latency 120 milidetik dan prioritas panggilan darurat 112, transmisi otomatis kembali ke daya penuh saat terjadi anomali beban tanpa interupsi."
    },
    {
      step: 4,
      timing: "3:45 - 5:00",
      title: "Mekanisme Swadana (Self-Funding Reinvestment)",
      tab: "financial",
      targetAudience: "Direktur Keuangan / CFO",
      keyPill: "NPV Rp41,48 Miliar • PBP 1,02 Tahun",
      cue: "Buka Financial Model Tab, perlihatkan tabel 3 horizon & cashflow reinvestasi.",
      script: "Dari kacamata finansial, ImpactGrid tidak membebani kas korporat dengan anggaran berulang. Kami merancang Reinvestment Loop: penghematan OpEx listrik Rp300 Juta di tahap pilot mendanai monitoring fase regional, dan akumulasi penghematan regional Rp6,6 Miliar mendanai ekspansi 10.000+ BTS nasional secara mandiri."
    },
    {
      step: 5,
      timing: "5:00 - 6:00",
      title: "MRV Anti-Greenwashing (ITU-T L.1331 & SHA-256)",
      tab: "esg",
      targetAudience: "Komite ESG & Investor",
      keyPill: "Audit-Ready • Standar Internasional",
      cue: "Buka ESG Tab, tunjukkan log transaksi SHA-256 & sertifikat kepatuhan POJK 51.",
      script: "Seluruh klaim reduksi karbon dihitung berdasarkan metodologi standar internasional ITU-T L.1331 yang memisahkan pengaruh fluktuasi cuaca dan payload trafik. Log audit kami terenkripsi SHA-256, menjadikan laporan keberlanjutan Telkomsel bebas dari tuduhan greenwashing dan audit-ready untuk BEI & OJK."
    },
    {
      step: 6,
      timing: "6:00 - 7:00",
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
      if (pitchSteps[idx].tab !== activeTab) {
        setActiveTab(pitchSteps[idx].tab);
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
            <h4 className="text-sm font-bold text-white line-clamp-1">
              {current.title}
            </h4>
          </div>
        </div>

        {/* Presenter Cue & Highlight */}
        <div className="hidden lg:flex items-center gap-2 flex-1 max-w-xl bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold text-amber-200 shrink-0">Cue:</span>
          <span className="truncate">{current.cue}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Quick Trigger Buttons */}
          {current.step === 3 && (
            <button
              onClick={onOpenEmergencyModal}
              className="px-2.5 py-1.5 bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 shadow-xs cursor-pointer animate-pulse"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Trigger Drill</span>
            </button>
          )}

          {current.step === 6 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenExecutiveMemo}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer border border-slate-700"
              >
                <span>Memo (P)</span>
              </button>
              <button
                onClick={onOpenBodDefense}
                className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <span>Q&A (Q)</span>
              </button>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToStep(currentStep - 1)}
              disabled={currentStep === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 cursor-pointer"
              title="Prev Step (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-400 px-1">
              {currentStep + 1}/{pitchSteps.length}
            </span>
            <button
              onClick={() => goToStep(currentStep + 1)}
              disabled={currentStep === pitchSteps.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 cursor-pointer"
              title="Next Step (Right Arrow / Space)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition ml-1 cursor-pointer"
            title="Tutup Walkthrough Mode (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}