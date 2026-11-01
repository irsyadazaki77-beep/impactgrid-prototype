import React from 'react';
import { Database, TrendingUp, Info, Calculator } from 'lucide-react';

/**
 * DataBadge:
 * Visually categorizes data provenance across the prototype:
 * - 'verified': Reserved for evidence validated by an accountable data owner
 * - 'projection': Sensitivity results calculated from explicitly stated assumptions
 * - 'PARAMETRIC_PROJECTION': Calculated What-If sandbox outputs from corporate baseline
 * - 'synthetic': Local demonstration values, not operational data
 */
export default function DataBadge({ type = 'synthetic', className = '' }) {
  if (type === 'PARAMETRIC_PROJECTION') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-800 shadow-2xs ${className}`}
        title="Simulasi Parametrik (What-If): Dihitung secara deterministik dari formula sensitivitas terhadap baseline resmi 2025 (1,88 TWh & 1,72 Juta Ton CO2e Telkomsel)"
      >
        <Calculator className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
        <span>Simulasi Parametrik (What-If)</span>
      </span>
    );
  }

  if (type === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200/90 shadow-2xs ${className}`}
        title="Terverifikasi dengan baseline operasional Telkomsel Sustainability Report & AMR PLN"
      >
        <Info className="w-3 h-3 text-emerald-700" />
        <span>Terverifikasi Baseline</span>
      </span>
    );
  }

  if (type === 'projection') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200/90 shadow-2xs ${className}`}
        title="Proyeksi sensitivitas berbasis parameter operasional SNOC"
      >
        <TrendingUp className="w-3 h-3 text-blue-600" />
        <span>Proyeksi Parameter SNOC</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200/90 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 shadow-2xs ${className}`}
      title="Baseline model operasi kluster SNOC Telkomsel"
    >
      <Database className="w-3 h-3 text-slate-600 dark:text-slate-400" />
      <span>Baseline Model SNOC</span>
    </span>
  );
}
