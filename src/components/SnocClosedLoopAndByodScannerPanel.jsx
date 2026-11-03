import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Wrench,
  Radio,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Zap,
  Activity
} from 'lucide-react';
import { scanByodTelemetryAnomalies } from '../utils/roleBasedWorkspaceEngine';

export default function SnocClosedLoopAndByodScannerPanel({
  operationalState,
  resolvedSites = [],
  onResolveSiteAnomaly,
  onBatchResolveAnomalies,
  onDispatchOranPolicy,
  onOpenOfficialBaRe,
  onOpenFieldConsole,
  onOpenSapVoucher
}) {
  const [driftThresholdPct, setDriftThresholdPct] = useState(5.0);
  const [tempThresholdC, setTempThresholdC] = useState(31.0);
  const [vipGuardActive, setVipGuardActive] = useState(true);
  const [emergency112GuardActive, setEmergency112GuardActive] = useState(false);
  const [actionStatusBanner, setActionStatusBanner] = useState(null);

  const scanResult = useMemo(() => {
    const baseResult = scanByodTelemetryAnomalies([], {
      maxBillingDriftPct: driftThresholdPct,
      maxShelterTempC: tempThresholdC
    });

    // Reflect resolved sites in real-time
    const updatedRecords = baseResult.records.map((rec) => {
      if (resolvedSites.includes(rec.siteId)) {
        return {
          ...rec,
          driftPct: 0.8,
          shelterTempC: 26.2,
          isAnomaly: false,
          severity: 'NOMINAL',
          rootCause: 'Terkalibrasi FOP · Filter AC Bersih & CT-Clamp Klop (< 1,5%)',
          recommendedFopAction: 'Selesai: BA-RE PLN & Jurnal SAP S/4HANA Telah Terbit',
          estimatedMonthlyLeakageIdr: 0
        };
      }
      return rec;
    });

    const activeAnomalies = updatedRecords.filter((r) => r.isAnomaly);
    return {
      totalScanned: updatedRecords.length,
      anomalyCount: activeAnomalies.length,
      nominalCount: updatedRecords.length - activeAnomalies.length,
      totalMonthlyLeakageIdr: activeAnomalies.reduce((sum, r) => sum + r.estimatedMonthlyLeakageIdr, 0),
      records: updatedRecords
    };
  }, [operationalState?.sites, driftThresholdPct, tempThresholdC, resolvedSites]);

  const handleExecuteClosedLoopSite = (site) => {
    if (onResolveSiteAnomaly) {
      onResolveSiteAnomaly(site.siteId);
    }
    if (onDispatchOranPolicy) {
      void onDispatchOranPolicy({
        siteId: site.siteId,
        mode: emergency112GuardActive ? 'EMERGENCY_112_FULL_POWER' : 'CLOSED_LOOP_FOP_ORAN_SYNC',
        targetTempC: 26.0
      });
    }
    setActionStatusBanner(
      `Siklus Closed-Loop dieksekusi untuk ${site.siteId}: Tiket e-WO FOP selesai, kebijakan NETCONF O-RAN O1 (${site.vendor}) dikirim, dan klaim BA-RE PLN disinkronkan.`
    );
  };

  const handleToggleEmergency112 = () => {
    const next = !emergency112GuardActive;
    setEmergency112GuardActive(next);
    if (onDispatchOranPolicy) {
      void onDispatchOranPolicy({
        cluster: 'JAMALI-PILOT-50',
        mode: next ? 'EMERGENCY_112_OVERRIDE_ALL_ON' : 'ADAPTIVE_CARRIER_SLEEP_O1',
        targetTempC: 26.0
      });
    }
    setActionStatusBanner(
      next
        ? 'MODE SIAGA DARURAT 112 AKTIF: Seluruh Carrier Sleep dibatalkan dalam 28ms. 100% PRB dialokasikan untuk trafik darurat.'
        : 'Mode Siaga Darurat 112 dinonaktifkan: Orkestrasi hemat energi O-RAN 3GPP Rel-18 kembali berjalan normal.'
    );
  };

  return (
    <section
      aria-label="Konsol Closed-Loop SNOC, Pemindai Anomali BYOD dan Guardrail 112"
      data-testid="snoc-closed-loop-byod-scanner"
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 space-y-5 shadow-xs"
    >
      {/* Top Header & VIP / 112 Guardrail Switches */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ED0226]">
            <Activity className="w-4 h-4" />
            <span>ALUR KERJA END-TO-END SNOC &rarr; TIKET e-WO FOP &rarr; NETCONF O-RAN O1</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Detektor Anomali Meteran PLN Otomatis (BYOD Scanner) &amp; Guardrail Trafik VIP / 112
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mendeteksi deviasi tagihan AMR PLN vs Sub-meter DC shelter secara otomatis, melindungi trafik VIP/112, dan mengeksekusi perbaikan tertutup satu klik.
          </p>
        </div>

        {/* Emergency 112 & VIP Traffic Guard Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setVipGuardActive((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              vipGuardActive
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>VIP Traffic Guard: {vipGuardActive ? 'AKTIF (PRB < 60%)' : 'NONAKTIF'}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleEmergency112}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              emergency112GuardActive
                ? 'bg-red-600 text-white border-red-700 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 text-white border-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>{emergency112GuardActive ? 'Override Darurat 112: AKTIF (100% Daya)' : 'Aktifkan Siaga Bencana 112'}</span>
          </button>
        </div>
      </div>

      {actionStatusBanner && (
        <div
          role="status"
          className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex flex-wrap items-center justify-between gap-2"
        >
          <span>{actionStatusBanner}</span>
          <div className="flex items-center gap-3">
            {onOpenOfficialBaRe && (
              <button type="button" onClick={onOpenOfficialBaRe} className="underline font-black cursor-pointer">
                Buka BA-RE PLN
              </button>
            )}
            {onOpenSapVoucher && (
              <button type="button" onClick={onOpenSapVoucher} className="underline font-black cursor-pointer">
                Lihat Jurnal SAP
              </button>
            )}
          </div>
        </div>
      )}

      {/* Threshold Controls & Summary Bar */}
      <div className="grid gap-4 md:grid-cols-4 items-center">
        <label className="space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="flex justify-between">
            <span>Ambang Selisih Tagihan PLN</span>
            <span className="font-mono tabular-nums font-bold text-[#ED0226]">&gt; {driftThresholdPct.toFixed(1)}%</span>
          </span>
          <input
            type="range"
            min="2.0"
            max="12.0"
            step="0.5"
            value={driftThresholdPct}
            onChange={(e) => setDriftThresholdPct(Number(e.target.value))}
            className="w-full accent-[#ED0226] cursor-pointer"
          />
        </label>

        <label className="space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="flex justify-between">
            <span>Ambang Suhu Shelter Kritis</span>
            <span className="font-mono tabular-nums font-bold text-amber-600">&gt; {tempThresholdC.toFixed(1)}°C</span>
          </span>
          <input
            type="range"
            min="28.0"
            max="35.0"
            step="0.5"
            value={tempThresholdC}
            onChange={(e) => setTempThresholdC(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </label>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="text-[11px] text-slate-500">Temuan Anomali Aktif</div>
          <div className="mt-1 text-base font-black font-mono tabular-nums text-slate-900 dark:text-white">
            {scanResult.anomalyCount} dari {scanResult.totalScanned} Site
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono tabular-nums">
            Potensi Kebocoran: Rp {scanResult.totalMonthlyLeakageIdr.toLocaleString('id-ID')}/bln
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {onBatchResolveAnomalies && (
            <button
              type="button"
              onClick={() => {
                const targets = scanResult.records.filter((r) => r.isAnomaly).map((r) => r.siteId);
                onBatchResolveAnomalies(targets.length > 0 ? targets : ['BDG-DGO-P04', 'JKT-SEL-P03', 'BKS-MET-P06']);
                setActionStatusBanner('Seluruh anomali berhasil dikalibrasi secara massal (Batch FOP + NETCONF O-RAN).');
              }}
              className="w-full px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              Selesaikan Semua Anomali (Batch FOP)
            </button>
          )}
          {onOpenFieldConsole && (
            <button
              type="button"
              onClick={onOpenFieldConsole}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 text-xs font-bold text-slate-800 dark:text-slate-200 transition cursor-pointer"
            >
              Buka Konsol Mobile Teknisi FOP
            </button>
          )}
        </div>
      </div>

      {/* Anomaly Detection & Closed-Loop Dispatch Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3">Site ID &amp; Regional</th>
              <th className="p-3 text-right">Meter PLN vs Sub-Meter DC</th>
              <th className="p-3 text-right">Deviasi / Suhu</th>
              <th className="p-3">Diagnosis Akar Masalah &amp; Rekomendasi</th>
              <th className="p-3 text-right">Tindakan Closed-Loop SNOC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {scanResult.records.map((site) => (
              <tr key={site.siteId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="p-3">
                  <div className="font-mono font-bold text-slate-900 dark:text-white">{site.siteId}</div>
                  <div className="text-[11px] text-slate-500">
                    {site.siteName} · {site.vendor}
                  </div>
                </td>
                <td className="p-3 text-right font-mono tabular-nums">
                  <div className="font-bold text-slate-900 dark:text-white">{site.plnKwh} kWh</div>
                  <div className="text-[11px] text-slate-500">Sub-meter: {site.dcSubmeterKwh} kWh</div>
                </td>
                <td className="p-3 text-right font-mono tabular-nums">
                  <div className={site.isAnomaly ? 'font-bold text-rose-600 dark:text-rose-400' : 'font-bold text-emerald-600'}>
                    {site.driftPct > 0 ? `+${site.driftPct}%` : `${site.driftPct}%`}
                  </div>
                  <div className="text-[11px] text-slate-500">{site.shelterTempC}°C · PRB {site.prbLoadPct}%</div>
                </td>
                <td className="p-3">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {site.isAnomaly ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span>{site.rootCause}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{site.recommendedFopAction}</div>
                </td>
                <td className="p-3 text-right">
                  {site.isAnomaly ? (
                    <button
                      type="button"
                      onClick={() => handleExecuteClosedLoopSite(site)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer whitespace-nowrap"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Kirim Tiket FOP &amp; NETCONF</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenOfficialBaRe}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition cursor-pointer whitespace-nowrap"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Terverifikasi · Lihat BA-RE</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
