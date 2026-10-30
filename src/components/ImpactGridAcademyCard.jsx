import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Award, 
  Layers,
  Sparkles
} from 'lucide-react';

const ACADEMY_STAGES = [
  {
    stage: 'Tahap 1: Awareness & Baseline',
    time: 'Bulan 1–2 (Hari 1–60)',
    gate: 'Gerbang G0 (Audit Kesiapan Data & Kontrak)',
    adkar: 'Awareness, Desire',
    description: 'Sosialisasi lintas direktorat, survei awal kesiapan staf dan rasa aman belajar (T1), serta pemilihan peserta inti & duta Green Network Champions.',
    color: 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
  },
  {
    stage: 'Tahap 2: Real-Case Sandbox',
    time: 'Bulan 3–4 (Hari 61–120)',
    gate: 'Gerbang G1 (Kesiapan Uji Model & Portofolio)',
    adkar: 'Knowledge, Ability',
    description: 'Pelatihan 40 jam kurikulum berbasis peran di Scenario Lab; latihan tombol pemulihan otomatis (auto-rollback 15-menit); simulasi jebakan (trap scenarios); ujian sertifikasi 100%.',
    color: 'border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20'
  },
  {
    stage: 'Tahap 3: Supervised Adoption',
    time: 'Bulan 5–7 (Hari 121–210)',
    gate: 'Eksekusi Intervensi Aktif 40 Lokasi Makro',
    adkar: 'Ability, Reinforcement',
    description: 'Pendampingan kerja nyata dengan prinsip human-in-the-loop (kendali penuh di tangan operator); evaluasi mingguan; bimbingan rekan sejawat oleh Green Network Champions.',
    color: 'border-sky-300 dark:border-sky-900 bg-sky-50/50 dark:bg-sky-950/20'
  },
  {
    stage: 'Tahap 4: Evaluasi Dampak',
    time: 'Bulan 8–9 (Hari 211–270)',
    gate: 'Gerbang G2–G3 (Evaluasi Kausal & Ekspansi)',
    adkar: 'Reinforcement',
    description: 'Survei sikap akhir (T3); evaluasi 4 level Kirkpatrick; pelaporan kontribusi kesiapan tim terhadap penghematan listrik riil dan terjaganya keandalan mutu sinyal.',
    color: 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20'
  }
];

const ROLE_CURRICULA = [
  {
    role: 'Operator NOC & Operasi Jaringan',
    focus: 'Interpretasi beban trafik, pemantauan non-inferioritas QoS, dan eksekusi auto-rollback.',
    scenario: 'Lonjakan trafik mendadak saat carrier dalam mode sleep; verifikasi auto-rollback 15-menitan saat availability mendekati ambang batas 99,9%.',
    fearAddressed: 'Kekhawatiran bahwa efisiensi energi memicu gangguan sinyal pelanggan dan hilangnya kendali operasi.'
  },
  {
    role: 'Insinyur Perencana Radio & Fasilitas',
    focus: 'Analisis batas termal ASHRAE (setpoint 25°C–26°C), parameter 3GPP Sleep Mode, dan mitigasi cuaca.',
    scenario: 'Mengevaluasi kasus safety-first ketika sistem otomatis menolak intervensi pada situs kritis (RS & posko bencana).',
    fearAddressed: 'Persepsi bahwa algoritma bersifat black-box dan mengabaikan keahlian rekayasa lapangan.'
  },
  {
    role: 'Analis Direktorat Finance',
    focus: 'Evaluasi optimasi portofolio 0-1 Knapsack, valuasi DCF/NPV, dan rekonsiliasi tagihan variabel PLN.',
    scenario: 'Menelusuri simulasi sensitivitas NPV (5%, 10%, 15%) serta alokasi Dana Swadana Reinvestasi (85%) dan dana sosial 3T (15%).',
    fearAddressed: 'Keraguan atas akurasi klaim penghematan kas bersih dan risiko biaya tersembunyi kontrak menara.'
  },
  {
    role: 'Tim Sustainability & Audit Internal',
    focus: 'Metodologi ekonometrika Difference-in-Differences (DiD), konversi Scope 2, dan jejak audit digital.',
    scenario: 'Menyusun kertas kerja verifikasi penghematan kWh dan reduksi tCO2e sesuai standar pelaporan PSPK 1 & PSPK 2 IAI serta POJK 51/2017.',
    fearAddressed: 'Ketidakpastian mengenai kesiapan bukti digital menghadapi audit penjaminan independen (KAP).'
  }
];

const KIRKPATRICK_METRICS = [
  { level: 'Level 1: Reaksi', metric: 'Tingkat Kepuasan & Rasa Aman', target: 'Skor Relevansi ≥85% & Psychological Safety Tinggi' },
  { level: 'Level 2: Pembelajaran', metric: 'Kelulusan Ujian & Praktik Rollback', target: '100% Lulus Sertifikasi; Waktu Rollback < 3 Menit' },
  { level: 'Level 3: Perilaku', metric: 'Kepatuhan Dual-Authorization', target: 'Kepatuhan Prosedur ≥98%; Nol Override Ilegal' },
  { level: 'Level 4: Hasil Bisnis', metric: 'Penghematan Bersih & QoS SLA', target: 'Efisiensi ≥10%, Availability ≥99,9%, Nol Insiden' }
];

export default function ImpactGridAcademyCard() {
  const [activeTab, setActiveTab] = useState('stages'); // 'stages' | 'curricula' | 'kirkpatrick'

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#ED0226]">
              <GraduationCap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Bab V: ImpactGrid Academy & Operational Onboarding
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengembangan Kapabilitas SDM Telkomsel, Kerangka ADKAR, & Mitigasi Algorithm Aversion vs Overtrust
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('stages')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'stages'
                ? 'bg-[#ED0226] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            4 Tahap Academy (Tabel 21)
          </button>
          <button
            onClick={() => setActiveTab('curricula')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'curricula'
                ? 'bg-[#ED0226] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Kurikulum Peran (Tabel 22)
          </button>
          <button
            onClick={() => setActiveTab('kirkpatrick')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'kirkpatrick'
                ? 'bg-[#ED0226] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Evaluasi Kirkpatrick (Tabel 23)
          </button>
        </div>
      </div>

      {/* SUBVIEW 1: 4 STAGES OF ACADEMY (TABLE 21) */}
      {activeTab === 'stages' && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {ACADEMY_STAGES.map((s, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${s.color} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-500">{s.time}</span>
                  <span className="text-[10px] font-bold text-red-600 bg-white/80 dark:bg-[#0B1324] px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900">
                    ADKAR: {s.adkar}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{s.stage}</h3>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Gerbang Terkait: <strong>{s.gate}</strong>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                  {s.description}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong>Mitigasi Bias Psikologis:</strong> ImpactGrid mengombinasikan simulasi jebakan (<em>trap scenarios</em>) di Bulan 4 agar operator tidak mengalami <em>overtrust in automation</em> (percaya buta pada rekomendasi AI) maupun <em>algorithm aversion</em> (menolak rekomendasi optimasi karena rasa takut).
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: ROLE-BASED CURRICULA (TABLE 22) */}
      {activeTab === 'curricula' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {ROLE_CURRICULA.map((rc, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#ED0226]" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{rc.role}</h3>
              </div>
              <div className="text-xs space-y-1.5 pt-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Fokus Kompetensi:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{rc.focus}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Skenario Real-Case Sandbox:</span>
                  <span className="text-slate-600 dark:text-slate-400">{rc.scenario}</span>
                </div>
                <div className="p-2 rounded-lg bg-red-50/60 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-[11px] text-red-800 dark:text-red-300">
                  <strong>Kekhawatiran yang Dijawab:</strong> {rc.fearAddressed}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBVIEW 3: KIRKPATRICK & PSYCHOMETRICS (TABLE 23) */}
      {activeTab === 'kirkpatrick' && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {KIRKPATRICK_METRICS.map((km, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#ED0226] block">
                  {km.level}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{km.metric}</h4>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Target: {km.target}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1 leading-relaxed">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Survei Psikometrik Longitudinal (T1, T2, T3):</span>
            </div>
            <p>
              Menggunakan kuesioner 5-point Likert teruji untuk melacak <em>Technology Acceptance Model (TAM)</em>, <em>Perceived Usefulness</em>, dan <em>Psychological Safety</em> sebelum pelatihan (T1 Bulan 2), pasca-sandbox (T2 Bulan 4), dan pasca-pilot operasional (T3 Bulan 9).
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
