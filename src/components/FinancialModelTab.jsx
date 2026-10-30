import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DataBadge from './DataBadge';
import TowerCoCapexDetail from './TowerCoCapexDetail';
import { deriveSimulationMetrics } from '../utils/simulationEngine';
import { 
  Calculator, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  DollarSign,
  Scale
} from 'lucide-react';

const CAPEX = 450_000_000;
const OPEX_YEAR = 60_000_000;

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

// Multivariable Sensitivity Table from Table 15
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

// 4-Horizon Expansion Roadmap from Table 16 & Table 19 + Horizon 1.5 Metro Transition
const HORIZON_ROADMAP = [
  {
    horizon: 'Horizon 1 (2027)',
    name: 'Uji Coba Terbatas (Pilot 9 Bulan)',
    scope: '40 Site Intervensi + 10 Kontrol (Kluster Jamali / Surabaya)',
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
    capex: 'Rp 6,50 Miliar (Swadana)',
    opex: 'Rp 1,80 Miliar/thn',
    energySaved: '5,80 GWh/thn',
    netBenefit: 'Rp 4,80 Miliar/thn',
    npv: '+Rp 11,70 Miliar',
    payback: '1,35 Tahun',
    carbon: '5.046 tCO₂e/thn',
    social3T: 'Rp 720 Jt/thn (15%)'
  },
  {
    horizon: 'Horizon 3 (2030–2031)',
    name: 'Perluasan Skala Nasional',
    scope: '10.000 Menara Makro Terpilih Nasional',
    capex: 'Rp 15,00 Miliar',
    opex: 'Rp 7,00 Miliar/thn',
    energySaved: '14,60 GWh/thn',
    netBenefit: 'Rp 14,90 Miliar/thn',
    npv: '+Rp 41,48 Miliar',
    payback: '1,00 Tahun',
    carbon: '12.702 tCO₂e/thn',
    social3T: 'Rp 2,23 Miliar/thn (15%)'
  }
];

function rupiah(value) {
  if (value === null || value === undefined) return 'N/A';
  const isNeg = value < 0;
  const absVal = Math.abs(value);
  const formatted = Math.round(absVal / 1_000_000).toLocaleString('id-ID');
  return `${isNeg ? '-Rp ' : 'Rp '}${formatted} juta`;
}

export default function FinancialModelTab({ simulationMode: externalMode, onToggleSimulationMode }) {
  const [internalMode, setInternalMode] = useState('STRICT_AUDIT');
  const simulationMode = externalMode || internalMode;
  const toggleMode = onToggleSimulationMode || (() => setInternalMode(m => m === 'STRICT_AUDIT' ? 'PARAMETRIC_SANDBOX' : 'STRICT_AUDIT'));

  const [tariff, setTariff] = useState(1500);
  const [discount, setDiscount] = useState(10);
  const [siteCount, setSiteCount] = useState(40);
  const [capexPerSite, setCapexPerSite] = useState(25000000); // 25 juta
  const [activeTab, setActiveTab] = useState('scenarios'); // 'scenarios' | 'sensitivity' | 'horizons'

  const targetEfficiency = 10.0;

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
      {/* Header Banner */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              Model sensitivitas finansial, sewa TowerCo, & DCF 5-Tahun
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-red-200/80 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-3 py-1 text-xs font-bold text-[#ED0226] dark:text-red-400">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Bab IV: Model Finansial DCF, Sensitivitas, & Swadana</span>
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

        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Kelayakan Finansial Pilot & Proyeksi 3-Horizon
        </h1>
        <p className="max-w-4xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          Model arus kas terdiskonto (DCF) 5 tahun (2027–2031) pada 40 lokasi pilot makro 3-sektor (baseline 50.000 kWh/site/th, tarif Rp1.500/kWh, CapEx Rp450 Juta, OpEx Rp60 Jt/th, WACC 10%). Dilengkapi analisis titik impas mandiri perangkat lunak (4,55%) dan mekanisme reinvestasi swadana ekspansi nasional.
        </p>

        {/* Subnavigation Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'scenarios'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            3 Skenario Arus Kas (Tabel 13)
          </button>
          <button
            onClick={() => setActiveTab('sensitivity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'sensitivity'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Sensitivitas & Impas Software (Tabel 14 & 15)
          </button>
          <button
            onClick={() => setActiveTab('towerco_capex')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'towerco_capex'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            TowerCo & CapEx IoT (Realitas Telko)
          </button>
          <button
            onClick={() => setActiveTab('horizons')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'horizons'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Roadmap 4-Horizon & Model Swadana (Fleet Expansion)
          </button>
        </div>
      </section>

      {/* VIEW 1: 3 SCENARIOS (SENSITIVITAS FINANSIAL) */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          {/* 3 Scenario Cards */}
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
                    <div className="text-xs text-slate-500 font-semibold">Proyeksi NPV 5 Tahun (10%)</div>
                    <div className={`text-3xl font-black tracking-tight tabular-nums mt-0.5 ${sc.npv5YearsIDR >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                      {rupiah(sc.npv5YearsIDR)}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-y border-slate-100 dark:border-slate-800 py-2.5">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Net Benefit/Tahun</span>
                      <strong className="text-slate-900 dark:text-white font-black">{rupiah(sc.netBenefitYearIDR)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Payback Period</span>
                      <strong className="text-slate-900 dark:text-white font-black">{sc.paybackYears} Tahun</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Hemat Energi</span>
                      <strong className="text-slate-700 dark:text-slate-300 font-bold">{sc.savedMWh} MWh/th</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Manfaat Bruto</span>
                      <strong className="text-slate-700 dark:text-slate-300 font-bold">{rupiah(sc.grossSavingIDR)}</strong>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {sc.analysis}
                </p>
              </article>
            ))}
          </section>

          {/* Table 13 Official Comparison Table */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] shadow-xs">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-5">
              <h2 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#ED0226]" />
                <span>Tabel 13: Hasil Model Arus Kas Pilot 5 Tahun (2027–2031)</span>
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Plafon CapEx Rp450 Juta (termasuk plafon audit G0 Rp95 Jt), OpEx Rp60 Juta/thn, WACC 10%, tarif Rp1.500/kWh.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="p-3.5">Ukuran Finansial</th>
                    <th className="p-3.5">Konservatif (5%)</th>
                    <th className="p-3.5 text-[#ED0226]">Dasar / Baseline (10%)</th>
                    <th className="p-3.5">Optimis (15%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Penghematan Energi Tahunan</td>
                    <td className="p-3.5">100,0 MWh</td>
                    <td className="p-3.5 font-bold text-[#ED0226]">200,0 MWh</td>
                    <td className="p-3.5">300,0 MWh</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Penghematan Biaya Bruto</td>
                    <td className="p-3.5">Rp 150,0 Juta</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Rp 300,0 Juta</td>
                    <td className="p-3.5">Rp 450,0 Juta</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Biaya Operasional Berulang (OpEx)</td>
                    <td className="p-3.5">Rp 60,0 Juta</td>
                    <td className="p-3.5">Rp 60,0 Juta</td>
                    <td className="p-3.5">Rp 60,0 Juta</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Manfaat Kas Bersih / Net (Thn 2–5)</td>
                    <td className="p-3.5 font-semibold text-emerald-600">Rp 90,0 Juta/thn</td>
                    <td className="p-3.5 font-black text-emerald-600">Rp 240,0 Juta/thn</td>
                    <td className="p-3.5 font-semibold text-emerald-600">Rp 390,0 Juta/thn</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Penghematan Aktif Tahun 1 (3 Bln)</td>
                    <td className="p-3.5">Rp 22,5 Juta</td>
                    <td className="p-3.5 font-bold">Rp 60,0 Juta</td>
                    <td className="p-3.5">Rp 97,5 Juta</td>
                  </tr>
                  <tr className="bg-slate-50/70 dark:bg-slate-800/30">
                    <td className="p-3.5 font-black text-slate-900 dark:text-white">Net Present Value (NPV 5 Tahun)</td>
                    <td className="p-3.5 font-bold text-rose-600">-Rp 109,0 Juta</td>
                    <td className="p-3.5 font-black text-emerald-600 text-sm">+Rp 460,0 Juta</td>
                    <td className="p-3.5 font-black text-emerald-600">+Rp 1.028,0 Juta</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Periode Balik Modal (Payback)</td>
                    <td className="p-3.5">5,0 Tahun</td>
                    <td className="p-3.5 font-black text-slate-900 dark:text-white">1,9 Tahun</td>
                    <td className="p-3.5 font-bold text-emerald-600">1,2 Tahun</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">Profitability Index (PI) / IRR</td>
                    <td className="p-3.5 text-slate-400">0,76x / Negatif</td>
                    <td className="p-3.5 font-bold text-emerald-600">2,02x / ~38%</td>
                    <td className="p-3.5 font-bold text-emerald-600">3,28x / ~65%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* VIEW 2: SENSITIVITY & SOFTWARE BREAKEVEN (TABLES 14 & 15) */}
      {activeTab === 'sensitivity' && (
        <div className="space-y-6">
          {/* Software Standalone Breakeven Card */}
          <section className="rounded-2xl border border-sky-200 dark:border-sky-800/80 bg-sky-50/60 dark:bg-sky-950/20 p-6 md:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Kotak Rumus 4: Pemisahan Ekonomi Software vs Intervensi Fisik
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Rancangan anggaran secara transparan memisahkan belanja perangkat lunak (Pengembangan Rp180 Jt + Integrasi Rp70 Jt + Metodologi Rp40 Jt = <strong>Rp 290 Juta</strong>) dari intervensi fisik 40 lokasi (Rp160 Juta).
            </p>
            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <div className="p-4 rounded-xl bg-white dark:bg-[#0B1324] border border-sky-100 dark:border-sky-900">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">CapEx Software Mandiri</span>
                <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">Rp 290 Juta</span>
                <span className="text-[10px] text-slate-500">Tanpa intervensi fisik site</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0B1324] border border-sky-100 dark:border-sky-900">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Titik Impas Software (Breakeven)</span>
                <span className="text-xl font-black text-sky-600 dark:text-sky-400 mt-1 block">Hanya 4,55% Efisiensi</span>
                <span className="text-[10px] text-slate-500">Setara Rp 136,5 Juta/tahun</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0B1324] border border-sky-100 dark:border-sky-900">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Imbal Hasil Bersih Software</span>
                <span className="text-xl font-black text-emerald-600 mt-1 block">+Rp 176,5 Jt/thn</span>
                <span className="text-[10px] text-slate-500">Pada skenario dasar 10%</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-white/60 dark:bg-[#0B1324]/40 p-3 rounded-xl border border-sky-200/50">
              💡 <strong>Takeaway Penguji:</strong> Keberhasilan ekonomi ImpactGrid tidak disandera oleh perangkat keras menara. Platform DSS intelijen saja sudah menguntungkan dengan penghematan minimal 4,55%, bahkan sebelum intervensi fisik dimulai.
            </div>
          </section>

          {/* Table 15 Multivariable Sensitivity */}
          <section id="pitch-step-6-financial" className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] shadow-xs scroll-mt-6">
            <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-5">
              <h2 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Tabel 15: Analisis Sensitivitas NPV 5-Tahun Terhadap Perubahan Asumsi Kunci</span>
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
                    <th className="p-3.5">NPV 5 Tahun (2027–2031)</th>
                    <th className="p-3.5">Dampak terhadap Baseline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {SENSITIVITY_TABLE.map((row, idx) => (
                    <tr key={idx} className={idx === 0 ? 'bg-red-50/40 dark:bg-red-950/20 font-bold' : ''}>
                      <td className="p-3.5 text-slate-900 dark:text-white flex items-center gap-2">
                        {idx === 0 && <span className="h-2 w-2 rounded-full bg-[#ED0226]"></span>}
                        <span>{row.variable}</span>
                      </td>
                      <td className={`p-3.5 font-bold tabular-nums ${row.npvIDR >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {rupiah(row.npvIDR)}
                      </td>
                      <td className="p-3.5 text-slate-500 font-semibold">{row.delta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* VIEW: TOWERCO, PLN TARIFFS, & CAPEX BREAKDOWN */}
      {activeTab === 'towerco_capex' && (
        <TowerCoCapexDetail />
      )}

      {/* VIEW 3: 4-HORIZON SCALE & SELF-FUNDING REINVESTMENT (TABLE 16) */}
      {activeTab === 'horizons' && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#ED0226]" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Tabel 16 & 19: Trajektori Skala 3-Horizon & Model Reinvestasi Swadana
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Ekspansi pasca-pilot tidak membebani kas korporat tambahan. <strong>85% manfaat kas bersih dialokasikan ke Dana Swadana Reinvestasi</strong> untuk membiayai CapEx horizon berikutnya, sedangkan <strong>15% disalurkan sebagai Social Dividend</strong> ke wilayah 3T/USO (Sinergi Telkomsel Jaga Cita & Internet BAIK).
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
              {HORIZON_ROADMAP.map((h, i) => (
                <div key={h.horizon} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
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
                      <strong className="text-slate-900 dark:text-white font-semibold">{h.capex} / {h.opex}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Net Benefit/Thn:</span>
                      <strong className="text-emerald-600 font-black">{h.netBenefit}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">NPV 5 Tahun:</span>
                      <strong className="text-emerald-600 font-bold">{h.npv}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Payback Period:</span>
                      <strong className="text-slate-900 dark:text-white font-bold">{h.payback}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Dekarbonisasi:</span>
                      <strong className="text-cyan-600 dark:text-cyan-400 font-bold">{h.carbon}</strong>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-700/60 pt-1.5 text-amber-700 dark:text-amber-400 font-bold">
                      <span>Dana Sosial 3T:</span>
                      <span>{h.social3T}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Assumptions Interactive Sliders */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 md:p-6 space-y-5">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Ubah asumsi simulasi (Interactive Parameters)</h2>
          <p className="text-xs text-slate-500">Tarif efektif dan diskonto perlu ditetapkan Finance; kontrol ini tidak mengambil data PLN atau Telkomsel langsung.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex justify-between"><span>Biaya energi yang dihindari (Tarif PLN)</span><span>Rp {tariff.toLocaleString('id-ID')}/kWh</span></span>
            <input className="w-full accent-[#ED0226]" type="range" min="1300" max="1800" step="50" value={tariff} onChange={(e) => setTariff(Number(e.target.value))} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex justify-between"><span>Tingkat diskonto (WACC)</span><span>{discount}%</span></span>
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
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] shadow-xs p-5 md:p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="font-extrabold text-slate-900 dark:text-white">
                  Proyeksi Arus Kas 5 Tahun (DCF) & Akumulasi NPV Sandbox
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

      {/* Audit Readiness Warning */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <h2 className="font-extrabold text-slate-900 dark:text-white">Cara Membaca & Integritas Audit Finansial</h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          Tata kelola proyek menetapkan bahwa intervensi fisik pada pilot 40 lokasi hanya akan dicairkan setelah <strong>Audit Kesiapan Gerbang G0 (Maks Rp95 Juta pada Bulan 1–2)</strong> berhasil memvalidasi: (1) meter AMR PLN terpasang dan dapat dibaca, (2) kontrak sewa menara adalah skema tarif variabel (pass-through), dan (3) estimasi efisiensi awal $\ge 7,5\%$. Jika syarat tidak terpenuhi, pengeluaran dihentikan pada plafon Rp95 Juta untuk melindungi kas korporat Telkomsel.
        </p>
      </section>
    </div>
  );
}
