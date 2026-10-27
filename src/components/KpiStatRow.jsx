import React from 'react';
import { Database, Leaf, Zap, ClipboardCheck } from 'lucide-react';

const kpis = [
  {
    id: 'electricity',
    title: 'Listrik Telkomsel 2025',
    value: '1.885,4 GWh',
    note: 'Angka korporat dari laporan resmi',
    icon: Zap,
    accentBorder: 'border-l-amber-500 dark:border-l-amber-400',
    iconStyle: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:border dark:border-amber-800/40',
  },
  {
    id: 'scope2',
    title: 'Emisi Scope 2 2025',
    value: '1,722 juta tCO₂e',
    note: '63,6% dari total emisi',
    icon: Leaf,
    accentBorder: 'border-l-emerald-600 dark:border-l-emerald-400',
    iconStyle: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border dark:border-emerald-800/40',
  },
  {
    id: 'pilot',
    title: 'Desain pilot usulan',
    value: '40 + 10 lokasi',
    note: '40 intervensi + 10 pembanding',
    icon: Database,
    accentBorder: 'border-l-sky-600 dark:border-l-sky-400',
    iconStyle: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 dark:border dark:border-sky-800/40',
  },
  {
    id: 'validation',
    title: 'Baseline lokasi',
    value: 'Belum tersedia',
    note: 'Perlu audit meter dan biaya',
    icon: ClipboardCheck,
    accentBorder: 'border-l-[#ED0226] dark:border-l-red-500',
    iconStyle: 'bg-red-50 text-[#ED0226] dark:bg-red-950/40 dark:text-red-400 dark:border dark:border-red-900/40',
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
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 ${className}`}>
      {dynamicKpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={kpi.id} 
            className={`rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 border-l-[3.5px] ${kpi.accentBorder} p-4 sm:p-5 shadow-xs hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 leading-tight">
                {kpi.title}
              </span>
              <div className={`p-1.5 sm:p-2 rounded-xl shrink-0 ${kpi.iconStyle}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {kpi.value}
            </div>
            <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-normal">
              {kpi.note}
            </div>
          </div>
        );
      })}
    </div>
  );
}
