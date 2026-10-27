import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Zap, Leaf, Sliders } from 'lucide-react';

const COMPARISON_POINTS = [
  {
    parameter: "Manajemen Pendinginan Shelter",
    before: "Suhu statis 20–22°C sepanjang waktu, AC bekerja penuh tanpa adaptasi cuaca luar.",
    after: "Dynamic Setpoint 26°C dengan sensor IoT dan kontrol ventilasi pintar.",
    impact: "Penghematan konsumsi AC 12–18% per shelter"
  },
  {
    parameter: "Efisiensi Daya RAN (Radio Access Network)",
    before: "Semua carrier aktif 24 jam meski utilisasi malam < 15% PRB.",
    after: "Otomasi Carrier Sleep & Symbol Sleep berbasis prediksi AI Prophet-RAN.",
    impact: "Penghematan daya radio 15–25% saat lalu lintas rendah"
  },
  {
    parameter: "Deteksi Kebocoran Daya (Phantom Load)",
    before: "Hanya terpantau saat audit tagihan bulanan PLN membengkak.",
    after: "Deteksi anomali telemetri submeter vs beban aktual dalam 15 menit.",
    impact: "Pencegahan pemborosan energi laten Rp 3–5 juta/site/thn"
  },
  {
    parameter: "Verifikasi Pengurangan Emisi Scope 2",
    before: "Estimasi manual tidak terkoreksi cuaca atau pertumbuhan trafik pelanggan.",
    after: "Metodologi Difference-in-Differences (DiD) berstandar ITU-T L.1331 & PSPK 1/2.",
    impact: "Klaim audit ESG akurat dan defensible di mata auditor independen"
  },
  {
    parameter: "Keputusan Alokasi Investasi CapEx",
    before: "Usulan terfragmentasi antar divisi jaringan, pengadaan, dan ESG.",
    after: "Multi-Criteria Optimization (Knapsack) berdasar NPV dan kendali batas QoS.",
    impact: "Portofolio efisiensi swadana (self-funding) dengan payback < 2 tahun"
  }
];

export default function BeforeVsAfterComparison() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Transformasi Nilai Tambah: Status Quo vs Solusi Terpadu ImpactGrid
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Perbandingan operasional berdasarkan naskah proposal AWAKENING Reborn (Tabel 9)
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {COMPARISON_POINTS.map((item, idx) => (
          <div 
            key={item.parameter}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                  {idx + 1}
                </span>
                {item.parameter}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                {item.impact}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-red-100 dark:border-red-950/40 space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Pendekatan Konvensional (Sebelum)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.before}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950/40 space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Solusi Terpadu ImpactGrid (Sesudah)</span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {item.after}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}