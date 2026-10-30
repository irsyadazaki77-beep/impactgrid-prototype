import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DataBadge from './DataBadge';
import { deriveSimulationMetrics } from '../utils/simulationEngine';
import { runMonteCarloSimulation } from '../utils/monteCarloEngine';
import { Calculator, ShieldCheck, Sparkles } from 'lucide-react';

const BASELINES = [
  { key: 'daily', name: 'Asumsi A: 50 kWh/lokasi/hari (~18.250 kWh/th)', annualPerSite: 50 * 365, note: 'Estimasi konservatif shelter mikro.' },
  { key: 'annual', name: 'Asumsi B: 50 MWh/lokasi/tahun (50.000 kWh/th)', annualPerSite: 50_000, note: 'Estimasi moderat cluster BTS makro perkotaan.' },
  { key: 'standard', name: 'Baseline Standar Model: 42.000 kWh/th/lokasi', annualPerSite: 42_000, note: 'Estimasi standar BTS makro perkotaan untuk simulasi.' },
];
const RATES = [5, 8, 12];

const rupiah = (value) => `Rp ${Math.round(value / 1_000_000).toLocaleString('id-ID')} juta`;

export default function ScenarioLabTab({ isActive = true, simulationMode: externalMode, onToggleSimulationMode }) {
  const [internalMode, setInternalMode] = useState('STRICT_AUDIT');
  const simulationMode = externalMode || internalMode;
  const toggleMode = onToggleSimulationMode || (() => setInternalMode(m => m === 'STRICT_AUDIT' ? 'PARAMETRIC_SANDBOX' : 'STRICT_AUDIT'));

  const [baselineKey, setBaselineKey] = useState('standard');
  const [sites, setSites] = useState(40);
  const [savingPct, setSavingPct] = useState(8.5);
  const [tariff, setTariff] = useState(1500);

  const baseline = BASELINES.find((item) => item.key === baselineKey) || BASELINES[2];
  const annualKWh = baseline.annualPerSite * sites;
  const savedKWh = annualKWh * savingPct / 100;
  const grossSavings = savedKWh * tariff;

  const scenarios = useMemo(() => RATES.map((rate) => ({
    rate: `${rate}%`,
    energy: Math.round(annualKWh * rate / 100),
    cost: annualKWh * rate / 100 * tariff / 1_000_000,
  })), [annualKWh, tariff]);

  // Parametric Sandbox Metrics
  const parametricMetrics = useMemo(() => {
    if (simulationMode !== 'PARAMETRIC_SANDBOX') return null;
    return deriveSimulationMetrics({
      simulationMode: 'PARAMETRIC_SANDBOX',
      targetEfficiencyPct: savingPct,
      siteCount: sites,
      avgSiteAnnualKWh: baseline.annualPerSite,
      tariffPerKWh: tariff,
    });
  }, [simulationMode, savingPct, sites, baseline.annualPerSite, tariff]);

  // Monte Carlo 1,000 Iteration Simulation
  const monteCarloResult = useMemo(() => {
    if (simulationMode !== 'PARAMETRIC_SANDBOX') return null;
    return runMonteCarloSimulation({
      simulationMode: 'PARAMETRIC_SANDBOX',
      iterations: 1000,
      siteCount: sites,
      avgSiteAnnualKWh: baseline.annualPerSite,
      targetEfficiencyPct: savingPct,
      tariffPerKWh: tariff,
    });
  }, [simulationMode, sites, baseline.annualPerSite, savingPct, tariff]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
              What-if berbasis asumsi
            </div>
            <DataBadge type={simulationMode === 'PARAMETRIC_SANDBOX' ? 'PARAMETRIC_PROJECTION' : 'synthetic'} />
          </div>

          <button
            type="button"
            onClick={toggleMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow-2xs cursor-pointer ${
              simulationMode === 'PARAMETRIC_SANDBOX'
                ? 'bg-[#ED0226] hover:bg-red-700 text-white border-red-600'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700'
            }`}
          >
            {simulationMode === 'PARAMETRIC_SANDBOX' ? (
              <>
                <Calculator className="w-3.5 h-3.5 text-cyan-300" />
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

        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Simulasi energi pilot</h1>
        <p className="max-w-4xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Kalkulator ini menunjukkan aritmetika untuk asumsi baseline dan persentase penghematan. Dalam mode What-If Sandbox, mesin menghitung proyeksi kWh, estimasi reduksi emisi Scope 2 dari faktor emisi jaringan resmi 2025, serta analisis risiko Monte Carlo 1.000 iterasi.
        </p>
      </section>

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
            <span>Jumlah lokasi BTS ({sites >= 1000 ? `${(sites / 1000).toFixed(1)}k` : sites} site)</span>
            <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{sites}</span>
          </span>
          <input
            className="w-full accent-sky-600"
            type="range"
            min="40"
            max="5000"
            step="10"
            value={sites}
            onChange={(event) => setSites(Number(event.target.value))}
          />
          <span className="block text-xs font-normal text-slate-500">Rentang 40 lokasi pilot hingga 5.000 lokasi regional.</span>
        </label>

        <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <span className="flex justify-between">
            <span>Target efisiensi energi</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{savingPct}%</span>
          </span>
          <input
            className="w-full accent-emerald-600"
            type="range"
            min="2"
            max="18"
            step="0.5"
            value={savingPct}
            onChange={(event) => setSavingPct(Number(event.target.value))}
          />
          <span className="block text-xs font-normal text-slate-500">Rentang penghematan realistis algoritma sleep-mode & HVAC (2% - 18%).</span>
        </label>

        <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <span className="flex justify-between">
            <span>Biaya energi yang dihindari</span>
            <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">Rp {tariff.toLocaleString('id-ID')}/kWh</span>
          </span>
          <input
            className="w-full accent-rose-600"
            type="range"
            min="1300"
            max="1800"
            step="50"
            value={tariff}
            onChange={(event) => setTariff(Number(event.target.value))}
          />
          <span className="block text-xs font-normal text-slate-500">Asumsi tarif acuan PLN B-3/TM (default Rp 1.500/kWh).</span>
        </label>
      </section>

      {/* KPI Output Grid */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Baseline tahunan model</div>
          <div className="mt-2 text-3xl md:text-4xl font-black tracking-tight tabular-nums text-slate-900 dark:text-white">
            {annualKWh.toLocaleString('id-ID')} kWh
          </div>
          <p className="mt-1 text-xs text-slate-500">{sites} lokasi × {baseline.annualPerSite.toLocaleString('id-ID')} kWh/th</p>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Penghematan Energi ({savingPct}%)</div>
          <div className="mt-2 text-3xl md:text-4xl font-black tracking-tight tabular-nums text-emerald-600 dark:text-emerald-400">
            {Math.round(savedKWh).toLocaleString('id-ID')} kWh
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {parametricMetrics ? `≈ ${parametricMetrics.projectedEmissionsReductionTons} Ton CO2e emisi Scope 2` : 'Hasil hitung aritmetika'}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Penghematan Bruto Setahun</div>
          <div className="mt-2 text-3xl md:text-4xl font-black tracking-tight tabular-nums text-slate-900 dark:text-slate-100">
            {rupiah(grossSavings)}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {parametricMetrics ? `Netto: ${rupiah(parametricMetrics.netAnnualBenefitIDR)}/th (setelah OpEx)` : 'Belum dikurangi OpEx'}
          </p>
        </article>
      </section>

      {/* Recharts Bar Chart Comparison */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 md:p-6 space-y-4">
        <div>
          <h2 className="font-extrabold text-slate-900 dark:text-white">Perbandingan Asumsi Efisiensi (5%, 8%, 12%)</h2>
          <p className="text-xs text-slate-500">Semua angka berubah mengikuti baseline dan biaya energi yang dipilih.</p>
        </div>
        <div className="h-80 w-full md:h-96">
          {isActive && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scenarios} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="rate" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  formatter={(value, name) =>
                    name === 'cost'
                      ? [`Rp ${Number(value).toFixed(1)} juta`, 'Manfaat bruto']
                      : [`${Number(value).toLocaleString('id-ID')} kWh`, 'Energi']
                  }
                />
                <Bar dataKey="energy" fill="#0284c7" radius={[4, 4, 0, 0]} name="Energi" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-3">Asumsi penghematan</th>
                <th className="p-3">Energi/tahun</th>
                <th className="p-3">Nilai bruto/tahun</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((item) => (
                <tr key={item.rate} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-3 font-medium text-slate-900 dark:text-white">{item.rate}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{item.energy.toLocaleString('id-ID')} kWh</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{rupiah(item.cost * 1_000_000)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Monte Carlo Section if PARAMETRIC_SANDBOX is active */}
      {simulationMode === 'PARAMETRIC_SANDBOX' && monteCarloResult && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] shadow-xs p-5 md:p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <h2 className="font-extrabold text-slate-900 dark:text-white">
                  Distribusi Probabilistik Monte Carlo (1.000 Iterasi Deterministik)
                </h2>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Variasi stokastik normal pada faktor penghematan energi (±20% std dev) dan volatilitas beban/tarif (±8% std dev).
              </p>
            </div>
            <DataBadge type="PARAMETRIC_PROJECTION" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <article className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">P5 (Batas Bawah 5%)</span>
              <div className={`mt-1 text-xl font-black tabular-nums ${monteCarloResult.p5 >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {rupiah(monteCarloResult.p5)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">95% simulasi di atas nilai ini</p>
            </article>

            <article className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-800/60 shadow-xs">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">P50 (Median)</span>
              <div className={`mt-1 text-xl font-black tabular-nums ${monteCarloResult.p50 >= 0 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600'}`}>
                {rupiah(monteCarloResult.p50)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Ekspektasi nilai tengah</p>
            </article>

            <article className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">P95 (Batas Atas 95%)</span>
              <div className={`mt-1 text-xl font-black tabular-nums ${monteCarloResult.p95 >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {rupiah(monteCarloResult.p95)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Skenario paling optimis</p>
            </article>

            <article className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Probabilitas NPV &gt; 0</span>
              <div className="mt-1 text-xl font-black text-slate-900 dark:text-white tabular-nums">
                {monteCarloResult.probabilityPositive}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Peluang kelayakan finansial</p>
            </article>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
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
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1324]/50 p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <strong>Tata Kelola Bukti:</strong> Seluruh angka simulasi di atas adalah hasil pemodelan sensitivitas parametrik. Keputusan investasi dan pelaporan ESG aktual memerlukan audit data meter, tinjauan kontrak daya, dan validasi lapangan sebelum diklaim.
      </section>
    </div>
  );
}
