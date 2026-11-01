import React, { useState } from 'react';
import {
  ClipboardCheck,
  Database,
  CircleDollarSign,
  Activity,
  Leaf,
  FileText,
  FileSearch,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Zap
} from 'lucide-react';
import EvidenceExplorerModal from './EvidenceExplorerModal';
import DifferenceInDifferencesVisualizer from './DifferenceInDifferencesVisualizer';
import { calculateHourTelemetry } from './GlobalSimulationBar';

const operationalValidations = [
  {
    title: 'Baseline Energi & Kualitas Data AMR',
    icon: Database,
    evidence: 'Rekonsiliasi otomatis interval 15-menit meter AMR PLN, rectifier DC, dan OSS RF untuk 40 site intervensi + 10 kontrol.',
    decision: 'Baseline diverifikasi stabil pada 50 kWh/hari/site dengan toleransi kebocoran phantom load < 5%.',
    status: 'Tervalidasi (Baseline AMR PLN Siap)',
    statusColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
  },
  {
    title: 'Atribusi Penghematan Kausal (DiD)',
    icon: Activity,
    evidence: 'Model ekonometrika Difference-in-Differences membandingkan 40 site intervensi vs 10 site kontrol sintetik.',
    decision: 'Efek perlakuan terisolasi dari fluktuasi cuaca CDD dan trafik libur nasional (ΔΔ = -8,4% s/d -14,8%, p < 0,001).',
    status: 'Model Kausal Aktif (Parallel Trend p=0.42)',
    statusColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
  },
  {
    title: 'Biaya & Realisasi Finansial TowerCo',
    icon: CircleDollarSign,
    evidence: 'Pemetaan kontrak sewa menara Mitratel & Protelindo skema pass-through biaya listrik aktual (85/15).',
    decision: 'Penghematan kWh langsung memotong tagihan bulanan operator tanpa tertahan di biaya sewa tetap.',
    status: 'Dikalibrasi (Pass-Through 85% Disahkan)',
    statusColor: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800'
  },
  {
    title: 'Mutu Layanan (QoS) & SLA Guardrail',
    icon: ClipboardCheck,
    evidence: 'Pemantauan metrik 3GPP: Radio Availability >= 99.9%, Throughput p10 degradation <= -2%, Call Drop Rate.',
    decision: 'Auto-rollback otomatis aktif dalam 28ms jika utilisasi PRB melonjak di atas 70% selama carrier sleep.',
    status: 'SLA Guardrail Aktif (Auto-Rollback 28ms)',
    statusColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
  },
  {
    title: 'Inventarisasi Emisi Scope 2 (ESDM Jamali)',
    icon: Leaf,
    evidence: 'Faktor emisi resmi ESDM sistem Jawa-Madura-Bali (0,87 kgCO₂e/kWh) dengan pencatatan ledger SHA-256.',
    decision: 'Memenuhi standar IFRS S2 dan ISO 14064-1 untuk pelaporan keberlanjutan tahunan Telkomsel.',
    status: 'Standar ESDM Jamali & IFRS S2',
    statusColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
  }
];

export default function PilotValidationCenterTab({
  onOpenReportModal,
  onOpenOfficialBaRe,
  onOpenSapVoucher,
  simState,
  operationalSummary,
  resolvedSites = [],
  onResolveSiteAnomaly,
  onBatchResolveAnomalies
}) {
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  const currentHour = typeof simState?.simHour === 'number' ? simState.simHour : 14;
  const currentScenario = simState?.scenarioKey || 'normal';
  const hourTelemetry = calculateHourTelemetry(currentHour, currentScenario);
  const activeSitesCount = operationalSummary?.activeSitesCount || 50;
  const calibratedCount = resolvedSites.length;

  return (
    <div className="space-y-6">
      <section id="pitch-step-5-pilotvalidation" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 space-y-5 shadow-xs scroll-mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>VALIDASI OPERASIONAL {activeSitesCount} SITE PILOT • KEPATUHAN QOS &amp; DID</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
            <span>Jam Operasional: <strong>{String(currentHour).padStart(2, '0')}:00 WIB</strong></span>
            <span>·</span>
            <span>Beban RAN: <strong className="text-emerald-600 dark:text-emerald-400 tabular-nums">{hourTelemetry.activeKw} kW (-{hourTelemetry.savingPct}%)</strong></span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Pusat Validasi Operasional &amp; Evaluasi Kinerja Lapangan (Pilot)
          </h1>
          <p className="max-w-4xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Evaluasi kausal berbasis Difference-in-Differences (DiD), kepatuhan guardrail QoS standar 3GPP, pemantauan telemetri auto-rollback 28ms, dan rekonsiliasi data konsumsi energi untuk kluster pilot Jawa Barat &amp; Banten.
          </p>
        </div>

        {/* Live Synchronized Operational Bar */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5">
            <div className="text-[11px] font-bold uppercase text-slate-500">Populasi Pilot Aktif</div>
            <div className="mt-1 text-lg font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {activeSitesCount} Site (40+10)
            </div>
            <div className="text-[11px] text-slate-500">40 Intervensi vs 10 Kontrol</div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5">
            <div className="text-[11px] font-bold uppercase text-slate-500">Efisiensi Jam {String(currentHour).padStart(2, '0')}:00</div>
            <div className="mt-1 text-lg font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              -{hourTelemetry.savingPct}% ({hourTelemetry.savedKw} kW)
            </div>
            <div className="text-[11px] text-slate-500">CDR {hourTelemetry.cdrPct}% (Batas &lt; 0,20%)</div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5">
            <div className="text-[11px] font-bold uppercase text-slate-500">Status Kalibrasi FOP</div>
            <div className="mt-1 text-lg font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {calibratedCount > 0 ? `${calibratedCount} Site Terkalibrasi` : 'Menunggu Kalibrasi'}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              {calibratedCount > 0 ? 'BA-RE & SAP FI-CO Tersinkron' : 'Siap Eksekusi Closed-Loop'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 flex flex-col justify-between">
            <div className="text-[11px] font-bold uppercase text-slate-500">Tindakan Cepat NOC</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {onBatchResolveAnomalies && (
                <button
                  type="button"
                  onClick={() => onBatchResolveAnomalies(['BDG-DGO-P04', 'JAB-SITE-05'])}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[11px] font-bold transition cursor-pointer"
                >
                  <Wrench className="h-3 w-3" />
                  <span>Kalibrasi Batch FOP</span>
                </button>
              )}
              {onOpenOfficialBaRe && (
                <button
                  type="button"
                  onClick={onOpenOfficialBaRe}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 text-white px-2.5 py-1 text-[11px] font-bold transition cursor-pointer"
                >
                  <span>BA-RE PLN</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {onOpenReportModal && (
            <button onClick={onOpenReportModal} className="inline-flex items-center gap-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white px-4 py-2 text-xs font-bold transition cursor-pointer shadow-2xs">
              <FileText className="h-4 w-4" /> Lihat Lembar Kerja Validasi
            </button>
          )}
          <button
            onClick={() => setIsEvidenceOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 text-xs font-bold transition cursor-pointer shadow-2xs border border-slate-200 dark:border-slate-700"
          >
            <FileSearch className="h-4 w-4 text-[#ED0226]" /> Buka Evidence Explorer
          </button>
          {onOpenSapVoucher && (
            <button
              onClick={onOpenSapVoucher}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 text-xs font-bold transition cursor-pointer shadow-2xs border border-slate-200 dark:border-slate-700"
            >
              <Zap className="h-4 w-4 text-blue-600" /> Jurnal Akuntansi SAP S/4HANA
            </button>
          )}
        </div>
      </section>

      {/* Interactive DiD and QoS Guardrail Visualizer */}
      <DifferenceInDifferencesVisualizer />

      <section className="grid gap-4 md:grid-cols-2">
        {operationalValidations.map(({ title, icon: Icon, evidence, decision, status, statusColor }, index) => (
          <article key={title} className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs">{index + 1}</span>
                <Icon className="h-4 w-4 text-[#ED0226] dark:text-red-400" />
                <h2 className="font-extrabold text-sm">{title}</h2>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}>
                {status}
              </span>
            </div>
            <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">Data Operasional:</strong> {evidence}
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 p-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <strong>Kriteria Evaluasi:</strong> {decision}
            </div>
          </article>
        ))}
      </section>

      <section id="pitch-step-8-decisiongates" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 md:p-6 shadow-xs scroll-mt-6">
        <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Tata Kelola Gerbang Keputusan Tahap (Stage-Gate G0–G3 Telkomsel)
        </h2>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Seluruh intervensi fisik pada pilot 40 lokasi dikontrol melalui tata kelola Gerbang G0 (Audit Baseline &amp; Kesiapan Meter), Gerbang G1 (Validasi Kausal DiD &amp; SLA 3GPP), Gerbang G2 (Audit Finansial TowerCo &amp; ISO 14064), dan Gerbang G3 (Otorisasi Ekspansi Skala Metro 250 Site &amp; Regional Jamali 5.000 Site).
        </p>
      </section>

      {/* Evidence Explorer Modal */}
      <EvidenceExplorerModal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
      />
    </div>
  );
}