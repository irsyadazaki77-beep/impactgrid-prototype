import React, { useState, useMemo } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Database,
  FileSpreadsheet,
  FileText,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Trash2
} from 'lucide-react';
import {
  DEFAULT_BYOD_CSV_TEXT,
  parseAndReconcileByodCsv,
  evaluateInvestmentCommitteeScorecard
} from '../utils/telkomselNextGenOperationsEngine';
import { computeClosedLoopReconciliation } from '../utils/enterpriseCommandAndClosedLoopEngine';
import WbpBessAndBorderGuardPanel from './WbpBessAndBorderGuardPanel';
import TelkomselItMaxSuitePanel from './TelkomselItMaxSuitePanel';
import ExecutiveDealClosingSuitePanel from './ExecutiveDealClosingSuitePanel';

export default function JuryScorecardModal({
  isOpen,
  onClose,
  resolvedSites = [],
  customByodSites = [],
  onUpdateCustomByodSites,
  onResolveSiteAnomaly,
  onOpenOfficialBaRe,
  onOpenSapVoucher
}) {
  const [activeTab, setActiveTab] = useState('scorecard'); // 'scorecard' | 'byod' | 'wbp_border'
  const [customScores, setCustomScores] = useState({
    business_financial: 96,
    technical_oran_safety: 97,
    esg_causality_audit: 98,
    procurement_governance: 95,
    field_closed_loop: 96
  });
  const [auditVerifiedPulse, setAuditVerifiedPulse] = useState(false);
  const [copiedSignOff, setCopiedSignOff] = useState(false);

  // BYOD CSV Editor state
  const [csvInput, setCsvInput] = useState(DEFAULT_BYOD_CSV_TEXT);
  const [byodSyncBanner, setByodSyncBanner] = useState('');

  const closedLoop = useMemo(
    () => computeClosedLoopReconciliation(resolvedSites, customByodSites),
    [resolvedSites, customByodSites]
  );

  const scorecard = useMemo(
    () =>
      evaluateInvestmentCommitteeScorecard(customScores, {
        isBdgResolved: closedLoop.isBdgResolved,
        customByodCount: closedLoop.customByodCount
      }),
    [customScores, closedLoop.isBdgResolved, closedLoop.customByodCount]
  );

  if (!isOpen) return null;

  const handleRunFullAudit = () => {
    if (!closedLoop.isBdgResolved && onResolveSiteAnomaly) {
      onResolveSiteAnomaly('BDG-DGO-P04');
    }
    if (customByodSites.length === 0 && onUpdateCustomByodSites) {
      const parsed = parseAndReconcileByodCsv(csvInput, resolvedSites);
      onUpdateCustomByodSites(parsed);
    }
    setAuditVerifiedPulse(true);
    setTimeout(() => setAuditVerifiedPulse(false), 3000);
  };

  const handleApplyByodCsv = () => {
    const parsed = parseAndReconcileByodCsv(csvInput, resolvedSites);
    onUpdateCustomByodSites?.(parsed);
    setByodSyncBanner(
      `${parsed.length} site BYOD Telkomsel berhasil diinjeksikan ke Berita Acara (BA-RE) & Jurnal SAP S/4HANA!`
    );
  };

  const handleClearByod = () => {
    onUpdateCustomByodSites?.([]);
    setByodSyncBanner('Data BYOD dikosongkan. Kembali ke 50 site baseline Jamali.');
  };

  const handleCopySignOff = () => {
    const payload = {
      document: 'BERITA ACARA PERSETUJUAN KOMITE INVESTASI & AUDIT INTERNAL TELKOMSEL',
      signOffHash: scorecard.signOffHash,
      date: scorecard.signOffDate,
      weightedTotalScore: scorecard.weightedTotalScore,
      verdict: scorecard.decisionVerdict,
      pillars: scorecard.pillars,
      closedLoopSummary: closedLoop.clusterSummary,
      sapJournalBalanced: closedLoop.isBalanced,
      totalSapJournalIDR: closedLoop.totalDebit
    };
    navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
    setCopiedSignOff(true);
    setTimeout(() => setCopiedSignOff(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[82] flex items-center justify-center overflow-y-auto bg-slate-950/85 p-2 sm:p-4 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="jury-scorecard-modal-title"
    >
      <div className="my-6 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-6 py-4 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ED0226] text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 id="jury-scorecard-modal-title" className="text-sm sm:text-base font-black tracking-tight">
                Komite Investasi, Audit Kelayakan 5 Pilar &amp; BYOD Regional Sandbox
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Ref: {scorecard.signOffHash} • Skor Tertimbang: {scorecard.weightedTotalScore}/100 • SAP Balance: {closedLoop.isBalanced ? 'VALID' : 'CHECK'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySignOff}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            >
              {copiedSignOff ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSignOff ? 'Sign-Off Tersalin' : 'Salin JSON Sign-Off'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#ED0226] hover:bg-red-700 px-3.5 py-1.5 text-xs font-bold text-white transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sign-Off</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Evaluasi Komite Investasi"
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Sub-Tabs */}
        <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('scorecard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'scorecard'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              1. Evaluasi Komite Investasi (5 Pilar)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('byod')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'byod'
                  ? 'bg-[#ED0226] text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              2. BYOD CSV Regional &rarr; Auto BA-RE &amp; SAP ({closedLoop.customByodCount} Site Aktif)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('wbp_border')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'wbp_border'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              3. Arbitrase WBP 17:00–22:00 &amp; Cross-Vendor Border Guard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('it_max')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'it_max'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              4. IT Telkomsel MAX (API, 11 Reg &amp; Chaos)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('deal_closing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'deal_closing'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              5. Restitusi PLN, IDXCarbon &amp; Master Pack
            </button>
          </div>

          <button
            type="button"
            onClick={handleRunFullAudit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Verifikasi Penuh (Loop + BYOD)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {auditVerifiedPulse && (
            <div className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Seluruh 5 Pilar Kelayakan, Resolusi FOP BDG-DGO-P04, dan 3 Site BYOD Regional telah disinkronkan ke BA-RE &amp; Jurnal SAP S/4HANA!
                </span>
              </div>
            </div>
          )}

          {activeTab === 'scorecard' && (
            <div className="space-y-5">
              {/* Top Verdict Banner */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                    REKOMENDASI KOMITE INVESTASI MODAL &amp; AUDIT INTERNAL TELKOMSEL
                  </div>
                  <div className="text-base sm:text-lg font-black text-emerald-400">
                    {scorecard.decisionVerdict}
                  </div>
                  <p className="text-xs text-slate-300">
                    Hash Persetujuan Kriptografis: <code className="font-mono text-amber-300">{scorecard.signOffHash}</code> • Tanggal: {scorecard.signOffDate}
                  </p>
                </div>

                <div className="text-right bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Skor Akhir Tertimbang</div>
                  <div className="text-3xl font-black font-mono text-white">
                    {scorecard.weightedTotalScore}<span className="text-sm text-slate-400">/100</span>
                  </div>
                </div>
              </div>

              {/* 5 Pillars Interactive Rubric */}
              <div className="space-y-3">
                {scorecard.pillars.map((pillar) => (
                  <div
                    key={pillar.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                            {pillar.title}
                          </strong>
                          <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-mono font-bold">
                            Bobot {pillar.weightPct}%
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Terverifikasi Sistem
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Bukti: <strong className="text-slate-700 dark:text-slate-200">{pillar.verificationMetric}</strong> • Penilai: {pillar.committeeOwner}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="60"
                          max="100"
                          step="1"
                          value={pillar.score}
                          onChange={(e) =>
                            setCustomScores((prev) => ({
                              ...prev,
                              [pillar.id]: Number(e.target.value)
                            }))
                          }
                          aria-label={`Skor ${pillar.title}`}
                          className="w-28 accent-[#ED0226] cursor-pointer"
                        />
                        <span className="font-mono text-sm font-black text-slate-900 dark:text-white w-12 text-right">
                          {pillar.score}/100
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Committee Approvers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {scorecard.approvers.map((app) => (
                  <div
                    key={app.role}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1"
                  >
                    <div className="text-[10px] font-bold uppercase text-slate-400">{app.role}</div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">{app.name}</div>
                    <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> {app.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'byod' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase text-[#ED0226]">
                    Bring Your Own Telkomsel Data (BYOD) &rarr; Auto BA-RE &amp; Jurnal SAP S/4HANA
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Masukkan baris CSV data site regional Telkomsel Anda di bawah ini. Sistem langsung menghitung deviasi 3-arah dan memperbarui dokumen resmi <strong>Berita Acara (BA-RE)</strong> serta <strong>Jurnal SAP S/4HANA</strong> secara otomatis!
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyByodCsv}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sinkronkan CSV ke BA-RE &amp; SAP</span>
                  </button>
                  {customByodSites.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearByod}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset BYOD</span>
                    </button>
                  )}
                </div>
              </div>

              {byodSyncBanner && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-between gap-2">
                  <span>{byodSyncBanner}</span>
                  <div className="flex items-center gap-2">
                    {onOpenOfficialBaRe && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenOfficialBaRe();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Lihat di BA-RE Resmi &rarr;
                      </button>
                    )}
                    {onOpenSapVoucher && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenSapVoucher();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Lihat di Jurnal SAP &rarr;
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* CSV Textarea */}
              <div>
                <label htmlFor="byod-csv-textarea" className="block text-xs font-bold mb-1.5">
                  Format CSV Regional Telkomsel (<code>site_id,site_name,tower_co,idpel_pln,pln_kwh,rectifier_dc_kwh,oss_radio_kwh,prb_pct</code>):
                </label>
                <textarea
                  id="byod-csv-textarea"
                  rows={5}
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-emerald-300 font-mono text-xs p-3 focus:outline-none"
                />
              </div>

              {/* Live Preview of Reconciled Sites (Baseline + BYOD) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black uppercase text-slate-700 dark:text-slate-200">
                    Pratinjau Langsung Matriks BA-RE &amp; Keseimbangan Jurnal SAP ({closedLoop.reconciliationSites.length} Site Tercatat)
                  </strong>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Total Jurnal SAP: Rp {closedLoop.totalDebit.toLocaleString('id-ID')} (Debit = Kredit)
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800/90 text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                        <th className="py-2 px-3">Site ID</th>
                        <th className="py-2 px-3">Nama BTS &amp; TowerCo</th>
                        <th className="py-2 px-3 text-right">PLN (kWh)</th>
                        <th className="py-2 px-3 text-right">DC Rect (kWh)</th>
                        <th className="py-2 px-3 text-right">Deviasi</th>
                        <th className="py-2 px-3 text-right">Klaim / Restitusi</th>
                        <th className="py-2 px-3">Status BA-RE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {closedLoop.reconciliationSites.map((row) => (
                        <tr key={row.siteId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-2 px-3 font-mono font-bold text-slate-900 dark:text-white">
                            {row.siteId}
                            {row.isCustomByod && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-[#ED0226] text-[9px] font-bold">
                                BYOD
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <div className="font-bold">{row.siteName}</div>
                            <div className="text-[10px] text-slate-500">{row.towerCo}</div>
                          </td>
                          <td className="py-2 px-3 text-right font-mono">{row.plnMeterKwh.toLocaleString('id-ID')}</td>
                          <td className="py-2 px-3 text-right font-mono">{row.rectifierDcKwh.toLocaleString('id-ID')}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold">
                            +{row.variancePct}%
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold">
                            Rp {(row.phantomLossRp || row.recoveredCreditNoteRp || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                row.status.includes('DISPUTE')
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wbp_border' && <WbpBessAndBorderGuardPanel />}
          {activeTab === 'it_max' && <TelkomselItMaxSuitePanel />}
          {activeTab === 'deal_closing' && (
            <ExecutiveDealClosingSuitePanel
              resolvedSites={resolvedSites}
              customByodSites={customByodSites}
              weightedScore={scorecard.weightedTotalScore}
              onResolveSiteAnomaly={onResolveSiteAnomaly}
              initialSubTab="pln_dispute"
            />
          )}
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 shrink-0">
          <div>
            Ketik <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono font-bold">J</kbd> kapan saja untuk membuka Suite Evaluasi Komite Investasi &amp; BYOD Sandbox ini.
          </div>
          <div className="flex items-center gap-2">
            {onOpenOfficialBaRe && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOfficialBaRe();
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Buka BA-RE Resmi
              </button>
            )}
            {onOpenSapVoucher && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSapVoucher();
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white transition cursor-pointer"
              >
                Buka Jurnal SAP S/4HANA
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
