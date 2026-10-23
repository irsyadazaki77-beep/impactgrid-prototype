import React from 'react';
import { 
  TrendingUp, 
  Zap, 
  Leaf, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';

/**
 * Reusable KPI Stat Banner across all executive & operational tabs.
 * Standardizes 4 mission-critical business impact metrics:
 * 1. Total OPEX Saved (Rp Miliar)
 * 2. Energy Cut (MWh / % efisiensi)
 * 3. Carbon Abated (Ton CO2e)
 * 4. Network SLA Reliability (99.9x%)
 */
export default function KpiStatRow({ 
  simState = { simHour: 14, tempC: 28, trafficMultiplier: 1.0, carrierSleepActive: true },
  selectedScale = 'pilot',
  className = ""
}) {
  // Dynamic scaling multipliers
  const scaleMultiplier = selectedScale === 'national' ? 250 : selectedScale === 'regional' ? 125 : 1;
  const sleepFactor = simState?.carrierSleepActive ? 1.0 : 0.45;
  const emergencyFactor = simState?.emergencyActive ? 0.8 : 1.0;

  // Real-time calculated KPIs with responsive feedback to simulation state
  const opexSavedIDR = ((1.42 * scaleMultiplier * sleepFactor * emergencyFactor)).toFixed(2);
  const energyCutMWh = ((48.7 * (scaleMultiplier / 10) * sleepFactor)).toFixed(1);
  const energyEfficiencyPct = simState?.carrierSleepActive ? '15.4%' : '6.2%';
  const carbonAbatedTons = ((157.2 * (scaleMultiplier / 10) * sleepFactor)).toFixed(1);
  const slaReliability = simState?.emergencyActive ? '99.98%' : '99.99%';

  const kpis = [
    {
      id: 'opex',
      title: 'Total OPEX Saved',
      value: `Rp ${opexSavedIDR} M`,
      change: '+14.8% vs Baseline',
      changePositive: true,
      subtext: selectedScale === 'national' ? 'Proyeksi Nasional (10k+ BTS)' : selectedScale === 'regional' ? 'Regional (5k BTS)' : 'Target Pilot (40 Sites)',
      icon: TrendingUp,
      accentColor: 'border-l-rose-600',
      iconBg: 'bg-rose-500/15 text-rose-400',
      glow: 'group-hover:border-rose-500/40'
    },
    {
      id: 'energy',
      title: 'Energy Cut',
      value: `${energyCutMWh} MWh`,
      change: `${energyEfficiencyPct} efisiensi`,
      changePositive: true,
      subtext: 'Carrier Sleep 3GPP & HVAC Inverter',
      icon: Zap,
      accentColor: 'border-l-amber-500',
      iconBg: 'bg-amber-500/15 text-amber-400',
      glow: 'group-hover:border-amber-500/40'
    },
    {
      id: 'carbon',
      title: 'Carbon Abated',
      value: `${carbonAbatedTons} Ton`,
      change: 'Emisi Scope 2',
      changePositive: true,
      subtext: 'Faktor Emisi Jamali 0,78 kg/kWh',
      icon: Leaf,
      accentColor: 'border-l-emerald-500',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      glow: 'group-hover:border-emerald-500/40'
    },
    {
      id: 'sla',
      title: 'Network SLA Reliability',
      value: slaReliability,
      change: 'Zero Drop Calls',
      changePositive: true,
      subtext: 'Kanal Darurat 112 Hard-Locked',
      icon: ShieldCheck,
      accentColor: 'border-l-cyan-500',
      iconBg: 'bg-cyan-500/15 text-cyan-400',
      glow: 'group-hover:border-cyan-500/40'
    }
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 ${className}`}>
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={kpi.id}
            className={`group relative rounded-2xl bg-slate-900/90 border border-slate-800 border-l-4 ${kpi.accentColor} p-3.5 sm:p-4 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-slate-900 hover:border-slate-700`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {kpi.title}
              </span>
              <div className={`p-1.5 rounded-lg ${kpi.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {kpi.value}
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {kpi.change}
              </span>
              <span className="text-slate-400 text-[10px] truncate max-w-[110px]" title={kpi.subtext}>
                {kpi.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
