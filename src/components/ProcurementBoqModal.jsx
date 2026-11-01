import React, { useState, useMemo } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Copy,
  Check,
  Download,
  Layers,
  Scale,
  Wrench,
  Sparkles,
  Upload,
  ArrowRight
} from 'lucide-react';
import {
  calculateBoqSummary,
  computeSlaPenaltyShield
} from '../utils/enterpriseCommandAndClosedLoopEngine';

const TELKOMSEL_DIFFERENTIATION_MATRIX = [
  {
    dimension: 'Sumber Data & Visibilitas Lintas-Silo',
    existingTools: 'Terpisah di 3 silo: ENM/iMaster NCE hanya melihat RF radio; PLN Corporate/SAP hanya melihat tagihan bulanan IDPEL; Mitratel hanya memegang log shelter.',
    impactGridAdvantage: 'Triangulasi 3-Arah Real-Time (PLN AC + Submeter DC 48V + OSS Radio PRB) dalam 1 konsol terpadu.',
    dayOneValue: 'Langsung mendeteksi Phantom Power / kebocoran arus shelter (>8%) yang selama ini tak terlihat di NMS radio.'
  },
  {
    dimension: 'Orkestrasi Multi-Vendor (Ericsson, Huawei, ZTE)',
    existingTools: 'Fitur hemat daya bawaan vendor bersifat tertutup (vendor lock-in) dan hanya mengontrol merek radionya sendiri tanpa peduli suhu shelter.',
    impactGridAdvantage: 'Vendor-Neutral Non-RT RIC rApp via standar terbuka O-RAN WG10 (O1 NETCONF/YANG) yang menggabungkan telemetri termal shelter + radio.',
    dayOneValue: 'Mencegah kerusakan kompartemen baterai akibat carrier sleep yang buta terhadap kenaikan suhu AC shelter.'
  },
  {
    dimension: 'Bukti Kausalitas Finansial & Auditabilitas OJK/KAP',
    existingTools: 'Klaim penghematan sering diperdebatkan Finance karena tercampur fluktuasi trafik musiman dan cuaca.',
    impactGridAdvantage: 'Ekonometrika Difference-in-Differences (40 Intervensi vs 10 Kontrol) + SHA-256 Merkle Ledger + Auto-Generator BA-RE & Jurnal SAP S/4HANA.',
    dayOneValue: 'Tim Finance & ESG Telkomsel langsung memperoleh dokumen siap-audit (POJK 51/2017 & BAPI SAP) tanpa olah Excel manual.'
  },
  {
    dimension: 'Jaminan Keselamatan Publik & Panggilan Darurat 112',
    existingTools: 'Konfigurasi power-saving statis berbasis jam malam berisiko menahan kapasitas saat terjadi bencana atau lonjakan mendadak.',
    impactGridAdvantage: 'Guardrail Near-RT xApp (< 28ms Zero-Wait Wake-Up) dengan prioritas mutlak panggilan darurat 112 dan rollback otomatis 120 detik.',
    dayOneValue: 'Nol kompromi terhadap SLA Radio Availability (>99.99%) dan Call Drop Rate (<0.20%).'
  }
];

const SAMPLE_BYOD_PLN_OSS_ROWS = [
  { idpel: '531002948101', siteId: 'BDG-DGO-P04', plnKwh: 2772.0, dcRectifierKwh: 2174.4, avgPrbPct: 18.4, tempC: 34.8 },
  { idpel: '531002948102', siteId: 'JKT-SEL-P01', plnKwh: 2966.4, dcRectifierKwh: 2556.0, avgPrbPct: 31.2, tempC: 27.4 },
  { idpel: '531002948103', siteId: 'SBY-GUB-P02', plnKwh: 3180.0, dcRectifierKwh: 2740.0, avgPrbPct: 14.2, tempC: 26.9 }
];

export default function ProcurementBoqModal({ isOpen, onClose, onOpenBaRe, onOpenSapVoucher, onOpenFieldConsole }) {
  const [activeTab, setActiveTab] = useState('boq'); // 'boq' | 'sla_shield' | 'differentiator'
  const [selectedPhase, setSelectedPhase] = useState('phase1_pilot');
  const [contingencyPct, setContingencyPct] = useState(0);
  const [copiedRks, setCopiedRks] = useState(false);

  // Interactive SLA Shield Sliders
  const [simCdr, setSimCdr] = useState(0.06);
  const [simLatency, setSimLatency] = useState(24);
  const [simTemp, setSimTemp] = useState(27.4);

  // Interactive BYOD Quick Audit
  const [byodTariff, setByodTariff] = useState(1500);

  const boqSummary = useMemo(
    () => calculateBoqSummary(selectedPhase, contingencyPct),
    [selectedPhase, contingencyPct]
  );

  const slaShield = useMemo(
    () => computeSlaPenaltyShield({
      callDropRatePct: simCdr,
      wakeUpLatencyMs: simLatency,
      shelterTempC: simTemp,
      siteCount: 40
    }),
    [simCdr, simLatency, simTemp]
  );

  if (!isOpen) return null;

  const handleCopyRks = () => {
    const payload = {
      documentCode: boqSummary.code,
      title: boqSummary.title,
      ceilingIDR: boqSummary.ceilingIDR,
      grandTotalIDR: boqSummary.grandTotalIDR,
      weightedTkdnPct: boqSummary.weightedTkdnPct,
      meetsBumnTkdnMandate: boqSummary.meetsBumnTkdnMandate,
      items: boqSummary.lineItems,
      slaProtection: slaShield
    };
    navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
    setCopiedRks(true);
    setTimeout(() => setCopiedRks(false), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = ['Kode_Item', 'Uraian_Komponen_Pengadaan', 'Kategori', 'Kuantitas', 'Satuan', 'Harga_Satuan_IDR', 'Total_Harga_IDR', 'TKDN_Pct'];
    const rows = boqSummary.lineItems.map((item) => [
      item.id,
      `"${item.item}"`,
      `"${item.category}"`,
      item.qty,
      `"${item.unit}"`,
      item.unitPriceIDR,
      item.totalIDR,
      item.tkdnPct
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RKS_BOQ_TSEL_${boqSummary.code.replace(/[\/\\]/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-950/85 p-2 sm:p-4 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="procurement-boq-title"
    >
      <div className="my-6 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-6 py-4 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ED0226] text-white">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="procurement-boq-title" className="text-sm sm:text-base font-black tracking-tight">
                Dokumen Pengadaan RKS / BoQ, Proteksi SLA &amp; Diferensiasi Plug-and-Play Telkomsel
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Ref: {boqSummary.code} • Kepatuhan TKDN BUMN &ge; 40% • PP No. 71/2019 On-Premise
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unduh CSV BoQ</span>
            </button>
            <button
              type="button"
              onClick={handleCopyRks}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              {copiedRks ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRks ? 'RKS Tersalin' : 'Salin JSON RKS'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#ED0226] hover:bg-red-700 px-3.5 py-1.5 text-xs font-bold text-white transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak RKS</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Modal Pengadaan BoQ"
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Sub-Navigation Bar */}
        <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('boq')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'boq'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              1. Bill of Quantities (BoQ) &amp; TKDN
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sla_shield')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'sla_shield'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              2. Simulasi Klausul Penalti SLA &amp; QoS Shield
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('differentiator')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'differentiator'
                  ? 'bg-[#ED0226] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              3. Diferensiasi vs Tool Internal Telkomsel &amp; Plug-and-Play
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            TKDN Tertimbang: <strong className="text-emerald-600 dark:text-emerald-400">{boqSummary.weightedTkdnPct}% (&ge;40% Lulus)</strong>
          </span>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: BILL OF QUANTITIES (BOQ) & RKS */}
          {activeTab === 'boq' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedPhase('g0_audit'); setContingencyPct(0); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      selectedPhase === 'g0_audit'
                        ? 'border-[#ED0226] bg-red-50 text-[#ED0226] dark:bg-red-950/40 dark:text-red-300'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Fase 0: Audit Kesiapan Pra-Pilot (Plafon Rp 95 Juta)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedPhase('phase1_pilot'); setContingencyPct(0); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      selectedPhase === 'phase1_pilot'
                        ? 'border-[#ED0226] bg-red-50 text-[#ED0226] dark:bg-red-950/40 dark:text-red-300'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Fase 1: Turn-Key Pilot 50 Site (Plafon Rp 450 Juta)
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <label htmlFor="boq-contingency-slider" className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    Simulasi Kontingensi Pengadaan: {contingencyPct}%
                  </label>
                  <input
                    id="boq-contingency-slider"
                    type="range"
                    min="0"
                    max="15"
                    step="5"
                    value={contingencyPct}
                    onChange={(e) => setContingencyPct(Number(e.target.value))}
                    className="w-24 accent-[#ED0226]"
                  />
                </div>
              </div>

              {/* Summary KPI Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Plafon Anggaran Komite</span>
                  <strong className="text-lg font-black font-mono tabular-nums text-slate-900 dark:text-white mt-0.5 block">
                    Rp {boqSummary.ceilingIDR.toLocaleString('id-ID')}
                  </strong>
                  <span className="text-[10px] text-slate-500">{boqSummary.durationLabel}</span>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Total BoQ (+Kontingensi {boqSummary.contingencyPct}%)</span>
                  <strong className="text-lg font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    Rp {boqSummary.grandTotalIDR.toLocaleString('id-ID')}
                  </strong>
                  <span className="text-[10px] text-slate-500">
                    {boqSummary.isWithinCeiling ? 'Sesuai Plafon Anggaran' : 'Melewati Plafon Dasar (Termasuk Cadangan)'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Kepatuhan TKDN BUMN</span>
                  <strong className="text-lg font-black font-mono tabular-nums text-slate-900 dark:text-white mt-0.5 block">
                    {boqSummary.weightedTkdnPct}%
                  </strong>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    Memenuhi Syarat &ge;40% Permenperin
                  </span>
                </div>
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Skema Kontrak</span>
                  <strong className="text-xs font-black text-slate-900 dark:text-white mt-1 block leading-snug">
                    {boqSummary.contractType}
                  </strong>
                </div>
              </div>

              {/* BoQ Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase">
                    <tr>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Kode</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Komponen Pengadaan &amp; Spesifikasi Teknis RKS</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800 text-right">Volume</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800 text-right">Harga Satuan</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800 text-right">TKDN</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Lead Time</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800 text-right">Subtotal (IDR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {boqSummary.lineItems.map((item) => (
                      <tr key={item.code} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40">
                        <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{item.code}</td>
                        <td className="p-3">
                          <strong className="font-bold text-slate-900 dark:text-white block">{item.component}</strong>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.spec}</span>
                        </td>
                        <td className="p-3 text-right font-mono tabular-nums whitespace-nowrap">
                          {item.qty} {item.unit}
                        </td>
                        <td className="p-3 text-right font-mono tabular-nums whitespace-nowrap">
                          Rp {item.unitCostIDR.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-bold">
                          {item.tkdnPct}%
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {item.leadTime}
                        </td>
                        <td className="p-3 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          Rp {item.subtotalIDR.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 dark:bg-slate-900 font-black border-t-2 border-slate-300 dark:border-slate-700">
                    <tr>
                      <td colSpan={6} className="p-3 text-right">TOTAL ANGGARAN DASAR (BASE BOQ):</td>
                      <td className="p-3 text-right font-mono tabular-nums text-slate-900 dark:text-white">
                        Rp {boqSummary.baseTotalIDR.toLocaleString('id-ID')}
                      </td>
                    </tr>
                    {boqSummary.contingencyIDR > 0 && (
                      <tr>
                        <td colSpan={6} className="p-3 text-right text-amber-700 dark:text-amber-400">
                          CADANGAN KONTINGENSI RISIKO ({boqSummary.contingencyPct}%):
                        </td>
                        <td className="p-3 text-right font-mono tabular-nums text-amber-700 dark:text-amber-400">
                          Rp {boqSummary.contingencyIDR.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={6} className="p-3 text-right text-emerald-700 dark:text-emerald-400">
                        GRAND TOTAL PENGADAAN RKS:
                      </td>
                      <td className="p-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 text-sm">
                        Rp {boqSummary.grandTotalIDR.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: SLA PENALTY & QOS INSURANCE SHIELD */}
          {activeTab === 'sla_shield' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Simulator Klausul Proteksi SLA &amp; Indemnitas Finansial (Zero Telkomsel Risk)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Uji bagaimana kontrak RKS melindungi Telkomsel secara otomatis jika terjadi pelanggaran batas Call Drop Rate (&gt;0.20%), keterlambatan Wake-Up (&gt;28ms), atau anomali suhu shelter (&gt;32.0°C).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="sla-cdr-slider" className="font-bold text-slate-800 dark:text-slate-200">
                      Call Drop Rate (CDR)
                    </label>
                    <span className={`font-mono font-black ${slaShield.breaches.cdrBreach ? 'text-red-600' : 'text-emerald-600'}`}>
                      {simCdr.toFixed(2)}% (Batas: 0.20%)
                    </span>
                  </div>
                  <input
                    id="sla-cdr-slider"
                    type="range"
                    min="0.04"
                    max="0.35"
                    step="0.01"
                    value={simCdr}
                    onChange={(e) => setSimCdr(Number(e.target.value))}
                    className="w-full accent-[#ED0226]"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="sla-latency-slider" className="font-bold text-slate-800 dark:text-slate-200">
                      Wake-Up Latency xApp
                    </label>
                    <span className={`font-mono font-black ${slaShield.breaches.latencyBreach ? 'text-red-600' : 'text-emerald-600'}`}>
                      {simLatency} ms (Batas: 28 ms)
                    </span>
                  </div>
                  <input
                    id="sla-latency-slider"
                    type="range"
                    min="12"
                    max="45"
                    step="1"
                    value={simLatency}
                    onChange={(e) => setSimLatency(Number(e.target.value))}
                    className="w-full accent-[#ED0226]"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="sla-temp-slider" className="font-bold text-slate-800 dark:text-slate-200">
                      Suhu Ambient Shelter
                    </label>
                    <span className={`font-mono font-black ${slaShield.breaches.tempBreach ? 'text-red-600' : 'text-emerald-600'}`}>
                      {simTemp.toFixed(1)}°C (Batas: 32.0°C)
                    </span>
                  </div>
                  <input
                    id="sla-temp-slider"
                    type="range"
                    min="23.0"
                    max="36.0"
                    step="0.2"
                    value={simTemp}
                    onChange={(e) => setSimTemp(Number(e.target.value))}
                    className="w-full accent-[#ED0226]"
                  />
                </div>
              </div>

              {/* Shield Result Card */}
              <div className={`p-5 rounded-2xl border ${
                slaShield.breaches.anyBreach
                  ? 'border-amber-300 bg-amber-50/70 dark:border-amber-800 dark:bg-amber-950/30'
                  : 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/30'
              } space-y-3`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Status Guardrail &amp; Klausul Kontrak: {slaShield.protectionStatus}
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Eksposur Kerugian Bersih Telkomsel: Rp {slaShield.telkomselNetRiskExposureRp.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Denda Pinalti Sewa TowerCo (Pasal 14 Termal):</span>
                    <strong className="text-sm font-mono font-black text-slate-900 dark:text-white">
                      Rp {slaShield.towerCoThermalPenaltyRp.toLocaleString('id-ID')}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Restitusi Jaminan QoS Vendor (Service Credit):</span>
                    <strong className="text-sm font-mono font-black text-slate-900 dark:text-white">
                      Rp {slaShield.vendorQosCreditRp.toLocaleString('id-ID')}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Total Indemnitas Terlindungi Kontrak:</span>
                    <strong className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">
                      Rp {slaShield.totalProtectedIndemnityRp.toLocaleString('id-ID')}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DIFFERENTIATION VS EXISTING TELKOMSEL TOOLS & BYOD PLUG-AND-PLAY */}
          {activeTab === 'differentiator' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-1.5">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Mengapa ImpactGrid Berbeda dari Sistem Eksisting Telkomsel (ENM / iMaster NCE / SAP BI) &amp; Siap Pakai Hari Pertama
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  ImpactGrid <strong>bukan pengganti</strong> EMS radio Ericsson/Huawei maupun ERP SAP, melainkan <strong>Cross-Silo Intelligence &amp; Settlement Bridge</strong> yang menghubungkan data kelistrikan PLN, kesehatan termal shelter TowerCo, dan utilisasi PRB radio menjadi keputusan finansial &amp; hukum otomatis.
                </p>
              </div>

              {/* Comparison Matrix */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase">
                    <tr>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800 w-1/5">Dimensi Operasional</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800 w-2/5">Sistem Eksisting Telkomsel Saat Ini (Siloed)</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800 w-2/5">Keunggulan Unik ImpactGrid (Cross-Silo DSS)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {TELKOMSEL_DIFFERENTIATION_MATRIX.map((row) => (
                      <tr key={row.dimension} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
                        <td className="p-3 font-bold text-slate-900 dark:text-white align-top">{row.dimension}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 align-top">{row.existingTools}</td>
                        <td className="p-3 align-top space-y-1">
                          <strong className="text-slate-900 dark:text-white block">{row.impactGridAdvantage}</strong>
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold block">
                            Nilai Hari-1: {row.dayOneValue}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Day-1 Plug-and-Play BYOD Tariff & IDPEL Reconciler */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#ED0226]">
                      Simulasi Plug-and-Play Hari Pertama: Rekonsiliasi Instan IDPEL PLN vs Counter OSS Telkomsel
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Ubah tarif efektif PLN B-2/B-3 di bawah ini untuk melihat bagaimana tim Regional Network Operations Telkomsel bisa langsung menghitung klaim Nota Kredit (BA-RE) dari data tagihan mereka:
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="byod-tariff-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Tarif PLN (Rp/kWh):
                    </label>
                    <input
                      id="byod-tariff-input"
                      type="number"
                      min="1200"
                      max="2500"
                      step="50"
                      value={byodTariff}
                      onChange={(e) => setByodTariff(Number(e.target.value) || 1500)}
                      className="w-24 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SAMPLE_BYOD_PLN_OSS_ROWS.map((row) => {
                    const deltaKwh = Math.max(0, row.plnKwh - row.dcRectifierKwh * 1.15);
                    const disputeRp = Math.round(deltaKwh * byodTariff);
                    return (
                      <div key={row.idpel} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{row.siteId}</span>
                          <span className="font-mono text-[10px] text-slate-500">IDPEL: {row.idpel}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                          PLN: {row.plnKwh} kWh · DC: {row.dcRectifierKwh} kWh · PRB: {row.avgPrbPct}%
                        </div>
                        <div className="pt-1 flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-500">Potensi Klaim BA-RE:</span>
                          <span className={disputeRp > 100000 ? 'text-red-600 font-mono' : 'text-emerald-600 font-mono'}>
                            Rp {disputeRp.toLocaleString('id-ID')}/bln
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                  {onOpenFieldConsole && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onOpenFieldConsole(); }}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      1. Buka FOP Mobile e-WO
                    </button>
                  )}
                  {onOpenBaRe && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onOpenBaRe(); }}
                      className="px-3.5 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                    >
                      2. Terbitkan Berita Acara (BA-RE)
                    </button>
                  )}
                  {onOpenSapVoucher && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onOpenSapVoucher(); }}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
                    >
                      3. Posting Jurnal SAP S/4HANA
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
