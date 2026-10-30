import React from 'react';
import { 
  FileText, 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Building2, 
  Check, 
  Download,
  Lock,
  Layers,
  Leaf,
  DollarSign
} from 'lucide-react';

export default function ExecutiveOnePagerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onepager-modal-title"
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-[#0B1324]/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 text-[#ED0226] border border-red-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="onepager-modal-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Executive One-Pager · Lembar Keputusan Dewan Direksi
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Dokumen Ringkasan Usulan Investasi & Keputusan Gerbang Audit ImpactGrid
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
              title="Cetak lembar keputusan atau simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: The 1-Pager Document View */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
          
          {/* Document Top Info Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                <span>No. Dok: MEMO/DIR-NET/TSF/2026/X-04</span>
                <span>•</span>
                <span>Klasifikasi: RAHASIA / DIREKSI</span>
              </div>
              <strong className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                Usulan Audit Kebutuhan Efisiensi Energi RAN & Validasi Kausal Kinerja
              </strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] border border-emerald-300 dark:border-emerald-800">
                Permintaan Awal: Audit Rp 95 Juta (2 Bulan)
              </span>
            </div>
          </div>

          {/* Section 1: Konteks & Skala Masalah */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#ED0226] flex items-center gap-1.5">
              <span>1. Konteks Bisnis & Materialitas Isu Energi Telkomsel</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500">Listrik Korporat (2025)</span>
                <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-1">1.885,4 GWh</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Laporan Keberlanjutan Telkom 2025 resmi</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500">Emisi Scope 2 (2025)</span>
                <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-1">1,722 Juta tCO₂e</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Menyumbang 63,6% emisi total operator</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0B1324] border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500">Status Baseline Site</span>
                <div className="text-lg font-black font-mono text-amber-600 dark:text-amber-400 mt-1">Belum Terukur</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Wajib diverifikasi lewat audit meter PLN</p>
              </div>
            </div>
          </div>

          {/* Section 2: Apa Permintaan Hari Ini (The Ask) */}
          <div className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#ED0226] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#ED0226]" />
              <span>2. Inti Permintaan Keputusan Direksi Hari Ini (The Ask)</span>
            </h3>
            <p className="text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
              Kami <strong>TIDAK MEMINTA</strong> persetujuan investasi CapEx miliaran rupiah atau komitmen penggelaran nasional di muka. Yang kami ajukan secara resmi kepada Dewan Direksi adalah:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white dark:bg-[#0B1324] border border-red-200/80 dark:border-red-900/40">
                <strong className="text-slate-900 dark:text-white text-xs block">Tahap 1: Audit Kebutuhan & Sistem (2 Bulan)</strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Batas anggaran maksimal <strong>Rp 95 Juta</strong>. Memeriksa ketersediaan sub-metering AMR PLN, menelaah klausul pass-through kontrak TowerCo (Mitratel/Protelindo), dan memastikan tidak terjadi tumpang tindih dengan fitur vendor RAN.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-[#0B1324] border border-red-200/80 dark:border-red-900/40">
                <strong className="text-slate-900 dark:text-white text-xs block">Tahap 2: Pilot Terbatas Bersyarat (9 Bulan)</strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                  Hanya dieksekusi <strong>jika lolos Gerbang G0</strong> pada 40 site intervensi + 10 site pembanding (Difference-in-Differences) di koridor Jawa Barat–Banten dengan proteksi QoS standar 3GPP.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Downside Protection & SLA Guardrail */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3. Mitigasi Risiko & Garansi Perlindungan Mutu Layanan (Zero Downside)</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  <strong>Fail-Safe Darurat 112:</strong> Pembatalan otomatis mode tidur radio dalam 28ms jika ada panggilan darurat publik atau anomali lonjakan trafik.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  <strong>De-Risking Gerbang G0:</strong> Proyek otomatis dihentikan sebelum CapEx pilot keluar jika estimasi efisiensi awal &lt; 7,5% atau sistem eksisting sudah memadai.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  <strong>Kausalitas Ilmiah (DiD):</strong> Atribusi penghematan diisolasi dari efek cuaca CDD dan tren musiman agar angka audit bebas bias.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Mockup Lembar Tanda Tangan Persetujuan */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              Lembar Otorisasi & Disposisi Direksi:
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                <p className="text-[11px] text-slate-500 font-medium">Diajukan Oleh:</p>
                <div className="my-3 font-serif italic text-base text-slate-800 dark:text-slate-200">
                  Tim Usulan AWAKENING Reborn
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white block">VP Network Architecture & Strategy</strong>
                <span className="text-[10px] text-slate-500 font-mono">TSF 2026 Innovation Challenge</span>
              </div>
              <div className="p-4 rounded-xl border border-dashed border-red-300 dark:border-red-900/50 bg-red-50/20 dark:bg-red-950/20">
                <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">Disetujui Untuk Pelaksanaan Audit:</p>
                <div className="my-3 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>[ Rekomendasi Disetujui ]</span>
                </div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white block">Direktur Network Telkomsel</strong>
                <span className="text-[10px] text-slate-500 font-mono">Alokasi Anggaran: Rp 95.000.000 (Maks)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Sticky Footer */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>SHA-256 Verified · ImpactGrid DSS Audit Engine</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Ringkasan</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
