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
      title: "1. Konteks energi dan emisi perusahaan",
      targetTab: "overview",
      targetDirector: "Direktur Utama & Dewan Direksi",
      keyMetric: "Listrik 2025: 1.885,4 GWh",
      pitchScript: "Data laporan keberlanjutan 2025 menunjukkan skala konsumsi listrik dan emisi Scope 2 perusahaan. Angka agregat tersebut adalah konteks, bukan baseline lokasi atau bukti dampak solusi.",
      actionPrompt: "Tunjukkan konteks perusahaan dan jelaskan batas datanya."
    },
    {
      title: "2. Model konseptual operasi jaringan",
      targetTab: "digitaltwin",
      targetDirector: "VP Network Ops & Chief Architect",
      keyMetric: "Ilustrasi, bukan uji perangkat",
      pitchScript: "Visualisasi Digital Twin ini adalah model konseptual dengan data contoh. Kapabilitas carrier sleep, batas suhu, dampak energi, dan keselamatan layanan harus dikonfirmasi per perangkat dan diuji oleh pemilik jaringan.",
      actionPrompt: "Tunjukkan visualisasi sebagai konsep dan sebutkan kebutuhan uji teknis."
    },
    {
      title: "3. O-RAN Autonomous AI Multi-Agent Swarm",
      targetTab: "agents",
      targetDirector: "Direktur Network / CTO & R&D",
      keyMetric: "Alur agen konseptual",
      pitchScript: "Panel agen menggambarkan kemungkinan pembagian analisis. Tidak ada agen yang terhubung, menjalankan prediksi terkalibrasi, mengendalikan perangkat, atau menjamin latensi dan layanan darurat.",
      actionPrompt: "Tunjukkan alur simulasi dan ingatkan bahwa lognya data contoh."
    },
    {
      title: "4. Data Hub Multi-Vendor & Validitas Smart Meter",
      targetTab: "telemetry",
      targetDirector: "VP Network Architecture & Procurement",
      keyMetric: "Desain usulan 40 + 10 lokasi",
      pitchScript: "Network Data Hub adalah rancangan integrasi. Konektivitas vendor, hak akses, format data, meter, dan rekonsiliasi PLN belum dibuktikan. Nama serta angka pada tabel adalah data sintetis.",
      actionPrompt: "Jelaskan sumber dan izin data yang perlu disiapkan untuk pilot."
    },
    {
      title: "5. Kalkulator sensitivitas energi",
      targetTab: "scenariolab",
      targetDirector: "Direktur Network / CTO",
      keyMetric: "Baseline belum tervalidasi",
      pitchScript: "Scenario Lab menghitung kisaran energi dan manfaat bruto dari baseline, persentase penghematan, dan biaya energi yang dimasukkan. Tidak ada pengukuran intervensi, dampak emisi, atau simulasi cuaca terkalibrasi di dalam prototype.",
      actionPrompt: "Ubah asumsi dan tunjukkan bahwa hasil mengikuti input."
    },
    {
      title: "6. Keselamatan dan alokasi investasi",
      targetTab: "optimization",
      targetDirector: "Direktur Network & Tim Keandalan",
      keyMetric: "QoS dan rollback perlu diuji",
      pitchScript: "Parameter QoS, prioritas layanan darurat, dan prosedur rollback harus disepakati tim operasi lalu diuji dalam lingkungan aman. Simulasi ini tidak membuktikan latency, zero outage, atau perlindungan layanan.",
      actionPrompt: "Tunjukkan stress drill hanya sebagai skenario konseptual."
    },
    {
      title: "7. Model finansial dan sensitivitas",
      targetTab: "financial",
      targetDirector: "Direktur Keuangan / CFO",
      keyMetric: "NPV berubah mengikuti baseline",
      pitchScript: "Model memakai asumsi dan belum menunjukkan kelayakan aktual. Pada skenario hemat 8 persen, NPV indikatif berubah dari sekitar minus Rp391,5 juta ke plus Rp82,3 juta ketika baseline berubah. Audit data dan biaya diperlukan sebelum keputusan investasi.",
      actionPrompt: "Buka Financial Model untuk melihat asumsi yang belum tervalidasi."
    },
    {
      title: "8. Metode ukur dampak ESG",
      targetTab: "esg",
      targetDirector: "Komite ESG & Dewan Komisaris",
      keyMetric: "Belum ada hasil verifikasi",
      pitchScript: "ITU-T L.1331 dapat menjadi rujukan pengukuran efisiensi jaringan. Hasil, faktor emisi, proses assurance, dan kelayakan untuk pelaporan harus ditetapkan bersama pemilik data dan fungsi ESG. Hash hanya mengecek integritas payload, bukan kebenaran sumber.",
      actionPrompt: "Buka daftar validasi dan rujukan resmi; jangan menyebutnya sertifikat audit."
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
