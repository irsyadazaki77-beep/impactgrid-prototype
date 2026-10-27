import React, { useState } from 'react';
import { ClipboardCheck, Database, CircleDollarSign, Activity, Leaf, FileText, FileSearch } from 'lucide-react';
import EvidenceExplorerModal from './EvidenceExplorerModal';

const requirements = [
  {
    title: 'Baseline energi dan kualitas data',
    icon: Database,
    evidence: 'Meter lokasi, tagihan, periode pencatatan, serta rekonsiliasi meter utama dan submeter.',
    decision: 'Tetapkan baseline kWh per lokasi dan ambang kelengkapan data sebelum intervensi.'
  },
  {
    title: 'Atribusi penghematan dan pembanding',
    icon: Activity,
    evidence: 'Data sebelum/sesudah, trafik, cuaca, perubahan konfigurasi, serta lokasi pembanding yang sebanding.',
    decision: 'Pradaftarkan metode, periode, dan pengecualian; hitung DiD hanya setelah data lengkap.'
  },
  {
    title: 'Biaya dan manfaat finansial',
    icon: CircleDollarSign,
    evidence: 'Kontrak energi, tarif efektif, porsi penghematan yang dapat dihindari, penawaran vendor, CapEx, dan OpEx.',
    decision: 'Finance mengesahkan arus kas, horizon, dan tingkat diskonto sebelum keputusan investasi.'
  },
  {
    title: 'Mutu layanan dan keselamatan',
    icon: ClipboardCheck,
    evidence: 'Availability, drop call, throughput, latency, keluhan, serta prosedur rollback yang disetujui operator.',
    decision: 'Tetapkan batas non-inferiority dan uji kendali di lingkungan yang diizinkan sebelum pilot.'
  },
  {
    title: 'Emisi Scope 2',
    icon: Leaf,
    evidence: 'Pengurangan kWh yang telah diatribusikan dan faktor emisi lokasi/periode dengan sumber serta versi resmi.',
    decision: 'Jangan klaim ton CO₂e sebelum faktor dan metode pelaporan disetujui fungsi ESG.'
  }
];

export default function PilotValidationCenterTab({ onOpenReportModal }) {
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 p-6 md:p-8 space-y-4 shadow-xs">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
          <ClipboardCheck className="h-4 w-4" /> Rencana validasi pilot
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Belum ada hasil pilot atau bukti lapangan</h1>
        <p className="max-w-4xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Prototipe ini tidak memiliki dataset lokasi operasional. Daftar di bawah menjelaskan kebutuhan data dan rancangan evaluasi; tidak ada penghematan, signifikansi statistik, kelulusan gerbang, status QoS, ataupun persetujuan Telkomsel yang dihasilkan dari halaman ini.
        </p>
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {onOpenReportModal && (
            <button onClick={onOpenReportModal} className="inline-flex items-center gap-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white px-4 py-2 text-xs font-bold transition cursor-pointer shadow-2xs">
              <FileText className="h-4 w-4" /> Lihat lembar kerja validasi
            </button>
          )}
          <button 
            onClick={() => setIsEvidenceOpen(true)} 
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 text-xs font-bold transition cursor-pointer shadow-2xs border border-slate-200 dark:border-slate-700"
          >
            <FileSearch className="h-4 w-4 text-[#ED0226]" /> Buka Evidence Explorer
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {requirements.map(({ title, icon: Icon, evidence, decision }, index) => (
          <article key={title} className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs">{index + 1}</span>
              <Icon className="h-4 w-4 text-[#ED0226] dark:text-red-400" />
              <h2 className="font-extrabold">{title}</h2>
            </div>
            <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Data yang dibutuhkan:</strong> {evidence}</div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300"><strong>Keputusan validasi:</strong> {decision}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Status: belum tersedia / menunggu data pilot</div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 p-5 md:p-6 shadow-xs">
        <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Gerbang keputusan yang perlu ditetapkan</h2>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Ambang angka untuk energi, finansial, dan QoS harus disepakati pemilik data, tim jaringan, Finance, serta ESG sebelum uji coba. Setelah pilot, tampilkan hasil aktual beserta ukuran ketidakpastian, pengecualian data, dan metodologi yang digunakan. Ekspansi tetap menjadi keputusan manusia berdasarkan bukti tersebut.
        </p>
      </section>

      {/* Evidence Explorer Modal */}
      <EvidenceExplorerModal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
      />
    </div>
  );
}