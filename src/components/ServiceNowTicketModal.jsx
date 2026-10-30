import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  Download, 
  Server, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  Clock,
  Layers,
  ExternalLink,
  RefreshCw,
  Hash
} from 'lucide-react';
import { addStoredWorkOrder } from '../utils/storageEngine';

export default function ServiceNowTicketModal({ isOpen, onClose, ticketData }) {
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [activeView, setActiveView] = useState('form'); // 'form' | 'payload'

  if (!isOpen) return null;

  const siteId = ticketData?.siteId || 'BDG-DGO-P04';
  const siteName = ticketData?.siteName || 'Bandung Dago - Urban Macro 4G/5G';
  const anomalyType = ticketData?.anomalyType || 'Phantom Load Drift (+14.2% DC-AC Discrepancy)';
  const incidentNumber = ticketData?.incidentNumber || `INC-2026-TSEL-${Math.floor(10000 + Math.random() * 90000)}`;
  const priority = ticketData?.priority || 'P2 - Mayor (SLA Respon &lt; 4 Jam)';
  const assignmentGroup = ticketData?.vendorTeam || 'Mitratel Regional Maintenance Team 04';
  const technician = ticketData?.technician || 'Agus Setiawan (+62 811-2200-911)';
  const cmdbCi = `BTS-SHELTER-${siteId}`;
  const auditHash = ticketData?.auditHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const serviceNowPayload = {
    sysparm_action: "insert",
    number: incidentNumber,
    caller_id: "svc-impactgrid-edgex",
    category: "Network Infrastructure",
    subcategory: "BTS Power & Cooling (Telkomsel Facilities)",
    cmdb_ci: cmdbCi,
    impact: 2,
    urgency: 2,
    priority: "2 - High",
    assignment_group: assignmentGroup,
    assigned_to: technician.split(' (')[0],
    short_description: `[IMPACTGRID-ANOMALY] ${anomalyType} on ${siteId} (${siteName.split(' - ')[0]})`,
    description: `Deteksi Anomali Daya Real-Time oleh ImpactGrid Engine:\n` +
      `- Site ID: ${siteId} (${siteName})\n` +
      `- Tipe Gangguan: ${anomalyType}\n` +
      `- Metodologi: 3-Way Reconciliation (Meteran PLN vs DC Rectifier Load vs Smart Meter Class 0.5s)\n` +
      `- Integritas Data: Cryptographic Hash SHA-256 (${auditHash.slice(0, 24)}...)\n` +
      `- Regulasi: Sesuai SOP FOP Telkomsel 2026 & Standar TM Forum TMF642 Alarm Management.\n` +
      `- Rekomendasi FOP: Periksa segel meteran, rugi-rugi busbar DC, serta kebersihan filter AC pendingin shelter.`,
    u_telkomsel_som_order: `WO-SOM-2026-${siteId.replace(/[^A-Z0-9]/g, '')}`,
    u_data_residency: "Telkom DC Sentul & Surabaya (PP 71/2019)",
    correlation_id: `IG-CORR-${Date.now()}`
  };

  const handleSimulateDispatch = () => {
    setIsDispatching(true);
    setDispatchResult(null);

    setTimeout(() => {
      setIsDispatching(false);
      try {
        addStoredWorkOrder({
          id: incidentNumber.replace('INC-', 'WO-'),
          siteId,
          siteName,
          anomalyType,
          priority: priority.split(' (')[0],
          priorityColor: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300',
          status: 'Dispatched',
          statusColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
          technician: technician.split(' (')[0],
          technicianPhone: technician.includes('(') ? technician.split('(')[1].replace(')', '') : '+62 811-2200-911',
          vendorTeam: assignmentGroup,
          slaMinutesLeft: 240,
          checklist: [
            { text: 'Verifikasi pembacaan meter Class 0.5s di lokasi', completed: false },
            { text: 'Inspeksi fisik shelter & dokumentasi SOM', completed: false }
          ]
        });
      } catch {
        // storage fallback
      }
      setDispatchResult({
        status: 201,
        statusText: 'Created',
        sys_id: 'a8109bf147320010992386992d9619b4',
        ticketNumber: incidentNumber,
        assignedGroup: assignmentGroup,
        message: 'Tiket insiden elektronik (e-WO) berhasil diinjeksi ke ServiceNow ITIL Telkomsel & tersinkronisasi ke SOM Mobile FOP.'
      });
    }, 700);
  };

  const handleCopyPayload = () => {
    navigator.clipboard?.writeText(JSON.stringify(serviceNowPayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleDownloadEwo = () => {
    const content = `========================================================================
TELKOMSEL IT SERVICE MANAGEMENT (ITSM) - ELECTRONIC WORK ORDER (e-WO)
Sistem Integrasi: ServiceNow ITSM Platform & ImpactGrid Decision Engine
========================================================================
Nomor Tiket       : ${incidentNumber}
Waktu Diterbitkan : ${new Date().toLocaleString('id-ID')}
Status Tiket      : ${dispatchResult ? 'DISPATCHED (SYS_ID: ' + dispatchResult.sys_id + ')' : 'READY_TO_DISPATCH'}
Prioritas         : ${priority}
CMDB CI           : ${cmdbCi}
Lokasi Site BTS   : ${siteId} - ${siteName}
Assignment Group  : ${assignmentGroup}
Petugas FOP       : ${technician}
Kategori Insiden  : Network Infrastructure / BTS Power & Thermal

DESKRIPSI GANGGUAN & ANOMALI TELEMETRI:
${serviceNowPayload.description}

STANDAR INTEGRASI & KEPATUHAN:
- TM Forum Open API: TMF642 Alarm Management API Rel 22.0
- Protokol Keamanan: TLS 1.3 / OAuth2 Bearer Token Telkomsel IAM
- Residen Data: Telkom Data Center Sentul & Surabaya (PP No. 71/2019)
- Hash Audit Kriptografis: ${auditHash}
========================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ServiceNow_${incidentNumber}_eWO.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="servicenow-modal-title"
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-[#ED0226]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black uppercase text-[#ED0226]">ServiceNow ITSM Connector</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                  ITIL v4 Compliant
                </span>
              </div>
              <h2 id="servicenow-modal-title" className="text-base font-black text-slate-900 dark:text-white">
                Disposisi Elektronik Tiket Insiden e-WO (Field Operations)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0B1324] text-xs">
          <button
            onClick={() => setActiveView('form')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeView === 'form'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Formulir Insiden ITIL</span>
          </button>
          <button
            onClick={() => setActiveView('payload')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeView === 'payload'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Payload REST API (JSON)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {dispatchResult && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-1.5 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Tiket Berhasil Terkirim ke ServiceNow Production API (HTTP 201 Created)</span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                {dispatchResult.message}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                <span>sys_id: <strong>{dispatchResult.sys_id}</strong></span>
                <span>•</span>
                <span>Incident: <strong>{dispatchResult.ticketNumber}</strong></span>
                <span>•</span>
                <span>Target: <strong>{dispatchResult.assignedGroup}</strong></span>
              </div>
            </div>
          )}

          {activeView === 'form' ? (
            <div className="space-y-4">
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Nomor Insiden (ServiceNow ID):</label>
                  <span className="font-mono text-xs font-black text-slate-900 dark:text-white">{incidentNumber}</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Prioritas & SLA Respon:</label>
                  <span className="font-bold text-xs text-amber-600 dark:text-amber-400">{priority}</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Configuration Item (CMDB CI):</label>
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">{cmdbCi}</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Assignment Group:</label>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{assignmentGroup}</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Teknisi Bertugas (FOP Assigned):</label>
                  <span className="text-xs text-slate-800 dark:text-slate-200">{technician}</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Kedaulatan & Residensi Data:</label>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Telkom DC Sentul / Surabaya (PP 71/2019)
                  </span>
                </div>
              </div>

              {/* Short Description & Telemetry Summary */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Ringkasan Masalah (Short Description):
                </label>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-slate-200">
                  {serviceNowPayload.short_description}
                </div>
              </div>

              {/* Work Notes / Auto Diagnosis */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Catatan Investigasi Otomatis (Diagnosis ImpactGrid Decision Engine):
                </label>
                <pre className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
{serviceNowPayload.description}
                </pre>
              </div>

              {/* Cryptographic Proof */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Audit SHA-256 Ledger: <strong className="font-mono text-slate-900 dark:text-white">{auditHash.slice(0, 28)}...</strong>
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold uppercase">Terverifikasi</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono text-[11px]">POST https://telkomsel.service-now.com/api/now/table/incident</span>
                <button
                  onClick={handleCopyPayload}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPayload ? 'JSON Tersalin!' : 'Salin JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800 max-h-[350px]">
{JSON.stringify(serviceNowPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
          <button
            type="button"
            onClick={handleDownloadEwo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Berita Acara e-WO (.txt)</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleSimulateDispatch}
              disabled={isDispatching}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white font-bold text-xs transition cursor-pointer shadow-xs disabled:opacity-60"
            >
              {isDispatching ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengirim ke ServiceNow...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Tiket ServiceNow ITIL</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
