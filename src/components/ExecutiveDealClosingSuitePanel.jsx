import React, { useState, useMemo } from 'react';
import {
  Compass,
  FileCheck2,
  Leaf,
  FolderCheck,
  ArrowRight,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Sparkles,
  Zap,
  School,
  Scale,
  DollarSign
} from 'lucide-react';
import {
  RUBRIC_EVIDENCE_NAVIGATOR_ITEMS,
  calculatePlnBillingDisputeDossier,
  calculateCarbonAnd3TSocialDividend,
  generateMasterHandoverPackDossier
} from '../utils/executiveDealClosingEngine';

export default function ExecutiveDealClosingSuitePanel({
  resolvedSites = [],
  customByodSites = [],
  weightedScore = 96.8,
  onNavigateTab,
  onOpenModal,
  onResolveSiteAnomaly,
  initialSubTab = 'navigator'
}) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // 'navigator' | 'pln_dispute' | 'carbon_3t' | 'master_pack'
  const [carbonScale, setCarbonScale] = useState('pilot');
  const [carbonPriceIdr, setCarbonPriceIdr] = useState(95000);
  const [copiedMasterPack, setCopiedMasterPack] = useState(false);

  const plnDispute = useMemo(
    () => calculatePlnBillingDisputeDossier({ resolvedSites, customByodSites }),
    [resolvedSites, customByodSites]
  );

  const carbonAnd3T = useMemo(
    () =>
      calculateCarbonAnd3TSocialDividend({
        scale: carbonScale,
        carbonPricePerTonIdr: carbonPriceIdr,
        socialDividendSharePct: 15
      }),
    [carbonScale, carbonPriceIdr]
  );

  const masterPack = useMemo(
    () =>
      generateMasterHandoverPackDossier({
        resolvedSites,
        customByodSites,
        weightedScore
      }),
    [resolvedSites, customByodSites, weightedScore]
  );

  const handleCopyMasterPack = () => {
    navigator.clipboard?.writeText(JSON.stringify(masterPack, null, 2));
    setCopiedMasterPack(true);
    setTimeout(() => setCopiedMasterPack(false), 2000);
  };

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 sm:p-6 shadow-md space-y-5">
      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-[10px] font-black text-[#ED0226] dark:text-red-400 uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Komite Investasi, Klaim Restitusi PLN &amp; Tata Kelola Korporat</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Matriks Bukti 5 Pilar, Klaim Restitusi PLN Fase 0, Bursa Karbon IDXCarbon &amp; Paket Dokumen Kontrak
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Menyatukan bukti kuantitatif 5 pilar kelayakan investasi Telkomsel, pengembalian modal swadana Fase 0 (Rp 95 Juta), valuasi unit karbon SPE-GRK, dan 5 dokumen kontrak resmi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveSubTab('navigator')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'navigator'
                ? 'bg-[#ED0226] text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            1. Matriks Bukti 5 Pilar Komite
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('pln_dispute')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'pln_dispute'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            2. Klaim Restitusi PLN (Swadana Rp 95 Jt)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('carbon_3t')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'carbon_3t'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            3. IDXCarbon SPE-GRK &amp; 4 Sekolah 3T
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('master_pack')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'master_pack'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            4. 1-Click Master Handover Pack (5 Dokumen)
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: 60-SECOND JURY & BOD EVIDENCE NAVIGATOR */}
      {activeSubTab === 'navigator' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {RUBRIC_EVIDENCE_NAVIGATOR_ITEMS.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 p-4 flex flex-col justify-between gap-3 hover:border-[#ED0226]/50 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-mono font-black">
                      {item.code}
                    </span>
                    <span className="text-[10px] font-mono font-black text-emerald-600 dark:text-emerald-400">
                      Bobot {item.weightPct}%
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.claimSummary}
                  </p>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300">
                    <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">
                      BUKTI MATEMATIS:
                    </strong>
                    {item.mathematicalProof}
                  </div>
                </div>

                <div className="pt-1 flex flex-col gap-1.5">
                  {onNavigateTab && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab(item.targetTab, item.targetViewMode)}
                      className="w-full inline-flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#ED0226] hover:bg-red-700 text-white text-[11px] font-bold transition cursor-pointer"
                    >
                      <span>{item.ctaLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  )}
                  {onOpenModal && item.modalTrigger && item.modalTrigger !== 'handover' && (
                    <button
                      type="button"
                      onClick={() => onOpenModal(item.modalTrigger)}
                      className="w-full inline-flex items-center justify-center px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      Buka Dokumen Bukti Resmi
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PLN BILLING DISPUTE & RESTITUTION DOSSIER (BAPB FASE 0) */}
      {activeSubTab === 'pln_dispute' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="text-[10px] font-mono font-bold uppercase text-amber-800 dark:text-amber-300">
                DOKUMEN KLAIM SENGKETA &amp; PEMERIKSAAN BERSAMA (BAPB): {plnDispute.bapbDocumentNumber}
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Bukti Mengapa Fase 0 (Rp 95 Juta) 100% Membiayai Dirinya Sendiri (Self-Funding Gate)
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {plnDispute.executiveConclusion}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-right">
                <div className="text-[10px] font-bold uppercase text-slate-400">Payback Modal Fase 0</div>
                <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {plnDispute.phase0SelfFundingMonths} Bulan
                </div>
                <div className="text-[10px] text-slate-500">
                  Recovery: Rp {(plnDispute.totalAnnualRecoveryIdr / 1e6).toFixed(1)} Jt/thn
                </div>
              </div>
              {onResolveSiteAnomaly && (
                <button
                  type="button"
                  onClick={() => onResolveSiteAnomaly('BDG-DGO-P04')}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
                >
                  Setujui Klaim BAPB &amp; Sinkronkan SAP
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] uppercase">
                  <th className="p-3">Site &amp; IDPEL PLN</th>
                  <th className="p-3 text-right">Tagihan AMR (kWh/bln)</th>
                  <th className="p-3 text-right">Sub-Meter DC (kWh/bln)</th>
                  <th className="p-3 text-right">Selisih Klaim (kWh/bln)</th>
                  <th className="p-3 text-right">Nilai Restitusi/Thn</th>
                  <th className="p-3">Akar Masalah Fisik &amp; Rekomendasi BAPB</th>
                  <th className="p-3 text-center">Status Klaim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {plnDispute.sites.map((site) => (
                  <tr key={site.siteId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3">
                      <div className="font-mono font-black text-slate-900 dark:text-white">{site.siteId}</div>
                      <div className="text-[11px] text-slate-500">{site.siteName}</div>
                      <div className="text-[10px] font-mono text-slate-400">IDPEL: {site.idpelPln}</div>
                    </td>
                    <td className="p-3 text-right font-mono">{site.billedAcKwhMonthly.toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-300">
                      {site.verifiedDcSubmeterKwhMonthly.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                      {site.disputedVarianceKwhMonthly.toLocaleString('id-ID')} ({site.variancePct}%)
                    </td>
                    <td className="p-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                      Rp {(site.annualRecoveryIdr / 1e6).toFixed(2)} Jt
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{site.rootCause}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{site.recommendedAction}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          site.status === 'RESTITUTION_APPROVED_AND_CALIBRATED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {site.status === 'RESTITUTION_APPROVED_AND_CALIBRATED'
                          ? 'DISETUJUI & TERKALIBRASI'
                          : 'SIAP KLAIM BAPB'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: IDXCARBON SPE-GRK & 4 SEKOLAH 3T JAGA CITA BLUEPRINT */}
      {activeSubTab === 'carbon_3t' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-300">
                REGISTRASI BURSA KARBON INDONESIA: {carbonAnd3T.idxCarbonRegistryCode}
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Valuasi Kredit Karbon SPE-GRK (IDXCarbon) &amp; Blueprint Konversi 15% Dividen Sosial Sekolah 3T
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                {[
                  { id: 'pilot', label: 'Pilot (40 Site)' },
                  { id: 'regional', label: 'Metro (250 Site)' },
                  { id: 'national', label: 'Nasional (43.000 BTS)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCarbonScale(opt.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                      carbonScale === opt.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-300">Harga SPE-GRK:</span>
                <input
                  type="range"
                  min={50000}
                  max={150000}
                  step={5000}
                  value={carbonPriceIdr}
                  onChange={(e) => setCarbonPriceIdr(Number(e.target.value))}
                  aria-label="Harga Kredit Karbon SPE-GRK per Ton"
                  className="w-24 accent-emerald-600 cursor-pointer"
                />
                <span className="font-mono font-black text-emerald-600">
                  Rp {(carbonPriceIdr / 1000).toFixed(0)}rb/tCO₂e
                </span>
              </div>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="text-[10px] font-bold uppercase text-slate-400">Reduksi Emisi Terverifikasi</div>
              <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                {carbonAnd3T.annualCo2ReducedTons.toLocaleString('id-ID')} tCO₂e/thn
              </div>
              <div className="text-[10px] text-slate-500">{carbonAnd3T.scaleLabel}</div>
            </div>
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="text-[10px] font-bold uppercase text-slate-400">Valuasi Ekonomi IDXCarbon</div>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-white mt-0.5">
                Rp {(carbonAnd3T.idxCarbonGrossValueIdr / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt/thn
              </div>
              <div className="text-[10px] text-slate-500">Unit Karbon SPE-GRK Siap Perdagangan</div>
            </div>
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="text-[10px] font-bold uppercase text-slate-400">Dana Dividen Sosial 3T (15%)</div>
              <div className="text-lg font-black font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                Rp {(carbonAnd3T.socialDividendPoolIdr / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Jt/thn
              </div>
              <div className="text-[10px] text-slate-500">Reinvestasi Langsung dari Penghematan OPEX</div>
            </div>
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="text-[10px] font-bold uppercase text-slate-400">Penerima Manfaat Pendidikan 3T</div>
              <div className="text-lg font-black font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                {carbonAnd3T.totalStudentsImpacted.toLocaleString('id-ID')} Siswa
              </div>
              <div className="text-[10px] text-slate-500">
                {carbonAnd3T.totalCleanEnergy3TKwhYr.toLocaleString('id-ID')} kWh Surya/thn
              </div>
            </div>
          </div>

          {/* 4 Schools Blueprint Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] uppercase">
                  <th className="p-3">Sekolah Penerima Manfaat (3T)</th>
                  <th className="p-3">Wilayah Regional Telkomsel</th>
                  <th className="p-3 text-right">Siswa &amp; Guru</th>
                  <th className="p-3 text-right">PLTS + BESS LiFePO4</th>
                  <th className="p-3 text-right">Kuota Edukasi 4G</th>
                  <th className="p-3 text-right">Alokasi Dana/Thn</th>
                  <th className="p-3">Keluaran Dampak Sosial Terukur (Jaga Cita)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {carbonAnd3T.schools.map((sch) => (
                  <tr key={sch.schoolId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3">
                      <div className="font-black text-slate-900 dark:text-white">{sch.schoolName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{sch.schoolId} • {sch.category}</div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-semibold">{sch.province}</td>
                    <td className="p-3 text-right font-mono font-bold">
                      {sch.scaledStudentsCount.toLocaleString('id-ID')} Siswa
                    </td>
                    <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {sch.solarMicrogridKwp} kWp / {sch.bessLifepo4Kwh} kWh
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      {sch.eduInternetQuotaTbYr} TB/thn
                    </td>
                    <td className="p-3 text-right font-mono font-black text-slate-900 dark:text-white">
                      Rp {(sch.scaledAllocationIdr / 1e6).toFixed(1)} Jt
                    </td>
                    <td className="p-3 text-[11px] text-slate-600 dark:text-slate-300 max-w-xs">
                      {sch.impactOutcome}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: 1-CLICK MASTER EXECUTIVE HANDOVER PACK */}
      {activeSubTab === 'master_pack' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-amber-400 uppercase">
                MASTER CRYPTOGRAPHIC SEAL: {masterPack.masterSealHash}
              </div>
              <h3 className="text-sm sm:text-base font-black">
                Bundel Serah-Terima Eksekutif (5 Dokumen Resmi Saling Mengunci SHA-256)
              </h3>
              <p className="text-xs text-slate-300">
                Siap dicetak atau diekspor dalam 1 klik untuk lampiran keputusan Rapat Direksi (BoD) &amp; Penilaian Akhir Dewan Juri.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyMasterPack}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition cursor-pointer"
              >
                {copiedMasterPack ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMasterPack ? 'Bundel JSON Tersalin!' : 'Salin Bundel JSON'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ED0226] hover:bg-red-700 text-xs font-black text-white transition cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Master Handover Pack</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {masterPack.documents.map((doc) => {
              const modalMap = {
                1: 'memo',
                2: 'boq',
                3: 'bare',
                4: 'sap',
                5: 'jury'
              };
              const targetModal = modalMap[doc.docOrder];
              return (
                <div
                  key={doc.docCode}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-mono font-black">
                        {doc.docCode}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
                        {doc.status}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Ref Hash: {doc.crossRefHash}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {doc.title}
                    </h4>
                    <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                      {doc.keyMetric}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Otoritas Penandatangan: <strong>{doc.authority}</strong>
                    </div>
                  </div>

                  {onOpenModal && targetModal && (
                    <button
                      type="button"
                      onClick={() => onOpenModal(targetModal)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 transition cursor-pointer shrink-0"
                    >
                      Inspeksi Dokumen #{doc.docOrder}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
