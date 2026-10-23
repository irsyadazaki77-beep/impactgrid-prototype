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
  ArrowRight,
  Zap,
  Bot
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
      title: "2. Digital Twin Fisika BTS & Carrier Sleep (700MHz–2.3GHz)",
      targetTab: "digitaltwin",
      targetDirector: "VP Network Ops & Chief Architect",
      keyMetric: "Carrier Sleep Otonom • PUE 1.18",
      pitchScript: "Lihat visualisasi Digital Twin mikroskopik BTS kami. Kami tidak memutus listrik sembarangan; carrier 700MHz & 900MHz tetap terkunci 100% aktif untuk panggilan darurat 112, sementara carrier 1.8GHz hingga 2.3GHz Massive MIMO dapat ditidurkan (micro/deep sleep) saat beban rendah, memangkas daya hingga 58% dan menekan suhu shelter secara presisi.",
      actionPrompt: "Tunjukkan simulasi interaktif carrier sleep dan termodinamika shelter AC."
    },
    {
      title: "3. O-RAN Autonomous AI Multi-Agent Swarm",
      targetTab: "agents",
      targetDirector: "Direktur Network / CTO & R&D",
      keyMetric: "4 Agen AI • Konsensus Sub-120ms",
      pitchScript: "ImpactGrid digerakkan oleh 4 agen AI otonom: Prophet-RAN memprediksi trafik 6 jam ke depan, ThermoOptima mengontrol AC inverter, Sentinel-SLA menjamin interupsi darurat <120ms, dan GreenLedger mengunci audit hash. Mereka bernegosiasi secara closed-loop tanpa intervensi manual manusia.",
      actionPrompt: "Uji coba skenario konser musik atau gempa bencana di terminal multi-agent."
    },
    {
      title: "4. Data Hub Multi-Vendor & Validitas Smart Meter",
      targetTab: "telemetry",
      targetDirector: "VP Network Architecture & Procurement",
      keyMetric: "40 Lokasi Uji + 10 Pembanding",
      pitchScript: "Sistem kami tidak terjebak vendor lock-in. Melalui Network Data Hub, ImpactGrid mengonsolidasikan data secara vendor-agnostic dari Ericsson ENM, Huawei iMaster, ZTE NetNumen, Nokia NetAct, dan merekonsiliasikannya 100% dengan smart meter PLN secara transparan.",
      actionPrompt: "Buka Network Data Hub dan perlihatkan pencarian site BTS pilot."
    },
    {
      title: "5. Simulasi Scenario Lab Terkoreksi Cuaca",
      targetTab: "scenariolab",
      targetDirector: "Direktur Network / CTO",
      keyMetric: "Hemat 10% - 15% Konsumsi Listrik",
      pitchScript: "Sebelum intervensi dieksekusi, Scenario Lab Digital Twin menguji simulasi secara dinamis. Peningkatan suhu shelter AC ke 26°C menghemat hingga 3% beban pendingin per derajat, terbukti menurunkan 200 MWh pada tahap pilot tanpa risiko overheating perangkat.",
      actionPrompt: "Uji coba slider suhu shelter AC dan pilih skenario 10% dasar."
    },
    {
      title: "6. CTO Guardrail & Alokasi Knapsack CapEx",
      targetTab: "optimization",
      targetDirector: "Direktur Network & Tim Keandalan",
      keyMetric: "120 ms Wake-up Latency • 112 Guaranteed",
      pitchScript: "Keamanan jaringan adalah harga mati. Dengan Multi-Layer Guardrail dan integrasi prioritas panggilan darurat 112, jika terjadi lonjakan mendadak, sistem otomatis menghentikan sleep mode dalam 120 milidetik. Zero drop call, zero komplain pelanggan.",
      actionPrompt: "Tunjukkan tombol simulasi lonjakan darurat (Emergency Drill)."
    },
    {
      title: "7. Model Finansial Swadana & Monte Carlo 1.000 Run",
      targetTab: "financial",
      targetDirector: "Direktur Keuangan / CFO",
      keyMetric: "NPV 5 Tahun +Rp41,48 M • P10 +Rp34,2 M",
      pitchScript: "Bagi keuangan korporat, model ini mandiri finansial. Penghematan pilot mendanai tahap regional, lalu mendanai ekspansi nasional secara swadana tanpa utang baru. Simulasi Monte Carlo 1.000 iterasi membuktikan tingkat kepastian 99,8% NPV positif dengan ekspansi EBITDA marjin +0,38%.",
      actionPrompt: "Tunjukkan grafik distribusi Monte Carlo dan analisis nilai pemegang saham."
    },
    {
      title: "8. Verifikasi ESG Anti-Greenwashing (ITU-T L.1331)",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xl bg-red-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight">
                Mode Presentasi Eksekutif Direksi Telkomsel (7 Menit Pitch)
              </h2>
              <p className="text-[11px] text-slate-400">
                Langkah {currentStep + 1} dari {tourSteps.length}: Narasi terarah untuk juri & direktur
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs">
          {/* Target Audience & Metric Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Audiens Utama:</span>
              <span className="font-extrabold text-xs text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                {current.targetDirector}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 font-mono text-[11px] bg-slate-100 px-2.5 py-0.5 rounded-lg text-slate-700 font-bold">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              <span>{current.keyMetric}</span>
            </div>
          </div>

          {/* Step Title */}
          <div>
            <h3 className="text-base font-black text-slate-900">
              {current.title}
            </h3>
          </div>

          {/* Spoken Pitch Script (Teleprompter style) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Naskah Ucapan Presenter:
            </span>
            <p className="text-slate-800 text-xs sm:text-[13px] leading-relaxed font-medium italic">
              "{current.pitchScript}"
            </p>
          </div>

          {/* Action Prompt */}
          <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tindakan di Layar: {current.actionPrompt}</span>
          </div>

          {/* Step Indicator Progress Dots */}
          <div className="flex items-center justify-center space-x-1.5 pt-2">
            {tourSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => handleGoTo(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx 
                    ? 'w-7 bg-red-600' 
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title={step.title}
              />
            ))}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentStep === 0 
                ? 'opacity-40 cursor-not-allowed text-slate-400' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
            >
              Tutup
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === tourSteps.length - 1}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition cursor-pointer ${
                currentStep === tourSteps.length - 1
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-xs'
                  : 'bg-red-600 hover:bg-red-700 shadow-xs'
              }`}
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Selesai Tour' : 'Lanjut Tab Berikutnya'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
