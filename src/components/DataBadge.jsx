import React from 'react';
import { Database, TrendingUp, CheckCircle2, Info } from 'lucide-react';

/**
 * DataBadge:
 * Visually categorizes data provenance across the prototype:
 * - 'verified': Hasil Terverifikasi Lapangan (Audit-Ready, DiD, Smart Meter PLN)
 * - 'projection': Proyeksi Model Matematis (Monte Carlo, 5-Year WACC, What-If)
 * - 'synthetic': Data Sintetis Terkalibrasi (Sampel 40 BTS, Standar 3GPP Rel 18)
 */
export default function DataBadge({ type = 'verified', className = '' }) {
  if (type === 'verified') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs ${className}`} title="Hasil terverifikasi berdasarkan data pengukuran empiris telemetri & uji DiD">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        <span>Terverifikasi Empiris</span>
      </span>
    );
  }

  if (type === 'projection') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200/90 shadow-2xs ${className}`} title="Proyeksi model probabilistik / finansial berbasis simulasi numerik">
        <TrendingUp className="w-3 h-3 text-blue-600" />
        <span>Proyeksi Model</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200/90 shadow-2xs ${className}`} title="Data sampel sintetis terkalibrasi parameter teknis riil Telkomsel">
      <Database className="w-3 h-3 text-purple-600" />
      <span>Data Sintetis Terkalibrasi</span>
    </span>
  );
}
