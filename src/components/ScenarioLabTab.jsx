import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import SafeResponsiveContainer from './SafeResponsiveContainer';
import DataBadge from './DataBadge';
import { deriveSimulationMetrics } from '../utils/simulationEngine';
import { runMonteCarloSimulation } from '../utils/monteCarloEngine';
import { JAMALI_REGIONAL_CLUSTERS } from '../data/mockData';
import { calculateHourTelemetry } from './GlobalSimulationBar';
import { Calculator, ShieldCheck, Sparkles, Layers, Building2, CheckCircle2 } from 'lucide-react';

const BASELINES = [
  { key: 'daily', name: 'Asumsi A: 50 kWh/lokasi/hari (~18.250 kWh/th)', annualPerSite: 50 * 365, note: 'Estimasi konservatif shelter mikro/sub-urban.' },
  { key: 'annual', name: 'Asumsi B: 50 MWh/lokasi/tahun (50.000 kWh/th)', annualPerSite: 50_000, note: 'Estimasi moderat kluster BTS makro perkotaan padat.' },
  { key: 'standard', name: 'Baseline Standar Model: 42.000 kWh/th/lokasi', annualPerSite: 42_000, note: 'Estimasi standar BTS makro Regional Jamali.' },
];

const SCALE_PRESETS = [
  { id: 'pilot', label: 'Fase 1: Pilot (40 Site)', sites: 40, savingPct: 12.0, baselineKey: 'standard', scaleKey: 'pilot' },
  { id: 'metro', label: 'Fase 1.5: Kluster Metro (250 Site)', sites: 250, savingPct: 13.5, baselineKey: 'annual', scaleKey: 'pilot' },
  { id: 'jamali', label: 'Fase 2: Regional Jamali (5.000 Site)', sites: 5000, savingPct: 14.5, baselineKey: 'annual', scaleKey: 'regional' },
  { id: 'national', label: 'Fase 3: Skala Nasional (10.000 Site)', sites: 10000, savingPct: 14.8, baselineKey: 'annual', scaleKey: 'national' }
];

const RATES = [5, 8, 12, 15];

const rupiah = (value) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} miliar`;
  }
  return `Rp ${Math.round(value / 1_000_000).toLocaleString('id-ID')} juta`;
};

export default function ScenarioLabTab({
  isActive = true,
  simulationMode: externalMode,
  onToggleSimulationMode,
  simState,
  selectedScale = 'pilot',
  onSelectScale,
  operationalSummary,
  resolvedSites = []
}) {
  const [internalMode, setInternalMode] = useState('PARAMETRIC_SANDBOX');
  const simulationMode = externalMode || internalMode;
  const toggleMode = onToggleSimulationMode || (() => setInternalMode(m => m === 'STRICT_AUDIT' ? 'PARAMETRIC_SANDBOX' : 'STRICT_AUDIT'));

  const [activeSubView, setActiveSubView] = useState('simulator'); // 'simulator' | 'jamali_clusters' | 'montecarlo'
  const [baselineKey, setBaselineKey] = useState('standard');
  const [sites, setSites] = useState(selectedScale === 'regional' ? 5000 : selectedScale === 'national' ? 10000 : 40);
  const [savingPct, setSavingPct] = useState(12.0);
  const [tariff, setTariff] = useState(1500);
  const [activePresetId, setActivePresetId] = useState(selectedScale === 'regional' ? 'jamali' : 'pilot');

  const currentHour = typeof simState?.simHour === 'number' ? simState.simHour : 14;
  const hourTelemetry = calculateHourTelemetry(currentHour, simState?.scenarioKey || 'normal');

  const baseline = BASELINES.find((item) => item.key === baselineKey) || BASELINES[2];
  const annualKWh = baseline.annualPerSite * sites;
  const savedKWh = (annualKWh * savingPct) / 100;
  const grossSavings = savedKWh * tariff;
  const scope2Tons = Number(((savedKWh * 0.87) / 1000).toFixed(1));

  const handleApplyPreset = (preset) => {
    setActivePresetId(preset.id);
    setSites(preset.sites);
    setSavingPct(preset.savingPct);
    setBaselineKey(preset.baselineKey);
    if (onSelectScale && preset.scaleKey) {
      onSelectScale(preset.scaleKey);
    }
  };

  const handleApplyRegionalCluster = (cluster) => {
    setActivePresetId(cluster.id);
    setSites(cluster.siteCount);
    setSavingPct(cluster.targetSavingPct);
    setBaselineKey('annual');
    setActiveSubView('simulator');
  };

  const scenarios = useMemo(() => RATES.map((rate) => ({
    rate: `${rate}%`,
    energy: Math.round((annualKWh * rate) / 100),
    cost: ((annualKWh * rate) / 100) * tariff / 1_000_000,
  })), [annualKWh, tariff]);

  const parametricMetrics = useMemo(() => {
    return deriveSimulationMetrics({
      simulationMode: 'PARAMETRIC_SANDBOX',
      targetEfficiencyPct: savingPct,
      siteCount: sites,
      avgSiteAnnualKWh: baseline.annualPerSite,
      tariffPerKWh: tariff,
    });
  }, [savingPct, sites, baseline.annualPerSite, tariff]);

  const monteCarloResult = useMemo(() => {
    return runMonteCarloSimulation({
      simulationMode: 'PARAMETRIC_SANDBOX',
      iterations: 1000,
      siteCount: sites,
      avgSiteAnnualKWh: baseline.annualPerSite,
      targetEfficiencyPct: savingPct,
      tariffPerKWh: tariff,
    });
  }, [sites, baseline.annualPerSite, savingPct, tariff]);

  return (
    <div className="space-y-6">
      <section id="pitch-step-3-scenarios" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-4 shadow-xs scroll-mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/40 px-3 py-1 text-xs font-bold text-[#ED0226] dark:text-red-300">
              <span>SIMULASI SKENARIO &amp; EKSPANSI REGIONAL JAMALI 5.000 SITE</span>
            </div>
            <DataBadge type={simulationMode === 'PARAMETRIC_SANDBOX' ? 'PARAMETRIC_PROJECTION' : 'synthetic'} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Jam Simulasi: <strong>{String(currentHour).padStart(2, '0')}:00 WIB</strong> (-{hourTelemetry.savingPct}%)
            </span>
            <button
              type="button"
              onClick={() => setSavingPct(hourTelemetry.savingPct)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition cursor-pointer"
            >
              Sinkron Efisiensi Jam {String(currentHour).padStart(2, '0')}:00
            </button>
            <button
              type="button"
              onClick={toggleMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                simulationMode === 'PARAMETRIC_SANDBOX'
                  ? 'bg-[#ED0226] hover:bg-red-700 text-white border-red-600'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
              }`}
            >
              {simulationMode === 'PARAMETRIC_SANDBOX' ? (
                <>
                  <Calculator className="w-3.5 h-3.5 text-cyan-200" />
                  <span>Mode What-If Sandbox Aktif</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Aktifkan Mode What-If Sandbox</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Laboratorium Simulasi Energi, Sensitivitas Tarif PLN &amp; Skala Regional Jamali
          </h1>
          <p className="max-w-4xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Uji sensitivitas parameter baseline daya per BTS, cakupan menara dari skala Pilot ({operationalSummary?.activeSiteCount || 50} site, {resolvedSites.length} terkalibrasi FOP) hingga ekspansi <strong>Regional Jamali 5.000 Site</strong>, fluktuasi tarif PLN B-3/WBP, serta simulasi probabilistik <strong>Monte Carlo 1.000 iterasi</strong>.
          </p>
        </div>

        {/* Quick Scale Presets */}
        <div className="pt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
            Prasetel Skala Rollout:
          </span>
          {SCALE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                activePresetId === preset.id
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:border-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {[
            { id: 'simulator', label: '1. Kalkulator Parameter & Proyeksi kWh', icon: Calculator },
            { id: 'jamali_clusters', label: '2. Matriks Ekspansi Regional Jamali (5.000 Site)', icon: Building2 },
            { id: 'montecarlo', label: '3. Distribusi Risiko Monte Carlo (1.000 Iterasi)', icon: Sparkles }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSubView(id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubView === id
                  ? 'bg-[#ED0226] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* KPI Output Grid (Always visible across sub-views for immediate feedback) */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Baseline Tahunan ({sites.toLocaleString('id-ID')} Site)</div>
          <div className="mt-2 text-2xl md:text-3xl font-black tracking-tight tabular-nums text-slate-900 dark:text-white">
            {annualKWh >= 1_000_000
              ? `${(annualKWh / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} GWh`
              : `${annualKWh.toLocaleString('id-ID')} kWh`}
          </div>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">{sites.toLocaleString('id-ID')} lokasi × {baseline.annualPerSite.toLocaleString('id-ID')} kWh/th</p>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Penghematan Energi ({savingPct}%)</div>
          <div className="mt-2 text-2xl md:text-3xl font-black tracking-tight tabular-nums text-emerald-600 dark:text-emerald-400">
            {savedKWh >= 1_000_000
              ? `${(savedKWh / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} GWh`
              : `${Math.round(savedKWh).toLocaleString('id-ID')} kWh`}
          </div>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            Reduksi Scope 2: <strong>{scope2Tons.toLocaleString('id-ID')} tCO₂e/thn</strong>
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Penghematan Bruto / Tahun</div>
          <div className="mt-2 text-2xl md:text-3xl font-black tracking-tight tabular-nums text-slate-900 dark:text-slate-100">
            {rupiah(grossSavings)}
          </div>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            Netto (Setelah OpEx): <strong>{rupiah(parametricMetrics.netAnnualBenefitIDR)}/th</strong>
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Median NPV 5-Thn (Monte Carlo)</div>
          <div className="mt-2 text-2xl md:text-3xl font-black tracking-tight tabular-nums text-sky-600 dark:text-sky-400">
            {rupiah(monteCarloResult.p50)}
          </div>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            Probabilitas Layak (NPV &gt; 0): <strong>{monteCarloResult.probabilityPositive}%</strong>
          </p>
        </article>
      </section>

      {activeSubView === 'simulator' && (
        <>
          {/* Parameter Sliders */}
          <section className="grid gap-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 md:grid-cols-2 md:p-6">
            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span>Baseline per lokasi (asumsi input)</span>
              <select
                value={baselineKey}
                onChange={(event) => setBaselineKey(event.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-slate-900 dark:text-white"
              >
                {BASELINES.map((item) => (
                  <option key={item.key} value={item.key}>{item.name}</option>
                ))}
              </select>
              <span className="block text-xs font-normal text-slate-500">{baseline.note}</span>
            </label>

            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex justify-between">
                <span>Jumlah lokasi BTS ({sites.toLocaleString('id-ID')} site)</span>
                <span className="font-mono tabular-nums text-sky-600 dark:text-sky-400 font-bold">{sites.toLocaleString('id-ID')} Site</span>
              </span>
              <input
                className="w-full accent-sky-600"
                type="range"
                min="40"
                max="10000"
                step="10"
                value={sites}
                onChange={(event) => {
                  setSites(Number(event.target.value));
                  setActivePresetId('custom');
                }}
              />
              <span className="block text-xs font-normal text-slate-500">Rentang 40 lokasi pilot, 5.000 lokasi Regional Jamali, hingga 10.000 lokasi Nasional.</span>
            </label>

            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex justify-between">
                <span>Target efisiensi energi</span>
                <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-bold">{savingPct}%</span>
              </span>
              <input
                className="w-full accent-emerald-600"
                type="range"
                min="2"
                max="20"
                step="0.5"
                value={savingPct}
                onChange={(event) => setSavingPct(Number(event.target.value))}
              />
              <span className="block text-xs font-normal text-slate-500">Rentang penghematan algoritma O-RAN Carrier Sleep &amp; HVAC PINN (2% – 20%).</span>
            </label>

            <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex justify-between">
                <span>Tarif Listrik PLN Acuan (B-3 / WBP Blended)</span>
                <span className="font-mono tabular-nums text-rose-600 dark:text-rose-400 font-bold">Rp {tariff.toLocaleString('id-ID')}/kWh</span>
              </span>
              <input
                className="w-full accent-rose-600"
                type="range"
                min="1300"
                max="2200"
                step="50"
                value={tariff}
                onChange={(event) => setTariff(Number(event.target.value))}
              />
              <span className="block text-xs font-normal text-slate-500">Rentang tarif acuan PLN LWBP Rp 1.300/kWh hingga tarif campuran WBP Rp 2.200/kWh.</span>
            </label>
          </section>

          {/* Recharts Bar Chart Comparison */}
          <section id="pitch-step-4-montecarlo" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 md:p-6 space-y-4 scroll-mt-6">
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-white">Perbandingan Skenario Efisiensi (5%, 8%, 12%, 15%)</h2>
              <p className="text-xs text-slate-500">Proyeksi berubah dinamis mengikuti jumlah menara ({sites.toLocaleString('id-ID')} site) dan tarif PLN.</p>
            </div>
            <div className="h-72 w-full md:h-80 min-w-[280px] min-h-[260px]">
              {isActive && (
                <SafeResponsiveContainer defaultHeight={280}>
                  <BarChart data={scenarios} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
                    <XAxis dataKey="rate" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                      formatter={(value, name) =>
                        name === 'cost'
                          ? [`Rp ${Number(value).toFixed(1)} juta`, 'Manfaat bruto']
                          : [`${Number(value).toLocaleString('id-ID')} kWh`, 'Energi']
                      }
                    />
                    <ReferenceLine
                      y={Math.round(annualKWh * 0.12)}
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      label={{ value: `Target 12% (${Math.round((annualKWh * 0.12) / 1000).toLocaleString('id-ID')} MWh)`, fill: '#ef4444', fontSize: 11, position: 'top' }}
                    />
                    <Bar dataKey="energy" fill="#0284c7" radius={[6, 6, 0, 0]} name="Energi" />
                  </BarChart>
                </SafeResponsiveContainer>
              )}
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="p-3">Tingkat Efisiensi</th>
                    <th className="p-3 text-right">Penghematan Energi / Tahun</th>
                    <th className="p-3 text-right">Manfaat Kas Bruto / Tahun</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((item) => (
                    <tr key={item.rate} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{item.rate}</td>
                      <td className="p-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">{item.energy.toLocaleString('id-ID')} kWh</td>
                      <td className="p-3 text-right font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">{rupiah(item.cost * 1_000_000)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {activeSubView === 'jamali_clusters' && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 md:p-6 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Peta Alokasi Ekspansi Regional Jamali (5.000 Menara Makro Prioritas)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Rincian distribusi 5.000 BTS makro pada 5 kluster regional Jawa-Madura-Bali. Klik tombol <strong>Simulasikan Kluster</strong> untuk memuat parameter kluster ke kalkulator.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleApplyPreset(SCALE_PRESETS[2])}
              className="px-3.5 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Muat Total 5.000 Site Jamali
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="p-3">Kluster Regional Telkomsel</th>
                  <th className="p-3">Vendor RAN Dominan</th>
                  <th className="p-3 text-right">Jumlah Site</th>
                  <th className="p-3 text-right">Baseline (GWh/th)</th>
                  <th className="p-3 text-right">Target Hemat</th>
                  <th className="p-3 text-right">Manfaat Neto/Thn</th>
                  <th className="p-3 text-right">Reduksi Emisi</th>
                  <th className="p-3 text-center">Aksi Simulator</th>
                </tr>
              </thead>
              <tbody>
                {JAMALI_REGIONAL_CLUSTERS.map((cluster) => (
                  <tr key={cluster.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{cluster.clusterName}</div>
                      <div className="text-[11px] text-slate-500">HQ Regional: {cluster.hqCity} · SLA {cluster.slaAvailabilityPct}%</div>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{cluster.dominantVendor}</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">{cluster.siteCount.toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">{cluster.baselineGWhYear} GWh</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">-{cluster.targetSavingPct}% ({cluster.savedGWhYear} GWh)</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">Rp {cluster.netBenefitMiliarIDR} M</td>
                    <td className="p-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-300">{cluster.carbonReducedTon.toLocaleString('id-ID')} tCO₂e</td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleApplyRegionalCluster(cluster)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Simulasikan Kluster
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100/80 dark:bg-slate-800/90 font-bold border-t border-slate-200 dark:border-slate-700">
                <tr>
                  <td className="p-3 text-slate-900 dark:text-white" colSpan={2}>Total Konsolidasi Regional Jamali (5 Kluster)</td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">5.000</td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">242,65 GWh</td>
                  <td className="p-3 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">-14,3% (34,75 GWh)</td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">Rp 44,31 M/thn</td>
                  <td className="p-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-300">30.233 tCO₂e</td>
                  <td className="p-3 text-center text-[11px] text-emerald-700 dark:text-emerald-300">Swadana Penuh</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      )}

      {activeSubView === 'montecarlo' && monteCarloResult && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] shadow-xs p-5 md:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <h2 className="font-extrabold text-slate-900 dark:text-white">
                  Distribusi Probabilistik Monte Carlo (1.000 Iterasi — {sites.toLocaleString('id-ID')} Site)
                </h2>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Simulasi stokastik deviasi efisiensi energi (±20% std dev) serta volatilitas beban trafik dan tarif PLN (±8% std dev).
              </p>
            </div>
            <DataBadge type="PARAMETRIC_PROJECTION" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <article className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">P5 (Skenario Pesimis 5%)</span>
              <div className={`mt-1 text-xl font-black tabular-nums ${monteCarloResult.p5 >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {rupiah(monteCarloResult.p5)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">95% iterasi di atas nilai ini</p>
            </article>

            <article className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-800/60 shadow-xs">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">P50 (Ekspektasi Median)</span>
              <div className={`mt-1 text-xl font-black tabular-nums ${monteCarloResult.p50 >= 0 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600'}`}>
                {rupiah(monteCarloResult.p50)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Nilai tengah distribusi NPV</p>
            </article>

            <article className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">P95 (Batas Atas Optimis)</span>
              <div className={`mt-1 text-xl font-black tabular-nums ${monteCarloResult.p95 >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {rupiah(monteCarloResult.p95)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Potensi maksimum sinergi WBP</p>
            </article>

            <article className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Probabilitas NPV &gt; 0</span>
              <div className="mt-1 text-xl font-black text-slate-900 dark:text-white tabular-nums">
                {monteCarloResult.probabilityPositive}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Keyakinan kelayakan Komite Investasi</p>
            </article>
          </div>

          <div className="h-64 w-full min-w-[280px] min-h-[240px]">
            <SafeResponsiveContainer defaultHeight={240}>
              <BarChart data={monteCarloResult.histogram} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#64748b" interval={3} tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => [
                    `${value} iterasi (${monteCarloResult.histogram.find(b => b.count === value)?.percentage || 0}%)`,
                    'Frekuensi',
                  ]}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[3, 3, 0, 0]} name="Frekuensi" />
              </BarChart>
            </SafeResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
}
