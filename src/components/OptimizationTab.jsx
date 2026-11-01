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
  Percent,
  Cpu,
  Lock,
  Layers,
  Check,
  X
} from 'lucide-react';
import { 
  INVESTMENT_PORTFOLIO_RECOMMENDATIONS 
} from '../data/mockData';
import AutonomousClosedLoopController from './AutonomousClosedLoopController';
import WbpBessAndBorderGuardPanel from './WbpBessAndBorderGuardPanel';

const REQUIRED_INPUTS = [
  { icon: Database, title: 'Baseline energi per lokasi', detail: 'Data meter/tagihan dengan periode, batas aset, dan rekonsiliasi yang disetujui (AMR PLN 15-menitan).', status: 'Tervalidasi (AMR PLN 15-Menit)' },
  { icon: Radio, title: 'Kelayakan teknis dan mutu layanan', detail: 'Kompatibilitas perangkat, kondisi jaringan, batas QoS (Availability >=99.9%, Throughput p10 >=-2%), prosedur uji aman, dan auto-rollback.', status: 'Guardrail Aktif (SLA >=99.9%)' },
  { icon: DollarSign, title: 'Biaya dan manfaat aktual', detail: 'Penawaran vendor, kontrak sewa menara pass-through PLN, biaya integrasi, OPEX, serta pembagian manfaat.', status: 'Terverifikasi (Pass-Through 85%)' },
  { icon: Leaf, title: 'Metode pengukuran ESG', detail: 'Baseline, periode pra/pasca, faktor emisi ESDM 0,87 kgCO2e/kWh, batas Scope 2, dan audit penjaminan KAP independen.', status: 'Standar Resmi (ESDM Jamali 0,87)' },
  { icon: ClipboardList, title: 'Izin dan tata kelola data', detail: 'Persetujuan pemilik aset (Mitratel/Towerco), hak akses, keamanan siber NIST AI RMF, dan persetujuan Komite Investasi Modal.', status: 'Disahkan (NIST AI RMF & Komite)' }
];

const DECISION_STEPS = [
  'Validasi sumber dan kelengkapan data (Audit G0 Maks Rp95 Juta)',
  'Terapkan kriteria teknis dan keselamatan sinyal (Safety Locking x_i,j = 0)',
  'Jalankan solver 0-1 Knapsack untuk maksimasi NPV portofolio global',
  'Tinjau hasil bersama Komite Investasi Modal & Network Operations'
];

// Dataset Komparasi Alokasi CapEx
const GREEDY_VS_KNAPSACK_DEMO = {
  budget: 80, // Rp Juta
  projects: [
    { id: 'A', name: 'Paket A: Optimasi HVAC Kluster Sentral', cost: 60, npv: 100, ratio: 1.67 },
    { id: 'B', name: 'Paket B: 3GPP Carrier Sleep Kluster Sub-Urban', cost: 40, npv: 64, ratio: 1.60 },
    { id: 'C', name: 'Paket C: Intelligent Free Cooling Kluster Pesisir', cost: 40, npv: 64, ratio: 1.60 }
  ],
  greedyChoice: {
    selected: ['A'],
    totalCost: 60,
    totalNpv: 100,
    unusedBudget: 20,
    note: 'Greedy memilih Paket A karena rasio NPV/Biaya tertinggi (1,67). Sisa Rp20 Juta menganggur karena Paket B & C (masing-masing Rp40 Juta) tidak muat.'
  },
  knapsackChoice: {
    selected: ['B', 'C'],
    totalCost: 80,
    totalNpv: 128,
    unusedBudget: 0,
    note: '0-1 Knapsack Solver mengevaluasi ruang kombinasi global. Memilih B + C menghabiskan anggaran 100% dan menghasilkan NPV Rp128 Juta (+28% lebih tinggi!).'
  }
};

const PARETO_POINTS = [
  {
    id: 'A',
    name: 'Titik A: Ultra-Konservatif',
    savingsMWh: 32,
    efficiencyPct: '5.2%',
    riskMarginPct: '0.1%',
    slaStatus: 'Zero Risk (100% Safe)',
    slaColor: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200',
    description: 'Carrier sleep hanya pada 1 band frekuensi tinggi (B3 1800 MHz) selama 90 menit di jam sepi ekstrem (03:00-04:30 WIB).',
    recommendation: 'Cocok untuk fase inisiasi awal 30 hari pertama audit lapangan.'
  },
  {
    id: 'B',
    name: 'Titik B: Konservatif Moderat',
    savingsMWh: 58,
    efficiencyPct: '8.4%',
    riskMarginPct: '0.4%',
    slaStatus: 'Ultra Safe (SLA > 99.99%)',
    slaColor: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200',
    description: 'Mengaktifkan carrier sleep B3 dan B8 di 40 site pilot perkotaan dengan interlock beban PRB < 25%.',
    recommendation: 'Baseline moderat yang direkomendasikan untuk target tahunan Telkomsel.'
  },
  {
    id: 'C',
    name: 'Titik C: Rekomendasi ImpactGrid (Pareto Knee Point)',
    savingsMWh: 96,
    efficiencyPct: '14.8%',
    riskMarginPct: '0.8%',
    slaStatus: 'Optimal Sweet Spot (SLA Safe)',
    slaColor: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 ring-1 ring-blue-400',
    description: 'Kombinasi Carrier Sleep adaptif + Setpoint HVAC 26°C ThermoOptima. Menghasilkan efisiensi energi tertinggi sebelum kurva risiko melonjak.',
    recommendation: '★ REKOMENDASI TERBAIK: Rasio penghematan energi per unit risiko mutu paling optimal.'
  },
  {
    id: 'D',
    name: 'Titik D: Agresif (High Risk)',
    savingsMWh: 128,
    efficiencyPct: '19.5%',
    riskMarginPct: '2.1%',
    slaStatus: 'Mendekati Batas Throughput',
    slaColor: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200',
    description: 'Carrier sleep diperpanjang ke jam 23:00 WIB dan simbol radio dimatikan lebih dalam. Terdapat potensi penurunan throughput 10th percentile sebesar 2.1%.',
    recommendation: 'Hanya disarankan untuk wilayah rural dengan alternatif seluler tumpang-tindih.'
  },
  {
    id: 'E',
    name: 'Titik E: Ekstrem (Melanggar SLA)',
    savingsMWh: 162,
    efficiencyPct: '24.2%',
    riskMarginPct: '4.8%',
    slaStatus: 'DITOLAK GUARDRAIL (SLA Violated)',
    slaColor: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200',
    description: 'Mematikan radio tanpa memperhatikan lonjakan lokal. Call Drop Rate meningkat melampaui standar operasional Telkomsel.',
    recommendation: 'DITOLAK SECARA OTOMATIS: Dilarang oleh Sentinel-SLA demi perlindungan kepuasan pelanggan.'
  }
];

export default function OptimizationTab({
  simState,
  selectedScale = 'pilot',
  setSelectedScale,
  operationalSummary,
  resolvedSites = [],
  onOpenOfficialBaRe,
  onOpenSapVoucher,
  onOpenProcurementBoq
}) {
  const [activeView, setActiveView] = useState('knapsack'); // 'knapsack' | 'pareto' | 'solver_comparison' | 'governance'
  const [selectedParetoPoint, setSelectedParetoPoint] = useState('C');
  const [budgetCapEx, setBudgetCapEx] = useState(450); // in Million Rupiah
  const [fieldOpsManHoursLimit, setFieldOpsManHoursLimit] = useState(120); // max technician man-hours
  const [selectedPortfolios, setSelectedPortfolios] = useState(['PORT-01', 'PORT-02']);
  const [criticalLockActive, setCriticalLockActive] = useState(true);

  const scaleMultiplier = selectedScale === 'national' ? 140 : selectedScale === 'regional' ? 75 : 1;

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
      <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/50 text-xs font-bold text-[#ED0226] dark:text-red-400">
            <Briefcase className="h-4 w-4" />
            <span>Modul 3: Investment Prioritizer (0-1 Knapsack Solver)</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveView('knapsack')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeView === 'knapsack'
                  ? 'bg-[#ED0226] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Simulasi Knapsack CapEx
            </button>
            <button
              onClick={() => setActiveView('pareto')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeView === 'pareto'
                  ? 'bg-[#ED0226] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Kurva Pareto Frontier (Energy vs QoS)
            </button>
            <button
              onClick={() => setActiveView('solver_comparison')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeView === 'solver_comparison'
                  ? 'bg-[#ED0226] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Uji Komparasi Greedy vs 0-1 Solver ILP
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
            <button
              onClick={() => setActiveView('closed_loop')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'closed_loop'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Closed-Loop Otonom (O-RAN)</span>
            </button>
            <button
              onClick={() => setActiveView('wbp_border')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'wbp_border'
                  ? 'bg-[#ED0226] text-white shadow-xs'
                  : 'bg-red-50 dark:bg-red-950/40 text-[#ED0226] dark:text-red-300 border border-red-300/40 hover:bg-red-100'
              }`}
            >
              <span>Arbitrase WBP &amp; Border Guard</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Prioritisasi Investasi Portofolio Efisiensi Energi
        </h1>
        <p className="max-w-4xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Formulasi 0-1 Integer Linear Programming (Multi-Choice Knapsack Problem) untuk mengalokasikan belanja modal (CapEx) secara optimal. Berbeda dari pengurutan heuristik ranking sederhana, solver ILP ImpactGrid memaksimalkan akumulasi Net Present Value (NPV) global di bawah kendali ketat batas mutu layanan (QoS Guardrail) dan penguncian keselamatan situs kritis.
        </p>

        {/* Live Scale & Corporate Procurement Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
              Jam Simulasi: {String(simState?.hour ?? 2).padStart(2, '0')}:00 WIB
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 font-bold text-emerald-700 dark:text-emerald-300">
              Proyeksi Skala ({selectedScale === 'national' ? 'Nasional 10.000 Site' : selectedScale === 'regional' ? 'Regional Jamali 5.000 Site' : 'Pilot 40 Site'}): Rp {((totalNetBenefitYear * scaleMultiplier) / 1_000_000_000).toFixed(2)} Miliar/thn
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 font-bold text-blue-700 dark:text-blue-300">
              Site FOP Terkalibrasi: {resolvedSites.length} Site ({operationalSummary?.activeSiteCount || 50} Total Aktif)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {onOpenProcurementBoq && (
              <button
                type="button"
                onClick={onOpenProcurementBoq}
                className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold cursor-pointer transition"
              >
                Buka Dokumen RKS / BoQ
              </button>
            )}
            {onOpenSapVoucher && (
              <button
                type="button"
                onClick={onOpenSapVoucher}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition"
              >
                Jurnal SAP S/4HANA
              </button>
            )}
            {onOpenOfficialBaRe && (
              <button
                type="button"
                onClick={onOpenOfficialBaRe}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer transition"
              >
                Berita Acara BA-RE
              </button>
            )}
          </div>
        </div>

        {/* Mathematical Formulation Pill Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Formulasi Multi-Constraint Knapsack & O-RAN Safety Guardrail:</div>
          <div className="text-slate-800 dark:text-slate-200 font-bold">
            max ∑ᵢ ∑ⱼ (NPVᵢ,ⱼ · xᵢ,ⱼ) &nbsp; s.t. &nbsp; ∑ cᵢ,ⱼ xᵢ,ⱼ ≤ B (CapEx) &nbsp;|&nbsp; ∑ mᵢ,ⱼ xᵢ,ⱼ ≤ M_max (Man-Hours) &nbsp;|&nbsp; xᵢ,ⱼ ∈ {'{0, 1}'}
          </div>
          <div className="text-[11px] text-slate-500 font-sans">
            TowerCo Pass-Through Benefit: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">Net = 85% Telkomsel / 15% TowerCo</strong> • Safety Lock: <strong className="text-red-600 font-mono">xᵢ,ⱼ = 0</strong> untuk lokasi kritis i ∈ {'{RS 112, Mitigasi BNPB, VIP Golden Site}'}.
          </div>
        </div>
      </header>

      {/* VIEW 1: INTERACTIVE KNAPSACK OPTIMIZER */}
      {activeView === 'knapsack' && (
        <div className="space-y-6 animate-fade-in">
          {/* Interactive Knapsack Budget & Guardrail Console */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#ED0226]" />
                  <span>Konsol Batas Anggaran Belanja Modal (CapEx Constraint B)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Geser batas plafon anggaran untuk melihat kombinasi portofolio terbaik
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCriticalLockActive(!criticalLockActive)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    criticalLockActive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 text-slate-500 border-slate-300'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span>Safety Lock Situs Kritis ({criticalLockActive ? 'AKTIF' : 'NON-AKTIF'})</span>
                </button>
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
                <span className="text-red-600 font-bold">Plafon CapEx Pilot: Rp 450 Jt</span>
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
                        ? 'bg-white dark:bg-[#0B1324] border-[#ED0226] ring-2 ring-red-500/10'
                        : 'bg-slate-50/70 dark:bg-[#0B1324]/40 border-slate-200 dark:border-slate-800 hover:bg-white'
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

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
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

      {/* VIEW: PARETO FRONTIER TRADE-OFF CURVE */}
      {activeView === 'pareto' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Card */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#ED0226]" />
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Kurva Batas Efisiensi Pareto (Pareto Trade-off Frontier: Energy vs QoS Risk Margin)
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 font-mono">
                Pareto Optimal Frontier Active
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Setiap kebijakan efisiensi energi memiliki korelasi pertukaran (*trade-off*) terhadap mutu layanan pelanggan. Solver ImpactGrid memetakan seluruh ruang solusi dan menemukan <strong>Titik Knee (Pareto Sweet Spot)</strong>: titik di mana penghematan energi berada pada kurva tertinggi sebelum margin risiko degradasi throughput meningkat tajam.
            </p>

            {/* Operating Points Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
              {PARETO_POINTS.map((pt) => {
                const isSelected = selectedParetoPoint === pt.id;
                const isKnee = pt.id === 'C';
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => setSelectedParetoPoint(pt.id)}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 relative ${
                      isSelected
                        ? 'border-[#ED0226] bg-red-50/25 dark:bg-red-950/20 ring-1 ring-red-400'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {isKnee && (
                      <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded-md bg-[#ED0226] text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                        Knee Point ★
                      </span>
                    )}
                    <div>
                      <span className="font-mono text-[10px] font-extrabold text-slate-500 block uppercase">
                        {pt.name.split(':')[0]}
                      </span>
                      <h4 className="font-black text-xs text-slate-900 dark:text-slate-100 mt-0.5 leading-snug">
                        {pt.name.split(':')[1]}
                      </h4>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs font-mono">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Hemat:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{pt.efficiencyPct}</strong>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Risiko:</span>
                        <strong className={pt.id === 'E' ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}>{pt.riskMarginPct}</strong>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Operating Point Deep-Dive */}
            {PARETO_POINTS.find(p => p.id === selectedParetoPoint) && (() => {
              const active = PARETO_POINTS.find(p => p.id === selectedParetoPoint);
              return (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Inspeksi Parameter Titik Operasi:</span>
                      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">{active.name}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${active.slaColor}`}>
                      Status: {active.slaStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 block text-[11px]">Proyeksi Penghematan Energi:</span>
                      <strong className="text-base text-emerald-600 dark:text-emerald-400 font-mono font-black">{active.savingsMWh} MWh/tahun</strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Penurunan konsumsi: {active.efficiencyPct}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 block text-[11px]">Margin Risiko Throughput p10:</span>
                      <strong className="text-base text-slate-900 dark:text-slate-100 font-mono font-black">{active.riskMarginPct}</strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Ambang batas aman Telkomsel &lt; 1.0%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 block text-[11px]">Rekomendasi Dewan Direksi:</span>
                      <strong className="text-xs text-slate-800 dark:text-slate-200 block font-semibold mt-1">{active.recommendation}</strong>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <strong>Konfigurasi Teknis:</strong> {active.description}
                  </p>
                </div>
              );
            })()}
          </section>

          {/* Multi-Constraint Real-World Governance Card */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Penerapan Multi-Constraint Realitas Lapangan (Bukan Sekadar Teori Biaya)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-slate-100 block">1. Kapasitas Man-Hours Teknisi</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Kunjungan tim field operations dibatasi maksimal <strong>120 jam/bulan per regional</strong> untuk instalasi submeter dan sensor. Solver memastikan jumlah site intervensi tidak melampaui batas personil lapangan.
                </p>
                <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Status: 84 / 120 Jam Teralokasi (Aman)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-slate-100 block">2. Model Bagi-Hasil TowerCo</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Pada menara sewa Mitratel/Protelindo dengan skema PLN Pass-Through, formula penghematan bersih dikalikan <strong>85% hak Telkomsel</strong> dan 15% dialokasikan sebagai insentif pemeliharaan mitra menara.
                </p>
                <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Status: Rasio Kontrak 85:15 Diterapkan
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-slate-100 block">3. Safety Locking Kritis (x_i,j = 0)</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Lokasi sekitar Rumah Sakit (kanal 112), Jalur Evakuasi Bencana BNPB, dan Menara Tunggal 3T dikunci dengan batasan matematika permanen agar tidak pernah dimasukkan ke dalam daftar Carrier Sleep.
                </p>
                <div className="text-[10px] font-mono text-red-600 dark:text-red-400 font-bold">
                  Status: 12 Site Terkunci Permanen
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* VIEW 2: GREEDY VS KNAPSACK COMPARISON (OPTIMASI ALOKASI CAPEX) */}
      {activeView === 'solver_comparison' && (
        <div className="space-y-6 animate-fade-in">
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#ED0226]" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Komparasi Efisiensi Alokasi: 0-1 Knapsack Solver vs Heuristik Ranking Konvensional
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Dalam evaluasi portofolio investasi Telkomsel, pendekatan tradisional sering menggunakan metode pengurutan rasio (<em>Greedy Heuristic ranking by NPV/CapEx</em>). Tabel di bawah membuktikan secara matematis mengapa pendekatan tersebut menghasilkan alokasi modal sub-optimal dan bagaimana 0-1 Knapsack memberikan <strong>+28% NPV lebih tinggi (+Rp 28 Juta)</strong> pada anggaran yang sama.
            </p>

            {/* Candidate Projects Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                Kandidat Proyek & Plafon Anggaran Tersedia: <strong>Rp 80 Juta</strong>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-white dark:bg-[#0B1324] text-[11px] uppercase text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Kandidat Proyek</th>
                    <th className="p-3">Biaya Awal (CapEx)</th>
                    <th className="p-3">NPV Tambahan</th>
                    <th className="p-3">Rasio NPV / Biaya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {GREEDY_VS_KNAPSACK_DEMO.projects.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                      <td className="p-3 font-mono">Rp {p.cost} Juta</td>
                      <td className="p-3 font-mono font-bold text-emerald-600">+Rp {p.npv} Juta</td>
                      <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{p.ratio.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Side-by-Side Comparison: Greedy vs Knapsack */}
            <div className="grid gap-4 md:grid-cols-2 pt-2">
              {/* Greedy Box */}
              <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/50 px-2.5 py-0.5 rounded-full">
                    Metode Konvensional (Greedy Ranking)
                  </span>
                  <X className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Total NPV Dihasilkan:</div>
                  <div className="text-2xl font-black text-rose-700 dark:text-rose-400 mt-0.5">
                    Rp 100 Juta
                  </div>
                </div>
                <div className="text-xs space-y-1.5 border-t border-rose-200 dark:border-rose-900/60 pt-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Proyek Dipilih:</span>
                    <strong className="text-slate-900 dark:text-white">Hanya Paket A</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">CapEx Terpakai:</span>
                    <strong className="text-slate-900 dark:text-white">Rp 60 Juta</strong>
                  </div>
                  <div className="flex justify-between text-rose-700 dark:text-rose-400 font-bold">
                    <span>Sisa Anggaran Menganggur:</span>
                    <span>Rp 20 Juta (Idle / Terbuang)</span>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-[#0B1324]/60 p-2.5 rounded-xl border border-rose-200/60">
                  {GREEDY_VS_KNAPSACK_DEMO.greedyChoice.note}
                </p>
              </div>

              {/* 0-1 Knapsack Box */}
              <div className="p-5 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2.5 py-0.5 rounded-full">
                    ImpactGrid 0-1 Knapsack Solver (Optimal)
                  </span>
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Total NPV Dihasilkan:</div>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5 flex items-baseline gap-2">
                    <span>Rp 128 Juta</span>
                    <span className="text-xs font-bold bg-emerald-200/80 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded-md">
                      +28% Lebih Tinggi!
                    </span>
                  </div>
                </div>
                <div className="text-xs space-y-1.5 border-t border-emerald-200 dark:border-emerald-900/60 pt-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Proyek Dipilih:</span>
                    <strong className="text-slate-900 dark:text-white">Kombinasi Paket B + C</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">CapEx Terpakai:</span>
                    <strong className="text-slate-900 dark:text-white">Rp 80 Juta (100% Optimal)</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                    <span>Sisa Anggaran Menganggur:</span>
                    <span>Rp 0 (Nol Pemborosan Modal)</span>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-[#0B1324]/60 p-2.5 rounded-xl border border-emerald-200/60">
                  {GREEDY_VS_KNAPSACK_DEMO.knapsackChoice.note}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* VIEW 3: GOVERNANCE & DATA INPUT REQUIREMENTS */}
      {activeView === 'governance' && (
        <div className="space-y-6 animate-fade-in">
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <Database className="h-4 w-4 text-[#ED0226] dark:text-red-400" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Data dan persetujuan yang diperlukan (Tabel 7)</h2>
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

          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-4">
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

      {/* SUB-VIEW 5: AUTONOMOUS CLOSED-LOOP O-RAN CONTROLLER */}
      {activeView === 'closed_loop' && (
        <AutonomousClosedLoopController />
      )}

      {/* SUB-VIEW 6: 24-HOUR PLN WBP/LWBP BESS ARBITRAGE & CROSS-VENDOR BORDER GUARD */}
      {activeView === 'wbp_border' && (
        <WbpBessAndBorderGuardPanel />
      )}
    </div>
  );
}
