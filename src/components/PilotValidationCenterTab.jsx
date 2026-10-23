import React from 'react';
import { ClipboardCheck, Database, CircleDollarSign, Activity, Leaf, FileText } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-amber-300 bg-amber-50 p-6 md:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-bold text-amber-900">
          <ClipboardCheck className="h-4 w-4" /> Rencana validasi pilot
        </div>
        <h1 className="text-2xl font-black text-slate-900">Belum ada hasil pilot atau bukti lapangan</h1>
        <p className="max-w-4xl text-sm leading-relaxed text-slate-700">
          Prototipe ini memakai data sintetis untuk mendemonstrasikan alur analisis. Angka simulasi tidak membuktikan penghematan, signifikansi statistik, kelulusan gerbang, status QoS, ataupun persetujuan Telkomsel. Gunakan daftar di bawah sebagai prasyarat pengumpulan dan validasi data.
        </p>
        {onOpenReportModal && (
          <button onClick={onOpenReportModal} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800">
            <FileText className="h-4 w-4" /> Lihat lembar kerja validasi
          </button>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {requirements.map(({ title, icon: Icon, evidence, decision }, index) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">{index + 1}</span>
              <Icon className="h-4 w-4 text-red-600" />
              <h2 className="font-extrabold">{title}</h2>
            </div>
            <div className="text-xs leading-relaxed text-slate-600"><strong className="text-slate-800">Data yang dibutuhkan:</strong> {evidence}</div>
            <div className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700"><strong>Keputusan validasi:</strong> {decision}</div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-amber-800">Status: belum tersedia / menunggu data pilot</div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
        <h2 className="font-extrabold text-slate-900">Gerbang keputusan yang perlu ditetapkan</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Ambang angka untuk energi, finansial, dan QoS harus disepakati pemilik data, tim jaringan, Finance, serta ESG sebelum uji coba. Setelah pilot, tampilkan hasil aktual beserta ukuran ketidakpastian, pengecualian data, dan metodologi yang digunakan. Ekspansi tetap menjadi keputusan manusia berdasarkan bukti tersebut.
        </p>
      </section>
    </div>
  );
}
