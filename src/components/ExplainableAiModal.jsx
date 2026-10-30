import React, { useState } from 'react';
import { 
  X, 
  Info, 
  Database, 
  ShieldCheck, 
  CircleDollarSign, 
  Leaf, 
  Cpu, 
  Sparkles, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Activity
} from 'lucide-react';

const checks = [
  { icon: Database, title: 'Kualitas dan sumber data', text: 'Meter, tagihan, trafik, interval, satuan, kelengkapan, dan rekonsiliasi harus diperiksa sebelum analisis.' },
  { icon: ShieldCheck, title: 'Mutu layanan dan keselamatan', text: 'Ambang QoS, risiko, persetujuan operasi, serta cara penghentian intervensi harus ditetapkan pemilik jaringan.' },
  { icon: CircleDollarSign, title: 'Kelayakan finansial', text: 'Gunakan biaya aktual yang dapat dihindari, CapEx, OpEx, kontrak, horizon, dan tingkat diskonto yang disahkan Finance.' },
  { icon: Leaf, title: 'Dampak ESG', text: 'Klaim emisi menunggu penghematan kWh yang terukur dan faktor emisi resmi sesuai lokasi serta periode.' },
];

const SHAP_ATTRIBUTION_FEATURES = [
  { name: 'Utilisasi PRB Trafik Seluler (< 20%)', value: '+42%', weight: 42, color: 'bg-emerald-500', direction: 'Mendukung Sleep', note: 'Beban rendah 16.2% selama 15 menit berturut-turut' },
  { name: 'Status Kanal Darurat 112 (Idle / Bersih)', value: '+25%', weight: 25, color: 'bg-emerald-500', direction: 'Safety Gate Pass', note: 'Nol panggilan darurat terdeteksi di sektor JKT-SEL-P01' },
  { name: 'Suhu PA Radio & Shelter BTS (< 28°C)', value: '+18%', weight: 18, color: 'bg-cyan-500', direction: 'Termal Stabil', note: 'Disipasi panas dalam ambang toleransi hijau' },
  { name: 'Tren Historis Musiman 7 Hari (TFT Model)', value: '+15%', weight: 15, color: 'bg-sky-500', direction: 'Prediksi Konsisten', note: 'Pola jam 03:00 WIB terverifikasi konsisten 98%' },
];

export default function ExplainableAiModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('shap'); // 'shap' | 'governance' | 'reward_formula'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/65 backdrop-blur-xs p-4 animate-fade-in">
      <div className="my-8 w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] shadow-2xl flex flex-col max-h-[90vh]">
        <header className="flex items-start justify-between bg-slate-900 p-6 text-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Explainable AI (XAI) & NIST AI RMF
              </span>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                Confidence Score: 94.2%
              </span>
            </div>
            <h2 className="mt-2 text-lg font-black">Transparansi Keputusan Model O-RAN Non-RT RIC</h2>
            <p className="mt-1 text-xs text-slate-300">
              Dekonstruksi kontribusi fitur (Feature Attribution ala SHAP) dan batasan analitik keputusan otomatisasi energi.
            </p>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="rounded-xl bg-slate-800 p-2 text-slate-300 hover:text-white cursor-pointer transition">
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 px-6 pt-3 gap-2 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('shap')}
            className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'shap'
                ? 'border-[#ED0226] text-[#ED0226]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Kontribusi Fitur (SHAP Attribution)</span>
          </button>
          <button
            onClick={() => setActiveTab('reward_formula')}
            className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reward_formula'
                ? 'border-[#ED0226] text-[#ED0226]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Fungsi Hadiah Multi-Objektif</span>
          </button>
          <button
            onClick={() => setActiveTab('governance')}
            className={`pb-3 px-3 transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'governance'
                ? 'border-[#ED0226] text-[#ED0226]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Tata Kelola & Validasi Data</span>
          </button>
        </div>

        <div className="space-y-5 p-6 text-sm overflow-y-auto flex-1">
          {/* TAB 1: SHAP FEATURE ATTRIBUTION */}
          {activeTab === 'shap' && (
            <div className="space-y-4 animate-fade-in">
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 text-xs leading-relaxed text-emerald-900 dark:text-emerald-300">
                <div className="font-bold text-sm flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Studi Kasus Keputusan: Aktivasi Carrier Sleep B3 di Site JKT-SEL-P01 (03:00 WIB)</span>
                </div>
                Model memberikan rekomendasi Carrier Sleep dengan tingkat keyakinan <strong>94.2%</strong>. Setiap fitur input memiliki bobot kontribusi positif terhadap penghematan daya tanpa mengorbankan kualitas panggilan:
              </div>

              <div className="space-y-3">
                {SHAP_ATTRIBUTION_FEATURES.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{item.name}</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded text-[11px]">
                        Bobot: {item.value} ({item.direction})
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.weight}%` }}></div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      <em>Telemetri O1:</em> {item.note}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Prinsip Human-in-the-Loop (HITL):</strong> Dalam mode operasional nyata, seluruh rekomendasi berbobot tinggi tetap disajikan ke antarmuka NOC sebelum dieksekusi atau dapat dijalankan otomatis hanya setelah melewati periode *Shadow-Running* selama 60 hari.
              </div>
            </div>
          )}

          {/* TAB 2: REWARD FUNCTION FORMULATION */}
          {activeTab === 'reward_formula' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-2 border border-slate-800">
                <div className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Formulasi Multi-Objective Policy Engine:</div>
                <div className="text-sm font-bold text-slate-100">
                  R = w_e · ΔEnergy − w_q · ΔQoS_Penalty − w_t · ΔThermal_Risk
                </div>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  Dimana bobot adaptif: w_e = 0.40 (Efisiensi kWh), w_q = 0.45 (Proteksi CDR/Throughput), w_t = 0.15 (Keamanan Suhu PA).
                </div>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 text-xs space-y-2 text-rose-950 dark:text-rose-300">
                <div className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Hard Guardrail Constraint (Veto Sentinel-SLA):</span>
                </div>
                <p className="leading-relaxed">
                  Jika <strong>PRB &gt; 60%</strong> ATAU <strong>Panggilan Darurat 112 = True</strong>, maka penalty bobot kualitas diatur menjadi tak hingga (<code className="font-mono bg-rose-200 dark:bg-rose-900 px-1 py-0.5 rounded">w_q → ∞</code>). Tindakan carrier sleep otomatis dibatalkan seketika dengan latensi rollback maksimal <strong>28 ms</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">Siklus Kontrol O-RAN A1:</span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">Interval evaluasi non-real-time berkisar 15–30 menit, mengalirkan target profil daya ke SMO.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">Siklus Guardrail E2 Near-RT:</span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">Shadow loop pengawas latensi &lt; 100 ms dengan akses langsung ke KPI radio tanpa jeda antrian.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GOVERNANCE & DATA CHECKS */}
          {activeTab === 'governance' && (
            <div className="space-y-4 animate-fade-in">
              <div className="rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 p-4 text-xs leading-relaxed text-amber-950 dark:text-amber-200">
                <strong>Standar Pengujian NIST AI RMF (Risk Management Framework):</strong> Sebelum algoritma dihubungkan ke jaringan produksi Telkomsel, model wajib melalui empat fungsi tata kelola: <em>Govern, Map, Measure, Manage</em>.
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {checks.map(({ icon: Icon, title, text }) => (
                  <article key={title} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3.5">
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-xs">
                      <Icon className="h-4 w-4 text-slate-500" />
                      {title}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{text}</p>
                  </article>
                ))}
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                <strong className="text-slate-800 dark:text-slate-200">Alur kendali yang diusulkan:</strong> model menyusun skenario → pemilik data memeriksa asumsi → Network/Finance/ESG meninjau → pejabat berwenang memberi keputusan → operator menjalankan perubahan melalui proses resmi O-RAN O1.
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-[11px] text-slate-500 font-mono">Arsitektur Terverifikasi • NIST AI RMF Standard</span>
            <button onClick={onClose} className="rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-2 text-xs font-bold text-white dark:text-slate-900 hover:bg-slate-800 cursor-pointer transition">
              Tutup Panel XAI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
