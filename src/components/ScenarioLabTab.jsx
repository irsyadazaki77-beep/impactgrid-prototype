import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  RotateCcw, 
  Sliders, 
  TrendingUp, 
  Leaf, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  CheckCircle2,
  Sun,
  CloudRain,
  CloudSun,
  Layers,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  IMPLEMENTATION_HORIZONS, 
  SYSTEM_METADATA, 
  INTERVENTION_TYPES 
} from '../data/mockData';
import BeforeVsAfterComparison from './BeforeVsAfterComparison';
import DataBadge from './DataBadge';

export default function ScenarioLabTab() {
  const pilot = IMPLEMENTATION_HORIZONS.pilot;
  
  // State interaktif
  const [selectedInterventionId, setSelectedInterventionId] = useState('INT-COMBINED');
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(1); // 0: Konservatif (5%), 1: Dasar (10%), 2: Optimistis (15%)
  const [shelterTempC, setShelterTempC] = useState(26); // Default 26°C (Tabel 5 Proposal)
  const [customSites, setCustomSites] = useState(40); // 40 lokasi default
  const [weatherCondition, setWeatherCondition] = useState('sunny'); // 'sunny' | 'cloudy' | 'rainy'
  const [solarHybridPct, setSolarHybridPct] = useState(15); // % bauran solar hybrid
  const [trafficGrowthPct, setTrafficGrowthPct] = useState(8.4); // +8.4% sesuai data DiD

  const currentScenario = pilot.scenarios[selectedScenarioIndex];
  const activeIntervention = INTERVENTION_TYPES.find(i => i.id === selectedInterventionId) || INTERVENTION_TYPES[2];
  
  // Weather factor on cooling & solar yield
  const weatherMultipliers = {
    sunny: { coolingLoadMod: 1.05, solarYieldMod: 1.0, label: "Terik (33°C - Beban AC Naik, Solar Maksimal)" },
    cloudy: { coolingLoadMod: 0.95, solarYieldMod: 0.6, label: "Berawan (28°C - Beban AC Normal, Solar Sedang)" },
    rainy: { coolingLoadMod: 0.85, solarYieldMod: 0.2, label: "Hujan/Malam (23°C - Beban AC Sangat Ringan, Solar Rendah)" }
  };

  const weatherMod = weatherMultipliers[weatherCondition];

  // Dynamic calculations based on selected intervention & environmental inputs:
  const totalBaselineKWh = customSites * 50000;
  const tempBonusPct = (shelterTempC - 24) * 0.75;
  const solarEnergySavingPct = (solarHybridPct * 0.35) * weatherMod.solarYieldMod;
  
  // Base efficiency determined by active intervention and scenario
  const interventionBasePct = activeIntervention.id === 'INT-SOLAR' 
    ? 26.5 
    : (activeIntervention.id === 'INT-AC' 
      ? 7.0 
      : (activeIntervention.id === 'INT-SLEEP' 
        ? 11.5 
        : currentScenario.efficiencyPct));

  const effectiveEffPct = (interventionBasePct + tempBonusPct + solarEnergySavingPct) * (1 / weatherMod.coolingLoadMod);
  
  const dynamicSavedKWh = (totalBaselineKWh * effectiveEffPct) / 100;
  const dynamicGrossSavingIDR = dynamicSavedKWh * SYSTEM_METADATA.electricityTariff;
  const dynamicNetBenefitIDR = dynamicGrossSavingIDR - (customSites === 40 ? pilot.opexYearIDR : (customSites * 1500000));
  const dynamicCapEx = customSites * activeIntervention.capexIDR + (pilot.capexIDR - 160000000); // base platform capex + per-site technical capex
  const dynamicPaybackYears = (dynamicCapEx / Math.max(1, dynamicNetBenefitIDR));
  const dynamicEmissionsReducedTon = (dynamicSavedKWh * SYSTEM_METADATA.gridEmissionFactor) / 1000;

  // Subsystem breakdown data (Before vs After)
  const subsystemData = [
    {
      subsystem: "Radio Unit RF (65%)",
      Baseline: Math.round(totalBaselineKWh * 0.65 / 1000),
      Optimized: Math.round(totalBaselineKWh * 0.65 * (1 - (activeIntervention.id.includes('SLEEP') || activeIntervention.id.includes('COMBINED') ? 0.12 : 0.02)) / 1000)
    },
    {
      subsystem: "Pendingin HVAC AC (25%)",
      Baseline: Math.round(totalBaselineKWh * 0.25 / 1000),
      Optimized: Math.round(totalBaselineKWh * 0.25 * (1 - ((shelterTempC - 24) * 0.04 + (solarHybridPct * 0.005))) / 1000)
    },
    {
      subsystem: "Rectifier & Power Supply (10%)",
      Baseline: Math.round(totalBaselineKWh * 0.10 / 1000),
      Optimized: Math.round(totalBaselineKWh * 0.10 * 0.94 / 1000)
    }
  ];

  // Data komparasi 3 skenario resmi dari Tabel 6 Proposal
  const table6Data = pilot.scenarios.map(sc => ({
    name: sc.name.split(' ')[0],
    "Hemat Bruto (Rp Jt)": sc.grossSavingIDR / 1000000,
    "Manfaat Bersih (Rp Jt)": sc.netBenefitYearIDR / 1000000,
    "NPV (Rp Jt)": sc.npv5YearsIDR / 1000000
  }));

  return (
    <div className="space-y-6">
      {/* Module 2 Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Modul 2: Scenario Lab Digital Twin</span>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            💡 Pertanyaan Kunci: Berapa potensi rupiah & kWh yang dihemat pada skenario 5%, 10%, dan 15%?
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Simulasi Skenario Efisiensi & Intervensi Terkoreksi Cuaca BMKG (Tabel 6)
        </h1>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          Menguji dampak 4 jenis intervensi teknis dan tiga skenario resmi proposal (<strong>Konservatif 5%, Dasar 10%, Optimistis 15%</strong>) sebelum rekomendasi disahkan ke lapangan. Dilengkapi perhitungan matematis <em>NPV 5 Tahun (diskonto 10%)</em> dan <em>Payback Period</em> transparan.
        </p>
      </div>

      {/* 4 Canonical Intervention Cards from Proposal Bab 3.2 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Pilih Alternatif Intervensi Teknis yang Diuji (Proposal Bab 3.2)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Intervensi Aktif: <strong className="text-indigo-700">{activeIntervention.shortName}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {INTERVENTION_TYPES.map((intv) => {
            const isSelected = selectedInterventionId === intv.id;
            return (
              <div 
                key={intv.id}
                onClick={() => setSelectedInterventionId(intv.id)}
                className={`p-4 rounded-3xl border transition cursor-pointer space-y-2.5 shadow-xs ${
                  isSelected 
                    ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start gap-1">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                    {intv.category}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isSelected ? 'AKTIF DIUJI' : 'PILIH'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-xs leading-snug">{intv.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{intv.desc}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">CapEx / Site</span>
                    <span className="font-bold text-rose-600">Rp {(intv.capexIDR / 1000000).toFixed(1)} Jt</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hemat Listrik</span>
                    <span className="font-bold text-emerald-700">~{intv.annualSavingKWh} kWh</span>
                  </div>
                </div>

                <div className="text-[10px] font-semibold text-slate-600 bg-white/80 p-1.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                  <span>Proteksi: {intv.qosProtection}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Before vs After Detailed Metric Comparison */}
      <BeforeVsAfterComparison
        scenarioName={`Skenario ${currentScenario.name} (${effectiveEffPct.toFixed(1)}% Efisiensi) - ${activeIntervention.shortName}`}
        baselineEnergyKWh={totalBaselineKWh}
        savingPct={+effectiveEffPct.toFixed(1)}
        tariffIDR={SYSTEM_METADATA.electricityTariff}
        siteCount={customSites}
      />

      {/* Grid: Controls & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pengaturan Skenario */}
        <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-red-600" />
              <span>Skenario Proposal & Parameter Cuaca (Tabel 6)</span>
            </h2>
          </div>

          {/* 3 Skenario Tab Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700">
              Pilihan Skenario Proposal (Tabel 6):
            </label>
            <div className="space-y-2">
              {pilot.scenarios.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedScenarioIndex(idx)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition cursor-pointer flex justify-between items-center ${
                    selectedScenarioIndex === idx
                      ? 'bg-red-50/90 border-red-300 text-slate-900 shadow-xs ring-2 ring-red-100'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{sc.name}</span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Listrik Dihemat: {sc.savedKWhYear.toLocaleString('id-ID')} kWh/thn
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-black block ${sc.npv5YearsIDR > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      NPV: {sc.npv5YearsIDR > 0 ? `+Rp${sc.npv5YearsIDR/1000000} Jt` : `-Rp${Math.abs(sc.npv5YearsIDR/1000000)} Jt`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">PBP: {sc.paybackYears} Thn</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Weather & Solar Hybrid Simulation Modifiers */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Simulasi Kondisi Cuaca BMKG</span>
              <span className="text-[10px] text-slate-500 font-semibold">{weatherMod.label.split('(')[0]}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setWeatherCondition('sunny')}
                className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                  weatherCondition === 'sunny'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Terik (33°C)</span>
              </button>
              <button
                type="button"
                onClick={() => setWeatherCondition('cloudy')}
                className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                  weatherCondition === 'cloudy'
                    ? 'bg-slate-700 text-white border-slate-800 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CloudSun className="w-3.5 h-3.5" />
                <span>Berawan (28°C)</span>
              </button>
              <button
                type="button"
                onClick={() => setWeatherCondition('rainy')}
                className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                  weatherCondition === 'rainy'
                    ? 'bg-cyan-600 text-white border-cyan-700 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Hujan (23°C)</span>
              </button>
            </div>

            {/* Solar Hybrid Portion Slider */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Porsi Panel Surya (Solar PV)</span>
                <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{solarHybridPct}% Hybrid</span>
              </div>
              <input 
                type="range"
                min="0"
                max="50"
                step="5"
                value={solarHybridPct}
                onChange={(e) => setSolarHybridPct(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 bg-slate-100 cursor-pointer h-2 rounded-lg mt-1.5"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Kapasitas baterai lithium & PV rooftop mengurangi penarikan grid PLN saat jam beban puncak.
              </p>
            </div>
          </div>

          {/* Pengaturan Suhu Shelter AC */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Penyesuaian Suhu Shelter AC</span>
              <span className="font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">{shelterTempC} °C (Baseline: 24°C)</span>
            </div>
            <input 
              type="range"
              min="24"
              max="28"
              step="1"
              value={shelterTempC}
              onChange={(e) => setShelterTempC(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 bg-slate-100 cursor-pointer h-2 rounded-lg"
            />
            <p className="text-[11px] text-slate-500">
              Intervensi pendinginan ringan (Rp4 Juta/lokasi) menaikkan ambang batas suhu tanpa memicu overheat perangkat.
            </p>
          </div>

          {/* Cakupan Lokasi Uji */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Cakupan Lokasi Intervensi</span>
              <span className="font-mono text-cyan-800 font-bold bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">{customSites} Lokasi</span>
            </div>
            <input 
              type="range"
              min="10"
              max="50"
              step="5"
              value={customSites}
              onChange={(e) => setCustomSites(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 bg-slate-100 cursor-pointer h-2 rounded-lg"
            />
            <p className="text-[11px] text-slate-500">
              Uji coba standar: 40 lokasi intervensi + 10 lokasi pembanding (Total 50 lokasi di Jawa).
            </p>
          </div>
        </div>

        {/* Right Column: Hasil Kalkulasi Dinamis & Subsystem Breakdown */}
        <div className="lg:col-span-7 space-y-5">
          {/* Output Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block font-bold uppercase tracking-wider">Hemat Listrik</span>
              <span className="text-xl font-black text-emerald-600 mt-1 block">
                {(dynamicSavedKWh / 1000).toFixed(1)} MWh
              </span>
              <span className="text-[10px] text-slate-400 font-medium">per tahun ({effectiveEffPct.toFixed(1)}%)</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block font-bold uppercase tracking-wider">Manfaat Bersih</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">
                Rp {(dynamicNetBenefitIDR / 1000000).toFixed(0)} Jt
              </span>
              <span className="text-[10px] text-slate-400 font-medium">setelah OpEx Rp60 Jt</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block font-bold uppercase tracking-wider">Balik Modal</span>
              <span className="text-xl font-black text-cyan-800 mt-1 block">
                {dynamicPaybackYears > 0 ? `${dynamicPaybackYears.toFixed(1)} Thn` : 'N/A'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">CapEx Rp {(dynamicCapEx / 1000000).toFixed(0)} Jt</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block font-bold uppercase tracking-wider">Reduksi Scope 2</span>
              <span className="text-xl font-black text-emerald-700 mt-1 block">
                {dynamicEmissionsReducedTon.toFixed(1)} t
              </span>
              <span className="text-[10px] text-slate-400 font-medium">ton CO2e terhindar</span>
            </div>
          </div>

          {/* Subsystem Power Breakdown Before vs After */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Dekomposisi Beban Listrik Sub-Sistem Menara (MWh/thn)</span>
                </h3>
                <p className="text-xs text-slate-500">Perbandingan Baseline Eksisting vs Pasca Intervensi {activeIntervention.shortName}</p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 font-bold shrink-0">
                Total Baseline: {(totalBaselineKWh / 1000).toFixed(0)} MWh
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subsystemData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="subsystem" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#e2e8f0', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                      color: '#0f172a'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Optimized" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Komparasi Grafik 3 Skenario Resmi (Tabel 6) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Komparasi Finansial 3 Skenario Resmi Proposal (Tabel 6)</h3>
                <p className="text-xs text-slate-500">Analisis Net Benefit & NPV 5 Tahun (WACC 10%) pada Tahap Uji Coba</p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold shrink-0">
                Skenario Dasar: +Rp460 Juta
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={table6Data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#e2e8f0', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                      color: '#0f172a'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="Hemat Bruto (Rp Jt)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Manfaat Bersih (Rp Jt)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="NPV (Rp Jt)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Catatan Integritas Analisis Proposal */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start space-x-3 text-xs shadow-xs">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-900">Kejujuran & Ketajaman Analisis Finansial Proposal:</span>
              <p className="text-amber-800 leading-relaxed font-normal">
                Proposal tim secara terbuka mengakui bahwa pada <strong>skenario konservatif (5%)</strong>, proyek belum layak secara ekonomi karena NPV bernilai <strong>-Rp109 Juta</strong> (balik modal 5 tahun). Namun pada <strong>skenario dasar (10%)</strong> dan <strong>optimistis (15%)</strong>, proyek menghasilkan NPV positif <strong>+Rp460 Juta hingga +Rp1,028 Miliar</strong> dengan periode balik modal singkat (1,9 hingga 1,2 tahun).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}