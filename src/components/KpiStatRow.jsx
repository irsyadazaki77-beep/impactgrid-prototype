import React from 'react';
import { Database, Leaf, Zap, ClipboardCheck } from 'lucide-react';

const kpis = [
  {
    id: 'electricity',
    title: 'Listrik Telkomsel 2025',
    value: '1.885,4 GWh',
    tag: 'TLKM-SR2025',
    note: 'Angka korporat dari laporan resmi',
    icon: Zap,
    topGradient: 'from-amber-500 to-amber-600',
    iconStyle: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20',
  },
  {
    id: 'scope2',
    title: 'Emisi Scope 2 2025',
    value: '1,722 juta tCO₂e',
    tag: '63,6% Emisi',
    note: '63,6% dari total emisi Telkomsel',
    icon: Leaf,
    topGradient: 'from-emerald-500 to-teal-600',
    iconStyle: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20',
  },
  {
    id: 'pilot',
    title: 'Desain Pilot Usulan',
    value: '40 + 10 lokasi',
    tag: 'DiD Kausal',
    note: '40 intervensi + 10 pembanding',
    icon: Database,
    topGradient: 'from-sky-500 to-blue-600',
    iconStyle: 'bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20',
  },
  {
    id: 'validation',
    title: 'Baseline Lokasi',
    value: 'Belum tersedia',
    tag: 'Audit Rp95 Jt',
    note: 'Perlu audit meter dan biaya',
    icon: ClipboardCheck,
    topGradient: 'from-[#ED0226] to-rose-600',
    iconStyle: 'bg-red-500/10 text-[#ED0226] dark:bg-red-500/20 dark:text-red-400 border border-red-500/20',
  },
];

export default function KpiStatRow({ selectedScale = 'pilot', className = '' }) {
  const scaleInfo = {
    pilot: { value: '40 + 10 lokasi', note: '40 intervensi + 10 pembanding' },
    regional: { value: '5.000 lokasi', note: 'Prioritas Kluster Jamali (H2)' },
    national: { value: '10.000+ lokasi', note: 'Perluasan makro nasional (H3)' }
  }[selectedScale] || { value: '40 + 10 lokasi', note: '40 intervensi + 10 pembanding' };

  const dynamicKpis = [
    kpis[0],
    kpis[1],
    {
      ...kpis[2],
      value: scaleInfo.value,
      note: scaleInfo.note,
    },
    kpis[3]
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6 ${className}`}>
      {dynamicKpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={kpi.id} 
            className="card-interactive group relative rounded-2xl bg-white dark:bg-[#0B1324] border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden"
          >
            {/* Sleek Top Line Accent */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${kpi.topGradient} opacity-80 group-hover:opacity-100 transition-opacity`} />

            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-tight">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-xl shrink-0 ${kpi.iconStyle}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline justify-between gap-2">
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white tracking-tight tabular-nums">
                {kpi.value}
              </div>
              {kpi.tag && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                  {kpi.tag}
                </span>
              )}
            </div>

            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-normal">
              {kpi.note}
            </div>
          </div>
        );
      })}
    </div>
  );
}
