import React from 'react';
import { Briefcase, CircleHelp, ClipboardList, Database, DollarSign, Leaf, Radio, ShieldAlert } from 'lucide-react';

const REQUIRED_INPUTS = [
  { icon: Database, title: 'Baseline energi per lokasi', detail: 'Data meter/tagihan dengan periode, batas aset, dan rekonsiliasi yang disetujui.', status: 'Belum tersedia' },
  { icon: Radio, title: 'Kelayakan teknis dan mutu layanan', detail: 'Kompatibilitas perangkat, kondisi jaringan, batas QoS, prosedur uji aman, dan rollback dari operator.', status: 'Belum dinilai' },
  { icon: DollarSign, title: 'Biaya dan manfaat aktual', detail: 'Penawaran, lisensi, kontrak, biaya integrasi, OPEX, serta pihak yang menerima manfaat.', status: 'Belum diverifikasi' },
  { icon: Leaf, title: 'Metode pengukuran ESG', detail: 'Baseline, periode, faktor emisi, batas inventaris, dan metode atribusi yang disepakati tim ESG.', status: 'Belum ditetapkan' },
  { icon: ClipboardList, title: 'Izin dan tata kelola data', detail: 'Persetujuan pemilik aset, hak akses, keamanan, retensi, dan pihak yang mengesahkan keputusan.', status: 'Belum dikaji' }
];

const DECISION_STEPS = [
  'Validasi sumber dan kelengkapan data',
  'Terapkan kriteria teknis dan keselamatan yang disetujui',
  'Bandingkan sensitivitas biaya dan manfaat',
  'Tinjau hasil bersama pemilik keputusan'
];

export default function OptimizationTab() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
          <Briefcase className="h-4 w-4" />
          <span>Modul 3: Investment Prioritizer (rancangan)</span>
        </div>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Kerangka prioritisasi investasi</h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-700">
          Prototype ini belum memiliki data lokasi terverifikasi dan tidak menghasilkan peringkat, rekomendasi investasi, atau keputusan jaringan. Daftar di bawah menunjukkan masukan yang harus tersedia sebelum model dapat dipakai.
        </p>
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <div><strong>Seluruh hasil investasi masih belum diketahui.</strong> Baseline, biaya, manfaat, dampak karbon, dan batas QoS harus diverifikasi oleh pemilik data serta unit berwenang. Perhitungan sensitivitas proposal ada di tab model finansial.</div>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center gap-2">
          <Database className="h-4 w-4 text-indigo-600" />
          <h2 className="text-sm font-extrabold text-slate-900">Data dan persetujuan yang diperlukan</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {REQUIRED_INPUTS.map(({ icon: Icon, title, detail, status }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <Icon className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-bold">{title}</h3>
                </div>
                <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-800">{status}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-cyan-700" />
          <h2 className="text-sm font-extrabold text-slate-900">Alur keputusan yang diusulkan</h2>
        </div>
        <ol className="grid gap-3 md:grid-cols-2">
          {DECISION_STEPS.map((step, index) => (
            <li key={step} className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">{index + 1}</span>
              <span className="pt-1 text-sm font-semibold leading-relaxed text-slate-700">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
          <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          Bobot, batas kelayakan, dan aturan pemilihan harus disepakati sebelum perhitungan. Persetujuan manusia dan kewenangan operator tetap menjadi bagian dari proses.
        </p>
      </section>
    </div>
  );
}
