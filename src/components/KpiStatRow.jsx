import React from 'react';
import { Database, Leaf, Zap, ClipboardCheck } from 'lucide-react';

const kpis = [
  {
    id: 'electricity',
    title: 'Listrik Telkomsel 2025',
    value: '1.885,4 GWh',
    note: 'Angka korporat dari laporan resmi',
    icon: Zap,
    accent: 'border-l-amber-500',
    iconStyle: 'bg-amber-50 text-amber-700',
  },
  {
    id: 'scope2',
    title: 'Emisi Scope 2 2025',
    value: '1,722 juta tCO₂e',
    note: '63,6% dari total emisi',
    icon: Leaf,
    accent: 'border-l-emerald-600',
    iconStyle: 'bg-emerald-50 text-emerald-700',
  },
  {
    id: 'pilot',
    title: 'Desain pilot usulan',
    value: '40 + 10 lokasi',
    note: '40 intervensi + 10 pembanding',
    icon: Database,
    accent: 'border-l-sky-600',
    iconStyle: 'bg-sky-50 text-sky-800',
  },
  {
    id: 'validation',
    title: 'Baseline lokasi',
    value: 'Belum tersedia',
    note: 'Perlu audit meter dan biaya',
    icon: ClipboardCheck,
    accent: 'border-l-rose-600',
    iconStyle: 'bg-rose-50 text-rose-700',
  },
];

export default function KpiStatRow({ className = '' }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 ${className}`}>
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.id} className={`rounded-2xl bg-white border border-slate-200 border-l-4 ${kpi.accent} p-4 sm:p-5 shadow-sm`}>
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold text-slate-600">{kpi.title}</span>
              <div className={`p-1.5 rounded-lg ${kpi.iconStyle}`}><Icon className="w-4 h-4" /></div>
            </div>
            <div className="mt-2 text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
            <div className="mt-2 text-xs text-slate-600">{kpi.note}</div>
          </div>
        );
      })}
    </div>
  );
}
