import React, { useMemo } from 'react';
import {
  Radio,
  Cpu,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { deriveSite3gppCarrierProfile } from '../utils/roleBasedWorkspaceEngine';

export default function Site3gppCarrierInspectorPanel({
  site,
  trafficLoadPct = 38,
  optimizationMode = 'autonomous',
  emergencyActive = false,
  isSelectedResolved = false
}) {
  const profile = useMemo(() => {
    return deriveSite3gppCarrierProfile({
      siteId: site?.id || 'BDG-DGO-P04',
      vendor: site?.vendor || 'Ericsson',
      trafficLoadPct,
      optimizationMode,
      emergencyActive
    });
  }, [site?.id, site?.vendor, trafficLoadPct, optimizationMode, emergencyActive]);

  return (
    <section
      aria-label="Inspektur Teknis 3GPP Rel-18 Carrier dan Sub-Carrier Sleep"
      data-testid="site-3gpp-carrier-inspector"
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 space-y-4 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#ED0226]">
            <Cpu className="w-4 h-4" />
            <span>INSPEKSI TEKNIS MENDALAM PER SITE • TELEMETRI 3GPP REL-18 &amp; O-RAN O1</span>
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
            04. Dekomposisi Per-Carrier Radio ({profile.siteId} · {profile.vendor}) &amp; Proteksi Kanal 112
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Status real-time Power Amplifier (PA), utilisasi PRB per frekuensi (900/1800/2100/2300 MHz), dan latensi pemulihan instan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500">Total Daya PA Radio: </span>
            <strong className="text-slate-900 dark:text-white">{profile.totalActiveWatts} W</strong>
            <span className="text-slate-400"> / {profile.totalBaselineWatts} W</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold">
            Efisiensi RF: -{profile.aggregateRfSavingPct}%
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3">Frekuensi &amp; Band 3GPP</th>
              <th className="p-3">Fungsi Lapisan Jaringan</th>
              <th className="p-3 text-right">Lebar Pita</th>
              <th className="p-3 text-right">Utilisasi PRB</th>
              <th className="p-3">Status Carrier Sleep (NETCONF O1)</th>
              <th className="p-3 text-right">Daya PA (Watt)</th>
              <th className="p-3 text-right">Wake-Up SLA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {profile.carriers.map((c) => (
              <tr key={c.band} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#ED0226] shrink-0" />
                  <span>{c.band}</span>
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400">{c.role}</td>
                <td className="p-3 text-right font-mono tabular-nums">{c.bandwidthMhz} MHz</td>
                <td className="p-3 text-right font-mono tabular-nums font-bold text-sky-600 dark:text-sky-400">
                  {c.prbUtilizationPct}%
                </td>
                <td className="p-3">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {c.sleepState}
                  </span>
                </td>
                <td className="p-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                  {c.paPowerWatts} W{' '}
                  {c.savingPct > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">
                      (-{c.savingPct}%)
                    </span>
                  )}
                </td>
                <td className="p-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-bold">
                  {c.wakeUpLatencyMs === 0 ? '0 ms (Anchor)' : `${c.wakeUpLatencyMs} ms`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
        <div className="flex items-center gap-1.5">
          {isSelectedResolved ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
          )}
          <span>
            Status Rekonsiliasi 3-Arah Site <strong>{profile.siteId}</strong>:{' '}
            {isSelectedResolved
              ? 'Terkalibrasi FOP (Deviasi Meter PLN vs Sub-meter DC 0,8% — Siap Klaim BA-RE)'
              : 'Monitoring Aktif O-RAN O1 (Siap Disposisi Kalibrasi FOP jika deviasi > 5%)'}
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">
          3GPP TS 28.310 Energy Efficiency &amp; O-RAN WG10 O1 Interface
        </span>
      </div>
    </section>
  );
}
