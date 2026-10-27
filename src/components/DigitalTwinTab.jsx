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
      <header className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 p-6 md:p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/50 text-xs font-bold text-sky-800 dark:text-sky-300">
          <Activity className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
          <span>Modul 2: Scenario Lab / Digital Twin (rancangan)</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Model skenario energi dan jaringan
        </h1>
        <p className="max-w-4xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Prototype ini tidak memakai twin lokasi nyata dan tidak memodelkan perilaku perangkat. Tanpa data dan parameter tervalidasi, halaman ini hanya menjelaskan masukan dan keluaran yang perlu disepakati.
        </p>
        <div className="flex items-start gap-3 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/25 p-4 text-xs leading-relaxed text-amber-900 dark:text-amber-300">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p>
            <strong className="font-bold text-amber-950 dark:text-amber-200">Tidak ada simulasi kinerja yang tervalidasi.</strong> Nilai konsumsi, manfaat, suhu, QoS, latency, dan respons darurat tidak dihitung oleh halaman ini.
          </p>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Masukan minimum untuk rancangan model
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {INPUTS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                  <Icon className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <span>{title}</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {text}
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-block rounded-full border border-amber-200/80 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                  Belum diterima
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 p-6 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Keluaran yang menunggu validasi
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {OUTPUTS.map(({ icon: Icon, title, status }) => (
            <article key={title} className="rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/25 p-4 space-y-1">
              <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                {title}
              </p>
              <p className="text-lg font-black text-amber-950 dark:text-amber-100">
                {status}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
