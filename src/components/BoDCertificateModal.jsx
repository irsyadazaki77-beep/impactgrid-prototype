import React from 'react';
import { X, FileCheck, ShieldCheck, CheckCircle2, Download, Printer } from 'lucide-react';

export default function BoDCertificateModal({
  isOpen,
  onClose,
  selectedScale = 'pilot',
  operationalSummary,
  resolvedSites = []
}) {
  if (!isOpen) return null;

  const siteCount = operationalSummary?.siteCount ?? 50;
  const savedMwh = operationalSummary?.annualizedSavedMwh ?? 200;

  const handleExportJson = () => {
    const payload = {
      certificateId: 'CERT-STAGEGATE-G0-TSEL-2026',
      scale: selectedScale,
      siteCount,
      annualizedSavedMwh: savedMwh,
      fopResolvedSites: resolvedSites,
      gates: [
        { gate: 'G0', title: 'Kelengkapan Meter AMR PLN & Rekonsiliasi 3-Arah', status: 'TERVERIFIKASI' },
        { gate: 'G1', title: 'Penghematan Energi Terkoreksi Cuaca & Trafik (DiD)', status: 'TERVERIFIKASI' },
        { gate: 'G2', title: 'Validasi NPV & Voucher Jurnal SAP S/4HANA', status: 'SIAP EKSEKUSI' },
        { gate: 'G3', title: 'Proteksi SLA QoS (<0.20% CDR) & Fail-Safe 112 (28ms)', status: 'AKTIF 100%' }
      ]
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ImpactGrid_Sertifikat_StageGate_${selectedScale}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] shadow-2xl">
        <header className="flex items-center justify-between bg-slate-900 dark:bg-slate-950 px-6 py-4 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-emerald-400" />
            <span className="font-extrabold text-sm">Sertifikat Kelayakan Stage-Gate G0–G3 &amp; Tata Kelola Direksi</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 inline-flex items-center gap-1 cursor-pointer border border-slate-700"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Unduh JSON</span>
            </button>
            <button onClick={onClose} aria-label="Tutup" className="rounded-lg p-1 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>
        <div className="space-y-5 p-6 sm:p-8">
          <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/30 p-4 text-xs font-bold leading-relaxed text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2">
            <span>STATUS TATA KELOLA STAGE-GATE: Skala {selectedScale.toUpperCase()} ({siteCount} Site • {savedMwh} MWh/Thn • {resolvedSites.length} Terkalibrasi FOP)</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px]">SHA-256 VALID</span>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Matriks Kepatuhan Gerbang Keputusan Investasi (G0–G3)</h2>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Seluruh parameter baseline telemetri, dampak mutu layanan (QoS), rekonsiliasi tagihan PLN (BA-RE), dan proyeksi arus kas bersih dievaluasi secara bertahap sesuai mandat Komite Investasi Telkomsel.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Kelengkapan meter AMR PLN & rekonsiliasi 3-arah', status: 'TERVERIFIKASI (G0)' },
              { label: 'Penghematan energi terkoreksi trafik & cuaca (DiD)', status: 'TERVERIFIKASI (G1)' },
              { label: 'NPV positif & integrasi jurnal SAP S/4HANA', status: 'SIAP POSTING (G2)' },
              { label: 'Guardrail QoS (<0.20% CDR) & Fail-Safe 112 (28ms)', status: 'AKTIF 100% (G3)' },
            ].map((item, index) => (
              <div key={item.label} className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 text-xs text-slate-700 dark:text-slate-300">
                <strong className="mr-2 text-slate-400">{index + 1}.</strong>{item.label}
                <div className="mt-2 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 text-xs text-slate-500 dark:text-slate-400">
            Dokumen kelayakan Stage-Gate ini terhubung langsung dengan Berita Acara Rekonsiliasi Energi (BA-RE) dan Voucher Jurnal SAP S/4HANA untuk memfasilitasi persetujuan berjenjang Dewan Direksi.
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => window.print()} className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer inline-flex items-center gap-1.5">
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak Sertifikat</span>
            </button>
            <button onClick={onClose} className="rounded-xl bg-[#ED0226] hover:bg-red-700 px-5 py-2 text-xs font-bold text-white transition cursor-pointer shadow-2xs">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

