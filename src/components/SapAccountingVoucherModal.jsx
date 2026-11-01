import React, { useState } from 'react';
import { 
  Printer, 
  X, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  DollarSign,
  Layers,
  Database
} from 'lucide-react';

import { computeClosedLoopReconciliation } from '../utils/enterpriseCommandAndClosedLoopEngine';

const SAP_VOUCHER_METADATA = {
  docNumber: 'SAP-2026-FI-088192',
  companyCode: '1000',
  companyName: 'PT Telekomunikasi Selular',
  fiscalYear: '2026',
  period: '10 (Oktober)',
  docType: 'SA (G/L Account Document)',
  postingDate: '30.10.2026',
  docDate: '30.10.2026',
  currency: 'IDR',
  reference: 'BA-RE/TSEL-NOPS/REG3/X/2026/0894',
  headerText: 'ImpactGrid O-RAN Energy Savings October 2026'
};

export default function SapAccountingVoucherModal({
  isOpen,
  onClose,
  resolvedSites = [],
  customByodSites = [],
  onResolveSiteAnomaly,
  onOpenOfficialBaRe,
  operationalState,
  onPostSapVoucher
}) {
  const [copiedBapi, setCopiedBapi] = useState(false);
  const [activeView, setActiveView] = useState('voucher'); // 'voucher' | 'bapi_payload'
  const [isPostingSap, setIsPostingSap] = useState(false);

  if (!isOpen) return null;

  const closedLoop = computeClosedLoopReconciliation(resolvedSites, customByodSites);
  const latestPostedVoucher = operationalState?.sapVouchers?.[0] || null;
  const journalItems = closedLoop.sapJournalItems;
  const sapBapiPayload = latestPostedVoucher?.bapiPayload || closedLoop.sapBapiPayload;
  const activeDocNumber = latestPostedVoucher?.docNumber || SAP_VOUCHER_METADATA.docNumber;

  const handleServerPostSap = async () => {
    if (!onPostSapVoucher) return;
    setIsPostingSap(true);
    try {
      await onPostSapVoucher({ siteId: 'BDG-DGO-P04' });
    } finally {
      setIsPostingSap(false);
    }
  };

  const handleCopyBapi = () => {
    navigator.clipboard?.writeText(JSON.stringify(sapBapiPayload, null, 2));
    setCopiedBapi(true);
    setTimeout(() => setCopiedBapi(false), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = ['Line', 'PK', 'GL_Account', 'Account_Name', 'Cost_Center', 'Profit_Center', 'Debit_IDR', 'Credit_IDR', 'Item_Text'];
    const rows = journalItems.map((item) => [
      item.line,
      item.pk,
      item.glAccount,
      `"${item.accountName}"`,
      item.costCenter,
      item.profitCenter,
      item.debitIDR,
      item.creditIDR,
      `"${item.text}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAP_FI_VOUCHER_${activeDocNumber.replace(/[\/\\]/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/85 p-2 sm:p-4 print:p-0 print:bg-white backdrop-blur-xs animate-fade-in">
      <div className="my-6 w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white text-slate-900 shadow-2xl print:my-0 print:rounded-none print:border-0 print:shadow-none print:max-w-none flex flex-col max-h-[92vh]">
        
        {/* Sticky Control Action Header */}
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-6 py-3.5 text-white print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold tracking-tight">Voucher Jurnal Akuntansi SAP S/4HANA &amp; BAST</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/50 text-[10px] font-bold text-blue-300">
                  {latestPostedVoucher ? `POSTED (${latestPostedVoucher.docNumber})` : 'SAP FI-CO Ready'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Doc: {activeDocNumber} • Plant 1102 (Telkomsel Jabar)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onPostSapVoucher && (
              <button
                type="button"
                disabled={isPostingSap}
                onClick={handleServerPostSap}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/60 bg-emerald-950/80 hover:bg-emerald-900 px-3 py-1.5 text-xs font-bold text-emerald-300 transition cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isPostingSap ? 'Posting BAPI...' : latestPostedVoucher ? 'Post Ulang BAPI' : 'Post ke SAP S/4HANA'}</span>
              </button>
            )}

            <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs flex">
              <button
                onClick={() => setActiveView('voucher')}
                className={`px-3 py-1 rounded-md font-bold transition cursor-pointer ${
                  activeView === 'voucher' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Voucher Cetak
              </button>
              <button
                onClick={() => setActiveView('bapi_payload')}
                className={`px-3 py-1 rounded-md font-bold transition cursor-pointer ${
                  activeView === 'bapi_payload' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                BAPI RFC JSON
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Unduh CSV</span>
            </button>

            <button
              onClick={handleCopyBapi}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              {copiedBapi ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedBapi ? 'Tersalin' : 'Salin BAPI'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-xs font-bold text-white transition cursor-pointer shadow-md"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak Voucher A4</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Tutup Voucher SAP"
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Printable Voucher Body */}
        <div className="p-6 sm:p-10 print:p-8 overflow-y-auto space-y-6 text-xs text-slate-900 leading-relaxed font-sans">
          
          {activeView === 'voucher' ? (
            <article className="space-y-6">
              
              {/* Official Corporate Header */}
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ED0226]">
                      PT TELEKOMUNIKASI SELULAR • DIVISI FINANCIAL ACCOUNTING &amp; TREASURY
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-0.5">
                      SAP S/4HANA JOURNAL VOUCHER (BAST KEUANGAN)
                    </h1>
                    <p className="text-xs text-slate-600 font-semibold">
                      Pengakuan Penghematan Energi O-RAN &amp; Akrual Bagi Hasil TowerCo (Bulan Oktober 2026)
                    </p>
                  </div>
                  <div className="text-right font-mono text-[11px] space-y-0.5 text-slate-600">
                    <div><strong>Company Code:</strong> 1000</div>
                    <div><strong>Doc Number:</strong> {SAP_VOUCHER_METADATA.docNumber}</div>
                    <div><strong>Doc Type:</strong> SA (G/L Account)</div>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500 block font-sans">Tanggal Posting:</span>
                    <strong className="text-slate-900">{SAP_VOUCHER_METADATA.postingDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-sans">Tahun Fiskal / Periode:</span>
                    <strong className="text-slate-900">2026 / 10</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-sans">Mata Uang:</span>
                    <strong className="text-slate-900">IDR (Rupiah)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-sans">Dokumen Referensi:</span>
                    <strong className="text-slate-900">{SAP_VOUCHER_METADATA.reference}</strong>
                  </div>
                </div>
              </div>

              {/* Journal Line Items Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 flex items-center justify-between">
                  <span>RINCIAN AKUN BUKU BESAR (GENERAL LEDGER ACCOUNTING ENTRIES)</span>
                  <span className="text-[10px] text-emerald-700 font-mono">BALANCE (DEBIT = CREDIT)</span>
                </h3>

                {/* Closed-Loop Status Banner */}
                <div className={`p-3 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 ${
                  closedLoop.isBdgResolved
                    ? 'border-emerald-300 bg-emerald-50/80 text-emerald-950'
                    : 'border-amber-300 bg-amber-50/80 text-amber-950'
                }`}>
                  <div>
                    <strong>Status Sinkronisasi Closed-Loop (FOP &rarr; BA-RE &rarr; SAP FI-CO):</strong>{' '}
                    {closedLoop.isBdgResolved
                      ? 'Item 004 & 005 (Nota Kredit Restitusi BDG-DGO-P04 senilai Rp 3.824.640) telah ditambahkan otomatis ke Buku Besar.'
                      : 'Menunggu penyelesaian WO FOP pada site BDG-DGO-P04 untuk memposting jurnal restitusi Nota Kredit Rp 3.824.640.'}
                  </div>
                  <div className="flex items-center gap-2 print:hidden">
                    {!closedLoop.isBdgResolved && onResolveSiteAnomaly && (
                      <button
                        type="button"
                        onClick={() => onResolveSiteAnomaly('BDG-DGO-P04')}
                        className="px-3 py-1 rounded-lg bg-[#ED0226] hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
                      >
                        Sinkronkan Resolusi FOP Sekarang
                      </button>
                    )}
                    {onOpenOfficialBaRe && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenOfficialBaRe();
                        }}
                        className="px-3 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs cursor-pointer"
                      >
                        Lihat Dokumen BA-RE
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-300 text-[11px]">
                  <table className="w-full text-left font-mono">
                    <thead className="bg-slate-100 text-slate-800 text-[10px] font-black uppercase">
                      <tr>
                        <th className="p-2 border-b border-r border-slate-300">Item</th>
                        <th className="p-2 border-b border-r border-slate-300">PK</th>
                        <th className="p-2 border-b border-r border-slate-300">Nomor Akun GL &amp; Deskripsi</th>
                        <th className="p-2 border-b border-r border-slate-300">Cost Center</th>
                        <th className="p-2 border-b border-r border-slate-300 text-right">Debit (IDR)</th>
                        <th className="p-2 border-b border-slate-300 text-right">Credit (IDR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {journalItems.map((item) => (
                        <tr key={item.item} className={Number(item.item) >= 4 ? 'bg-emerald-50/70' : ''}>
                          <td className="p-2 border-r border-slate-200">{item.item}</td>
                          <td className="p-2 border-r border-slate-200 font-bold">{item.postingKey}</td>
                          <td className="p-2 border-r border-slate-200 font-sans">
                            <span className="font-mono font-bold block">{item.glAccount}</span>
                            <span className="text-slate-700">{item.glName}</span>
                            <span className="text-[10px] text-slate-500 block font-mono">{item.text}</span>
                          </td>
                          <td className="p-2 border-r border-slate-200">{item.costCenter}</td>
                          <td className="p-2 border-r border-slate-200 text-right font-bold text-slate-900">
                            {item.postingKey.includes('40') ? `Rp ${item.amount.toLocaleString('id-ID')}` : '-'}
                          </td>
                          <td className="p-2 text-right font-bold text-emerald-700">
                            {item.postingKey.includes('50') ? `Rp ${item.amount.toLocaleString('id-ID')}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 font-black border-t-2 border-slate-400">
                      <tr>
                        <td colSpan={4} className="p-2 border-r border-slate-300 text-right font-sans">
                          TOTAL REKONSILIASI KEUANGAN (DEBIT = CREDIT):
                        </td>
                        <td className="p-2 border-r border-slate-300 text-right text-slate-900">
                          Rp {closedLoop.totalDebit.toLocaleString('id-ID')}
                        </td>
                        <td className="p-2 text-right text-emerald-700">
                          Rp {closedLoop.totalCredit.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Cost Object & WBS Allocations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-[11px]">
                <div>
                  <strong className="block text-slate-900">Cost Center Pengendali:</strong>
                  <span className="font-mono">CC-REG3-NOPS</span>
                  <p className="text-[10px] text-slate-500">Network Operations Regional Jawa Barat</p>
                </div>
                <div>
                  <strong className="block text-slate-900">Profit Center:</strong>
                  <span className="font-mono">PC-TSEL-RETAIL</span>
                  <p className="text-[10px] text-slate-500">Layanan Seluler &amp; Broadband Konsumer</p>
                </div>
                <div>
                  <strong className="block text-slate-900">WBS Inisiatif Hijau:</strong>
                  <span className="font-mono">WBS-2026-TSEL-RAN-ENERGY-01</span>
                  <p className="text-[10px] text-slate-500">Program ESG &amp; Efisiensi Menara Nasional</p>
                </div>
              </div>

              {/* BAST Official Sign-off Block */}
              <div className="pt-4 border-t-2 border-slate-900 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
                  TANDA TANGAN PENGESAHAN DOKUMEN SERAH TERIMA (BAST KEUANGAN)
                </h3>
                <div className="grid grid-cols-2 gap-8 text-center text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Diserahkan Oleh:</span>
                    <div className="h-14 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-emerald-700 font-bold bg-emerald-50/50">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      TERVERIFIKASI DIGITAL (NIK: 8810429)
                    </div>
                    <strong className="block text-slate-900 underline">Ir. Bambang Sugiarto, M.T.</strong>
                    <span className="text-[10px] text-slate-500 block">VP Network Operations Jawa Barat</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Disetujui &amp; Diposting Oleh:</span>
                    <div className="h-14 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-blue-700 font-bold bg-blue-50/50">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      SAP S/4HANA POSTED (NIK: 9102441)
                    </div>
                    <strong className="block text-slate-900 underline">Dra. Ratna Kusuma, Ak., CA.</strong>
                    <span className="text-[10px] text-slate-500 block">General Manager Financial Accounting</span>
                  </div>
                </div>
              </div>

            </article>
          ) : (
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Payload Resmi SAP BAPI_ACC_DOCUMENT_POST (JSON RFC Interface):
                </span>
                <span className="text-[11px] text-slate-500">
                  Format Kompatibel SAP NetWeaver Gateway &amp; S/4HANA Cloud
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs overflow-x-auto border border-slate-800">
{JSON.stringify(sapBapiPayload, null, 2)}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
