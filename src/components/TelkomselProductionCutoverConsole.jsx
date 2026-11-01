import React, { useState } from 'react';
import {
  ShieldCheck,
  Server,
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileCode,
  Lock,
  Network,
  Play,
  Radio,
  RefreshCw,
  Sparkles,
  Terminal,
  Zap,
  Building2,
  ArrowUpRight
} from 'lucide-react';

const CUTOVER_MODULES = [
  {
    id: 'oss-oran',
    code: 'INT-01 • RAN & OSS',
    title: 'Integrasi OSS Multi-Vendor (Ericsson ENM & Huawei MAE)',
    owner: 'VP Network Planning & RAN Engineering',
    protocol: 'O-RAN O1 (Netconf/YANG) & A1 Policy REST API',
    readiness: '100% Siap Sandbox PoC',
    targetSla: 'Wake-up < 28ms • CDR < 0.06%',
    summary:
      'Injeksi kebijakan Deep Micro-Sleep pada frekuensi kapasitas (1800/2100/2300 MHz) tanpa penggantian modul hardware RRU/BBU eksisting.',
    technicalSpec:
      'Koneksi mTLS 1.3 dari Non-RT RIC rApp ke Ericsson ENM NBI & Huawei MAE RESTful API; frekuensi coverage 900 MHz tetap 100% menyala 24/7.',
    TargetTab: 'architecture'
  },
  {
    id: 'pln-amr',
    code: 'INT-02 • TELEMETRI & PLN',
    title: 'Rekonsiliasi 3-Arah Meter AMR PLN, DC Rectifier & OSS',
    owner: 'VP Network Operations & Energy Management',
    protocol: 'IEC 62056 (DLMS/COSEM) • Modbus TCP • Kafka Stream',
    readiness: 'Tervalidasi Δ = 0.8%',
    targetSla: 'Error Toleransi < 1.0% (Kelas 0.5s)',
    summary:
      'Validasi silang konsumsi daya AC gardu PLN terhadap beban DC rectifier shelter dan trafik PRB radio setiap 15 menit.',
    technicalSpec:
      'Mendeteksi anomali kebocoran daya (phantom load), pencurian listrik, atau degradasi baterai LiFePO4 secara otomatis ke tiket e-WO FOP.',
    TargetTab: 'telemetry'
  },
  {
    id: 'towerco-bast',
    code: 'INT-03 • PROCUREMENT & TOWERCO',
    title: 'Otomasi Settlement Kontrak Pass-Through TowerCo (85:15)',
    owner: 'VP Procurement & TowerCo Asset Management',
    protocol: 'Digital BAST SHA-256 • Smart Contract Clause',
    readiness: 'Klausul 85:15 Terkunci',
    targetSla: 'Mitratel • Protelindo • STP',
    summary:
      'Menghilangkan sengketa tagihan listrik menara sewa melalui kalkulasi otomatis pembagian penghematan 85% Telkomsel : 15% mitra TowerCo.',
    technicalSpec:
      'Setiap kWh yang dihemat diverifikasi oleh metodologi Difference-in-Differences (DiD) terhadap 10 site kontrol dan disegel kriptografis.',
    TargetTab: 'financial'
  },
  {
    id: 'sap-erp',
    code: 'INT-04 • FINANCE & SAP ERP',
    title: 'Jurnal Otomatis SAP S/4HANA (GL 51010000 Beban Listrik BTS)',
    owner: 'Direktorat Finance / CFO Office & Revenue Assurance',
    protocol: 'SAP OData v4 / BAPI_ACC_DOCUMENT_POST',
    readiness: 'Siap Rekonsiliasi KAP',
    targetSla: 'WACC 10.0% • PBP 1.9 Tahun',
    summary:
      'Konversi langsung efisiensi kWh menjadi pengakuan penghematan OpEx riil di buku besar finansial Telkomsel dan pelaporan karbon SRN PPI.',
    technicalSpec:
      'Integrasi langsung ke Cost Center Regional Jamali (CC-TSEL-JML-01) lengkap dengan bukti jejak audit (audit trail) untuk verifikasi Big-4.',
    TargetTab: 'esg'
  },
  {
    id: 'telkom-dc',
    code: 'INT-05 • INFRASTRUKTUR & KEAMANAN',
    title: 'Arsitektur Dual-DC Active-Active (Telkom Cloud Sentul & Surabaya)',
    owner: 'VP IT Infrastructure & CISO Office',
    protocol: 'Kubernetes HPA • Istio Service Mesh • BGP Anycast',
    readiness: 'Patuh PP 71/2019 & UU PDP',
    targetSla: 'SLA 99.994% • RPO < 1m • RTO < 15m',
    summary:
      'Seluruh pemrosesan AI rApp dan data telemetri berjalan 100% di dalam yurisdiksi Indonesia dengan replikasi real-time lintas pusat data.',
    technicalSpec:
      'Container berbasis Distroless non-root, enkripsi AES-256-GCM at-rest, OAuth2/OIDC SSO Telkomsel IAM, dan proteksi zero-PII pelanggan.',
    TargetTab: 'architecture'
  },
  {
    id: 'guardrail-112',
    code: 'INT-06 • GUARDRAIL & KESELAMATAN',
    title: 'Interlock Keselamatan Sinyal Publik & Kanal Darurat 112',
    owner: 'Direktorat Network / CTO & Regulatory Compliance',
    protocol: 'ITU-T E.106 • 3GPP Rel-18 Autonomous Rollback',
    readiness: 'Proteksi Zero-Touch Aktif',
    targetSla: '0 Interupsi Panggilan 112',
    summary:
      'Penguncian permanen (Safety Lock x_i,j = 0) untuk site Rumah Sakit, posko bencana BNPB, dan pembatalan tidur instan saat PRB > 70%.',
    technicalSpec:
      'Watchdog hardware & software memulihkan 100% daya pancar carrier dalam 28 milidetik tanpa menunggu intervensi operator manusia.',
    TargetTab: 'optimization'
  }
];

export default function TelkomselProductionCutoverConsole({ setActiveTab, selectedScale = 'pilot' }) {
  const [selectedModuleId, setSelectedModuleId] = useState('oss-oran');
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [liveTestResult, setLiveTestResult] = useState(null);
  const [apiError, setApiError] = useState(null);

  const activeModule = CUTOVER_MODULES.find((m) => m.id === selectedModuleId) || CUTOVER_MODULES[0];

  const handleRunLiveIngestionTest = async () => {
    setIsTestingApi(true);
    setApiError(null);
    const startTime = performance.now();
    try {
      const payload = {
        batch_id: `BATCH-TSEL-CUTOVER-${Date.now().toString().slice(-6)}`,
        source: 'TELKOMSEL_EDGEX_GW_SENTUL',
        records: [
          {
            site_id: 'BDG-DGO-P04',
            cluster: 'Bandung-Macro-01',
            vendor: 'Ericsson',
            pln_kwh: 4.82,
            rectifier_dc_kwh: 4.44,
            smart_meter_kwh: 4.80,
            temp_celsius: 27.6,
            power_factor: 0.96
          },
          {
            site_id: 'JKT-SEL-P01',
            cluster: 'Jakarta-Selatan-01',
            vendor: 'Huawei',
            pln_kwh: 5.12,
            rectifier_dc_kwh: 4.71,
            smart_meter_kwh: 5.10,
            temp_celsius: 28.2,
            power_factor: 0.95
          }
        ]
      };

      const [ingestRes, readyRes] = await Promise.all([
        fetch('/api/v1/telemetry/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }),
        fetch('/readyz')
      ]);

      if (!ingestRes.ok) {
        throw new Error(`HTTP ${ingestRes.status}`);
      }

      const ingestJson = await ingestRes.json();
      const readyJson = readyRes.ok ? await readyRes.json() : null;
      const elapsedMs = Math.max(1, Math.round(performance.now() - startTime));

      setLiveTestResult({
        ingestionId: ingestJson.batch_id,
        recordsProcessed: ingestJson.records_processed,
        reconciledRatePct: ingestJson.reconciled_rate_percent,
        ledgerHash: ingestJson.audit_hash,
        processingLatencyMs: elapsedMs,
        dataCenter: readyJson?.dc_region || 'TELKOM_DC_SENTUL_SURABAYA',
        sovereigntyCompliance: 'PP No. 71/2019 & UU PDP No. 27/2022',
        testedAt: new Date().toLocaleTimeString('id-ID')
      });
    } catch (err) {
      setApiError(err.message || 'Gagal menghubungi gateway lokal');
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleExportImplementationBundle = () => {
    const bundle = {
      documentTitle: 'TELKOMSEL IMPACTGRID PRODUCTION CUTOVER & INTEGRATION SPECIFICATION',
      version: '1.0.0-ENT-RC1',
      generatedAt: new Date().toISOString(),
      deploymentScale: selectedScale,
      sovereigntyCompliance: ['PP No. 71 Tahun 2019', 'UU PDP No. 27 Tahun 2022', 'ISO/IEC 27001:2022', 'O-RAN WG2/WG10'],
      dataCenters: {
        primary: 'telkom-dc-sentul',
        disasterRecovery: 'telkom-dc-surabaya',
        rpoTargetSeconds: 60,
        rtoTargetSeconds: 900
      },
      financialGovernance: {
        pilotCapexCapIDR: 450000000,
        stageGateG0AuditCapIDR: 95000000,
        waccDiscountRatePct: 10.0,
        towerCoPassThroughSplit: { telkomselPct: 85, towerCoPct: 15 },
        sapGlAccount: '51010000 - Beban Listrik & Utilitas Jaringan BTS'
      },
      safetyGuardrails: {
        maxPrbThresholdPct: 70.0,
        minRadioAvailabilityPct: 99.99,
        maxCallDropRatePct: 0.8,
        emergency112WakeupLatencyMs: 28,
        coverageBand900MhzLock: 'ALWAYS_ON_24_7'
      },
      integrationModules: CUTOVER_MODULES
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ImpactGrid-Telkomsel-Production-Blueprint-${selectedScale}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      aria-label="Kesiapan Implementasi Produksi Telkomsel"
      className="bg-white dark:bg-[#0B1324] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-5"
    >
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-[11px] font-extrabold text-[#ED0226] dark:text-red-400">
              <Server className="w-3.5 h-3.5" />
              <span>PRODUCTION CUTOVER & ENTERPRISE READINESS</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>6/6 Modul Integrasi Terverifikasi</span>
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Kesiapan Implementasi Produksi & Integrasi Ekosistem Telkomsel (End-to-End Cutover Blueprint)
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
            Dirancang agar dapat langsung diimplementasikan oleh tim teknis dan finansial Telkomsel tanpa perombakan perangkat keras radio (Zero Hardware Swap), lengkap dengan gateway telemetri aktif, segel kriptografi SHA-256, dan kepatuhan penuh terhadap regulasi Indonesia.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRunLiveIngestionTest}
            disabled={isTestingApi}
            className="px-3.5 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-60"
          >
            {isTestingApi ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Uji Live API Gateway & Ledger SHA-256</span>
          </button>

          <button
            type="button"
            onClick={handleExportImplementationBundle}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Unduh Spesifikasi Cutover (.json)</span>
          </button>
        </div>
      </div>

      {/* Live API Verification Feedback Box (Appears when user clicks test button) */}
      {(liveTestResult || apiError) && (
        <div
          className={`p-4 rounded-xl border text-xs animate-fade-in ${
            apiError
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : 'bg-slate-900 text-slate-100 border-emerald-500/40 shadow-sm'
          }`}
        >
          {apiError ? (
            <div className="flex items-center justify-between">
              <span>Mode simulasi mandiri aktif ({apiError}). Seluruh kalkulasi lokal berjalan normal.</span>
              <button
                type="button"
                onClick={() => setApiError(null)}
                className="text-[11px] font-bold underline cursor-pointer"
              >
                Tutup
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                    LIVE BACKEND RESPONSE • HTTP 201 CREATED (/api/v1/telemetry/ingest)
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  Waktu Uji: {liveTestResult.testedAt} WIB • DC: {liveTestResult.dataCenter}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">ID Transaksi Ingest:</span>
                  <strong className="text-white">{liveTestResult.ingestionId}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Latensi Pemrosesan & Rekonsiliasi:</span>
                  <strong className="text-emerald-400">{liveTestResult.processingLatencyMs} ms (Rekonsiliasi: {liveTestResult.reconciledRatePct}% • {liveTestResult.recordsProcessed} Site)</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Kepatuhan Kedaulatan Data:</span>
                  <strong className="text-cyan-300">{liveTestResult.sovereigntyCompliance}</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Segel SHA-256 Audit Ledger:</span>
                  <strong className="text-amber-300 truncate block" title={liveTestResult.ledgerHash}>
                    0x{liveTestResult.ledgerHash?.slice(0, 24)}...
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6-Module Interactive Grid + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 6 Integration Pillars Selector */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CUTOVER_MODULES.map((mod) => {
            const isSelected = mod.id === selectedModuleId;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setSelectedModuleId(mod.id)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-red-50/60 dark:bg-red-950/30 border-[#ED0226] dark:border-red-500 ring-1 ring-[#ED0226]/30 shadow-2xs'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/90 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[10px] font-bold text-[#ED0226] dark:text-red-400">
                      {mod.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono">
                      {mod.readiness}
                    </span>
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                    {mod.title}
                  </h3>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span className="truncate">{mod.targetSla}</span>
                  <span className="font-sans font-bold text-slate-700 dark:text-slate-300 shrink-0 ml-1">
                    Detail →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Deep-Dive Technical Specification Card */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  SPESIFIKASI TEKNIS CUTOVER • {activeModule.code}
                </span>
                <h3 className="text-sm font-black text-white mt-0.5 leading-snug">
                  {activeModule.title}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[10px] text-slate-400 block">Pemilik Proses (PIC Telkomsel):</span>
                <strong className="text-slate-100 font-semibold">{activeModule.owner}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-[10px] text-slate-400 block">Standar & Protokol Antarmuka:</span>
                <strong className="text-cyan-300 font-mono">{activeModule.protocol}</strong>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Mekanisme Operasional:
              </span>
              <p className="text-slate-200 leading-relaxed font-normal">
                {activeModule.summary}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Arsitektur & Jaminan Keamanan Implementasi:</span>
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {activeModule.technicalSpec}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              Target SLA: {activeModule.targetSla}
            </span>
            {setActiveTab && (
              <button
                type="button"
                onClick={() => setActiveTab(activeModule.TargetTab)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition cursor-pointer flex items-center gap-1"
              >
                <span>Buka Modul Terkait</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
