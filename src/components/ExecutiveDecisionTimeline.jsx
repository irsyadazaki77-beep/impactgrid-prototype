import React from 'react';
import { ClipboardList, Database, FileCheck2, ShieldAlert } from 'lucide-react';

const steps = [
  { title: 'Validasi data', text: 'Pastikan sumber, periode, kelengkapan, dan kewenangan akses.', icon: Database },
  { title: 'Analisis sensitivitas', text: 'Bandingkan asumsi yang tercatat; pisahkan hasil hitung dari pengukuran.', icon: ClipboardList },
  { title: 'Tinjauan pemilik fungsi', text: 'Minta persetujuan jaringan, keuangan, ESG, legal, dan pengelola aset sesuai kebutuhan.', icon: FileCheck2 },
  { title: 'Keputusan bersyarat', text: 'Pilot hanya dipertimbangkan setelah bukti, izin, dan prosedur keselamatan disepakati.', icon: ShieldAlert }
];

export default function ExecutiveDecisionTimeline() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
      <h2 className="text-base font-extrabold text-slate-900">Alur keputusan yang diusulkan</h2>
      <p className="mt-1 text-xs text-slate-600">Tidak ada integrasi, hasil pengukuran, persetujuan, atau keputusan otomatis pada prototype.</p>
      <ol className="mt-5 grid gap-3 md:grid-cols-2">
        {steps.map(({ title, text, icon: Icon }, index) => (
          <li key={title} className="flex gap-3 rounded-2xl border border-slate-200 p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">{index + 1}</span>
            <div><div className="flex items-center gap-2 font-bold text-slate-900"><Icon className="h-4 w-4 text-indigo-600" />{title}</div><p className="mt-1 text-xs leading-relaxed text-slate-600">{text}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
