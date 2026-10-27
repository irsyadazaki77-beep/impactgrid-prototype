import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  CircleHelp, 
  ClipboardList, 
  Database, 
  DollarSign, 
  Leaf, 
  Radio, 
  ShieldAlert, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { 
  INVESTMENT_PORTFOLIO_RECOMMENDATIONS 
} from '../data/mockData';

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
  const [activeView, setActiveView] = useState('knapsack'); // 'knapsack' | 'governance'
  const [budgetCapEx, setBudgetCapEx] = useState(450); // in Million Rupiah
  const [selectedPortfolios, setSelectedPortfolios] = useState(['PORT-01', 'PORT-02']);
  const [strictQoS, setStrictQoS] = useState(true);

  // Toggle selection
  const togglePortfolio = (id) => {
    setSelectedPortfolios(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Knapsack calculations
  const totalAllocatedCapEx = useMemo(() => {
    return selectedPortfolios.reduce((sum, id) => {
      const item = INVESTMENT_PORTFOLIO_RECOMMENDATIONS.find(p => p.id === id);
      return sum + (item ? item.capexIDR : 0);
    }, 0);
  }, [selectedPortfolios]);

  const totalNetBenefitYear = useMemo(() => {
    return selectedPortfolios.reduce((sum, id) => {
      const item = INVESTMENT_PORTFOLIO_RECOMMENDATIONS.find(p => p.id === id);
      return sum + (item ? item.annualNetBenefitIDR : 0);
    }, 0);
  }, [selectedPortfolios]);

  const totalCarbonReduced = useMemo(() => {
    return selectedPortfolios.reduce((sum, id) => {
      const item = INVESTMENT_PORTFOLIO_RECOMMENDATIONS.find(p => p.id === id);
      return sum + (item ? item.carbonReducedTon : 0);
    }, 0);
  }, [selectedPortfolios]);

  const budgetLimitIDR = budgetCapEx * 1_000_000;
  const isOverBudget = totalAllocatedCapEx > budgetLimitIDR;
  const combinedPayback = totalNetBenefitYear > 0 ? (totalAllocatedCapEx / totalNetBenefitYear).toFixed(2) : 'N/A';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <header className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 p-6 md:p-8 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/50 text-xs font-bold text-[#ED0226] dark:text-red-400">
            <Briefcase className="h-4 w-4" />
            <span>Modul 3: Investment Prioritizer (rancangan DSS)</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveView('knapsack')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeView === 'knapsack'
                  ? 'bg-[#ED0226] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Simulasi Knapsack Optimizer
            </button>
            <button
              onClick={() => setActiveView('governance')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeView === 'governance'
                  ? 'bg-[#ED0226] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Tata Kelola & Kebutuhan Data
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Prioritisasi Investasi Portofolio Efisiensi Energi
        </h1>
        <p className="max-w-4xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Modul Multi-Criteria Optimization untuk mengalokasikan belanja modal (CapEx) secara efisien dengan memaksimalkan Net Present Value (NPV) dan reduksi emisi Scope 2 di bawah kendali ketat batas mutu layanan (QoS Guardrail).
        </p>
      </header>

      {/* VIEW 1: INTERACTIVE KNAPSACK OPTIMIZER */}
      {activeView === 'knapsack' && (
        <div className="space-y-6 animate-fade-in">
          {/* Interactive Knapsack Budget & Guardrail Console */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#ED0226]" />
                  <span>Konsol Batas Anggaran Belanja Modal (CapEx Constraint)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Geser batas plafon anggaran untuk melihat kombinasi portofolio terbaik
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  Plafon: Rp {budgetCapEx} Juta
                </span>
              </div>
            </div>

            {/* Range Slider for Budget */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>Rp 100 Jt</span>
                <span>Rp 300 Jt</span>
                <span className="text-red-600 font-bold">Rancangan Pilot: Rp 450 Jt</span>
                <span>Rp 600 Jt</span>
              </div>
              <input
                type="range"
                min="100"
                max="600"
                step="25"
                value={budgetCapEx}
                onChange={(e) => setBudgetCapEx(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#ED0226]"
              />
            </div>

            {/* Live Portfolio Combination Performance Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">CapEx Terpakai</span>
                <div className={`text-lg font-black tracking-tight mt-1 ${isOverBudget ? 'text-red-600' : 'text-slate-900 dark:text-slate-100'}`}>
                  Rp {(totalAllocatedCapEx / 1_000_000).toLocaleString('id-ID')} Jt
                </div>
                <span className={`text-[10px] font-medium block mt-0.5 ${isOverBudget ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                  {isOverBudget ? '⚠️ Melampaui Plafon Anggaran!' : `Sisa Plafon: Rp ${((budgetLimitIDR - totalAllocatedCapEx) / 1_000_000).toLocaleString('id-ID')} Jt`}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">Manfaat Bersih/Tahun</span>
                <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 tracking-tight mt-1">
                  +Rp {(totalNetBenefitYear / 1_000_000).toLocaleString('id-ID')} Jt
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 block mt-0.5">Setelah dikurangi OpEx</span>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-800/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400 block">Balik Modal (PBP)</span>
                <div className="text-lg font-black text-sky-700 dark:text-sky-400 tracking-tight mt-1">
                  ~{combinedPayback} Tahun
                </div>
                <span className="text-[10px] text-sky-600 dark:text-sky-500 block mt-0.5">Model arus kas swadana</span>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-800/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-400 block">Reduksi Emisi Scope 2</span>
                <div className="text-lg font-black text-cyan-700 dark:text-cyan-400 tracking-tight mt-1">
                  ~{totalCarbonReduced.toFixed(1)} tCO₂e/th
                </div>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-500 block mt-0.5">Faktor 0,87 kgCO2e/kWh</span>
              </div>
            </div>
          </div>

          {/* Candidate Investment Portfolios */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Pilihan Portofolio Intervensi Teknis (Kandidat Evaluasi Knapsack)
              </h3>
              <span className="text-[11px] text-slate-500">Klik kartu untuk mengaktifkan / menonaktifkan</span>
            </div>

            <div className="grid gap-3">
              {INVESTMENT_PORTFOLIO_RECOMMENDATIONS.map((portfolio) => {
                const isSelected = selectedPortfolios.includes(portfolio.id);
                return (
                  <div
                    key={portfolio.id}
                    onClick={() => togglePortfolio(portfolio.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-[#ED0226] ring-2 ring-red-500/10'
                        : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-white'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                          isSelected ? 'bg-red-50 text-red-600 dark:bg-red-950/40' : 'bg-slate-200 text-slate-500'
                        }`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-slate-500">{portfolio.id}</span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {portfolio.tag}
                            </span>
                            <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                              Prioritas #{portfolio.recommendationPriority}
                            </span>
                          </div>
                          <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 mt-1">
                            {portfolio.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            {portfolio.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800 text-right">
                        <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                          Rp {(portfolio.capexIDR / 1_000_000).toLocaleString('id-ID')} Jt
                        </div>
                        <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                          +Rp {(portfolio.annualNetBenefitIDR / 1_000_000).toLocaleString('id-ID')} Jt/thn
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Payback: ~{portfolio.paybackYears} Thn
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        <span>Cakupan: <strong className="text-slate-700 dark:text-slate-300">{portfolio.siteCount} Sites</strong></span>
                        <span>Hemat: <strong className="text-slate-700 dark:text-slate-300">{(portfolio.annualEnergySavedKWh).toLocaleString('id-ID')} kWh/th</strong></span>
                        <span>Reduksi Emisi: <strong className="text-cyan-700 dark:text-cyan-400">{portfolio.carbonReducedTon} tCO₂e</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400">QoS SLA:</span>
                        <strong className="text-emerald-700 dark:text-emerald-400">{portfolio.qosScore}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GOVERNANCE & DATA INPUT REQUIREMENTS */}
      {activeView === 'governance' && (
        <div className="space-y-6 animate-fade-in">
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 p-6 shadow-xs space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <Database className="h-4 w-4 text-[#ED0226] dark:text-red-400" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Data dan persetujuan yang diperlukan</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {REQUIRED_INPUTS.map(({ icon: Icon, title, detail, status }) => (
                <article key={title} className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-1.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      <Icon className="h-4 w-4 text-[#ED0226] dark:text-red-400" />
                      <h3 className="text-sm font-bold">{title}</h3>
                    </div>
                    <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-800">{status}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 p-6 shadow-xs space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-cyan-700" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Alur keputusan yang diusulkan</h2>
            </div>
            <ol className="grid gap-3 md:grid-cols-2">
              {DECISION_STEPS.map((step, index) => (
                <li key={step} className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">{index + 1}</span>
                  <span className="pt-1 text-sm font-semibold leading-relaxed text-slate-700 dark:text-slate-300">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              Bobot, batas kelayakan, dan aturan pemilihan harus disepakati sebelum perhitungan. Persetujuan manusia dan kewenangan operator tetap menjadi bagian dari proses.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}