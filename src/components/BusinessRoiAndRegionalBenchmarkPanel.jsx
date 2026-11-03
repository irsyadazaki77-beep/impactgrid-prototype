import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Building2,
  FileText,
  Database,
  CheckCircle2,
  AlertTriangle,
  Download,
  Sliders
} from 'lucide-react';
import {
  calculateDynamicBusinessRoi,
  calculateRegionalFinancialBenchmark
} from '../utils/roleBasedWorkspaceEngine';

function formatIdr(value) {
  const num = Number(value) || 0;
  const abs = Math.abs(num);
  const prefix = num < 0 ? '-Rp ' : 'Rp ';
  if (abs >= 1_000_000_000) {
    return `${prefix}${(abs / 1_000_000_000).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Miliar`;
  }
  return `${prefix}${Math.round(abs / 1_000_000).toLocaleString('id-ID')} Juta`;
}

export default function BusinessRoiAndRegionalBenchmarkPanel({
  siteCount = 40,
  tariffPerKwh = 1500,
  waccPct = 10,
  capexPerSiteIdr = 11_250_000,
  targetEfficiencyPct = 12.0,
  resolvedSites = [],
  onOpenOfficialBaRe,
  onOpenSapVoucher,
  onOpenProcurementBoq
}) {
  const [telkomselSharePct, setTelkomselSharePct] = useState(85);
  const [contingencyPct, setContingencyPct] = useState(10);
  const [opexPerSiteIdr, setOpexPerSiteIdr] = useState(1_500_000);
  const [efficiencyOverride, setEfficiencyOverride] = useState(targetEfficiencyPct);
  const [regionSearch, setRegionSearch] = useState('');

  const dynamicRoi = useMemo(() => {
    return calculateDynamicBusinessRoi({
      siteCount,
      baselineMwhPerSiteYear: 50,
      efficiencyPct: efficiencyOverride,
      tariffPerKwh,
      waccPct,
      capexPerSiteIdr,
      opexPerSiteYearIdr: opexPerSiteIdr,
      telkomselPassThroughSharePct: telkomselSharePct,
      contingencyReservePct: contingencyPct
    });
  }, [siteCount, efficiencyOverride, tariffPerKwh, waccPct, capexPerSiteIdr, opexPerSiteIdr, telkomselSharePct, contingencyPct]);

  const regionalBenchmarks = useMemo(() => {
    const mult = efficiencyOverride / 12.0;
    const all = calculateRegionalFinancialBenchmark({
      efficiencyMultiplier: mult,
      telkomselSharePct,
      resolvedSites
    });
    if (!regionSearch.trim()) return all;
    const q = regionSearch.toLowerCase();
    return all.filter(
      (r) =>
        r.regionName.toLowerCase().includes(q) ||
        r.hubCity.toLowerCase().includes(q) ||
        r.towerCoMix.toLowerCase().includes(q)
    );
  }, [efficiencyOverride, telkomselSharePct, resolvedSites, regionSearch]);

  const handleExportRegionalCsv = () => {
    const headers = [
      'Regional_Telkomsel',
      'Kota_Hub',
      'Populasi_BTS_Makro',
      'Efisiensi_Pct',
      'Energi_Dihemat_MWh_Thn',
      'Hemat_Bruto_PLN_IDR',
      'Porsi_Bersih_Telkomsel_IDR',
      'Reduksi_CO2_Ton',
      'Status_Rekonsiliasi_BARE'
    ];
    const rows = regionalBenchmarks.map((r) => [
      `"${r.regionName}"`,
      `"${r.hubCity}"`,
      r.macroSites,
      r.adjustedEffPct,
      r.savedMwhYear,
      r.grossSavingIdr,
      r.telkomselNetSavingIdr,
      r.co2ReducedTons,
      `"${r.reconciliationStatus}"`
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ImpactGrid_Telkomsel_Regional_Financial_Benchmark_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" data-testid="business-roi-regional-benchmark-panel">
      {/* 1. Interactive Business ROI, TowerCo Pass-Through & Budget Contingency Simulator */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ED0226]">
              <Calculator className="w-4 h-4" />
              <span>SIMULATOR KONTRAK TOWERCO &amp; ANGGARAN CAPEX/OPEX TIM BISNIS</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Kalkulator Bagi-Hasil Pass-Through TowerCo (Mitratel/Protelindo) &amp; Ketahanan Anggaran
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simulasikan porsi penghematan tagihan listrik yang diterima Telkomsel vs insentif pemeliharaan SLA TowerCo beserta cadangan kontingensi CapEx/OpEx.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenOfficialBaRe && (
              <button
                type="button"
                onClick={onOpenOfficialBaRe}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5 text-[#ED0226]" />
                <span>Otorisasi BA-RE PLN</span>
              </button>
            )}
            {onOpenSapVoucher && (
              <button
                type="button"
                onClick={onOpenSapVoucher}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Jurnal Kredit SAP S/4HANA</span>
              </button>
            )}
            {onOpenProcurementBoq && (
              <button
                type="button"
                onClick={onOpenProcurementBoq}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dokumen BoQ Pengadaan</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Interactive Business Sliders */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="flex justify-between">
              <span>Target Efisiensi Energi RAN</span>
              <span className="font-mono tabular-nums font-bold text-emerald-600">{efficiencyOverride.toFixed(1)}%</span>
            </span>
            <input
              type="range"
              min="5"
              max="22"
              step="0.5"
              value={efficiencyOverride}
              onChange={(e) => setEfficiencyOverride(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="block text-[11px] text-slate-500 font-normal">
              Titik impas (breakeven): <strong className="font-mono tabular-nums">{dynamicRoi.breakevenEfficiencyPct}%</strong>
            </span>
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="flex justify-between">
              <span>Porsi Pass-Through Telkomsel</span>
              <span className="font-mono tabular-nums font-bold text-[#ED0226]">{telkomselSharePct}% / {100 - telkomselSharePct}%</span>
            </span>
            <input
              type="range"
              min="60"
              max="100"
              step="5"
              value={telkomselSharePct}
              onChange={(e) => setTelkomselSharePct(Number(e.target.value))}
              className="w-full accent-[#ED0226] cursor-pointer"
            />
            <span className="block text-[11px] text-slate-500 font-normal">
              TowerCo (Mitratel/Protelindo): <strong className="font-mono tabular-nums">{100 - telkomselSharePct}%</strong>
            </span>
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="flex justify-between">
              <span>Cadangan Kontingensi CapEx</span>
              <span className="font-mono tabular-nums font-bold text-amber-600">{contingencyPct}%</span>
            </span>
            <input
              type="range"
              min="0"
              max="25"
              step="5"
              value={contingencyPct}
              onChange={(e) => setContingencyPct(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="block text-[11px] text-slate-500 font-normal">
              Total CapEx: <strong className="font-mono tabular-nums">{formatIdr(dynamicRoi.totalCapexWithContingencyIdr)}</strong>
            </span>
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="flex justify-between">
              <span>OpEx Pemeliharaan / Site / Thn</span>
              <span className="font-mono tabular-nums font-bold text-sky-600">Rp {(opexPerSiteIdr / 1_000_000).toFixed(2)} Jt</span>
            </span>
            <input
              type="range"
              min="1000000"
              max="3000000"
              step="250000"
              value={opexPerSiteIdr}
              onChange={(e) => setOpexPerSiteIdr(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <span className="block text-[11px] text-slate-500 font-normal">
              Total OpEx/Thn: <strong className="font-mono tabular-nums">{formatIdr(dynamicRoi.annualOpexIdr)}</strong>
            </span>
          </label>
        </div>

        {/* Output Summary Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="text-[11px] text-slate-500">Hemat Tagihan PLN Bruto</div>
            <div className="mt-1 text-base font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {formatIdr(dynamicRoi.grossPlnSavingIdrYear)}/thn
            </div>
            <div className="text-[11px] text-slate-500 font-mono tabular-nums">{dynamicRoi.totalSavedMwhYear} MWh dihemat</div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="text-[11px] text-slate-500">Porsi Kas Telkomsel ({telkomselSharePct}%)</div>
            <div className="mt-1 text-base font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {formatIdr(dynamicRoi.telkomselGrossShareIdrYear)}/thn
            </div>
            <div className="text-[11px] text-slate-500 font-mono tabular-nums">
              Insentif TowerCo: {formatIdr(dynamicRoi.towerCoIncentiveIdrYear)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="text-[11px] text-slate-500">Arus Kas Bersih (Net OpEx)</div>
            <div className="mt-1 text-base font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {formatIdr(dynamicRoi.netAnnualCashflowTelkomselIdr)}/thn
            </div>
            <div className="text-[11px] text-slate-500 font-mono tabular-nums">
              Payback: {dynamicRoi.paybackYears} Tahun
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
            <div className="text-[11px] text-slate-500">NPV 5-Tahun (Setelah Kontingensi)</div>
            <div className={`mt-1 text-base font-black font-mono tabular-nums ${dynamicRoi.npv5YearIdr >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
              {formatIdr(dynamicRoi.npv5YearIdr)}
            </div>
            <div className="text-[11px] text-slate-500 font-mono tabular-nums">
              Profitability Index: {dynamicRoi.profitabilityIndex}x
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 flex flex-col justify-between">
            <div className="text-[11px] text-slate-500">Keputusan Komite Investasi</div>
            <div className="mt-1 flex items-center gap-1.5">
              {dynamicRoi.isViableForStageGateG1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">LAYAK LANJUT GERBANG G1</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-black text-amber-700 dark:text-amber-400">TAHAN DI GERBANG G0</span>
                </>
              )}
            </div>
            <div className="text-[10px] text-slate-500">
              Syarat: Efisiensi &ge; {dynamicRoi.breakevenEfficiencyPct}% &amp; NPV Positif
            </div>
          </div>
        </div>
      </section>

      {/* 2. Real-Time Multi-Regional Financial Benchmark Table */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <Building2 className="w-4 h-4 text-[#ED0226]" />
              <span>BENCHMARK FINANSIAL &amp; ENERGI 8 REGIONAL TELKOMSEL</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
              Perbandingan Efisiensi Tagihan PLN, Bagi-Hasil TowerCo &amp; Kesiapan BA-RE Antar-Regional
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={regionSearch}
              onChange={(e) => setRegionSearch(e.target.value)}
              placeholder="Cari Regional atau Kota Hub..."
              aria-label="Cari Regional Telkomsel"
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#ED0226]"
            />
            <button
              type="button"
              onClick={handleExportRegionalCsv}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-xs font-bold text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unduh Benchmark Regional (CSV)</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Peringkat &amp; Regional</th>
                <th className="p-3">Komposisi Kontrak TowerCo</th>
                <th className="p-3 text-right">Populasi BTS</th>
                <th className="p-3 text-right">Efisiensi Aktif</th>
                <th className="p-3 text-right">Hemat Energi/Thn</th>
                <th className="p-3 text-right">Porsi Kas Telkomsel ({telkomselSharePct}%)</th>
                <th className="p-3 text-right">Status BA-RE &amp; FOP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {regionalBenchmarks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    Tidak ada regional yang cocok dengan kata kunci &ldquo;{regionSearch}&rdquo;.{' '}
                    <button
                      type="button"
                      onClick={() => setRegionSearch('')}
                      className="text-[#ED0226] font-bold underline ml-1 cursor-pointer"
                    >
                      Reset pencarian
                    </button>
                  </td>
                </tr>
              ) : (
                regionalBenchmarks.map((reg, index) => (
                  <tr key={reg.regionId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {index + 1}. {reg.regionName}
                      </div>
                      <div className="text-[11px] text-slate-500">{reg.hubCity}</div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{reg.towerCoMix}</td>
                    <td className="p-3 text-right font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                      {reg.macroSites.toLocaleString('id-ID')} Site
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                      -{reg.adjustedEffPct}%
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {reg.savedMwhYear.toLocaleString('id-ID')} MWh
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums font-black text-slate-900 dark:text-white">
                      {formatIdr(reg.telkomselNetSavingIdr)}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums">
                      <span
                        className={
                          reg.remainingAnomalies === 0
                            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                            : 'text-amber-600 dark:text-amber-400 font-bold'
                        }
                      >
                        {reg.reconciliationStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
