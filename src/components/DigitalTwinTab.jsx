import React from 'react';
import { Activity, Database, Leaf, Radio, ShieldAlert, Thermometer, Zap } from 'lucide-react';

const INPUTS = [
  { icon: Database, title: 'Konfigurasi aset', text: 'Perangkat, pemilik aset, izin, batas pengukuran, dan versi konfigurasi.' },
  { icon: Zap, title: 'Konsumsi energi', text: 'Data meter/tagihan per lokasi yang direkonsiliasi untuk periode yang disepakati.' },
  { icon: Activity, title: 'Trafik dan layanan', text: 'Indikator agregat, definisi metrik, ambang layanan, dan prosedur keselamatan.' },
  { icon: Thermometer, title: 'Cuaca dan kondisi lokasi', text: 'Sumber cuaca, suhu, serta faktor eksternal yang relevan dengan model.' }
];

const OUTPUTS = [
  { icon: Zap, title: 'Perubahan konsumsi', status: 'Belum dihitung' },
  { icon: Leaf, title: 'Emisi terhindar', status: 'Belum dihitung' },
  { icon: Radio, title: 'Dampak QoS dan latency', status: 'Belum diuji' }
];

export default function DigitalTwinTab() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold"><Activity className="h-4 w-4" /><span>Modul 2: Scenario Lab / Digital Twin (rancangan)</span></div>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Model skenario energi dan jaringan</h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-700">Prototype ini tidak memakai twin lokasi nyata dan tidak memodelkan perilaku perangkat. Tanpa data dan parameter tervalidasi, halaman ini hanya menjelaskan masukan dan keluaran yang perlu disepakati.</p>
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p><strong>Tidak ada simulasi kinerja yang tervalidasi.</strong> Nilai konsumsi, manfaat, suhu, QoS, latency, dan respons darurat tidak dihitung oleh halaman ini.</p>
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-extrabold text-slate-900">Masukan minimum untuk rancangan model</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {INPUTS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Icon className="h-4 w-4 text-indigo-600" />{title}</div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{text}</p>
              <span className="mt-3 inline-block rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-800">Belum diterima</span>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-extrabold text-slate-900">Keluaran yang menunggu validasi</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {OUTPUTS.map(({ icon: Icon, title, status }) => (
            <article key={title} className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <Icon className="h-5 w-5 text-amber-800" />
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-amber-900">{title}</p>
              <p className="mt-1 text-lg font-black text-amber-950">{status}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
