import React, { useState } from 'react';
import { Database, AlertTriangle, CheckCircle2, RefreshCw, Zap, Cpu, Server, ShieldCheck, ArrowRight, FileText } from 'lucide-react';

const RECONCILIATION_SITES = [
  {
    id: 'JKT-SEL-P01',
    name: 'Kebayoran Baru Macro BTS',
    plnKw: 4.12,
    rectifierKw: 3.55,
    ossKw: 3.42,
    hvacEstimateKw: 0.50,
    cableLossEstimateKw: 0.07,
    discrepancyPct: 14.5,
    unaccountedPct: 1.2,
    status: 'NORMAL',
    statusText: 'Rekonsiliasi Seimbang (Dalam Batas Toleransi)'
  },
  {
    id: 'BDG-DGO-P04',
    name: 'Dago Atas Macro Hub',
    plnKw: 3.85,
    rectifierKw: 3.02,
    ossKw: 2.88,
    hvacEstimateKw: 0.38,
    cableLossEstimateKw: 0.05,
    discrepancyPct: 21.5,
    unaccountedPct: 10.4,
    status: 'ANOMALY_LEAKAGE',
    statusText: 'Anomali Terdeteksi: Dugaan Phantom Load / Penurunan Efisiensi AC Shelter'
  },
  {
    id: 'SBY-RKT-C02',
    name: 'Rungkut Industri (Control)',
    plnKw: 5.20,
    rectifierKw: 4.65,
    ossKw: 4.48,
    hvacEstimateKw: 0.52,
    cableLossEstimateKw: 0.09,
    discrepancyPct: 13.8,
    unaccountedPct: 0.8,
    status: 'NORMAL',
    statusText: 'Rekonsiliasi Seimbang (Baseline Valid)'
  }
];

export default function TelemetryReconciliationMatrix({ onOpenOfficialBaRe }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const runReconciliationCheck = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
    }, 800);
  };

  const filtered = filterStatus === 'all' 
    ? RECONCILIATION_SITES 
    : RECONCILIATION_SITES.filter(s => s.status === filterStatus);

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 md:p-6 space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/60 px-2.5 py-0.5 text-[11px] font-bold text-cyan-800 dark:text-cyan-300">
            <Database className="w-3.5 h-3.5" />
            <span>Rekonsiliasi Tiga Arah (3-Way Telemetry Reconciliation)</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Matriks Discrepancy: PLN vs Rectifier DC vs OSS Vendor
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Memverifikasi disparitas antara meteran PLN (AC), output DC Rectifier, dan telemetri radio vendor untuk mendeteksi *phantom load*, penurunan efisiensi pendingin, atau kebocoran daya.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onOpenOfficialBaRe && (
            <button
              onClick={onOpenOfficialBaRe}
              className="inline-flex items-center gap-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white px-3.5 py-2 text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cetak Berita Acara (BA-RE)</span>
            </button>
          )}
          <button
            onClick={runReconciliationCheck}
            disabled={isVerifying}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white px-3.5 py-2 text-xs font-bold transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Memverifikasi...' : 'Uji Rekonsiliasi Real-time'}</span>
          </button>
        </div>
      </div>

      {/* 3-Stream Flow Explanation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>1. Meter Induk PLN (AC Input)</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Data AMR / Billing PLN resmi per jam. Mengukur total daya masuk mencakup AC, rectifier, dan lampu shelter.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20">
          <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-extrabold text-xs">
            <Server className="w-4 h-4 text-indigo-600" />
            <span>2. Smart Rectifier (DC Output)</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Submetering IoT industri Kelas 0.5s di output busbar 48V DC. Memantau daya bersih yang masuk ke rak telekomunikasi.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/50 dark:bg-cyan-950/20">
          <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-300 font-extrabold text-xs">
            <Cpu className="w-4 h-4 text-cyan-600" />
            <span>3. Vendor OSS / EMS (Radio Load)</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            Estimasi daya PA/BBU dari antarmuka O-RAN / Ericsson ENM / Huawei iMaster berdasar utilisasi slot trafik.
          </p>
        </div>
      </div>

      {/* Sites Discrepancy Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            <tr>
              <th className="p-3">ID & Nama Menara BTS</th>
              <th className="p-3">Input PLN (AC)</th>
              <th className="p-3">Rectifier (DC)</th>
              <th className="p-3">OSS Radio</th>
              <th className="p-3">Loss & Beban Parasitik</th>
              <th className="p-3">Status Audit Integritas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((site) => (
              <tr key={site.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-3">
                  <div className="font-mono text-[10px] font-bold text-slate-500">{site.id}</div>
                  <div className="font-extrabold text-slate-900 dark:text-white">{site.name}</div>
                </td>
                <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">{site.plnKw.toFixed(2)} kW</td>
                <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{site.rectifierKw.toFixed(2)} kW</td>
                <td className="p-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">{site.ossKw.toFixed(2)} kW</td>
                <td className="p-3">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {site.discrepancyPct}% Total Discrepancy
                  </div>
                  <div className="text-[10px] text-slate-400">
                    HVAC ~{site.hvacEstimateKw}kW • Kabel ~{site.cableLossEstimateKw}kW
                  </div>
                </td>
                <td className="p-3">
                  {site.status === 'NORMAL' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" /> Rekonsiliasi Klop (&plusmn;{site.unaccountedPct}%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      <AlertTriangle className="w-3 h-3" /> Anomali Kebocoran (+{site.unaccountedPct}%)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
        <span><strong>Toleransi Telkomsel:</strong> Ambang selisih tak tertelusuri maksimal 3,0%. Di atas ambang batas, alarm tiket otomatis diteruskan ke tim Network Operations.</span>
        <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400 font-bold">Standard ITU-T L.1331 Aligned</span>
      </div>
    </section>
  );
}
