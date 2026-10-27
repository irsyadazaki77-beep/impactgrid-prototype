import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DataBadge from './DataBadge';
import { deriveSimulationMetrics } from '../utils/simulationEngine';
import { Calculator, ShieldCheck, TrendingUp } from 'lucide-react';

const CAPEX = 450_000_000;
const OPEX_YEAR = 60_000_000;
const BASELINE_CASES = [
  { name: 'Skenario rendah: 50 kWh/lokasi/hari', annualKWh: 40 * 50 * 365, note: 'Belum diverifikasi dengan meter; 730.000 kWh/tahun untuk 40 lokasi.' },
  { name: 'Skenario alternatif: 50 MWh/lokasi/tahun', annualKWh: 40 * 50_000, note: 'Asumsi bahan tim; bukan baseline pilot terukur.' },
];
const SAVING_RATES = [5, 8, 12];

function calculate(annualKWh, savingPct, tariff, discountPct) {
  const grossFullYear = annualKWh * savingPct / 100 * tariff;
  const cashFlows = [grossFullYear * 3 / 12 - OPEX_YEAR * 9 / 12];
  for (let year = 2; year <= 5; year++) cashFlows.push(grossFullYear - OPEX_YEAR);
  const rate = discountPct / 100;
  const npv = -CAPEX + cashFlows.reduce((sum, cf, i) => sum + cf / (1 + rate) ** (i + 1), 0);
  return { grossFullYear, cashFlows, npv };
}

function rupiah(value) {
  return `Rp ${Math.round(value / 1_000_000).toLocaleString('id-ID')} juta`;
}

export default function FinancialModelTab({ simulationMode: externalMode, onToggleSimulationMode }) {
  const [internalMode, setInternalMode] = useState('STRICT_AUDIT');
  const simulationMode = externalMode || internalMode;
  const toggleMode = onToggleSimulationMode || (() => setInternalMode(m => m === 'STRICT_AUDIT' ? 'PARAMETRIC_SANDBOX' : 'STRICT_AUDIT'));

  const [tariff, setTariff] = useState(1500);
  const [discount, setDiscount] = useState(10);
  const [siteCount, setSiteCount] = useState(40);
  const [capexPerSite, setCapexPerSite] = useState(25000000); // 25 juta
  const targetEfficiency = 8.5;

  const results = useMemo(() => BASELINE_CASES.map((baseline) => ({
    ...baseline,
    scenarios: SAVING_RATES.map((savingPct) => ({
      savingPct,
      ...calculate(baseline.annualKWh, savingPct, tariff, discount),
    })),
  })), [tariff, discount]);
  const baseCase = results[0].scenarios[1];
  const alternateCase = results[1].scenarios[1];

  // Parametric Sandbox Output
  const sandboxMetrics = useMemo(() => {
    if (simulationMode !== 'PARAMETRIC_SANDBOX') return null;
    return deriveSimulationMetrics({
      simulationMode: 'PARAMETRIC_SANDBOX',
      targetEfficiencyPct: targetEfficiency,
      siteCount,
      capexPerSiteIDR: capexPerSite,
      tariffPerKWh: tariff,
      discountRate: discount / 100,
    });
  }, [simulationMode, targetEfficiency, siteCount, capexPerSite, tariff, discount]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 p-6 md:p-8 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
              Model sensitivitas - data lapangan belum tersedia
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
                <Calculator className="w-3.5 h-3.5 text-white" />
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

        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Kelayakan finansial pilot</h1>
        <p className="max-w-4xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Semua hasil di halaman ini adalah simulasi. Baseline lokasi, biaya yang benar-benar dapat dihindari, penawaran vendor, dan bagian penghematan yang diterima Telkomsel belum divalidasi. Model mengikuti jadwal proposal: tindakan aktif tiga bulan pada 2027, biaya operasi sembilan bulan, lalu empat tahun operasi penuh.
        </p>
      </section>

      {/* KPI Cards */}
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Skenario rendah, hemat 8%</div>
          <div className="mt-2 text-3xl md:text-4xl font-black tracking-tight tabular-nums text-rose-700">
            {rupiah(baseCase.npv)}
          </div>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">Baseline 50 kWh/lokasi/hari; belum diukur di lapangan.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Skenario alternatif, hemat 8%</div>
          <div className={`mt-2 text-3xl md:text-4xl font-black tracking-tight tabular-nums ${alternateCase.npv >= 0 ? 'text-amber-700' : 'text-rose-700'}`}>
            {rupiah(alternateCase.npv)}
          </div>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">Baseline 50 MWh/lokasi/tahun; asumsi alternatif bahan tim.</p>
        </article>
      </section>

      {/* Assumptions Control */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 md:p-6 space-y-5">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Ubah asumsi simulasi</h2>
          <p className="text-xs text-slate-500">Tarif efektif dan diskonto perlu ditetapkan Finance; kontrol ini tidak mengambil data PLN atau Telkomsel.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex justify-between"><span>Biaya energi yang dihindari</span><span>Rp {tariff.toLocaleString('id-ID')}/kWh</span></span>
            <input className="w-full accent-rose-600" type="range" min="1300" max="1800" step="50" value={tariff} onChange={(e) => setTariff(Number(e.target.value))} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex justify-between"><span>Tingkat diskonto</span><span>{discount}%</span></span>
            <input className="w-full accent-amber-500" type="range" min="8" max="12" step="0.5" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          </label>

          {simulationMode === 'PARAMETRIC_SANDBOX' && (
            <>
              <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex justify-between">
                  <span>Skala Lokasi Intervensi ({siteCount} site)</span>
                  <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{siteCount} site</span>
                </span>
                <input
                  className="w-full accent-sky-600"
                  type="range"
                  min="40"
                  max="5000"
                  step="10"
                  value={siteCount}
                  onChange={(e) => setSiteCount(Number(e.target.value))}
                />
              </label>

              <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex justify-between">
                  <span>CapEx per Site BTS</span>
                  <span className="font-mono text-emerald-600 font-bold">Rp {(capexPerSite / 1_000_000).toFixed(0)} juta</span>
                </span>
                <input
                  className="w-full accent-emerald-600"
                  type="range"
                  min="10000000"
                  max="50000000"
                  step="2500000"
                  value={capexPerSite}
                  onChange={(e) => setCapexPerSite(Number(e.target.value))}
                />
              </label>
            </>
          )}
        </div>
      </section>

      {/* 5-Year Projection Chart if PARAMETRIC_SANDBOX */}
      {simulationMode === 'PARAMETRIC_SANDBOX' && sandboxMetrics && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 shadow-xs p-5 md:p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-extrabold text-slate-900 dark:text-white">
                  Proyeksi Arus Kas 5 Tahun (DCF) & Akumulasi NPV
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                CapEx total {rupiah(sandboxMetrics.totalCapexIDR)} ({siteCount} site × Rp {(capexPerSite / 1_000_000).toFixed(0)}M) dengan tingkat diskonto {discount}%.
              </p>
            </div>
            <DataBadge type="PARAMETRIC_PROJECTION" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <article className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500">Proyeksi NPV 5 Tahun</span>
              <div className={`mt-1 text-2xl font-black tabular-nums ${sandboxMetrics.projectedNpv5YearsIDR >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {rupiah(sandboxMetrics.projectedNpv5YearsIDR)}
              </div>
            </article>

            <article className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500">Payback Period</span>
              <div className="mt-1 text-2xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">
                {sandboxMetrics.paybackYears ? `${sandboxMetrics.paybackYears} Tahun` : 'Tidak tercapai (< 0)'}
              </div>
            </article>

            <article className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500">Arus Kas Bersih Tahunan (Net Benefit)</span>
              <div className="mt-1 text-2xl font-black tabular-nums text-slate-900 dark:text-white">
                {rupiah(sandboxMetrics.netAnnualBenefitIDR)}/th
              </div>
            </article>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sandboxMetrics.fiveYearProjection} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" tickFormatter={(y) => `Thn ${y}`} />
                <YAxis stroke="#64748b" tickFormatter={(v) => `Rp ${Math.round(v / 1_000_000)}M`} />
                <Tooltip
                  formatter={(val, name) => [
                    `Rp ${Number(val).toLocaleString('id-ID')}`,
                    name === 'netCashflowIDR' ? 'Arus Kas Bersih' : name === 'discountedCashflowIDR' ? 'Discounted Cashflow' : 'NPV Kumulatif'
                  ]}
                />
                <Bar dataKey="discountedCashflowIDR" fill="#059669" radius={[3, 3, 0, 0]} name="Discounted Cashflow" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Baseline Scenarios Table */}
      {results.map((baseline) => (
        <section key={baseline.name} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-5">
            <h2 className="font-extrabold text-slate-900 dark:text-white">{baseline.name}</h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{baseline.note} Baseline total: {baseline.annualKWh.toLocaleString('id-ID')} kWh/tahun.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white dark:bg-slate-900 text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="p-3">Penghematan tambahan</th>
                  <th className="p-3">Manfaat bruto setahun penuh</th>
                  <th className="p-3">NPV 2027-2031</th>
                </tr>
              </thead>
              <tbody>
                {baseline.scenarios.map((scenario) => (
                  <tr key={scenario.savingPct} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="p-3 text-slate-900 dark:text-white font-medium">{scenario.savingPct}%</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{rupiah(scenario.grossFullYear)}</td>
                    <td className={`p-3 font-bold ${scenario.npv >= 0 ? 'text-amber-700' : 'text-rose-700'}`}>
                      {rupiah(scenario.npv)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <h2 className="font-extrabold text-slate-900 dark:text-white">Cara membaca hasil</h2>
        <p className="mt-2">
          NPV pilot berubah tanda ketika baseline berubah. Karena itu, hasil di atas tidak menyatakan proyek layak atau tidak layak. Audit yang diusulkan terlebih dahulu memeriksa data meter dan tagihan, kontrak energi, lokasi yang eligible, biaya aktual, serta nilai tambah terhadap proses existing. Anggaran audit yang diusulkan adalah maksimum Rp95 juta; kelanjutan pilot memerlukan keputusan terpisah.
        </p>
      </section>
    </div>
  );
}
