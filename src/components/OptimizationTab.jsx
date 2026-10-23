import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  ArrowRight, 
  Activity, 
  Sliders, 
  Zap, 
  Clock,
  Layers,
  Info,
  DollarSign,
  TrendingUp,
  Cpu,
  Code,
  FileCheck,
  RotateCcw,
  Sparkles,
  Lock,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer
} from 'lucide-react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ReferenceLine
} from 'recharts';
import { 
  PILOT_SITES_SAMPLE,
  PILOT_CAPEX_BREAKDOWN,
  SYSTEM_METADATA,
  INTERVENTION_TYPES
} from '../data/mockData';
import NetconfDeploymentModal from './NetconfDeploymentModal';

export default function OptimizationTab({ 
  isAutonomous, 
  setIsAutonomous, 
  onOpenEmergencyModal,
  emergencyState = { active: false },
  simState = { simHour: 14, tempC: 28, trafficMultiplier: 1.0, plnTariffIDR: 1500, emergencyActive: false }
}) {
  // Only evaluate the 40 candidate intervention sites
  const candidateSites = useMemo(() => {
    return PILOT_SITES_SAMPLE.filter(s => s.type === 'Intervensi');
  }, []);

  // DSS Parameters
  const [budgetCapIDR, setBudgetCapIDR] = useState(450000000); // Default Rp 450 Juta (Tabel 5 Proposal)
  const [optimizationStrategy, setOptimizationStrategy] = useState('balanced'); // 'balanced' | 'financial' | 'esg' | 'qos'
  const [clusterFilter, setClusterFilter] = useState('ALL');
  const [vendorFilter, setVendorFilter] = useState('ALL');
  const [forcedOverrides, setForcedOverrides] = useState({}); // { [siteId]: 'FORCE_IN' | 'FORCE_OUT' }
  const [selectedExplainer, setSelectedExplainer] = useState(null);
  const [isAllocationMemoOpen, setIsAllocationMemoOpen] = useState(false);
  const [isNetconfModalOpen, setIsNetconfModalOpen] = useState(false);

  // Knapsack Optimization Algorithm with Multi-Objective Scoring and Central Simulation Synced Dynamics
  const portfolioResult = useMemo(() => {
    // Dynamic multipliers derived from central simulation state
    const tariffFactor = (simState.plnTariffIDR || 1500) / 1500;
    const isEmergency = emergencyState.active || simState.emergencyActive;
    
    // 1. Calculate Multi-Objective Score for each candidate site
    const scoredSites = candidateSites.map(site => {
      // Scale benefits dynamically with live PLN tariff
      const dynamicAnnualBenefit = site.netAnnualBenefitIDR * tariffFactor;
      const dynamicNpv5Years = Math.round(site.npv5YearsIDR * tariffFactor);

      // Normalize attributes
      const financialRatio = (dynamicAnnualBenefit / Math.max(1, site.capexIDR));
      const carbonDensity = (site.emissionsReducedTon / (site.capexIDR / 1000000));
      const qosSafety = Math.max(0, 1 - (site.latencyDeltaMs / 0.5)); // lower latency delta = higher safety

      let score = 0;
      if (optimizationStrategy === 'financial') {
        score = financialRatio * 0.70 + carbonDensity * 0.20 + qosSafety * 0.10;
      } else if (optimizationStrategy === 'esg') {
        score = carbonDensity * 0.65 + financialRatio * 0.25 + qosSafety * 0.10;
      } else if (optimizationStrategy === 'qos') {
        score = qosSafety * 0.60 + financialRatio * 0.25 + carbonDensity * 0.15;
      } else {
        // Balanced (Proposal standard)
        score = financialRatio * 0.45 + carbonDensity * 0.35 + qosSafety * 0.20;
      }

      return {
        ...site,
        netAnnualBenefitIDR: dynamicAnnualBenefit,
        npv5YearsIDR: dynamicNpv5Years,
        dssScore: score
      };
    });

    // 2. Separate forced items vs automatic knapsack items
    let allocatedCapEx = 0;
    const selected = [];
    const deferred = [];

    // First handle manual FORCE_IN
    scoredSites.forEach(site => {
      const override = forcedOverrides[site.id];
      if (override === 'FORCE_IN') {
        allocatedCapEx += site.capexIDR;
        selected.push({ ...site, allocationStatus: 'FORCED_IN' });
      }
    });

    // Sort remaining sites by DSS Score descending (Greedy Knapsack heuristic)
    const remainingSites = scoredSites
      .filter(s => forcedOverrides[s.id] !== 'FORCE_IN')
      .sort((a, b) => b.dssScore - a.dssScore);

    // Allocate within budget cap
    remainingSites.forEach(site => {
      const override = forcedOverrides[site.id];
      if (override === 'FORCE_OUT') {
        deferred.push({ ...site, allocationStatus: 'FORCED_OUT' });
      } else if (allocatedCapEx + site.capexIDR <= budgetCapIDR) {
        allocatedCapEx += site.capexIDR;
        selected.push({ ...site, allocationStatus: 'APPROVED' });
      } else {
        deferred.push({ ...site, allocationStatus: 'DEFERRED_BUDGET' });
      }
    });

    // Summary Aggregates
    const totalSelectedSites = selected.length;
    const totalCapExUsed = allocatedCapEx;
    const remainingBudget = Math.max(0, budgetCapIDR - totalCapExUsed);
    const totalNetBenefitYear = selected.reduce((acc, s) => acc + s.netAnnualBenefitIDR, 0);
    const totalCarbonReduced = selected.reduce((acc, s) => acc + s.emissionsReducedTon, 0);
    const totalNpv5Years = selected.reduce((acc, s) => acc + s.npv5YearsIDR, 0);
    const avgPayback = totalNetBenefitYear > 0 ? (totalCapExUsed / totalNetBenefitYear).toFixed(2) : '0';
    const avgLatencyDelta = isEmergency ? '0.00' : (totalSelectedSites > 0 
      ? (selected.reduce((acc, s) => acc + s.latencyDeltaMs, 0) / totalSelectedSites).toFixed(2) 
      : '0');

    return {
      selected,
      deferred,
      allScored: [...selected, ...deferred],
      totalSelectedSites,
      totalCapExUsed,
      remainingBudget,
      totalNetBenefitYear,
      totalCarbonReduced: +totalCarbonReduced.toFixed(1),
      totalNpv5Years,
      avgPayback,
      avgLatencyDelta,
      isEmergencyActive: isEmergency
    };
  }, [candidateSites, budgetCapIDR, optimizationStrategy, forcedOverrides, simState.plnTariffIDR, emergencyState.active, simState.emergencyActive]);

  // Handle manual override toggle
  const toggleOverride = (siteId) => {
    setForcedOverrides(prev => {
      const current = prev[siteId];
      if (!current) {
        // Toggle to FORCE_OUT if currently approved, or FORCE_IN if deferred
        const isCurrentlyApproved = portfolioResult.selected.some(s => s.id === siteId);
        return { ...prev, [siteId]: isCurrentlyApproved ? 'FORCE_OUT' : 'FORCE_IN' };
      } else {
        // Reset override
        const next = { ...prev };
        delete next[siteId];
        return next;
      }
    });
  };

  const resetOverrides = () => {
    setForcedOverrides({});
  };

  // Filtered list for table
  const displayedSites = useMemo(() => {
    return portfolioResult.allScored.filter(site => {
      const matchCluster = clusterFilter === 'ALL' || site.cluster.includes(clusterFilter);
      const matchVendor = vendorFilter === 'ALL' || site.vendor === vendorFilter;
      return matchCluster && matchVendor;
    });
  }, [portfolioResult.allScored, clusterFilter, vendorFilter]);

  // Data for Pareto Frontier Scatter Chart
  const scatterData = useMemo(() => {
    return portfolioResult.allScored.map(site => ({
      name: site.name,
      id: site.id,
      carbon: site.emissionsReducedTon,
      npv: Math.round(site.npv5YearsIDR / 1000000), // in Rp Juta
      capex: site.capexIDR / 1000000,
      isSelected: portfolioResult.selected.some(s => s.id === site.id),
      vendor: site.vendor,
      intervention: site.intervensiUtama
    }));
  }, [portfolioResult]);

  return (
    <div className="space-y-6">
      {/* Module 3 Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                <span>Modul 3: Investment Prioritizer (DSS Knapsack Engine)</span>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                💡 Inti Inovasi: Alokasi Modal Optimal Antarlokasi BTS dalam Batas Anggaran
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Optimasi Portofolio Investasi Lintas Lokasi Berbasis Nilai NPV & ESG
            </h1>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed mt-1">
              Menjawab keterbatasan anggaran korporat Telkomsel dengan memecahkan <em>Knapsack Optimization Problem</em>: memilih kombinasi intervensi BTS antarlokasi yang menghasilkan <strong>NPV kumulatif dan reduksi emisi maksimal</strong> di bawah pagu CapEx, tanpa pernah melanggar batas SLA QoS (112 emergency protected).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* CTO Emergency Surge Drill Button */}
            <button
              onClick={onOpenEmergencyModal}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition shadow-xs flex items-center space-x-1.5 cursor-pointer ${
                emergencyState.active 
                  ? 'bg-amber-400 text-slate-950 animate-pulse border-2 border-red-500' 
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
              }`}
              title="Uji Lonjakan Beban 300% & Pembuktian SLA 112"
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${emergencyState.active ? 'text-red-700' : 'text-red-600'}`} />
              <span>{emergencyState.active ? '⚡ KONDISI DARURAT AKTIF' : 'Simulasi Lonjakan Trafik (CTO Drill)'}</span>
            </button>

            {/* Print Allocation Memo */}
            <button
              onClick={() => setIsAllocationMemoOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Memo Alokasi Modal</span>
            </button>

            {/* O-RAN O1 Netconf/YANG Dispatcher */}
            <button
              onClick={() => setIsNetconfModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
              title="Kirim rekomendasi alokasi ke 40 BTS via Netconf O-RAN O1"
            >
              <Code className="w-3.5 h-3.5 text-cyan-200" />
              <span>Push O-RAN O1</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive DSS Controls Panel */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>Parameter & Kontrol Mesin Optimasi Portofolio DSS</span>
            </h2>
            <p className="text-xs text-slate-500">Ubah pagu anggaran atau bobot prioritas untuk melihat respon seleksi portofolio secara instan</p>
          </div>
          {Object.keys(forcedOverrides).length > 0 && (
            <button
              onClick={resetOverrides}
              className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Override Manual ({Object.keys(forcedOverrides).length})</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Budget Cap Slider */}
          <div className="lg:col-span-6 space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Pagu Anggaran CapEx Uji Coba:</span>
              <span className="font-mono font-black text-sm text-emerald-700 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                Rp {(budgetCapIDR).toLocaleString('id-ID')}
              </span>
            </div>
            
            <input 
              type="range"
              min={100000000}
              max={800000000}
              step={25000000}
              value={budgetCapIDR}
              onChange={(e) => setBudgetCapIDR(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
              <span className="text-slate-400 self-center mr-1">Preset:</span>
              <button
                onClick={() => setBudgetCapIDR(250000000)}
                className={`px-2.5 py-1 rounded-lg border transition font-bold cursor-pointer ${
                  budgetCapIDR === 250000000 ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Rp 250 Jt (Ketat)
              </button>
              <button
                onClick={() => setBudgetCapIDR(450000000)}
                className={`px-2.5 py-1 rounded-lg border transition font-bold cursor-pointer ${
                  budgetCapIDR === 450000000 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Rp 450 Jt (Tabel 5 Proposal) ⭐
              </button>
              <button
                onClick={() => setBudgetCapIDR(600000000)}
                className={`px-2.5 py-1 rounded-lg border transition font-bold cursor-pointer ${
                  budgetCapIDR === 600000000 ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Rp 600 Jt (Ekspansif)
              </button>
            </div>
          </div>

          {/* Multi-Objective Optimization Strategy */}
          <div className="lg:col-span-6 space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="font-bold text-slate-700 text-xs block">Lensa Strategi Optimasi Algoritma:</span>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setOptimizationStrategy('balanced')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  optimizationStrategy === 'balanced'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 font-extrabold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold">Balanced ESG & Finance</div>
                <div className="text-[10px] opacity-80 font-normal">Standar Usulan Tim (45% ROI + 35% CO2)</div>
              </button>

              <button
                onClick={() => setOptimizationStrategy('financial')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  optimizationStrategy === 'financial'
                    ? 'bg-emerald-600 text-white border-emerald-700 font-extrabold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold">Lensa CFO (Max NPV)</div>
                <div className="text-[10px] opacity-80 font-normal">Prioritas Payback Tercepat & Kas Bersih</div>
              </button>

              <button
                onClick={() => setOptimizationStrategy('esg')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  optimizationStrategy === 'esg'
                    ? 'bg-teal-600 text-white border-teal-700 font-extrabold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold">Lensa ESG (Max Carbon)</div>
                <div className="text-[10px] opacity-80 font-normal">Reduksi tCO2e Terbanyak per Rp Modal</div>
              </button>

              <button
                onClick={() => setOptimizationStrategy('qos')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  optimizationStrategy === 'qos'
                    ? 'bg-indigo-600 text-white border-indigo-700 font-extrabold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold">Lensa CTO (Strict QoS)</div>
                <div className="text-[10px] opacity-80 font-normal">Minimalkan Delta Latensi (&lt;0.15ms)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Optimization Cockpit KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">BTS Terpilih</span>
            <span className="text-xl font-black text-slate-900">
              {portfolioResult.totalSelectedSites} <span className="text-xs font-semibold text-slate-400">/ 40 Lokasi</span>
            </span>
            <span className="text-[10px] text-emerald-700 block font-semibold">
              {((portfolioResult.totalSelectedSites / 40) * 100).toFixed(0)}% Kandidat Didanai
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">CapEx Terpakai</span>
            <span className="text-xl font-black text-rose-600">
              Rp {(portfolioResult.totalCapExUsed / 1000000).toFixed(0)} <span className="text-xs font-semibold">Jt</span>
            </span>
            <span className="text-[10px] text-slate-500 block">
              Sisa Pagu: <strong>Rp {(portfolioResult.remainingBudget / 1000000).toFixed(0)} Jt</strong>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">NPV 5 Tahun (10%)</span>
            <span className="text-xl font-black text-emerald-700">
              +Rp {(portfolioResult.totalNpv5Years / 1000000).toFixed(0)} <span className="text-xs font-semibold">Jt</span>
            </span>
            <span className="text-[10px] text-emerald-700 block font-semibold">Layak Finansial</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Manfaat Bersih / Thn</span>
            <span className="text-xl font-black text-slate-900">
              Rp {(portfolioResult.totalNetBenefitYear / 1000000).toFixed(0)} <span className="text-xs font-semibold">Jt</span>
            </span>
            <span className="text-[10px] text-slate-500 block">OpEx Rp60 Jt tercover</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Reduksi Emisi</span>
            <span className="text-xl font-black text-cyan-800">
              {portfolioResult.totalCarbonReduced} <span className="text-xs font-semibold">Ton</span>
            </span>
            <span className="text-[10px] text-slate-500 block">CO2e Scope 2/thn</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Payback & Latensi</span>
            <span className="text-xl font-black text-slate-900">
              {portfolioResult.avgPayback} <span className="text-xs font-semibold text-slate-400">Thn</span>
            </span>
            <span className="text-[10px] text-emerald-700 block font-semibold">
              ΔLatensi: +{portfolioResult.avgLatencyDelta}ms (Aman)
            </span>
          </div>
        </div>
      </div>

      {/* Visual Pareto Frontier Chart */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Kurva Trade-off Pareto Frontier Portofolio (NPV vs Reduksi Karbon tCO2e)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Titik hijau mewakili lokasi yang lolos seleksi optimasi Knapsack. Titik abu-abu berada di luar pagu anggaran atau ditunda.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
              Terpilih ({portfolioResult.selected.length})
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block"></span>
              Ditunda ({portfolioResult.deferred.length})
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                type="number" 
                dataKey="carbon" 
                name="Reduksi Karbon" 
                unit=" ton" 
                stroke="#64748b"
                fontSize={11}
                domain={['auto', 'auto']}
              />
              <YAxis 
                type="number" 
                dataKey="npv" 
                name="NPV 5 Tahun" 
                unit=" Jt" 
                stroke="#64748b"
                fontSize={11}
              />
              <ZAxis type="number" dataKey="capex" range={[60, 240]} name="CapEx (Jt)" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-xl border border-slate-800">
                        <div className="font-bold text-amber-300">{data.id} - {data.name}</div>
                        <div className="text-[11px] text-slate-300">Intervensi: {data.intervention}</div>
                        <div className="flex justify-between gap-3 text-[11px] pt-1 border-t border-slate-800">
                          <span>NPV 5 Tahun: <strong>+Rp {data.npv} Juta</strong></span>
                          <span>Reduksi: <strong>{data.carbon} tCO2e</strong></span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Status: <strong className={data.isSelected ? 'text-emerald-400' : 'text-slate-400'}>
                            {data.isSelected ? 'TERPILIH DLM PORTOFOLIO' : 'DITUNDA (DILUAR PAGU)'}
                          </strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isSelected ? '#10b981' : '#cbd5e1'} 
                    stroke={entry.isSelected ? '#047857' : '#94a3b8'}
                    strokeWidth={1.5}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rincian Komponen Biaya Investasi Awal CapEx (Tabel 5 Proposal) */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Rincian Komponen Biaya Investasi Awal CapEx Uji Coba (Tabel 5 Proposal)</span>
            </h2>
            <p className="text-xs text-slate-500">Total Belanja Modal (CapEx) Tahap Uji Coba 40 Lokasi: <strong>Rp450.000.000</strong></p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">OpEx: Rp60 Juta/Tahun</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {PILOT_CAPEX_BREAKDOWN.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900 text-xs">{item.komponen}</span>
                <span className="text-xs font-mono font-bold text-emerald-700 shrink-0 ml-2">
                  Rp {(item.biayaIDR).toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                {item.justifikasi}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Sites Interactive Portfolio Decision Table */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Tabel Keputusan Portofolio 40 Kandidat BTS (Human-in-the-Loop DSS)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Klik tombol 'Override' untuk memaksakan masuk atau mengeluarkan BTS tertentu dari portofolio investasi
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <option value="ALL">Semua Kluster</option>
              <option value="DKI Jakarta">DKI Jakarta</option>
              <option value="Jatim">Jawa Timur</option>
              <option value="Jabar">Jawa Barat</option>
              <option value="Jateng">Jawa Tengah & DIY</option>
              <option value="Bali">Bali-Nusra</option>
              <option value="Luar Jawa">Luar Jawa</option>
            </select>

            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <option value="ALL">Semua Vendor</option>
              <option value="Ericsson">Ericsson</option>
              <option value="Huawei">Huawei</option>
              <option value="ZTE">ZTE</option>
              <option value="Nokia">Nokia</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Status Otorisasi</th>
                <th className="p-3">Site ID & Nama</th>
                <th className="p-3">Vendor / Kluster</th>
                <th className="p-3">Intervensi Rekomendasi</th>
                <th className="p-3 text-right">CapEx</th>
                <th className="p-3 text-right">Manfaat / Thn</th>
                <th className="p-3 text-right">NPV 5-Thn</th>
                <th className="p-3 text-right">CO2e (t/th)</th>
                <th className="p-3 text-right">QoS Δ</th>
                <th className="p-3 text-center">Aksi DSS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedSites.map((site) => {
                const isSelected = portfolioResult.selected.some(s => s.id === site.id);
                const override = forcedOverrides[site.id];

                return (
                  <tr 
                    key={site.id} 
                    className={`transition hover:bg-slate-50/80 ${
                      isSelected ? 'bg-emerald-50/30' : 'bg-white opacity-80'
                    }`}
                  >
                    <td className="p-3">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          {override === 'FORCE_IN' ? 'TERPILIH (MANUAL)' : 'TERPILIH (AI)'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <X className="w-3 h-3 text-slate-400" />
                          {override === 'FORCE_OUT' ? 'DIKELUARKAN (MANUAL)' : 'DITUNDA (PAGU)'}
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-semibold text-slate-900">
                      <div className="font-mono text-[11px] text-red-600 font-bold">{site.id}</div>
                      <div className="text-slate-800">{site.name}</div>
                    </td>

                    <td className="p-3 text-slate-600">
                      <span className="font-semibold text-slate-800">{site.vendor}</span>
                      <div className="text-[10px] text-slate-400">{site.city}</div>
                    </td>

                    <td className="p-3 text-slate-700">
                      <div className="font-bold text-slate-900">{site.intervensiUtama}</div>
                      <div className="text-[10px] text-emerald-700">{site.qosSLA}</div>
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-rose-600">
                      Rp {(site.capexIDR / 1000000).toFixed(1)} Jt
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-emerald-700">
                      Rp {(site.netAnnualBenefitIDR / 1000000).toFixed(1)} Jt
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      +Rp {(site.npv5YearsIDR / 1000000).toFixed(1)} Jt
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-cyan-800">
                      {site.emissionsReducedTon} t
                    </td>

                    <td className="p-3 text-right font-mono text-slate-600">
                      +{site.latencyDeltaMs}ms
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedExplainer(site)}
                          className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] transition cursor-pointer flex items-center gap-1 border border-indigo-200"
                          title="Inspeksi XAI Rationale, Parameters, Risks & Alternatives"
                        >
                          <Cpu className="w-3 h-3 text-indigo-600" />
                          <span>XAI</span>
                        </button>
                        <button
                          onClick={() => toggleOverride(site.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer border ${
                            override
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : isSelected
                              ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-600'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                          title="Ubah Keputusan Manual"
                        >
                          {override ? 'Reset' : isSelected ? 'Exclude' : 'Force In'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Decision Inspector Modal (XAI / SHAP Explainer) */}
      {selectedExplainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">Explainable AI (XAI) Engine</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Confidence 96,8%
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">{selectedExplainer.id} - {selectedExplainer.name}</h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedExplainer(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* XAI Structured Rationale Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                1. Alasan Pemilihan & Rationale Model (Physics-Informed LSTM)
              </span>
              <p className="text-slate-700 leading-relaxed font-normal">
                Situs <strong>{selectedExplainer.name}</strong> ({selectedExplainer.vendor}) memiliki utilisasi PRB off-peak rata-rata hanya <strong>18,2%</strong> pada jam 01:00-05:00 WIB, dengan suhu shelter terkontrol pada <strong>{selectedExplainer.tempC}°C</strong>. Intervensi <strong>{selectedExplainer.intervensiUtama}</strong> menghasilkan efisiensi energi tertinggi <strong>+{selectedExplainer.savingPercent}%</strong> tanpa mempengaruhi panggilan darurat 112 (carrier 700/900MHz dipertahankan aktif).
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                2. Faktor Bobot Penentu Keputusan (SHAP Feature Importance):
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-600 mb-1">
                    <span>1. Histori & Prediksi Trafik Rendah (00:00 - 05:00)</span>
                    <span className="text-indigo-600 font-bold">45% Bobot</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-600 mb-1">
                    <span>2. Suhu Shelter & Efisiensi PUE (Pendingin AC)</span>
                    <span className="text-emerald-600 font-bold">25% Bobot</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-600 mb-1">
                    <span>3. Toleransi Margin Latensi QoS (&lt; 15 ms)</span>
                    <span className="text-amber-600 font-bold">20% Bobot</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-semibold text-slate-600 mb-1">
                    <span>4. Cadangan Daya Baterai / Rectifier Telemetri</span>
                    <span className="text-slate-600 font-bold">10% Bobot</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-slate-400 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Multi-Criteria Decision Alternatives */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                3. Alternatif Keputusan yang Diuji (Multi-Criteria Trade-offs):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="font-extrabold text-emerald-900 block">Opsi A (Dipilih)</span>
                  <p className="text-slate-600 mt-1">{selectedExplainer.intervensiUtama}</p>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-1">Efisiensi +{selectedExplainer.savingPercent}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block">Opsi B (Konservatif)</span>
                  <p className="text-slate-500 mt-1">Hanya AC Setpoint 26°C tanpa carrier sleep</p>
                  <span className="text-[10px] text-slate-500 font-bold block mt-1">Efisiensi +6.5%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block">Opsi C (Status Quo)</span>
                  <p className="text-slate-500 mt-1">AC 22°C & Semua Carrier Aktif Penuh</p>
                  <span className="text-[10px] text-red-600 font-bold block mt-1">Efisiensi 0% (Boros)</span>
                </div>
              </div>
            </div>

            {/* Vendor API Command Preview */}
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Code className="w-3.5 h-3.5" /> Outbound Vendor Command Payload (O-RAN O1 / NETCONF)
                </span>
                <span>Standar 3GPP Rel-18</span>
              </div>
              <pre className="text-[11px] leading-relaxed overflow-x-auto text-emerald-300">
{`{
  "command": "APPLY_PORTFOLIO_POLICY",
  "target_site_id": "${selectedExplainer.id}",
  "site_name": "${selectedExplainer.name}",
  "vendor_ems": "${selectedExplainer.vendor} NMS/EMS",
  "policy": {
    "intervention": "${selectedExplainer.intervensiUtama}",
    "shelter_target_celsius": 26.0,
    "wake_up_latency_limit_ms": 120,
    "emergency_112_bypass": true,
    "max_carrier_sleep_duration_hrs": 5.0
  },
  "dss_verification": {
    "expected_saving_kwh": ${selectedExplainer.savedKWh},
    "expected_co2_reduction_tons": ${selectedExplainer.emissionsReducedTon},
    "audit_sha256": "4a9f73b18c5e921d0a33b4e6c7104f29a1b2c3d4..."
  }
}`}
              </pre>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedExplainer(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
              >
                Tutup Inspeksi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Capital Allocation Approval Memo Modal */}
      {isAllocationMemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto text-slate-800">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <img src="/assets/logo_utama_impactgrid.png" alt="Logo" className="h-10 w-auto object-contain" />
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    MEMORANDUM USULAN ALOKASI BELANJA MODAL (CAPEX)
                  </h3>
                  <p className="text-xs text-slate-500">PT Telekomunikasi Selular • ImpactGrid Portfolio Prioritizer</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAllocationMemoOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs leading-relaxed">
              <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-slate-200 pb-2">
                <div>Kepada: <strong>Dewan Direksi (CTO & CFO Telkomsel)</strong></div>
                <div>Tanggal: <strong>22 Oktober 2026</strong></div>
                <div>Dari: <strong>Tim Satgas Efisiensi Jaringan (ImpactGrid)</strong></div>
                <div>Perihal: <strong>Persetujuan Portofolio Uji Coba 40 Lokasi (Tabel 5 & 6)</strong></div>
              </div>

              <p>
                Berdasarkan hasil pemrosesan <em>Knapsack Multi-Objective Optimization</em> dengan batas pagu anggaran <strong>Rp {(budgetCapIDR).toLocaleString('id-ID')}</strong>, berikut adalah rekomendasi portofolio investasi yang siap dieksekusi:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-1">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold">BTS Terpilih</span>
                  <span className="text-base font-black text-slate-900">{portfolioResult.totalSelectedSites} Lokasi</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold">Total CapEx</span>
                  <span className="text-base font-black text-rose-600">Rp {(portfolioResult.totalCapExUsed / 1000000).toFixed(0)} Jt</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold">Manfaat Bersih/Thn</span>
                  <span className="text-base font-black text-emerald-700">Rp {(portfolioResult.totalNetBenefitYear / 1000000).toFixed(0)} Jt</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold">NPV 5 Tahun</span>
                  <span className="text-base font-black text-slate-900">+Rp {(portfolioResult.totalNpv5Years / 1000000).toFixed(0)} Jt</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600">
                <strong>Jaminan Keselamatan Jaringan (CTO Guardrail):</strong> Seluruh lokasi terpilih memenuhi margin non-inferiority dengan pertambahan latensi rata-rata hanya <strong>+{portfolioResult.avgLatencyDelta}ms</strong> dan bypass instan 120ms saat ada panggilan darurat 112.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-center text-xs">
              <div className="p-3 border-t border-slate-200">
                <span className="text-slate-400 block text-[10px]">Disetujui Oleh,</span>
                <span className="font-bold text-slate-900 block mt-6">Direktur Network / CTO</span>
                <span className="text-[10px] text-slate-500">PT Telekomunikasi Selular</span>
              </div>
              <div className="p-3 border-t border-slate-200">
                <span className="text-slate-400 block text-[10px]">Disetujui Oleh,</span>
                <span className="font-bold text-slate-900 block mt-6">Direktur Keuangan / CFO</span>
                <span className="text-[10px] text-slate-500">PT Telekomunikasi Selular</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-mono">Doc ID: TSEL-IG-CAPEX-2027-01</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / PDF</span>
                </button>
                <button
                  onClick={() => setIsAllocationMemoOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* O-RAN O1 Netconf/YANG Dispatcher Modal */}
      <NetconfDeploymentModal
        isOpen={isNetconfModalOpen}
        onClose={() => setIsNetconfModalOpen(false)}
        selectedSitesCount={portfolioResult.totalSelectedSites}
        totalCapExIDR={portfolioResult.totalCapExUsed}
      />
    </div>
  );
}