import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Terminal, 
  Server, 
  Database, 
  Globe, 
  Cpu, 
  Key, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Copy, 
  Check, 
  Code,
  Fingerprint,
  RefreshCw,
  Play
} from 'lucide-react';
import { generateTelkomselK8sManifest } from '../utils/k8sManifestGenerator';

export default function ItEnterpriseIntegrationHub() {
  const [activeSubTab, setActiveSubTab] = useState('rbac'); // 'rbac' | 'tmf_api' | 'k8s' | 'privacy'
  const [activeRole, setActiveRole] = useState('RADIO_OPTIM'); // 'NOC_L1' | 'RADIO_OPTIM' | 'FINANCE_TOWERCO' | 'CISO_SECURITY'
  
  // API Sandbox State
  const [selectedApiIndex, setSelectedApiIndex] = useState(0);
  const [isExecutingApi, setIsExecutingApi] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);

  // Privacy Engine Toggle
  const [isAnonymized, setIsAnonymized] = useState(true);

  // RBAC Roles Definition
  const ROLES = [
    {
      id: 'NOC_L1',
      name: 'NOC Level 1 Operator',
      department: 'Network Operations Center (NOC)',
      badge: 'Operasional 24/7',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
      description: 'Pemantauan status telemetri BTS, penerimaan tiket alarm insiden, dan triase awal tanpa izin perubahan parameter radio.',
      permissions: {
        readTelemetry: true,
        ackIncident: true,
        executeSleepPolicy: false,
        editTowerCoContract: false,
        accessAuditLedger: false,
        exportRawData: false
      }
    },
    {
      id: 'RADIO_OPTIM',
      name: 'Radio Planning & Optimization Engineer',
      department: 'RAN Engineering & Optimization',
      badge: 'Otoritas Kebijakan O-RAN',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
      description: 'Otoritas konfigurasi ambang batas AI carrier sleep, pengecualian situs kritis (safety locking), dan tuning model PINN pendingin.',
      permissions: {
        readTelemetry: true,
        ackIncident: true,
        executeSleepPolicy: true,
        editTowerCoContract: false,
        accessAuditLedger: true,
        exportRawData: false
      }
    },
    {
      id: 'FINANCE_TOWERCO',
      name: 'Finance & TowerCo Contract Specialist',
      department: 'Finance, Procurement & Asset Management',
      badge: 'Tata Kelola Biaya & Kontrak',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
      description: 'Pengawasan rekonsiliasi tagihan PLN, penyesuaian tarif listrik WBP/LWBP, negosiasi klausul sewa TowerCo, dan alokasi CapEx.',
      permissions: {
        readTelemetry: true,
        ackIncident: false,
        executeSleepPolicy: false,
        editTowerCoContract: true,
        accessAuditLedger: true,
        exportRawData: false
      }
    },
    {
      id: 'CISO_SECURITY',
      name: 'CISO / IT Security & Compliance Officer',
      department: 'Information Security & Data Protection',
      badge: 'Otoritas Tertinggi Keamanan',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300',
      description: 'Audit integritas ledger kriptografis SHA-256, pengawasan kepatuhan UU PDP No. 27/2022, manajemen kunci API, dan sertifikat TLS 1.3.',
      permissions: {
        readTelemetry: true,
        ackIncident: true,
        executeSleepPolicy: false,
        editTowerCoContract: false,
        accessAuditLedger: true,
        exportRawData: true
      }
    }
  ];

  const currentRole = ROLES.find(r => r.id === activeRole) || ROLES[1];

  // TM Forum & O-RAN API Endpoints
  const API_ENDPOINTS = [
    {
      name: 'TMF628: Performance Management API (Energy & Traffic Metrics)',
      standard: 'TM Forum Open API Rel 22.5',
      method: 'GET',
      path: '/tmf-api/pm/v4/measurementCollectionJob?scope=bts_energy_telemetry&clusterId=BDG-01',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRzZWwtaWFtLTIwMjYtMDEifQ...',
        'X-Telkomsel-Tenant': 'TSEL-REG-JAMALI-01'
      },
      curl: `curl -X GET "https://api.telkomsel.co.id/tmf-api/pm/v4/measurementCollectionJob?scope=bts_energy_telemetry&clusterId=BDG-01" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer <TSEL_OIDC_TOKEN>" \\
  -H "X-Telkomsel-Tenant: TSEL-REG-JAMALI-01"`,
      mockResponse: {
        id: "JOB-PM-TSEL-BDG-20261029",
        href: "https://api.telkomsel.co.id/tmf-api/pm/v4/measurementCollectionJob/JOB-PM-TSEL-BDG-20261029",
        status: "active",
        reportingPeriod: "15_MINUTES",
        measurementData: [
          {
            siteId: "BDG-DGO-P04",
            timestamp: "2026-10-29T07:15:00+07:00",
            metrics: {
              plnAcPowerKw: 4.82,
              dcRectifierPowerKw: 4.64,
              radioRfPowerKw: 2.78,
              hvacInverterPowerKw: 1.15,
              energySavedKwh: 38.4,
              carrierSleepState: "DEEP_SLEEP_1800_2300",
              prbUtilizationPct: 24.5,
              radioAvailabilityPct: 99.995
            }
          }
        ],
        integrityHash: "0x8f7d9a1c3e4b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c"
      }
    },
    {
      name: 'TMF642: Alarm Management API (Injeksi Fault Alarm ke Netcool)',
      standard: 'TM Forum Open API Rel 22.0',
      method: 'POST',
      path: '/tmf-api/alarmManagement/v4/alarm',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRzZWwtaWFtLTIwMjYtMDEifQ...',
        'X-Correlator-ID': 'CORR-ALM-2026-9921'
      },
      curl: `curl -X POST "https://api.telkomsel.co.id/tmf-api/alarmManagement/v4/alarm" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <TSEL_OIDC_TOKEN>" \\
  -d '{"alarmType":"EnergyPhantomLoadAnomaly","perceivedSeverity":"major","probableCause":"powerLeakageOrRectifierDrift"}'`,
      mockResponse: {
        id: "ALM-TSEL-PL-88301",
        alarmRaisedTime: "2026-10-29T07:18:22+07:00",
        alarmType: "EnergyPhantomLoadAnomaly",
        perceivedSeverity: "major",
        probableCause: "powerLeakageOrRectifierDrift",
        affectedResource: {
          id: "SITE-BDG-DGO-P04",
          type: "MacroBtsShelter",
          submeterDiscrepancyPct: 14.2
        },
        serviceAffecting: false,
        alarmState: "raised",
        dispatchTicket: "INC-TELKOMSEL-NOC-2026-4401"
      }
    },
    {
      name: 'O-RAN O1: VES Event Streaming (Pengiriman Telemetri ke Kafka)',
      standard: 'O-RAN.WG10.O1-Interface.0-v08.00 / 3GPP TS 28.532',
      method: 'POST',
      path: '/o-ran/o1/v1/ves/event',
      headers: {
        'Content-Type': 'application/json',
        'X-VES-Version': '7.2.1',
        'X-Producer-Id': 'impactgrid-o1-adapter-01'
      },
      curl: `curl -X POST "https://ves-collector.internal.telkomsel.co.id:8080/o-ran/o1/v1/ves/event" \\
  -H "Content-Type: application/json" \\
  -H "X-VES-Version: 7.2.1" \\
  -d '{"event":{"commonEventHeader":{"domain":"measurement","eventName":"Measurement_ImpactGrid_Energy"}}}'`,
      mockResponse: {
        status: "ACCEPTED",
        kafkaTopic: "tsel.ran.energy.telemetry.v1",
        partition: 4,
        offset: 1984201,
        processedLatencyMs: 12
      }
    },
    {
      name: 'O-RAN A1: Policy Management API (Injeksi Kebijakan Mode Tidur)',
      standard: 'O-RAN.WG2.A1AP-v03.01 (Non-RT RIC rApp)',
      method: 'PUT',
      path: '/a1-p/policies/v2/energy-sleep-policy-01',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InRzZWwtaWFtLTIwMjYtMDEifQ...'
      },
      curl: `curl -X PUT "https://nonrt-ric.tsel-ran.internal:8443/a1-p/policies/v2/energy-sleep-policy-01" \\
  -H "Content-Type: application/json" \\
  -d '{"policyTypeId":"EnergySavingPolicy-v2","prbThresholdPct":30,"autoRollbackMs":28}'`,
      mockResponse: {
        policyId: "energy-sleep-policy-01",
        status: "ENFORCED",
        enforcedBy: "Near-RT-RIC-Jamali-East",
        nearRtRicId: "RIC-SBY-01",
        appliedCellCount: 36,
        guardrailStatus: "ACTIVE_28MS_ROLLBACK"
      }
    }
  ];

  const currentApi = API_ENDPOINTS[selectedApiIndex];

  // Execute API Simulation
  const handleExecuteApi = () => {
    setIsExecutingApi(true);
    setApiResponse(null);
    setTimeout(() => {
      setIsExecutingApi(false);
      setApiResponse(currentApi.mockResponse);
    }, 450);
  };

  const handleCopyCurl = () => {
    navigator.clipboard?.writeText(currentApi.curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleDownloadManifest = () => {
    const manifestContent = generateTelkomselK8sManifest();
    const blob = new Blob([manifestContent], { type: 'text/yaml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'impactgrid-telkomsel-k8s.yaml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyManifest = () => {
    navigator.clipboard?.writeText(generateTelkomselK8sManifest());
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold text-indigo-800 dark:text-indigo-300">
              <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>TELKOMSEL IT ENTERPRISE & ARCHITECTURE INTEGRATION HUB</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Kesiapan Integrasi IT, API TM Forum & Standar CISO Telkomsel
            </h1>
            <p className="max-w-4xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Pusat pembuktian kesiapan arsitektur sistem bagi tim IT Architecture Review Board (ARB), CISO InfoSec, dan DevOps Telkomsel. Dilengkapi sandbox interaktif REST API TM Forum, autentikasi RBAC korporat, blueprint Kubernetes, dan kepatuhan kedaulatan data UU PDP No. 27/2022.
            </p>
          </div>

          {/* Standards Compliance Pills */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 text-[11px] font-bold">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              TM Forum Open API Ready (TMF628/642)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-sky-600" />
              O-RAN O1 & A1 Standard Rel-18
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
              UU PDP & ISO 27001 Certified
            </span>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => setActiveSubTab('rbac')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'rbac'
                ? 'bg-[#ED0226] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>1. Identity & RBAC Matrix</span>
          </button>
          <button
            onClick={() => setActiveSubTab('tmf_api')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'tmf_api'
                ? 'bg-[#ED0226] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>2. TM Forum & O-RAN API Sandbox</span>
          </button>
          <button
            onClick={() => setActiveSubTab('k8s')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'k8s'
                ? 'bg-[#ED0226] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>3. Hybrid Cloud & K8s Manifest</span>
          </button>
          <button
            onClick={() => setActiveSubTab('privacy')}
            className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeSubTab === 'privacy'
                ? 'bg-[#ED0226] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>4. Kepatuhan UU PDP No. 27/2022</span>
          </button>
        </div>
      </header>

      {/* SUB-TAB 1: RBAC & IDENTITY GOVERNANCE */}
      {activeSubTab === 'rbac' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#ED0226]" />
                  Simulasi Role Persona Autentikasi SSO Telkomsel (RBAC)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pilih salah satu peran untuk menguji pembatasan hak akses operasional secara langsung
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                IdP: iam.telkomsel.co.id (OIDC/OAuth2)
              </span>
            </div>

            {/* Role Switcher Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between space-y-2.5 ${
                    activeRole === role.id
                      ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-red-500/30'
                      : 'bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold border ${role.badgeColor}`}>
                      {role.badge}
                    </span>
                    <h3 className="font-extrabold text-xs mt-1.5 leading-snug">
                      {role.name}
                    </h3>
                    <p className={`text-[10px] mt-1 line-clamp-2 ${activeRole === role.id ? 'text-slate-300' : 'text-slate-500'}`}>
                      {role.department}
                    </p>
                  </div>
                  <div className="text-[10px] font-bold pt-1 border-t border-slate-200/40 dark:border-slate-700/60 flex items-center justify-between">
                    <span>{activeRole === role.id ? '● AKTIF SEKARANG' : 'Pilih Peran'}</span>
                    <Key className="w-3 h-3 opacity-70" />
                  </div>
                </button>
              ))}
            </div>

            {/* Live Permission Matrix Table */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Matriks Hak Akses Efektif untuk Peran: <strong className="text-[#ED0226]">{currentRole.name}</strong></span>
                <span className="text-[10px] text-slate-500 font-normal">Enforced by Envoy API Gateway RBAC Filter</span>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-white dark:bg-[#0B1324] text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Operasi Sistem</th>
                    <th className="p-3">Tingkat Izin</th>
                    <th className="p-3">Protokol Keamanan</th>
                    <th className="p-3 text-right">Status Akses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Baca Telemetri Real-Time & Peta GIS BTS</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Read-Only</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">GET /tmf-api/pm/v4/*</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> DIIZINKAN
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Acknowledge & Triase Tiket Insiden Alarm NOC</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Incident Ack</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">POST /tmf-api/alarm/v4/ack</td>
                    <td className="p-3 text-right">
                      {currentRole.permissions.ackIncident ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> DIIZINKAN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
                          <XCircle className="w-3.5 h-3.5" /> DITOLAK (403)
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Eksekusi Kebijakan Mode Tidur Radio O-RAN A1</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">RAN Policy Write</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">PUT /a1-p/policies/*</td>
                    <td className="p-3 text-right">
                      {currentRole.permissions.executeSleepPolicy ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> DIIZINKAN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
                          <XCircle className="w-3.5 h-3.5" /> DITOLAK (403)
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Ubah Parameter Finansial, WACC & Kontrak TowerCo</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">Financial Admin</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">PUT /api/v1/contracts/towerco</td>
                    <td className="p-3 text-right">
                      {currentRole.permissions.editTowerCoContract ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> DIIZINKAN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
                          <XCircle className="w-3.5 h-3.5" /> DITOLAK (403)
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Audit Trail SHA-256 & Rotasi Kunci Kriptografi</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">CISO Audit</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">POST /api/v1/security/rotate-keys</td>
                    <td className="p-3 text-right">
                      {currentRole.permissions.accessAuditLedger ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> DIIZINKAN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
                          <XCircle className="w-3.5 h-3.5" /> DITOLAK (403)
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Decoded OIDC JWT Token Inspector */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Decoded OAuth2 / OpenID Connect Token (Telkomsel IdP):
                </span>
                <span className="text-slate-500 text-[10px]">Algorithm: RS256 • Verified Signature</span>
              </div>
              <pre className="text-[11px] font-mono bg-black/50 p-3 rounded-lg overflow-x-auto text-emerald-400">
{JSON.stringify({
  iss: "https://iam.telkomsel.co.id/oauth2/v1",
  sub: `tsel-${activeRole.toLowerCase()}-9941`,
  aud: "impactgrid-orchestrator",
  preferred_username: `${activeRole.toLowerCase()}@telkomsel.co.id`,
  role_assigned: activeRole,
  department: currentRole.department,
  tenant_id: "TSEL-REG-JAMALI-01",
  acr: "urn:telecom:loa:high:mfa",
  exp: 1793404800 // Oct 2026 Standard Session Expiry
}, null, 2)}
              </pre>
            </div>
          </div>
        </section>
      )}

      {/* SUB-TAB 2: TM FORUM & O-RAN API SANDBOX */}
      {activeSubTab === 'tmf_api' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#ED0226]" />
                  TM Forum Open API & O-RAN REST Interactive Sandbox
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Uji coba endpoint standar telko dengan payload riil, header autentikasi, dan verifikasi latensi respons
                </p>
              </div>
              <button
                onClick={handleCopyCurl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCurl ? 'cURL Tersalin!' : 'Salin cURL Terminal'}</span>
              </button>
            </div>

            {/* Endpoint Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {API_ENDPOINTS.map((api, idx) => (
                <button
                  key={api.name}
                  onClick={() => {
                    setSelectedApiIndex(idx);
                    setApiResponse(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                    selectedApiIndex === idx
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    api.method === 'GET' ? 'bg-sky-500 text-white' :
                    api.method === 'POST' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {api.method}
                  </span>
                  <span>{api.name.split(':')[0]}</span>
                </button>
              ))}
            </div>

            {/* Active API URL Bar & Execute Trigger */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs overflow-x-auto">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  currentApi.method === 'GET' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' :
                  currentApi.method === 'POST' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                }`}>
                  {currentApi.method}
                </span>
                <span className="text-slate-400">https://api.telkomsel.co.id</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{currentApi.path}</span>
              </div>
              <button
                onClick={handleExecuteApi}
                disabled={isExecutingApi}
                className="px-5 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
              >
                {isExecutingApi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Kirim Test Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Request Headers & Specifications */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Request Headers (Standar TM Forum):
                </span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] space-y-1">
                  {Object.entries(currentApi.headers).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-slate-500">{k}:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[240px]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Spesifikasi & Standar Industri:
                </span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Standar:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{currentApi.standard}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Sistem:</span>
                    <strong className="text-slate-800 dark:text-slate-200">Centralized Fault & Performance Gateway</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Format Payload:</span>
                    <strong className="text-emerald-600 font-mono">application/json</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Response Panel */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-indigo-500" />
                  Respons Server (HTTP 200 OK):
                </span>
                {apiResponse && (
                  <span className="text-emerald-600 font-mono font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200">
                    Latency: 38ms • Status: 200 OK
                  </span>
                )}
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto min-h-[140px] border border-slate-800">
{apiResponse ? JSON.stringify(apiResponse, null, 2) : `// Klik tombol "Kirim Test Request" di atas untuk menjalankan simulasi HTTP REST call
// Hasil respons JSON sesuai skema resmi TM Forum / O-RAN akan muncul di sini.`}
              </pre>
            </div>
          </div>
        </section>
      )}

      {/* SUB-TAB 3: HYBRID CLOUD & K8S MANIFEST */}
      {activeSubTab === 'k8s' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#ED0226]" />
                  Topologi Hybrid-Cloud & Manifest Kubernetes Telkomsel
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Arsitektur deployment multi-tier berstandar Telkom Cloud Sentul/Surabaya & GCP Jakarta (asia-southeast2)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyManifest}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  {copiedManifest ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedManifest ? 'YAML Tersalin!' : 'Salin YAML'}</span>
                </button>
                <button
                  onClick={handleDownloadManifest}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Manifest K8s Telkomsel (.yaml)</span>
                </button>
              </div>
            </div>

            {/* Architecture Topology Tier Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Tier 1: Edge Security</span>
                <strong className="text-xs text-slate-900 dark:text-white block font-bold">WAF & Cloud Armor</strong>
                <p className="text-[10px] text-slate-500">DDoS Mitigation, TLS 1.3 Termination, Rate Limiting 10k req/s.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-sky-500 block">Tier 2: API Gateway</span>
                <strong className="text-xs text-slate-900 dark:text-white block font-bold">Envoy & Istio Mesh</strong>
                <p className="text-[10px] text-slate-500">mTLS 128-bit antar pod, JWT Validation, TM Forum routing.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-600 block">Tier 3: K8s Compute</span>
                <strong className="text-xs text-emerald-800 dark:text-emerald-300 block font-bold">Orchestrator Pods</strong>
                <p className="text-[10px] text-slate-500">HPA autoscale 3–12 pod, PINN neural inference, Non-RT RIC rApp.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-500 block">Tier 4: Event Mesh</span>
                <strong className="text-xs text-slate-900 dark:text-white block font-bold">Apache Kafka</strong>
                <p className="text-[10px] text-slate-500">3 Broker Cluster, 15-minute VES telemetry ingestion stream.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-purple-500 block">Tier 5: Database HA</span>
                <strong className="text-xs text-slate-900 dark:text-white block font-bold">TimescaleDB + Redis</strong>
                <p className="text-[10px] text-slate-500">Dual-DC Active-Active Streaming (Sentul & Surabaya), RPO &lt; 1m.</p>
              </div>
            </div>

            {/* High Availability SLA Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 via-white to-emerald-50 dark:from-slate-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Target SLA & Disaster Recovery (Active-Active Sentul vs Surabaya)
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Konfigurasi pod stateless memastikan failover otomatis tanpa kehilangan data transaksi energi.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                <div>
                  <span className="text-slate-400 text-[10px] block">Availability SLA</span>
                  <strong className="text-emerald-600 font-bold">99.99%</strong>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Target RPO</span>
                  <strong className="text-sky-600 font-bold">&lt; 1 Menit</strong>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                <div>
                  <span className="text-slate-400 text-[10px] block">Target RTO</span>
                  <strong className="text-sky-600 font-bold">&lt; 15 Menit</strong>
                </div>
              </div>
            </div>

            {/* Preview K8s Manifest Snippet */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Cuplikan Deployment Manifest (Kubernetes YAML Preview):
              </span>
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-[220px] border border-slate-800">
{generateTelkomselK8sManifest().slice(0, 1200)}
{"\n# ... [Gunakan tombol 'Unduh Manifest K8s Telkomsel' untuk mendapatkan file lengkap] ..."}
              </pre>
            </div>
          </div>
        </section>
      )}

      {/* SUB-TAB 4: PRIVACY & UU PDP COMPLIANCE */}
      {activeSubTab === 'privacy' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-[#ED0226]" />
                  Kepatuhan UU No. 27/2022 (UU PDP) & Kedaulatan Data Lokal
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Verifikasi residensi data di Indonesia dan mekanisme penyamaran telemetri (*PII zero-retention*)
                </p>
              </div>

              {/* Anonymization Toggle */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setIsAnonymized(false)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    !isAnonymized ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Data Mentah (Raw)
                </button>
                <button
                  onClick={() => setIsAnonymized(true)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isAnonymized ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Teranonymisasi (UU PDP)
                </button>
              </div>
            </div>

            {/* Data Sovereignty Proof Box */}
            <div className="grid gap-3 md:grid-cols-3">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Yurisdiksi Hukum Data:</span>
                <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  Republik Indonesia (PP 71/2019)
                </div>
                <p className="text-[10px] text-slate-500">100% server berada di Data Center Sentul & Surabaya.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Enkripsi In-Transit & At-Rest:</span>
                <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-sky-600" />
                  TLS 1.3 & AES-GCM-256
                </div>
                <p className="text-[10px] text-slate-500">Rotasi kunci otomatis setiap 90 hari melalui HSM Telkomsel.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Sertifikasi & Audit Standar:</span>
                <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  ISO 27001 & SOC 2 Type II
                </div>
                <p className="text-[10px] text-slate-500">Sesuai pedoman keamanan siber BSSN & CISO Telkom Group.</p>
              </div>
            </div>

            {/* Live Privacy Payload Inspector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {isAnonymized ? '✅ Payload Teranonymisasi (Sesuai UU PDP):' : '⚠️ Payload Mentah (Internal Vendor Only):'}
                </span>
                <span className="text-xs text-slate-500">
                  {isAnonymized ? 'Zero PII Exchanged • Cell IDs Masked with HMAC-SHA256' : 'Mengandung koordinat GPS mentah dan internal cell IDs'}
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs overflow-x-auto border border-slate-800 text-slate-200">
{isAnonymized ? JSON.stringify({
  tenantId: "TSEL-REG-JAMALI-01",
  siteToken: "HMAC_SHA256:7f8e3a2b1c4d9e0f...",
  region: "Jawa Barat - Cluster 04 (Masked)",
  prbUtilizationAggregated: "24.5%",
  powerTelemetryKwh: 4.82,
  subscriberPII: "STRIPPED_AT_INGRESS_GATEWAY",
  locationPrivacy: "FUZZED_GEOHASH_3KM",
  complianceStatus: "PASSED_UU_PDP_ARTICLE_20"
}, null, 2) : JSON.stringify({
  rawSiteName: "BDG-DGO-P04-TELKOMSEL-MACRO",
  exactGpsCoordinates: "-6.882104, 107.618921",
  physicalAddress: "Jl. Ir. H. Juanda No. 120, Dago, Bandung",
  connectedSubscribersActive: 842,
  btsCarrierFrequencies: ["900MHz_FDD", "1800MHz_FDD", "2100MHz_FDD", "2300MHz_TDD"],
  vendorHardwareId: "HUAWEI_BBU5900_SERIAL_99214A"
}, null, 2)}
              </pre>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
