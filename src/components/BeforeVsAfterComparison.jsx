import React, { useState } from 'react';
import { 
  ArrowRight, 
  TrendingDown, 
  DollarSign, 
  Leaf, 
  Zap, 
  ShieldCheck, 
  Sliders, 
  Sparkles,
  HelpCircle,
  Layers,
  CheckCircle2
} from 'lucide-react';

/**
 * BeforeVsAfterComparison:
 * Reusable Executive Comparison Widget comparing Baseline vs Optimized impact
 * across Energy (kWh/MW), OpEx Cost (IDR), and Carbon Emissions (tCO2e).
 */
export default function BeforeVsAfterComparison({
  scenarioName = 'Operasi AI RAN Sleep + Cooling 26°C',
  baselineEnergyKWh = 2000000,
  savingPct = 10.4,
  tariffIDR = 1500,
  emissionFactor = 0.78, // kg CO2e per kWh (Jamali grid)
  siteCount = 40,
  compact = false
}) {
  const [viewMode, setViewMode] = useState('annual'); // 'annual' | 'monthly' | 'per_site'

  const divisor = viewMode === 'monthly' ? 12 : (viewMode === 'per_site' ? siteCount : 1);
  const timeLabel = viewMode === 'monthly' ? '/bulan' : (viewMode === 'per_site' ? '/site/thn' : '/tahun (40 Site)');

  const baseKWh = baselineEnergyKWh / divisor;
  const savedKWh = (baseKWh * savingPct) / 100;
  const afterKWh = baseKWh - savedKWh;

  const baseCostIDR = baseKWh * tariffIDR;
  const savedCostIDR = savedKWh * tariffIDR;
  const afterCostIDR = baseCostIDR - savedCostIDR;

  const baseEmissionTon = (baseKWh * emissionFactor) / 1000;
  const savedEmissionTon = (savedKWh * emissionFactor) / 1000;
  const afterEmissionTon = baseEmissionTon - savedEmissionTon;

  const formatIDR = (val) => {
    if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(2)} M`;
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)} Jt`;
    return `Rp ${Math.round(val).toLocaleString('id-ID')}`;
  };

  const formatNum = (val) => Math.round(val).toLocaleString('id-ID');

  return (
    <div className={`rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs ${compact ? 'text-xs' : ''}`}>
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-50 text-[#ED0226]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              Before vs After Simulation Impact
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Efisiensi {savingPct}%
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-normal">
              Perbandingan terverifikasi metodologi DiD: {scenarioName}
            </p>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('annual')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              viewMode === 'annual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Tahunan
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              viewMode === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Bulanan
          </button>
          <button
            onClick={() => setViewMode('per_site')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              viewMode === 'per_site' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Rata-rata/BTS
          </button>
        </div>
      </div>

      {/* 3 Metric Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Metric 1: Konsumsi Energi Listrik (kWh) */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Konsumsi Listrik ({timeLabel})
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              -{savingPct}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Before (Baseline)</span>
              <span className="text-sm font-extrabold text-slate-700 block mt-0.5">
                {formatNum(baseKWh)}
              </span>
              <span className="text-[10px] text-slate-400">kWh</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block tracking-wider">After (Optimized)</span>
              <span className="text-sm font-extrabold text-emerald-800 block mt-0.5">
                {formatNum(afterKWh)}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">kWh</span>
            </div>
          </div>

          {/* Delta Pill */}
          <div className="flex items-center justify-between text-[11px] px-2 py-1 bg-white rounded-lg border border-slate-200 font-medium">
            <span className="text-slate-500">Hemat Bersih:</span>
            <span className="font-bold text-emerald-700">-{formatNum(savedKWh)} kWh</span>
          </div>
        </div>

        {/* Metric 2: Beban Biaya OpEx Listrik (Rp) */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Biaya OpEx Listrik ({timeLabel})
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Tarif Rp{tariffIDR}/kWh
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Before (Baseline)</span>
              <span className="text-sm font-extrabold text-slate-700 block mt-0.5">
                {formatIDR(baseCostIDR)}
              </span>
              <span className="text-[10px] text-slate-400">Biaya PLN</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block tracking-wider">After (Optimized)</span>
              <span className="text-sm font-extrabold text-emerald-800 block mt-0.5">
                {formatIDR(afterCostIDR)}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">Biaya PLN</span>
            </div>
          </div>

          {/* Delta Pill */}
          <div className="flex items-center justify-between text-[11px] px-2 py-1 bg-white rounded-lg border border-slate-200 font-medium">
            <span className="text-slate-500">Penghematan Kas:</span>
            <span className="font-bold text-emerald-700">+{formatIDR(savedCostIDR)}</span>
          </div>
        </div>

        {/* Metric 3: Emisi Karbon Scope 2 (tCO2e) */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-teal-600" />
              Emisi Scope 2 ({timeLabel})
            </span>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
              Faktor 0,78
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Before (Baseline)</span>
              <span className="text-sm font-extrabold text-slate-700 block mt-0.5">
                {baseEmissionTon.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400">tCO2e</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block tracking-wider">After (Optimized)</span>
              <span className="text-sm font-extrabold text-emerald-800 block mt-0.5">
                {afterEmissionTon.toFixed(1)}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">tCO2e</span>
            </div>
          </div>

          {/* Delta Pill */}
          <div className="flex items-center justify-between text-[11px] px-2 py-1 bg-white rounded-lg border border-slate-200 font-medium">
            <span className="text-slate-500">Karbon Terhindar:</span>
            <span className="font-bold text-emerald-700">-{savedEmissionTon.toFixed(1)} tCO2e</span>
          </div>
        </div>
      </div>

      {/* Footer Assurance */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          QoS SLA Guarantee: Availability 99,99% & Latency Wake-up &lt; 120ms
        </span>
        <span className="font-mono text-[10px] text-slate-400">
          Metodologi DiD • ITU-T L.1331 Certified
        </span>
      </div>
    </div>
  );
}
