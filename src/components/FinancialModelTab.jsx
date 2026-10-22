import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Table, 
  RefreshCw, 
  CheckCircle2, 
  ArrowUpRight,
  Info,
  Sliders,
  Sparkles,
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
import { IMPLEMENTATION_HORIZONS } from '../data/mockData';

export default function FinancialModelTab() {
  const pilot = IMPLEMENTATION_HORIZONS.pilot;
  const regional = IMPLEMENTATION_HORIZONS.regional;
  const national = IMPLEMENTATION_HORIZONS.national;

  // CFO Dynamic Sensitivity Controls
  const [plnTariff, setPlnTariff] = useState(1500); // Default Rp1.500/kWh
  const [waccDiscount, setWaccDiscount] = useState(10); // Default 10% WACC
  const [carbonCreditPrice, setCarbonCreditPrice] = useState(60000); // Rp/ton CO2e (IDXCarbon reference)

  // Dynamic calculations for Pilot (40 Sites, 2,000,000 kWh baseline)
  const baselineKWh = 2000000;
  const capexPilot = 450000000;
  const opexPilot = 60000000;
  const savedKWhPilot = baselineKWh * 0.10; // Skenario dasar 10% = 200,000 kWh
  const carbonTonsPilot = 174; // Skenario dasar
  const carbonRevenue = carbonTonsPilot * carbonCreditPrice;
  const dynamicGrossSaving = savedKWhPilot * plnTariff;
  const dynamicNetBenefit = dynamicGrossSaving + carbonRevenue - opexPilot;
  const dynamicPbp = (capexPilot / dynamicNetBenefit).toFixed(2);

  // 5-Year NPV calculation: NPV = -Capex + sum_{t=1}^5 (NetBenefit / (1+r)^t)
  const r = waccDiscount / 100;
  let dynamicNpv = -capexPilot;
  for (let t = 1; t <= 5; t++) {
    dynamicNpv += dynamicNetBenefit / Math.pow(1 + r, t);
  }

  const horizonComparison = [
    {
      horizon: "Jangka Pendek (2027)",
      cakupan: "40 Uji + 10 Kontrol",
      capexJt: 450,
      opexJt: 60,
      netBenefitJt: 240,
      paybackThn: 1.9,
      reduksiTon: 174,
      npvJt: 460
    },
    {
      horizon: "Jangka Menengah (2028-29)",
      cakupan: "5.000 Lokasi Jamali",
      capexJt: 6500,
      opexJt: 1800,
      netBenefitJt: 4800,
      paybackThn: 1.35,
      reduksiTon: 5046,
      npvJt: 11700
    },
    {
      horizon: "Jangka Panjang (2030-31)",
      cakupan: "10.000+ Menara Nasional",
      capexJt: 15000,
      opexJt: 7000,
      netBenefitJt: 14900,
      paybackThn: 1.0,
      reduksiTon: 12702,
      npvJt: 41480
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
          <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
          <span>Analisis Finansial & Proyeksi Bertahap</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Evaluasi Biaya, Manfaat Finansial, & Peta Jalan Ekspansi (Tabel 6 & 7)
        </h1>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed font-normal">
          Menampilkan kalkulasi finansial resmi dari naskah proposal semifinal AWAKENING Reborn: evaluasi 3 skenario pada tahap uji coba 40 lokasi intervensi serta mekanisme swadana (*Self-Funding Reinvestment*) menuju skala nasional <strong>Indonesia Emas 2045</strong>.
        </p>
      </div>

      {/* 4 Financial Indicator Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">NPV Skenario Dasar</span>
          <div className="text-2xl font-black text-emerald-600 mt-1.5">
            +Rp {Math.round(dynamicNpv / 1000000)} Juta
          </div>
          <span className="text-[11px] text-slate-400 font-medium">40 Lokasi Uji (WACC {waccDiscount}%, 5 Thn)</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Balik Modal Uji Coba</span>
          <div className="text-2xl font-black text-slate-900 mt-1.5">{dynamicPbp} Tahun</div>
          <span className="text-[11px] text-emerald-700 font-semibold">Net Rp {Math.round(dynamicNetBenefit / 1000000)} Jt/Thn</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Investasi Awal CapEx Pilot</span>
          <div className="text-2xl font-black text-rose-600 mt-1.5">Rp 450 Juta</div>
          <span className="text-[11px] text-slate-400 font-medium">OpEx Berulang Rp 60 Jt/Tahun</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">NPV Nasional (Panjang)</span>
          <div className="text-2xl font-black text-cyan-800 mt-1.5">+Rp 41,48 M</div>
          <span className="text-[11px] text-slate-400 font-medium">10.000+ Menara (Manfaat Rp14,9 M/thn)</span>
        </div>
      </div>

      {/* CFO Sensitivity Analysis Sandbox */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border border-amber-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              CFO Sensitivity Sandbox: Stress-Test Asumsi Tarif Listrik PLN & Suku Bunga WACC
            </h3>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
            Simulasi Dinamis untuk Direktur Keuangan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Slider 1: Tarif Listrik PLN */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-700">Tarif Listrik PLN (B3/I3):</span>
              <span className="font-mono text-red-600 text-sm">Rp {plnTariff.toLocaleString('id-ID')} / kWh</span>
            </div>
            <input 
              type="range" 
              min="1200" 
              max="2000" 
              step="50"
              value={plnTariff} 
              onChange={(e) => setPlnTariff(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ED0226]"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Rp 1.200 (Tarif Rendah)</span>
              <span>Rp 1.500 (Baseline)</span>
              <span>Rp 2.000 (+33%)</span>
            </div>
          </div>

          {/* Slider 2: WACC Discount Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-700">Suku Bunga Diskonto (WACC):</span>
              <span className="font-mono text-indigo-700 text-sm">{waccDiscount}% per tahun</span>
            </div>
            <input 
              type="range" 
              min="8" 
              max="14" 
              step="0.5"
              value={waccDiscount} 
              onChange={(e) => setWaccDiscount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>8.0% (Lunak)</span>
              <span>10.0% (Baseline Telkomsel)</span>
              <span>14.0% (Ketat)</span>
            </div>
          </div>

          {/* Slider 3: Nilai Kredit Karbon IDXCarbon */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-bold">
              <span className="text-slate-700">Kredit Karbon (IDXCarbon):</span>
              <span className="font-mono text-emerald-700 text-sm">Rp {carbonCreditPrice.toLocaleString('id-ID')} / ton</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="150000" 
              step="10000"
              value={carbonCreditPrice} 
              onChange={(e) => setCarbonCreditPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Rp 0 (Tanpa Monetisasi)</span>
              <span>Rp 60.000 (Konservatif)</span>
              <span>Rp 150.000 (Regulasi Pajak)</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Pada tarif <strong>Rp{plnTariff}/kWh</strong> dan diskonto <strong>{waccDiscount}%</strong>, investasi pilot 40 lokasi tetap membukukan <strong>NPV Positif +Rp {Math.round(dynamicNpv / 1000000)} Juta</strong> dengan Payback <strong>{dynamicPbp} Tahun</strong>.
            </span>
          </div>
          <span className="font-bold text-emerald-700 whitespace-nowrap bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Investasi Layak Dijalankan (Go)
          </span>
        </div>
      </div>

      {/* Tabel 6: Simulasi Kelayakan Finansial 3 Skenario pada Tahap Uji Coba (40 Lokasi) */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h3 className="text-xs font-bold text-slate-900">Tabel 6 Proposal: Simulasi Kelayakan Finansial 3 Skenario (Tahap Uji Coba 40 Lokasi)</h3>
          <span className="text-[11px] text-slate-500 font-mono font-semibold">Baseline: 2,0 GWh • Rp 3,0 Miliar Beban Listrik</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Skenario Evaluasi</th>
                <th className="py-3.5 px-4">Target Hemat</th>
                <th className="py-3.5 px-4">Listrik Dihemat</th>
                <th className="py-3.5 px-4">Hemat Bruto / Thn</th>
                <th className="py-3.5 px-4">Manfaat Bersih (Net)</th>
                <th className="py-3.5 px-4">Balik Modal</th>
                <th className="py-3.5 px-4">NPV (5 Thn, 10%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {pilot.scenarios.map((sc, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {sc.name}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-800">{sc.efficiencyPct}%</td>
                  <td className="py-4 px-4 text-slate-700 font-medium">{(sc.savedKWhYear).toLocaleString('id-ID')} kWh</td>
                  <td className="py-4 px-4 text-emerald-700 font-bold">Rp {(sc.grossSavingIDR).toLocaleString('id-ID')}</td>
                  <td className="py-4 px-4 text-slate-900 font-extrabold">Rp {(sc.netBenefitYearIDR).toLocaleString('id-ID')}</td>
                  <td className="py-4 px-4 font-mono font-semibold">{sc.paybackYears} Tahun</td>
                  <td className="py-4 px-4 font-mono font-bold">
                    <span className={sc.npv5YearsIDR > 0 ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200' : 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200'}>
                      {sc.npv5YearsIDR > 0 ? `+Rp ${(sc.npv5YearsIDR).toLocaleString('id-ID')}` : `-Rp ${Math.abs(sc.npv5YearsIDR).toLocaleString('id-ID')}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel 7: Proyeksi Skala Ekspansi Bertahap (Tabel 7 Proposal) */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h3 className="text-xs font-bold text-slate-900">Tabel 7 Proposal: Proyeksi Skala Ekspansi Bertahap (Uji Coba, Regional, dan Nasional)</h3>
          <span className="text-[11px] text-slate-500 font-mono font-semibold">Faktor Emisi Grid: 0,87 kgCO2e/kWh</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Horizon & Tahap</th>
                <th className="py-3.5 px-4">Cakupan Lokasi</th>
                <th className="py-3.5 px-4">Estimasi CapEx & OpEx</th>
                <th className="py-3.5 px-4">Potensi Manfaat Bersih & NPV</th>
                <th className="py-3.5 px-4">Dampak Reduksi Emisi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {horizonComparison.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {row.horizon}
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{row.cakupan}</td>
                  <td className="py-4 px-4">
                    <span className="text-rose-600 font-bold block">CapEx: Rp {row.capexJt >= 1000 ? `${row.capexJt/1000} Miliar` : `${row.capexJt} Juta`}</span>
                    <span className="text-slate-500 text-[11px]">OpEx: Rp {row.opexJt >= 1000 ? `${row.opexJt/1000} M/thn` : `${row.opexJt} Jt/thn`}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-emerald-700 font-black block">Net: Rp {row.netBenefitJt >= 1000 ? `${row.netBenefitJt/1000} Miliar/thn` : `${row.netBenefitJt} Jt/thn`}</span>
                    <span className="text-cyan-800 text-[11px] font-semibold">NPV: +Rp {row.npvJt >= 1000 ? `${row.npvJt/1000} Miliar` : `${row.npvJt} Juta`} (PBP {row.paybackThn} thn)</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-emerald-700">
                    {row.reduksiTon.toLocaleString('id-ID')} ton CO2e/thn
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
