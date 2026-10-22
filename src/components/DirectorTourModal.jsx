import React, { useState } from 'react';
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  DollarSign, 
  Leaf, 
  X,
  Target,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function DirectorTourModal({ isOpen, onClose, onNavigateTab }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: "1. Paradoks Energi & Beban Emisi Scope 2 Telkomsel",
      targetTab: "overview",
      targetDirector: "Direktur Utama & Dewan Direksi",
      keyMetric: "1,885 Miliar kWh (63,6% Emisi)",
      pitchScript: "Bapak/Ibu Direksi yang terhormat, di balik kepemimpinan Telkomsel dengan 293.000 BTS, terdapat tantangan beban listrik senilai triliunan rupiah dan defisit dekarbonisasi 547.000 ton CO2e menuju target Net Zero 2030. ImpactGrid diciptakan untuk memecahkan paradoks ini tanpa menurunkan mutu sinyal sedikit pun.",
      actionPrompt: "Tunjukkan Overview Tab & Peta Geospasial Nusantara."
    },
    {
      title: "2. Data Hub Multi-Vendor & Validitas Smart Meter",
      targetTab: "telemetry",
      targetDirector: "VP Network Ops & Chief Architect",
      keyMetric: "40 Lokasi Uji + 10 Pembanding",
      pitchScript: "Sistem kami tidak terjebak vendor lock-in. Melalui Network Data Hub, ImpactGrid mengonsolidasikan data secara vendor-agnostic dari Ericsson ENM, Huawei iMaster, ZTE NetNumen, Nokia NetAct, dan merekonsiliasikannya 100% dengan smart meter PLN secara transparan.",
      actionPrompt: "Buka Network Data Hub dan perlihatkan pencarian site BTS pilot."
    },
    {
      title: "3. Simulasi Digital Twin Terkoreksi Cuaca & Trafik",
      targetTab: "scenariolab",
      targetDirector: "Direktur Network / CTO",
      keyMetric: "Hemat 10% - 15% Konsumsi Listrik",
      pitchScript: "Sebelum intervensi dieksekusi, Scenario Lab Digital Twin menguji simulasi secara dinamis. Peningkatan suhu shelter AC ke 26°C menghemat hingga 3% beban pendingin per derajat, terbukti menurunkan 200 MWh pada tahap pilot tanpa risiko overheating perangkat.",
      actionPrompt: "Uji coba slider suhu shelter AC dan pilih skenario 10% dasar."
    },
    {
      title: "4. CTO Guardrail & Prioritas Alokasi CapEx",
      targetTab: "optimization",
      targetDirector: "Direktur Network & Tim Keandalan",
      keyMetric: "120 ms Wake-up Latency • 112 Guaranteed",
      pitchScript: "Keamanan jaringan adalah harga mati. Dengan Multi-Layer Guardrail dan integrasi prioritas panggilan darurat 112, jika terjadi lonjakan mendadak, sistem otomatis menghentikan sleep mode dalam 120 milidetik. Zero drop call, zero komplain pelanggan.",
      actionPrompt: "Tunjukkan tombol simulasi lonjakan darurat (Emergency Drill)."
    },
    {
      title: "5. Mekanisme Swadana (Self-Funding Reinvestment Loop)",
      targetTab: "financial",
      targetDirector: "Direktur Keuangan / CFO",
      keyMetric: "NPV 5 Tahun Rp41,48 Miliar • PBP 1,02 Tahun",
      pitchScript: "Bagi keuangan korporat, model ini tidak membutuhkan suntikan anggaran baru terus-menerus. Penghematan OpEx listrik Rp300 Juta di tahap pilot mendanai monitoring fase regional, dan penghematan regional Rp6,6 Miliar mendanai ekspansi skala nasional 10.000+ BTS secara swadana.",
      actionPrompt: "Tunjukkan tabel perbandingan 3 horizon dan grafik reinvestasi mandiri."
    },
    {
      title: "6. Verifikasi ESG Anti-Greenwashing (ITU-T L.1331)",
      targetTab: "esg",
      targetDirector: "Komite ESG & Dewan Komisaris",
      keyMetric: "Standar ITU-T L.1331 • Hash SHA-256",
      pitchScript: "Klaim dekarbonisasi kami lolos uji audit internasional. Metodologi ITU-T L.1331 memisahkan efek cuaca dan kenaikan payload data secara ilmiah, menghasilkan sertifikat verifikasi MRV yang siap dipakai untuk pelaporan POJK 51 dan BEI ESG.",
      actionPrompt: "Klik tombol 'Generate Laporan Verifikasi MRV' untuk memperlihatkan sertifikat audit."
    }
  ];

  const current = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      if (onNavigateTab) {
        onNavigateTab(tourSteps[nextIdx].targetTab);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      if (onNavigateTab) {
        onNavigateTab(tourSteps[prevIdx].targetTab);
      }
    }
  };

  const handleGoTo = (idx) => {
    setCurrentStep(idx);
    if (onNavigateTab) {
      onNavigateTab(tourSteps[idx].targetTab);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-lg animate-slide-up shadow-2xl">
      <div className="rounded-2xl bg-white border border-slate-300 shadow-2xl overflow-hidden text-slate-900">
        {/* Top Header */}
        <div className="p-3.5 bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-white/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-red-200 block">
                Executive Walkthrough Guide
              </span>
              <h3 className="text-xs font-black">Mode Presentasi Direksi (Langkah {currentStep + 1} dari {tourSteps.length})</h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 space-y-3.5 text-xs">
          {/* Target Persona Badge */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
              Fokus: {current.targetDirector}
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-bold">
              Key Metric: {current.keyMetric}
            </span>
          </div>

          <h4 className="text-sm font-extrabold text-slate-900">{current.title}</h4>

          {/* Script Box */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed italic text-[11px]">
            "{current.pitchScript}"
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Target className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span><strong>Aksi Demo:</strong> {current.actionPrompt}</span>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center space-x-1.5 pt-1">
            {tourSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => handleGoTo(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx 
                    ? 'w-6 bg-red-600' 
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={step.title}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-3 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentStep === 0 
                ? 'opacity-40 cursor-not-allowed text-slate-400' 
                : 'text-slate-700 hover:bg-white hover:shadow-xs cursor-pointer'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === tourSteps.length - 1}
            className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer ${
              currentStep === tourSteps.length - 1
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
