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
  CheckCircle2
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
import { IMPLEMENTATION_HORIZONS, SYSTEM_METADATA } from '../data/mockData';

export default function ScenarioLabTab() {
  const pilot = IMPLEMENTATION_HORIZONS.pilot;
  
  // State interaktif
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(1); // 0: Konservatif (5%), 1: Dasar (10%), 2: Optimistis (15%)
  const [shelterTempC, setShelterTempC] = useState(26); // Default 26°C
  const [customSites, setCustomSites] = useState(40); // 40 lokasi default

  const currentScenario = pilot.scenarios[selectedScenarioIndex];
  
  // Kalkulasi dinamis berbasis data asli:
  const totalBaselineKWh = customSites * 50000;
  const tempBonusPct = (shelterTempC - 24) * 0.75;
  const effectiveEffPct = currentScenario.efficiencyPct + tempBonusPct;
  
  const dynamicSavedKWh = (totalBaselineKWh * effectiveEffPct) / 100;
  const dynamicGrossSavingIDR = dynamicSavedKWh * SYSTEM_METADATA.electricityTariff;
  const dynamicNetBenefitIDR = dynamicGrossSavingIDR - (customSites === 40 ? pilot.opexYearIDR : (customSites * 1500000));
  const dynamicPaybackYears = (pilot.capexIDR / dynamicNetBenefitIDR);
  const dynamicEmissionsReducedTon = (dynamicSavedKWh * SYSTEM_METADATA.gridEmissionFactor) / 1000;

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
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800">
          <Cpu className="w-3.5 h-3.5 text-indigo-600" />
          <span>Modul 2: Scenario Lab Digital Twin</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Simulasi Skenario Efisiensi Terkoreksi Trafik & Cuaca (Tabel 6)
        </h1>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          Menguji dampak tiga skenario resmi dari naskah proposal (<strong>Konservatif 5%, Dasar 10%, Optimistis 15%</strong>) sebelum rekomendasi intervensi disetujui. Dilengkapi perhitungan matematis <em>NPV 5 Tahun (diskonto 10%)</em> dan <em>Payback Period</em> transparan.
        </p>
      </div>

      {/* Grid: Controls & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pengaturan Skenario */}
        <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-red-600" />
              <span>Pilihan Skenario Proposal (Tabel 6)</span>
            </h2>
          </div>

          {/* 3 Skenario Tab Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700">
              Pilih Skenario Evaluasi:
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

        {/* Right Column: Hasil Kalkulasi Dinamis */}
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
              <span className="text-[10px] text-slate-400 font-medium">CapEx Rp450 Jt</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block font-bold uppercase tracking-wider">Reduksi Scope 2</span>
              <span className="text-xl font-black text-emerald-700 mt-1 block">
                {dynamicEmissionsReducedTon.toFixed(1)} t
              </span>
              <span className="text-[10px] text-slate-400 font-medium">ton CO2e terhindar</span>
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

            <div className="h-60 w-full">
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
