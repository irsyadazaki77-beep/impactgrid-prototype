import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  X,
  Target,
  Download
} from 'lucide-react';

export default function DirectorTourModal({
  isOpen,
  onClose,
  onNavigateTab,
  simState,
  selectedScale = 'pilot',
  operationalSummary,
  resolvedSites = []
}) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const siteCount = operationalSummary?.siteCount ?? 50;
  const savedMwh = operationalSummary?.annualizedSavedMwh ?? 200;
  const simHour = typeof simState?.simHour === 'number' ? simState.simHour : 14;

  const tourSteps = [
    {
      title: "1. Konteks Skala Energi & Emisi Jaringan Telkomsel",
      targetTab: "overview",
      targetDirector: "Direktur Utama & Dewan Direksi",
      keyMetric: "Listrik 2025: 1.885,4 GWh",
      pitchScript: "Telkomsel mengoperasikan lebih dari 250.000 BTS dengan beban listrik tahunan mencapai 1.885,4 GWh yang menyumbang 63,6% emisi Scope 2 korporat. ImpactGrid menghadirkan sistem pendukung keputusan lintas fungsi untuk memangkas OPEX listrik hingga Rp 240 Juta/tahun pada 40 site pilot.",
      actionPrompt: "Tinjau dasbor KPI utama, tren konsumsi daya aktif, dan ringkasan 3 pilar skor eksekutif."
    },
    {
      title: "2. Digital Twin & Optimasi Termal PINN",
      targetTab: "digitaltwin",
      targetDirector: "VP Network Ops & Chief Architect",
      keyMetric: "Efisiensi PUE 1.18 • Wake-Up 28ms",
      pitchScript: "Digital Twin berbasis Physics-Informed Neural Network (PINN) memodelkan disipasi panas shelter dan konsumsi radio secara fisik. Sistem mengorkestrasi pendingin cerdas dan 3GPP carrier sleep secara presisi tanpa melanggar batas suhu kritis shelter 27°C.",
      actionPrompt: "Eksplorasi slider temperatur luar ruangan dan beban trafik untuk melihat kalkulasi daya reaktif."
    },
    {
      title: "3. Orkestrasi Multi-Agen O-RAN Otonom",
      targetTab: "agents",
      targetDirector: "Direktur Network / CTO & R&D",
      keyMetric: "Orkestrasi 4 Agen Terdistribusi",
      pitchScript: "Arsitektur multi-agen otonom membagi peran secara modular: Agen Prediksi Beban, Agen Manajemen Termal, Agen Efisiensi Radio, dan Agen Keselamatan SLA. Seluruh keputusan dieksekusi dengan protokol O-RAN A1/O1 non-real-time RIC.",
      actionPrompt: "Tinjau log orkestrasi real-time dan interaksi antar agen dalam menanggapi anomali jaringan."
    },
    {
      title: "4. Network Data Hub & Validasi Telemetri Multi-Vendor",
      targetTab: "telemetry",
      targetDirector: "VP Network Architecture & Procurement",
      keyMetric: "Rekonsiliasi 3-Arah • IoT Kelas 0.5s",
      pitchScript: "Data Hub mengintegrasikan telemetri multi-vendor (Ericsson, Huawei, ZTE) dengan submeter digital shelter dan smart meter AMR PLN. Rekonsiliasi 3-arah mengeliminasi phantom load leakage dan memvalidasi penghematan kWh secara objektif.",
      actionPrompt: "Periksa modul Ingestion CSV BTS dan matriks rekonsiliasi PLN vs Rectifier vs Radio."
    },
    {
      title: "5. Scenario Lab: Uji Sensitivitas Multi-Kondisi",
      targetTab: "scenariolab",
      targetDirector: "Direktur Network / CTO",
      keyMetric: "Stress-Testing Lonjakan & Cuaca",
      pitchScript: "Scenario Lab memungkinkan direksi melakukan simulasi what-if terhadap berbagai ketidakpastian: kenaikan tarif listrik PLN, lonjakan trafik mudik Lebaran, pemadaman grid regional, hingga gelombang panas ekstrem.",
      actionPrompt: "Ubah parameter tarif listrik dan beban trafik untuk menganalisis batas ketahanan sistem."
    },
    {
      title: "6. Optimasi CapEx & Proteksi Layanan Darurat 112",
      targetTab: "optimization",
      targetDirector: "Direktur Network & Komite Investasi",
      keyMetric: "0-1 Knapsack Solver (+28% NPV)",
      pitchScript: "Menggunakan algoritma 0-1 Knapsack Solver untuk alokasi modal CapEx yang memaksimalkan NPV portofolio dibanding heuristik konvensional. Dilengkapi proteksi zero-wait yang seketika membatalkan sleep mode jika panggilan 112 terdeteksi.",
      actionPrompt: "Bandingkan kurva Pareto Frontier dan simulasikan mekanisme auto-rollback darurat."
    },
    {
      title: "7. Model Finansial & Roadmap Swadana 4-Horizon",
      targetTab: "financial",
      targetDirector: "Direktur Keuangan / CFO",
      keyMetric: "NPV 5-Thn: +Rp 460 Jt • PBP: 1,9 Thn",
      pitchScript: "Investasi turn-key Rp450 juta untuk 50 site pilot menghasilkan payback 1,9 tahun dengan IRR 38%. Penghematan neto fase pilot menjadi modal swadana (self-funding) untuk mendanai ekspansi regional 5.000 menara makro tanpa beban utang baru.",
      actionPrompt: "Tinjau analisis arus kas diskonto (DCF), kurva sensitivitas, dan roadmap 4-horizon ekspansi."
    },
    {
      title: "8. Dampak ESG & Integritas Audit Kriptografis",
      targetTab: "esg",
      targetDirector: "Komite ESG & Dewan Komisaris",
      keyMetric: "Faktor ESDM 0,87 kgCO₂e • SHA-256",
      pitchScript: "Metodologi penghitungan reduksi emisi Scope 2 mematuhi faktor emisi resmi ESDM Jamali dan standar IFRS S2/ISO 14064-1. Setiap kWh penghematan dicatat pada audit trail ledger berbasis hash SHA-256 untuk menjamin anti-greenwashing.",
      actionPrompt: "Periksa kepatuhan standar ESG korporat dan verifikasi integritas rantai blok telemetri."
    }
  ];

  const current = tourSteps[currentStep];

  const handleExportBriefingCsv = () => {
    const rows = [
      ['Tahap', 'Judul Materi Briefing', 'Audiens Direksi', 'Metrik Utama', 'Pokok Telaah Strategis Eksekutif', 'Modul Terkait'],
      ...tourSteps.map((s, idx) => [
        idx + 1,
        s.title,
        s.targetDirector,
        s.keyMetric,
        s.pitchScript,
        s.targetTab
      ])
    ];
    const csvContent = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ImpactGrid_Executive_Briefing_Direksi_${selectedScale}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  const handleGoToStep = (index) => {
    setCurrentStep(index);
    if (onNavigateTab) {
      onNavigateTab(tourSteps[index].targetTab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="director-tour-title"
        className="w-full max-w-xl bg-white dark:bg-[#0B1324] text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xl bg-red-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="director-tour-title" className="text-sm font-black tracking-tight">
                Executive Briefing &amp; Strategic Walkthrough • Dewan Direksi Telkomsel
              </h2>
              <p className="text-[11px] text-slate-400">
                Langkah {currentStep + 1} dari {tourSteps.length}: Panduan Eksekutif ({siteCount} Site · Jam {String(simHour).padStart(2, '0')}:00 WIB)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleExportBriefingCsv}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition cursor-pointer inline-flex items-center gap-1 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unduh Materi (CSV)</span>
            </button>
            <button 
              onClick={onClose}
              aria-label="Tutup Briefing"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs">
          {/* Live Telemetry Sync Strip */}
          <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span>Skala Aktif: <strong className="uppercase text-[#ED0226]">{selectedScale} ({siteCount} Site)</strong></span>
            <span>Penghematan: <strong className="text-emerald-600 dark:text-emerald-400">{savedMwh} MWh/Thn</strong></span>
            <span>Kalibrasi FOP: <strong>{resolvedSites.length} Site Klop</strong></span>
          </div>

          {/* Target Audience & Metric Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Audiens Utama:</span>
              <span className="font-extrabold text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-900">
                {current.targetDirector}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg text-slate-700 dark:text-slate-200 font-bold">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              <span>{current.keyMetric}</span>
            </div>
          </div>

          {/* Step Title */}
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {current.title}
            </h3>
          </div>

          {/* Spoken Pitch Script (Executive Dossier Style) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Pokok Telaah Strategis Eksekutif:
            </span>
            <p className="text-slate-800 dark:text-slate-200 text-xs sm:text-[13px] leading-relaxed font-medium">
              &ldquo;{current.pitchScript}&rdquo;
            </p>
          </div>

          {/* Action Prompt */}
          <div className="flex items-center space-x-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-semibold text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Tindakan di Layar: {current.actionPrompt}</span>
          </div>

          {/* Step Tracker Dots */}
          <div className="flex items-center justify-center space-x-1.5 pt-2">
            {tourSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => handleGoToStep(idx)}
                aria-label={`Pindah ke langkah ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep 
                    ? 'w-6 bg-[#ED0226]' 
                    : 'w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 dark:bg-slate-900 px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              currentStep === 0
                ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            {currentStep + 1} / {tourSteps.length}
          </span>

          {currentStep < tourSteps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Selesai Briefing</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

