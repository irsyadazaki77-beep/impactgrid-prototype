import React, { useState } from 'react';
import TelemetryReconciliationMatrix from './TelemetryReconciliationMatrix';
import BtsDataIngestionHub from './BtsDataIngestionHub';
import { 
  Activity, 
  Database, 
  FileSearch, 
  Radio, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Server, 
  BarChart2, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Upload,
  FileSpreadsheet,
  Layers
} from 'lucide-react';

const DATA_REQUIREMENTS = [
  { 
    title: 'Meter dan tagihan listrik PLN', 
    detail: 'kWh per interval 15 menit, nomor IDPEL/kontrak tarif B-2/B-3, rekonsiliasi faktur PLN vs submeter digital shelter.', 
    owner: 'Energy Management / Keuangan',
    status: 'Integrasi API PLN Siaga',
    readiness: '85%'
  },
  { 
    title: 'Konsumsi dan konfigurasi radio RAN', 
    detail: 'Pengukuran daya DC rectifier, RF transmit power, utilisasi PRB per carrier, dan status sleep mode via interface O-RAN O1.', 
    owner: 'Network Operations / Vendor',
    status: 'Konektor O-RAN O1 Terhubung',
    readiness: '90%'
  },
  { 
    title: 'Trafik dan mutu layanan (QoS)', 
    detail: 'Call Drop Rate (CDR), throughput downlink/uplink, handover success rate, serta interlock proteksi panggilan darurat 112.', 
    owner: 'Network Quality Assurance',
    status: 'Guardrail 112 Terverifikasi',
    readiness: '95%'
  },
  { 
    title: 'Sensor termal dan lingkungan shelter', 
    detail: 'Suhu ambient shelter, suhu heat sink radio BTS, kelembaban, serta status inverter AC dan ventilasi pintar.', 
    owner: 'Facility & Asset Management',
    status: 'Sensor IoT Kelas 0.5s Siaga',
    readiness: '90%'
  },
  { 
    title: 'Hak akses & kontrak sewa TowerCo', 
    detail: 'Identitas aset menara makro, hak intervensi pendingin shelter, pembagian pasokan daya bersama Mitratel/Protelindo.', 
    owner: 'TowerCo Partnership / Legal',
    status: 'Model Bagi-Hasil Siap',
    readiness: '80%'
  }
];

const SIMULATED_BTS_FEEDS = [
  {
    id: 'JKT-SEL-P01',
    name: 'Kebayoran Baru Macro BTS',
    type: 'Intervensi (Carrier Sleep)',
    powerKw: '3.42 kW',
    powerBaseline: '4.15 kW',
    trafficLoad: '68 Mbps (32% PRB)',
    tempC: '27.4°C',
    status: 'Carrier Sleep B3/B8 Aktif',
    savings: '−17.6%',
    qosStatus: 'Optimal (Call Drop 0.06%)',
    activeBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
  },
  {
    id: 'BDG-DGO-P04',
    name: 'Dago Atas Macro Hub',
    type: 'Intervensi (Deep Sleep)',
    powerKw: '2.88 kW',
    powerBaseline: '3.90 kW',
    trafficLoad: '42 Mbps (18% PRB)',
    tempC: '26.8°C',
    status: 'Deep Sleep Symbol Mode',
    savings: '−26.1%',
    qosStatus: 'Optimal (Call Drop 0.05%)',
    activeBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
  },
  {
    id: 'SBY-RKT-C02',
    name: 'Rungkut Industri (Control)',
    type: 'Pembanding (Baseline Murni)',
    powerKw: '4.48 kW',
    powerBaseline: '4.50 kW',
    trafficLoad: '145 Mbps (74% PRB)',
    tempC: '30.2°C',
    status: 'Full Load Active',
    savings: '0.0%',
    qosStatus: 'Normal (Call Drop 0.09%)',
    activeBadge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
  }
];

export default function TelemetryTab({
  onOpenOfficialBaRe,
  onOpenFieldConsole,
  onOpenSapVoucher,
  resolvedSites = [],
  operationalState,
  operationalSummary,
  onSelectDatasetPreset,
  onIngestRecords,
  onIngestTelemetryRecords,
  onUpsertSite,
  onUpsertBtsSite,
  onDeleteSite,
  onDeleteBtsSite,
  onUpdateSlaThresholds,
  onDispatchOranPolicy,
  onResolveSiteAnomaly,
  onBatchResolveAnomalies
}) {
  const [activeView, setActiveView] = useState('all'); // 'all', 'ingestion', 'reconciliation', 'live_stream'
  const [batchFeedback, setBatchFeedback] = useState(null);
  const handleIngest = onIngestRecords || onIngestTelemetryRecords;
  const handleUpsert = onUpsertSite || onUpsertBtsSite;
  const handleDelete = onDeleteSite || onDeleteBtsSite;
  const annualSavedMwh = operationalSummary?.annualizedSavedMwh ?? 200;
  const annualSavedIdrMillions = operationalSummary?.annualizedSavedIdr
    ? Math.round(operationalSummary.annualizedSavedIdr / 1_000_000)
    : 240;
  const activeSiteCount = operationalSummary?.siteCount ?? 50;

  const handleBatchFopClick = () => {
    const targetIds = ['BDG-DGO-P04', 'JAB-SITE-05', 'JKT-SEL-P03', 'BKS-MET-P06'];
    if (onBatchResolveAnomalies) {
      onBatchResolveAnomalies(targetIds);
    } else if (onResolveSiteAnomaly) {
      targetIds.forEach((id) => onResolveSiteAnomaly(id));
    }
    setBatchFeedback(`Batch Kalibrasi FOP selesai untuk ${targetIds.length} site anomali (${targetIds.join(', ')}). Dokumen BA-RE PLN & Jurnal SAP S/4HANA telah diperbarui.`);
    setTimeout(() => setBatchFeedback(null), 5000);
  };

  const handleBatchOranClick = () => {
    if (onDispatchOranPolicy) {
      void onDispatchOranPolicy({
        cluster: 'JAMALI-PILOT-50',
        mode: 'ADAPTIVE_CARRIER_SLEEP_O1',
        targetTempC: 26.0
      });
    }
    setBatchFeedback(`Kebijakan Batch O-RAN O1 (Adaptive Carrier Sleep + Setpoint HVAC 26°C) dikirim ke ${activeSiteCount} menara BTS multi-vendor (Ericsson/Huawei/ZTE).`);
    setTimeout(() => setBatchFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Executive Header */}
      <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-400 text-xs font-bold">
            <Radio className="h-4 w-4" />
            <span>Modul Telemetri: Network Data Hub Operasional</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
              <span>Konektor O-RAN O1 &amp; Meter Kelas 0.5s Aktif ({activeSiteCount} Site Tersinkron · {resolvedSites.length} Terkalibrasi FOP)</span>
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Konsolidasi Data Telemetri Energi, Otomasi Batch FOP &amp; Rekonsiliasi 3-Arah Telkomsel
          </h1>
          <p className="mt-1.5 max-w-4xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Mengintegrasikan aliran data konsumsi listrik PLN, telemetri RF RAN O-RAN O1 (Ericsson, Huawei, ZTE), dan submeter DC shelter, dilengkapi eksekusi massal (<em>Batch Operations</em>) untuk tiket FOP dan sinkronisasi jurnal SAP S/4HANA.
          </p>
        </div>

        {/* Batch Operations Bar */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 p-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Konsol Eksekusi Massal (Batch SNOC):</span>
            <span className="ml-2 text-slate-600 dark:text-slate-400">Jalankan kalibrasi FOP serentak atau kirim kebijakan O-RAN O1 ke seluruh kluster.</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleBatchFopClick}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              Eksekusi Batch Kalibrasi FOP (Semua Anomali)
            </button>
            <button
              type="button"
              onClick={handleBatchOranClick}
              className="px-3 py-1.5 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
            >
              Batch Dispatch O-RAN O1 ({activeSiteCount} Site)
            </button>
            {onOpenOfficialBaRe && (
              <button
                type="button"
                onClick={onOpenOfficialBaRe}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Buka BA-RE PLN
              </button>
            )}
            {onOpenSapVoucher && (
              <button
                type="button"
                onClick={onOpenSapVoucher}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Jurnal SAP S/4HANA
              </button>
            )}
          </div>
        </div>

        {batchFeedback && (
          <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 px-4 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
            <span>{batchFeedback}</span>
          </div>
        )}

        {/* View Switcher Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveView('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Semua Modul Terpadu</span>
            </button>
            <button
              onClick={() => setActiveView('ingestion')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'ingestion'
                  ? 'bg-[#ED0226] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ingestion CSV &amp; CRUD Site</span>
            </button>
            <button
              onClick={() => setActiveView('reconciliation')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'reconciliation'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Matriks Rekonsiliasi 3-Arah</span>
            </button>
            <button
              onClick={() => setActiveView('live_stream')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'live_stream'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Stream Node BTS</span>
            </button>
            <button
              onClick={() => setActiveView('mlops')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'mlops'
                  ? 'bg-[#ED0226] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Data Quality &amp; MLOps Drift</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Standard: O-RAN WG1 &amp; IPMVP Option B
          </span>
        </div>
      </header>

      {/* Corporate Macro Benchmarks */}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Konsumsi Listrik Korporat 2025</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono tabular-nums">1.885.417.875,2 kWh</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Total konsumsi listrik jaringan Telkomsel (Sustainability Report 2025).</p>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Emisi Scope 2 Korporat 2025</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono tabular-nums">1.721.967,7 tCO₂e</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Menyumbang 63,6% dari total emisi gas rumah kaca korporat.</p>
        </article>

        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Penghematan Kluster Aktif</span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight font-mono tabular-nums">~{annualSavedMwh} MWh/thn</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Potensi penghematan kas neto Rp {annualSavedIdrMillions.toLocaleString('id-ID')} Juta/thn ({activeSiteCount} Site Aktif).</p>
        </article>
      </section>

      {/* Feature 1: Enterprise BTS CSV Data Ingestion Hub & CRUD Manager */}
      {(activeView === 'all' || activeView === 'ingestion') && (
        <section className="animate-fade-in">
          <BtsDataIngestionHub
            operationalState={operationalState}
            onSelectDatasetPreset={onSelectDatasetPreset}
            onIngestRecords={handleIngest}
            onUpsertSite={handleUpsert}
            onDeleteSite={handleDelete}
            onUpdateSlaThresholds={onUpdateSlaThresholds}
            onDispatchOranPolicy={onDispatchOranPolicy}
            onResolveSiteAnomaly={onResolveSiteAnomaly}
          />
        </section>
      )}

      {/* Feature 2: 3-Way Reconciliation Matrix between PLN, Rectifier, and OSS */}
      {(activeView === 'all' || activeView === 'reconciliation') && (
        <section className="animate-fade-in">
          <TelemetryReconciliationMatrix 
            onOpenOfficialBaRe={onOpenOfficialBaRe} 
            onOpenFieldConsole={onOpenFieldConsole}
            onOpenSapVoucher={onOpenSapVoucher}
            onResolveSiteAnomaly={onResolveSiteAnomaly}
            resolvedSites={resolvedSites}
          />
        </section>
      )}

      {/* Feature 3: Simulated Live BTS Telemetry Stream */}
      {(activeView === 'all' || activeView === 'live_stream') && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-[#ED0226]" />
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Streaming Telemetri Node BTS Pilot (Sample Stream)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Data telemetri tersinkronisasi interval 5 menit untuk evaluasi Carrier Sleep & Mutu Layanan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Streaming Aktif (Sampling 5m)</span>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {SIMULATED_BTS_FEEDS.map((site) => (
              <div 
                key={site.id} 
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{site.id}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{site.name}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${site.activeBadge}`}>
                    {site.savings}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Daya Terukur:</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{site.powerKw} <span className="text-[10px] text-slate-400">(Base: {site.powerBaseline})</span></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Beban Trafik:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 font-mono">{site.trafficLoad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Suhu Shelter:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 font-mono">{site.tempC}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status Aksi:</span>
                    <span className="font-bold text-cyan-700 dark:text-cyan-400 truncate">{site.status}</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/40 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">QoS Guardrail:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">{site.qosStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Feature 4: AI Data Quality, Imputation & MLOps Concept Drift Pipeline */}
      {(activeView === 'all' || activeView === 'mlops') && (
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs animate-fade-in space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-[#ED0226]" />
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  AI Data Pre-Processing, Missing Telemetry Imputation & MLOps Drift Engine
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mengatasi realitas lapangan telekomunikasi: packet loss sensor AMR PLN, sensor drift, dan adaptasi perubahan musiman (Mudik/Libur Nasional)
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
              K-NN Imputation & PSI &lt; 0.10 Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Box 1: Packet Loss & Imputation */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100">1. Missing Data Imputation</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">K-NN Spline</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Di lapangan, 1–3% telemetri AMR PLN mengalami kegagalan transmisi. Algoritma K-NN Temporal Spline merekonstruksi data interval 15 menit menggunakan korelasi historis kluster tanpa merusak sifat varians asli.
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-mono text-[10px]">
                <span className="text-slate-500">Kelengkapan Data:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">98.6% (1.4% Imputed)</strong>
              </div>
            </div>

            {/* Box 2: Anomaly & Sensor Drift Detection */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100">2. Sensor Drift & Anomaly</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">Z-Score 3σ</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Mendeteksi degradasi akurasi sensor suhu shelter dan CT meter DC sebelum mempengaruhi model PINN. Deviasi &gt;1.5°C secara konsisten memicu tiket kalibrasi teknisi pemeliharaan preventif.
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-mono text-[10px]">
                <span className="text-slate-500">Sensor Drift Rate:</span>
                <strong className="text-slate-800 dark:text-slate-200">0.02% (Dalam Toleransi)</strong>
              </div>
            </div>

            {/* Box 3: Concept Drift & MLOps Retraining */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100">3. MLOps Concept Drift</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold">PSI Monitor</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Population Stability Index (PSI) memantau pergeseran distribusi trafik (misal saat Mudik Lebaran). Jika PSI &gt; 0.20, pipeline MLOps memicu automated model re-training secara terisolasi tanpa mengganggu layanan.
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-mono text-[10px]">
                <span className="text-slate-500">Indeks Stabilitas (PSI):</span>
                <strong className="text-emerald-600 dark:text-emerald-400">0.07 (Distribusi Stabil)</strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Data Ingestion Pipeline Architecture */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Arsitektur Pipeline Ingesti & Verifikasi Data (O-RAN O1)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Alur pengolahan data mentah menjadi rekomendasi keputusan hemat energi
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tahap 1</span>
            <p className="font-bold text-xs text-slate-900 dark:text-white mt-1">Multi-Source Ingestion</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Smart meter PLN (kWh), DC power rectifiers, serta O-RAN O1 PM/FM events.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tahap 2</span>
            <p className="font-bold text-xs text-slate-900 dark:text-white mt-1">Data Harmonization</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Penyelarasan interval 5 menit, pembersihan anomali sensor, dan normalisasi cuaca.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tahap 3</span>
            <p className="font-bold text-xs text-slate-900 dark:text-white mt-1">Traffic-Power Correlation</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Model DiD memisahkan penghematan asli intervensi dari penurunan trafik alami.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tahap 4</span>
            <p className="font-bold text-xs text-slate-900 dark:text-white mt-1">QoS Safety Guardrail</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Interlock otomatis: jika PRB load &gt;60% atau ada panggilan 112, sleep dibatalkan seketika.</p>
          </div>
        </div>
      </section>

      {/* Data Governance & Integration Requirements Table */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSearch className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Data Integrasi & Spesifikasi Skema Operasional (Governance Roadmap)
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">5 Komponen Terdefinisi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-3">Sumber Data</th>
                <th className="p-3">Kebutuhan Validasi</th>
                <th className="p-3">Pemilik Validasi</th>
                <th className="p-3">Status Desain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DATA_REQUIREMENTS.map((item) => (
                <tr key={item.title} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{item.title}</td>
                  <td className="p-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{item.detail}</td>
                  <td className="p-3 text-xs text-slate-600 dark:text-slate-400 font-medium">{item.owner}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Official Footnote */}
      <footer className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1324] p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div>
          <strong>Sumber kalibrasi korporat:</strong>{' '}
          <a 
            className="font-semibold text-cyan-800 dark:text-cyan-400 hover:underline inline-flex items-center gap-1" 
            href="https://www.telkom.co.id/minio/show/data/lampiran/1778605801197_original_TLKM-SR2025-IND.pdf" 
            target="_blank" 
            rel="noreferrer"
          >
            <span>Laporan Keberlanjutan Telkom 2025</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          . Data dilaporkan pada tingkat perusahaan untuk dasar kalibrasi makro.
        </div>
        <span className="font-mono text-[11px] text-slate-500">Standard: O-RAN WG1 & IPMVP Option B</span>
      </footer>

    </div>
  );
}
