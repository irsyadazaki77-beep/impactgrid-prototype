import React from 'react';
import { ClipboardList, Database, FileCheck2, ShieldAlert, Zap, Calendar, ArrowRight, Award } from 'lucide-react';

const steps = [
  { 
    stage: 'Bulan 1–2 (2027)',
    title: 'Audit Pra-Pilot & Rekonsiliasi Data', 
    budget: 'Plafon Rp 95 Juta',
    detail: 'Pemeriksaan sistem existing, rekonsiliasi data meter PLN vs submeter shelter, audit hak kendali aset menara, dan penetapan baseline 50 lokasi uji.',
    deliverable: 'Laporan Feasibility Baseline & Persetujuan Dewan Komisaris / Direksi',
    icon: Database 
  },
  { 
    stage: 'Bulan 3–4 (2027)',
    title: 'Prototipe MVP & Shadow Mode', 
    budget: 'CapEx Tahap 1',
    detail: 'Penyelarasan pipa data Network Data Hub, kalibrasi model analitik Prophet-RAN dan ThermoOptima tanpa mengirimkan perintah aktif ke perangkat jaringan.',
    deliverable: 'Verifikasi Akurasi Prediksi Trafik & Uji Fail-Safe Rollback 120 Detik',
    icon: ClipboardList 
  },
  { 
    stage: 'Bulan 5–7 (2027)',
    title: 'Intervensi Aktif Terbatas (40 Sites)', 
    budget: 'Alokasi Uji Coba',
    detail: 'Aplikasi bertahap setpoint pendinginan shelter 26°C dan aktivasi fitur Carrier Sleep selektif dengan pengawasan langsung tim Network Operations Center.',
    deliverable: 'Pengukuran Konsumsi Energi Harian & Pemantauan Ketat Drop Call Rate < 0,20%',
    icon: Zap 
  },
  { 
    stage: 'Bulan 8–9 (2027)',
    title: 'Evaluasi DiD & Gerbang Keputusan BoD', 
    budget: 'Evaluasi Komprehensif',
    detail: 'Analisis Difference-in-Differences (DiD) membandingkan 40 site uji terhadap 10 site kontrol; verifikasi penghematan kas neto dan reduksi emisi Scope 2.',
    deliverable: 'Keputusan Go / No-Go untuk Ekspansi Regional 5.000 Menara Makro',
    icon: Award 
  }
];

export default function ExecutiveDecisionTimeline() {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Alur Waktu Keputusan Bertahap: Audit 2 Bulan → Pilot 9 Bulan
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Peta jalan eksekutif untuk memitigasi risiko modal sebelum komitmen belanja penuh (Tabel 4 Proposal)
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {steps.map(({ stage, title, budget, detail, deliverable, icon: Icon }, index) => (
          <div key={title} className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[10px] font-bold">
                  Tahap {index + 1} • {stage}
                </span>
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                  {budget}
                </span>
              </div>
              <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900 dark:text-slate-100">
                <Icon className="h-4 w-4 text-[#ED0226] shrink-0" />
                <span>{title}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                {detail}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300">Target Luaran:</strong> {deliverable}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}