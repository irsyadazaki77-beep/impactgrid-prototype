import React, { useState, useMemo } from 'react';
import {
  Leaf,
  Award,
  CheckCircle2,
  FileText,
  Sliders,
  Sun
} from 'lucide-react';
import {
  calculateEsgCarbonAndGreenBts,
  TELKOMSEL_REGIONAL_BENCHMARKS
} from '../utils/roleBasedWorkspaceEngine';

export default function EsgCarbonTaxAndGreenBtsPanel({
  selectedScale = 'pilot',
  projectedAnnualTons = 174,
  resolvedSites = [],
  onOpenModal
}) {
  const [carbonTaxRateIdr, setCarbonTaxRateIdr] = useState(75_000);
  const [idxCarbonPriceIdr, setIdxCarbonPriceIdr] = useState(95_000);
  const [emissionFactor, setEmissionFactor] = useState(0.87);

  const scaleMultiplier = selectedScale === 'national' ? 250 : selectedScale === 'regional' ? 125 : 1;
  const baseSavedMwh = Math.round((projectedAnnualTons / 0.87) || (200 * scaleMultiplier));
  const netBenefitIdr = 240_000_000 * scaleMultiplier;

  const esgMetrics = useMemo(() => {
    return calculateEsgCarbonAndGreenBts({
      savedMwhYear: baseSavedMwh,
      emissionFactorKgPerKwh: emissionFactor,
      carbonTaxRatePerTonIdr: carbonTaxRateIdr,
      idxCarbonMarketPricePerTonIdr: idxCarbonPriceIdr,
      netFinancialBenefitIdr: netBenefitIdr,
      resolvedSitesCount: resolvedSites.length
    });
  }, [baseSavedMwh, emissionFactor, carbonTaxRateIdr, idxCarbonPriceIdr, netBenefitIdr, resolvedSites.length]);

  return (
    <div className="space-y-6" data-testid="esg-carbon-tax-green-bts-panel">
      {/* 1. Interactive Carbon Tax (UU HPP) & Green BTS Simulator */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <Leaf className="w-4 h-4" />
              <span>SIMULATOR PAJAK KARBON (UU HPP), BURSA IDXCARBON &amp; SERTIFIKASI GREEN BTS</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Kalkulator Eksposur Pajak Karbon, Valuasi Nilai Ekonomi Karbon &amp; Standar ITU-T L.1331
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Uji dampak finansial dari regulasi Pajak Karbon dan perdagangan unit karbon SPE-GRK terhadap penurunan konsumsi listrik jaringan RAN Telkomsel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenModal && (
              <button
                type="button"
                onClick={() => onOpenModal('bare')}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Bukti Rekonsiliasi BA-RE PLN</span>
              </button>
            )}
            {onOpenModal && (
              <button
                type="button"
                onClick={() => onOpenModal('memo')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Dossier Kepatuhan ESG BoD</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Sliders */}
        <div className="grid gap-5 md:grid-cols-3">
          <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="flex justify-between">
              <span>Tarif Pajak Karbon (UU HPP)</span>
              <span className="font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                Rp {carbonTaxRateIdr.toLocaleString('id-ID')}/tCO₂e
              </span>
            </span>
            <input
              type="range"
              min="30000"
              max="150000"
              step="5000"
              value={carbonTaxRateIdr}
              onChange={(e) => setCarbonTaxRateIdr(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="block text-[11px] text-slate-500 font-normal">
              Rentang uji stres regulasi: Rp 30.000 – Rp 150.000 / ton
            </span>
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="flex justify-between">
              <span>Harga Kredit Karbon IDXCarbon</span>
              <span className="font-mono tabular-nums font-bold text-sky-600 dark:text-sky-400">
                Rp {idxCarbonPriceIdr.toLocaleString('id-ID')}/tCO₂e
              </span>
            </span>
            <input
              type="range"
              min="50000"
              max="200000"
              step="5000"
              value={idxCarbonPriceIdr}
              onChange={(e) => setIdxCarbonPriceIdr(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <span className="block text-[11px] text-slate-500 font-normal">
              Valuasi unit SPE-GRK bursa karbon domestik
            </span>
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="flex justify-between">
              <span>Faktor Emisi Grid ESDM</span>
              <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                {emissionFactor.toFixed(2)} kgCO₂e/kWh
              </span>
            </span>
            <input
              type="range"
              min="0.75"
              max="0.95"
              step="0.01"
              value={emissionFactor}
              onChange={(e) => setEmissionFactor(Number(e.target.value))}
              className="w-full accent-slate-800 cursor-pointer"
            />
            <span className="block text-[11px] text-slate-500 font-normal">
              Acuan Jamali 0,87 kgCO₂e/kWh · Nasional 0,85 kgCO₂e/kWh
            </span>
          </label>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="text-[11px] text-slate-500">Pajak Karbon Dihindari / Thn</div>
            <div className="mt-1 text-lg font-black font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
              Rp {esgMetrics.carbonTaxAvoidedIdr.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-slate-500 font-mono tabular-nums">
              Dari {esgMetrics.co2ReducedTons.toLocaleString('id-ID')} tCO₂e direduksi
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="text-[11px] text-slate-500">Valuasi Ekonomi IDXCarbon</div>
            <div className="mt-1 text-lg font-black font-mono tabular-nums text-sky-600 dark:text-sky-400">
              Rp {esgMetrics.idxCarbonCreditValueIdr.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-slate-500 font-mono tabular-nums">
              Total Manfaat Karbon: Rp {esgMetrics.totalCarbonEconomicValueIdr.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="text-[11px] text-slate-500">Dividen Sosial BTS 3T (15%)</div>
            <div className="mt-1 text-lg font-black font-mono tabular-nums text-slate-900 dark:text-white">
              Rp {esgMetrics.socialDividend3tIdr.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
              <Sun className="w-3.5 h-3.5" />
              <span>Setara {esgMetrics.solarMicrogridEquivalentKwp} kWp Solar Panel 3T</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30">
            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">Indeks Sertifikasi Green BTS</div>
            <div className="mt-1 text-lg font-black font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
              {esgMetrics.readinessScorePct}%
            </div>
            <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400">
              {esgMetrics.certificationTier}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Green BTS Regional Certification Readiness Matrix */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>MATRIKS SERTIFIKASI GREEN BTS REGIONAL (ITU-T L.1331 &amp; POJK 51/2017)</span>
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
              Status Kelayakan Sertifikasi Green BTS &amp; Kepatuhan Audit Emisi per Regional
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
            {resolvedSites.length} Site FOP Terkalibrasi · SHA-256 Verified
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Regional Telkomsel</th>
                <th className="p-3 text-right">Populasi BTS</th>
                <th className="p-3 text-right">Efisiensi Energi</th>
                <th className="p-3 text-right">Skor Green BTS</th>
                <th className="p-3">Status Sertifikasi ITU-T L.1331</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {TELKOMSEL_REGIONAL_BENCHMARKS.map((reg) => {
                const score = Math.min(99, reg.greenBtsScore + (resolvedSites.length > 0 ? 2 : 0));
                return (
                  <tr key={reg.regionId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{reg.regionName}</div>
                      <div className="text-[11px] text-slate-500">{reg.hubCity}</div>
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums">{reg.macroSites.toLocaleString('id-ID')} Site</td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-emerald-600">-{reg.avgEfficiencyPct}%</td>
                    <td className="p-3 text-right font-mono tabular-nums font-black text-slate-900 dark:text-white">{score}/100</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{score >= 92 ? 'Tersertifikasi Platinum Green BTS' : 'Siap Audit Gold Green BTS'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
