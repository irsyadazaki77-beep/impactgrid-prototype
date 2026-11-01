import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import SafeResponsiveContainer from './SafeResponsiveContainer';
import DataBadge from './DataBadge';
import TowerCoCapexDetail from './TowerCoCapexDetail';
import { deriveSimulationMetrics } from '../utils/simulationEngine';
import { JAMALI_REGIONAL_CLUSTERS } from '../data/mockData';
import { calculateHourTelemetry } from './GlobalSimulationBar';
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  Layers,
  Sparkles,
  DollarSign,
  Scale,
  Database,
  FileText,
  Building2
} from 'lucide-react';

// Skenario Sensitivitas Finansial Resmi Telkomsel
const TELKOMSEL_SENSITIVITY_SCENARIOS = [
  {
    key: 'conservative',
    name: 'Skenario Konservatif (5%)',
    pct: 5,
    savedMWh: 100.0,
    grossSavingIDR: 150_000_000,
    opexIDR: 60_000_000,
    netBenefitYearIDR: 90_000_000,
    activeYear1IDR: 22_500_000,
    paybackYears: 5.0,
    npv5YearsIDR: -109_000_000,
    badgeColor: 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
    analysis: 'Berfungsi sebagai de-risking gate. Titik impas (breakeven) operasional pilot adalah efisiensi 6,85%. Jika estimasi awal di Gerbang G0 < 7,5%, intervensi fisik ditunda untuk mencegah kerugian.'
  },
  {
    key: 'base',
    name: 'Skenario Dasar / Baseline (10%)',
    pct: 10,
    savedMWh: 200.0,
    grossSavingIDR: 300_000_000,
    opexIDR: 60_000_000,
    netBenefitYearIDR: 240_000_000,
    activeYear1IDR: 60_000_000,
    paybackYears: 1.9,
    npv5YearsIDR: 460_000_000,
    irrPct: 38,
    piRatio: 2.02,
    badgeColor: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
    analysis: 'Target kerja utama base case. Menghasilkan NPV 5-tahun +Rp460 Juta dengan Payback 1,9 tahun. Jika cadangan kontingensi 10% terpakai penuh (CapEx Rp499,5 Jt), NPV tetap positif kuat di +Rp410,5 Juta (Payback 2,1 th).'
  },
  {
    key: 'optimistic',
    name: 'Skenario Optimis (15%)',
    pct: 15,
    savedMWh: 300.0,
    grossSavingIDR: 450_000_000,
    opexIDR: 60_000_000,
    netBenefitYearIDR: 390_000_000,
    activeYear1IDR: 97_500_000,
    paybackYears: 1.2,
    npv5YearsIDR: 1_028_000_000,
    badgeColor: 'border-cyan-300 bg-cyan-50 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300',
    analysis: 'Tercapai jika intervensi gabungan (HVAC setpoint 25°C + 3GPP Advanced Carrier Sleep) bekerja sinergis pada kluster BTS bersuhu sedang. NPV melampaui Rp1,02 Miliar.'
  }
];

const SENSITIVITY_TABLE = [
  { variable: 'Skenario Dasar Kerja (50 MWh/site, Hemat 10%, Rp1.500/kWh, WACC 10%)', npvIDR: 460_000_000, delta: 'Baseline' },
  { variable: 'Efisiensi Naik ke Skenario Optimis (15%)', npvIDR: 1_028_000_000, delta: '+Rp568,0 Jt' },
  { variable: 'Efisiensi Turun ke Skenario Konservatif (5%)', npvIDR: -109_000_000, delta: '-Rp569,0 Jt' },
  { variable: 'Tarif Listrik PLN Turun Menjadi Rp1.300/kWh (Hemat 10%)', npvIDR: 308_300_000, delta: '-Rp151,7 Jt' },
  { variable: 'Tarif Listrik PLN Naik Menjadi Rp1.700/kWh (Hemat 10%)', npvIDR: 611_700_000, delta: '+Rp151,7 Jt' },
  { variable: 'Biaya Investasi Awal CapEx Naik 20% (Menjadi Rp540 Juta)', npvIDR: 370_000_000, delta: '-Rp90,0 Jt' },
  { variable: 'Biaya Operasional OpEx Naik 25% (Menjadi Rp75 Juta/tahun)', npvIDR: 403_100_000, delta: '-Rp56,9 Jt' },
  { variable: 'Tingkat Diskonto Naik Menjadi 12% (Cost of Capital Tinggi)', npvIDR: 414_200_000, delta: '-Rp45,8 Jt' }
];

const HORIZON_ROADMAP = [
  {
    horizon: 'Horizon 1 (2027)',
    name: 'Uji Coba Terbatas (Pilot 9 Bulan)',
    scope: '40 Site Intervensi + 10 Kontrol (Kluster Jamali / Surabaya)',
    siteCount: 40,
    capexPerSiteIDR: 11_250_000,
    capex: 'Rp 450 Jt (Plafon G0 Rp95 Jt)',
    opex: 'Rp 60 Jt/thn',
    energySaved: '200 MWh/thn',
    netBenefit: 'Rp 240 Jt/thn',
    npv: '+Rp 460 Jt',
    payback: '1,9 Tahun',
    carbon: '174 tCO₂e/thn',
    social3T: 'Rp 36 Jt/thn (15%)'
  },
  {
    horizon: 'Horizon 1.5 (2028)',
    name: 'Ekspansi Klaster Prioritas Metro',
    scope: '250 Menara Makro Padat Trafik (Jakarta & Surabaya)',
    siteCount: 250,
    capexPerSiteIDR: 7_400_000,
    capex: 'Rp 1,85 Miliar (Swadana Kas Pilot)',
    opex: 'Rp 320 Jt/thn',
    energySaved: '1,12 GWh/thn',
    netBenefit: 'Rp 1,36 Miliar/thn',
    npv: '+Rp 3,25 Miliar',
    payback: '1,36 Tahun',
    carbon: '974 tCO₂e/thn',
    social3T: 'Rp 204 Jt/thn (15%)'
  },
  {
    horizon: 'Horizon 2 (2028–2029)',
    name: 'Standardisasi Regional Kluster Jamali',
    scope: '5.000 Lokasi Makro Prioritas Tarif Tinggi',
    siteCount: 5000,
    capexPerSiteIDR: 1_300_000,
    capex: 'Rp 6,50 Miliar (Swadana)',
    opex: 'Rp 1,80 Miliar/thn',
    energySaved: '34,75 GWh/thn',
    netBenefit: 'Rp 44,31 Miliar/thn',
    npv: '+Rp 11,70 Miliar',
    payback: '1,35 Tahun',
    carbon: '30.233 tCO₂e/thn',
    social3T: 'Rp 720 Jt/thn (15%)'
  },
  {
    horizon: 'Horizon 3 (2030–2031)',
    name: 'Perluasan Skala Nasional',
    scope: '10.000 Menara Makro Terpilih Nasional',
    siteCount: 10000,
    capexPerSiteIDR: 1_500_000,
    capex: 'Rp 15,00 Miliar',
    opex: 'Rp 7,00 Miliar/thn',
    energySaved: '68,50 GWh/thn',
    netBenefit: 'Rp 82,40 Miliar/thn',
    npv: '+Rp 41,48 Miliar',
    payback: '1,00 Tahun',
    carbon: '59.595 tCO₂e/thn',
    social3T: 'Rp 2,23 Miliar/thn (15%)'
  }
];

function rupiah(value) {
  if (value === null || value === undefined) return 'N/A';
  const isNeg = value < 0;
  const absVal = Math.abs(value);
  if (absVal >= 1_000_000_000) {
    return `${isNeg ? '-Rp ' : 'Rp '}${(absVal / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} miliar`;
  }
  const formatted = Math.round(absVal / 1_000_000).toLocaleString('id-ID');
  return `${isNeg ? '-Rp ' : 'Rp '}${formatted} juta`;
}

export default function FinancialModelTab({
  simulationMode: externalMode,
  onToggleSimulationMode,
  simState,
  selectedScale = 'pilot',
  onSelectScale,
  operationalSummary,
  resolvedSites = [],
  onOpenSapVoucher,
  onOpenProcurementBoq,
  onOpenOfficialBaRe
}) {
  const [internalMode, setInternalMode] = useState('PARAMETRIC_SANDBOX');
  const simulationMode = externalMode || internalMode;
  const toggleMode = onToggleSimulationMode || (() => setInternalMode(m => m === 'STRICT_AUDIT' ? 'PARAMETRIC_SANDBOX' : 'STRICT_AUDIT'));

  const [tariff, setTariff] = useState(1500);
  const [discount, setDiscount] = useState(10);
  const [siteCount, setSiteCount] = useState(selectedScale === 'regional' ? 5000 : selectedScale === 'national' ? 10000 : 40);
  const [capexPerSite, setCapexPerSite] = useState(selectedScale === 'regional' ? 10_000_000 : 11_250_000);
  const [activeTab, setActiveTab] = useState('scenarios'); // 'scenarios' | 'sensitivity' | 'towerco_capex' | 'horizons'

  const currentHour = typeof simState?.simHour === 'number' ? simState.simHour : 14;
  const hourTelemetry = calculateHourTelemetry(currentHour, simState?.scenarioKey || 'normal');
  const targetEfficiency = hourTelemetry.savingPct || 12.0;

  const calibratedCount = resolvedSites.length;
  const restitutedCreditIDR = Math.max(1, calibratedCount) * 3_824_640;

  // Parametric Sandbox Output
  const sandboxMetrics = useMemo(() => {
    return deriveSimulationMetrics({
      simulationMode: 'PARAMETRIC_SANDBOX',
      targetEfficiencyPct: targetEfficiency,
      siteCount,
      capexPerSiteIDR: capexPerSite,
      tariffPerKWh: tariff,
      discountRate: discount / 100,
    });
  }, [targetEfficiency, siteCount, capexPerSite, tariff, discount]);

  const handleLoadHorizon = (h) => {
    setSiteCount(h.siteCount);
    setCapexPerSite(Math.max(10_000_000, h.capexPerSiteIDR));
    if (onSelectScale) {
      if (h.siteCount >= 10000) onSelectScale('national');
      else if (h.siteCount >= 5000) onSelectScale('regional');
      else onSelectScale('pilot');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span>MODEL FINANSIAL DCF 5-TAHUN • KONTRAK TOWERCO • JURNAL SAP S/4HANA</span>
            </div>
            <DataBadge type={simulationMode === 'PARAMETRIC_SANDBOX' ? 'PARAMETRIC_PROJECTION' : 'synthetic'} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenOfficialBaRe && (
              <button
                type="button"
                onClick={onOpenOfficialBaRe}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#ED0226]" />
                <span>Dokumen BA-RE PLN</span>
              </button>
            )}

            {onOpenProcurementBoq && (
              <button
                type="button"
                onClick={onOpenProcurementBoq}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-600/60 bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Rincian BoQ &amp; RKS Pengadaan</span>
              </button>
            )}

            {onOpenSapVoucher && (
              <button
                type="button"
                onClick={onOpenSapVoucher}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-500/50 bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Posting Jurnal SAP S/4HANA</span>
              </button>
            )}

            <button
              type="button"
              onClick={toggleMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                simulationMode === 'PARAMETRIC_SANDBOX'
                  ? 'bg-[#ED0226] hover:bg-red-700 text-white border-red-600'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{simulationMode === 'PARAMETRIC_SANDBOX' ? 'Sandbox DCF Aktif' : 'Aktifkan Sandbox DCF'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Kelayakan Finansial, Rekonsiliasi Tagihan PLN &amp; Ekspansi 4-Horizon Telkomsel
          </h1>
          <p className="max-w-4xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Model arus kas terdiskonto (DCF) 5 tahun (2027–2031) dari fase Pilot ({operationalSummary?.activeSiteCount || 50} site) hingga ekspansi <strong>Regional Jamali 5.000 Site</strong>, terintegrasi dengan nilai Nota Kredit Restitusi BA-RE PLN dan ayat jurnal <strong>SAP S/4HANA FI-CO</strong>.
          </p>
        </div>

        {/* Real-Time Financial Telemetry Strip */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5">
            <div className="text-[11px] font-bold uppercase text-slate-500">Efisiensi Jam Aktif ({String(currentHour).padStart(2, '0')}:00)</div>
            <div className="mt-1 text-lg font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              -{targetEfficiency}% ({hourTelemetry.savedKw} kW)
            </div>
            <div className="text-[11px] text-slate-500">Skenario: {simState?.scenarioKey || 'normal'}</div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5">
            <div className="text-[11px] font-bold uppercase text-slate-500">Nota Kredit Restitusi BA-RE</div>
            <div className="mt-1 text-lg font-black font-mono tabular-nums text-slate-900 dark:text-white">
              Rp {restitutedCreditIDR.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {calibratedCount > 0 ? `${calibratedCount} Site FOP Terkalibrasi` : '1 Site Siap Klaim Restitusi'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5">
            <div className="text-[11px] font-bold uppercase text-slate-500">Proyeksi NPV ({siteCount.toLocaleString('id-ID')} Site)</div>
            <div className="mt-1 text-lg font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {rupiah(sandboxMetrics.projectedNpv5YearsIDR)}
            </div>
            <div className="text-[11px] text-slate-500">WACC {discount}% · Tarif Rp {tariff.toLocaleString('id-ID')}</div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5">
            <div className="text-[11px] font-bold uppercase text-slate-500">Manfaat Kas Neto / Tahun</div>
            <div className="mt-1 text-lg font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {rupiah(sandboxMetrics.netAnnualBenefitIDR)}/thn
            </div>
            <div className="text-[11px] text-slate-500">Payback {sandboxMetrics.paybackYears || 1.9} Tahun</div>
          </div>
        </div>

        {/* Subnavigation Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('scenarios')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'scenarios'
                ? 'bg-[#ED0226] text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            1. Skenario Arus Kas &amp; DCF 5-Tahun
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sensitivity')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'sensitivity'
                ? 'bg-[#ED0226] text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            2. Sensitivitas &amp; Titik Impas Software
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('horizons')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'horizons'
                ? 'bg-[#ED0226] text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            3. Roadmap 4-Horizon &amp; Regional Jamali 5.000 Site
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('towerco_capex')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'towerco_capex'
                ? 'bg-[#ED0226] text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            4. Kontrak TowerCo (Mitratel/Protelindo) &amp; CapEx IoT
          </button>
        </div>
      </section>

      {/* VIEW 1: 3 SCENARIOS & INTERACTIVE DCF */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-3">
            {TELKOMSEL_SENSITIVITY_SCENARIOS.map((sc) => (
              <article
                key={sc.key}
                className={`rounded-2xl border p-5 bg-white dark:bg-[#0B1324] shadow-xs flex flex-col justify-between ${
                  sc.key === 'base' ? 'border-[#ED0226] ring-2 ring-red-500/10' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${sc.badgeColor}`}>
                      {sc.name}
                    </span>
                    {sc.key === 'base' && (
                      <span className="text-[10px] font-black text-[#ED0226] bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-md">
                        Target Rencana Kerja (Base Case)
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-slate-500 font-semibold">Proyeksi NPV 5 Tahun (WACC 10%)</div>
                    <div className={`text-3xl font-black tracking-tight tabular-nums mt-0.5 ${sc.npv5YearsIDR >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                      {rupiah(sc.npv5YearsIDR)}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-y border-slate-100 dark:border-slate-800 py-2.5">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Net Benefit/Tahun</span>
                      <strong className="text-slate-900 dark:text-white font-black tabular-nums">{rupiah(sc.netBenefitYearIDR)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Payback Period</span>
                      <strong className="text-slate-900 dark:text-white font-black tabular-nums">{sc.paybackYears} Tahun</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Hemat Energi</span>
                      <strong className="text-slate-700 dark:text-slate-300 font-bold tabular-nums">{sc.savedMWh} MWh/th</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Manfaat Bruto</span>
                      <strong className="text-slate-700 dark:text-slate-300 font-bold tabular-nums">{rupiah(sc.grossSavingIDR)}</strong>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {sc.analysis}
                </p>
              </article>
            ))}
          </section>

          {/* Interactive DCF Sliders & 5-Year Chart */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 md:p-6 space-y-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Simulasi Interaktif Parameter DCF 5-Tahun ({siteCount.toLocaleString('id-ID')} Site)
                </h2>
                <p className="text-xs text-slate-500">
                  Sesuaikan tarif PLN, WACC, jumlah lokasi (40 s/d 5.000 site), dan CapEx per site untuk menguji ketahanan arus kas.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Pilot 40 Site', count: 40, capex: 11_250_000 },
                  { label: 'Metro 250 Site', count: 250, capex: 10_000_000 },
                  { label: 'Jamali 5.000 Site', count: 5000, capex: 10_000_000 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setSiteCount(preset.count);
                      setCapexPerSite(preset.capex);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      siteCount === preset.count
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex justify-between">
                  <span>Tarif Listrik PLN Acuan</span>
                  <span className="font-mono tabular-nums font-bold text-[#ED0226]">Rp {tariff.toLocaleString('id-ID')}/kWh</span>
                </span>
                <input className="w-full accent-[#ED0226]" type="range" min="1300" max="2000" step="50" value={tariff} onChange={(e) => setTariff(Number(e.target.value))} />
              </label>

              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex justify-between">
                  <span>Tingkat Diskonto (WACC Korporat)</span>
                  <span className="font-mono tabular-nums font-bold text-amber-600">{discount}%</span>
                </span>
                <input className="w-full accent-amber-500" type="range" min="8" max="14" step="0.5" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
              </label>

              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex justify-between">
                  <span>Skala Lokasi Intervensi</span>
                  <span className="font-mono tabular-nums text-sky-600 dark:text-sky-400 font-bold">{siteCount.toLocaleString('id-ID')} Site</span>
                </span>
                <input className="w-full accent-sky-600" type="range" min="40" max="5000" step="10" value={siteCount} onChange={(e) => setSiteCount(Number(e.target.value))} />
              </label>

              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex justify-between">
                  <span>CapEx Integrasi per Site BTS</span>
                  <span className="font-mono tabular-nums text-emerald-600 font-bold">Rp {(capexPerSite / 1_000_000).toFixed(1)} juta</span>
                </span>
                <input className="w-full accent-emerald-600" type="range" min="5000000" max="35000000" step="1250000" value={capexPerSite} onChange={(e) => setCapexPerSite(Number(e.target.value))} />
              </label>
            </div>

            <div className="h-64 w-full min-w-[280px] min-h-[240px] pt-2">
              <SafeResponsiveContainer defaultHeight={240}>
                <BarChart data={sandboxMetrics.fiveYearProjection} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#64748b" tickFormatter={(y) => `Tahun ${y}`} />
                  <YAxis stroke="#64748b" tickFormatter={(v) => `Rp ${Math.round(v / 1_000_000)}M`} />
                  <Tooltip
                    formatter={(val, name) => [
                      `Rp ${Number(val).toLocaleString('id-ID')}`,
                      name === 'discountedCashflowIDR' ? 'Arus Kas Terdiskonto' : 'Arus Kas Bersih'
                    ]}
                  />
                  <Bar dataKey="discountedCashflowIDR" fill="#059669" radius={[4, 4, 0, 0]} name="Arus Kas Terdiskonto" />
                </BarChart>
              </SafeResponsiveContainer>
            </div>
          </section>
        </div>
      )}

      {/* VIEW 2: SENSITIVITY & SOFTWARE BREAKEVEN */}
      {activeTab === 'sensitivity' && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-sky-200 dark:border-sky-800/80 bg-sky-50/60 dark:bg-sky-950/20 p-6 md:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Pemisahan Ekonomi Platform Software DSS vs Intervensi Fisik Shelter
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Rancangan anggaran memisahkan belanja perangkat lunak (Pengembangan Rp180 Jt + Integrasi O-RAN O1 Rp70 Jt + Metodologi DiD Rp40 Jt = <strong>Rp 290 Juta</strong>) dari perangkat keras submetering 40 lokasi (Rp160 Juta).
            </p>
            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <div className="p-4 rounded-xl bg-white dark:bg-[#0B1324] border border-sky-100 dark:border-sky-900">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">CapEx Software Mandiri</span>
                <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block tabular-nums">Rp 290 Juta</span>
                <span className="text-[10px] text-slate-500">Tanpa modifikasi fisik shelter</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0B1324] border border-sky-100 dark:border-sky-900">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Titik Impas Software (Breakeven)</span>
                <span className="text-xl font-black text-sky-600 dark:text-sky-400 mt-1 block tabular-nums">4,55% Efisiensi</span>
                <span className="text-[10px] text-slate-500">Setara Rp 136,5 Juta/tahun</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0B1324] border border-sky-100 dark:border-sky-900">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Imbal Hasil Bersih Software</span>
                <span className="text-xl font-black text-emerald-600 mt-1 block tabular-nums">+Rp 176,5 Jt/thn</span>
                <span className="text-[10px] text-slate-500">Pada skenario dasar 10%</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-white/60 dark:bg-[#0B1324]/40 p-3 rounded-xl border border-sky-200/50">
              <strong>Catatan Komite Investasi &amp; CFO:</strong> Kelayakan ekonomi ImpactGrid tidak bergantung pada modifikasi perangkat keras menara. Orkestrasi kebijakan O-RAN Carrier Sleep saja sudah melampaui titik impas pada penghematan minimal 4,55%.
            </div>
          </section>

          <section id="pitch-step-6-financial" className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] shadow-xs scroll-mt-6">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-5">
              <h2 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Analisis Sensitivitas Multivariabel NPV 5-Tahun</span>
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Menguji ketahanan proyek terhadap fluktuasi tarif PLN, eskalasi biaya CapEx/OpEx, dan kenaikan biaya modal (WACC).
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="p-3.5">Perubahan Asumsi / Variabel</th>
                    <th className="p-3.5 text-right">NPV 5 Tahun (2027–2031)</th>
                    <th className="p-3.5 text-right">Selisih terhadap Baseline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {SENSITIVITY_TABLE.map((row, idx) => (
                    <tr key={idx} className={idx === 0 ? 'bg-red-50/40 dark:bg-red-950/20 font-bold' : ''}>
                      <td className="p-3.5 text-slate-900 dark:text-white">{row.variable}</td>
                      <td className={`p-3.5 text-right font-mono font-bold tabular-nums ${row.npvIDR >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {rupiah(row.npvIDR)}
                      </td>
                      <td className="p-3.5 text-right font-mono tabular-nums text-slate-500 font-semibold">{row.delta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* VIEW 3: 4-HORIZON SCALE & JAMALI 5.000 SITE BREAKDOWN */}
      {activeTab === 'horizons' && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#ED0226]" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Trajektori Ekspansi 4-Horizon &amp; Skema Reinvestasi Swadana (Self-Funding)
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Ekspansi pasca-pilot tidak membebani plafon CapEx korporat baru. <strong>85% manfaat kas bersih dialokasikan ke Dana Swadana Reinvestasi</strong> untuk membiayai horizon berikutnya, sedangkan <strong>15% disalurkan sebagai Dividen Sosial 3T</strong>.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
              {HORIZON_ROADMAP.map((h, i) => (
                <div key={h.horizon} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-[#ED0226] bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900">
                        {h.horizon}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">Tahap {i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white">{h.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{h.scope}</p>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700/60 pt-2.5 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">CapEx / OpEx:</span>
                        <strong className="text-slate-900 dark:text-white font-semibold tabular-nums">{h.capex}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Net Benefit/Thn:</span>
                        <strong className="text-emerald-600 font-black tabular-nums">{h.netBenefit}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">NPV 5 Tahun:</span>
                        <strong className="text-emerald-600 font-bold tabular-nums">{h.npv}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payback Period:</span>
                        <strong className="text-slate-900 dark:text-white font-bold tabular-nums">{h.payback}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Dekarbonisasi:</span>
                        <strong className="text-cyan-600 dark:text-cyan-400 font-bold tabular-nums">{h.carbon}</strong>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleLoadHorizon(h);
                      setActiveTab('scenarios');
                    }}
                    className="w-full mt-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Muat ke Kalkulator DCF
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Regional Jamali 5,000-Site Financial Breakdown */}
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#ED0226]" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Rincian Anggaran &amp; Arus Kas Ekspansi Regional Jamali (5.000 Site per Regional)
              </h2>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase text-slate-500 font-bold">
                  <tr>
                    <th className="p-3">Regional Telkomsel</th>
                    <th className="p-3 text-right">Populasi BTS</th>
                    <th className="p-3 text-right">Alokasi CapEx</th>
                    <th className="p-3 text-right">Hemat Bruto/Thn</th>
                    <th className="p-3 text-right">Kas Neto/Thn</th>
                    <th className="p-3 text-right">Peak-Shaving WBP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {JAMALI_REGIONAL_CLUSTERS.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{c.clusterName}</td>
                      <td className="p-3 text-right font-mono tabular-nums">{c.siteCount.toLocaleString('id-ID')} Site</td>
                      <td className="p-3 text-right font-mono tabular-nums">Rp {c.capexMiliarIDR} Miliar</td>
                      <td className="p-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">Rp {c.grossSavingMiliarIDR} Miliar</td>
                      <td className="p-3 text-right font-mono tabular-nums font-bold text-emerald-600">Rp {c.netBenefitMiliarIDR} Miliar</td>
                      <td className="p-3 text-right font-mono tabular-nums text-sky-600">{c.wbpPeakShavingMw} MW</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* VIEW 4: TOWERCO, PLN TARIFFS, & CAPEX BREAKDOWN */}
      {activeTab === 'towerco_capex' && (
        <TowerCoCapexDetail />
      )}

      {/* Audit Readiness Footer */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <h2 className="font-extrabold text-slate-900 dark:text-white">Tata Kelola Pencairan Modal &amp; Integritas Audit Finansial</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          Intervensi fisik pada pilot 40 lokasi hanya dicairkan setelah <strong>Audit Kesiapan Gerbang G0 (Maks Rp95 Juta pada Bulan 1–2)</strong> memvalidasi: (1) meter AMR PLN terpasang dan sinkron dengan submeter DC Kelas 0.5s, (2) kontrak sewa menara adalah skema tarif variabel (pass-through 85/15), dan (3) estimasi efisiensi awal ≥ 7,5%.
        </p>
      </section>
    </div>
  );
}
