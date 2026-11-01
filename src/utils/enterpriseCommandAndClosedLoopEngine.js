import { SYNTHETIC_PILOT_SITES_50 } from '../data/mockData.js';
import { BOD_DEFENSE_QUESTIONS } from '../data/bodQuestions.js';
import { evaluateByodSiteRow } from './telkomselNextGenOperationsEngine.js';

export const SYNC_CHANNEL_NAME = 'impactgrid-live-sync-v1';

export const MODULE_COMMAND_ITEMS = [
  { id: 'mod-overview', category: 'modules', title: 'Ringkasan Eksekutif (Overview Command Center)', subtitle: 'Peta GIS 50 Site, Gerbang G0–G3, & Ringkasan KPI Dewan Direksi', tab: 'overview', viewMode: 'executive', keywords: 'overview ringkasan dashboard peta gis kpi utama' },
  { id: 'mod-pilotvalidation', category: 'modules', title: 'Validasi Pilot & Kausalitas DiD', subtitle: '40 Site Intervensi vs 10 Site Kontrol & Ekonometrika Difference-in-Differences', tab: 'pilotvalidation', viewMode: 'executive', keywords: 'pilot validasi did difference in differences kontrol intervensi p-value' },
  { id: 'mod-scenariolab', category: 'modules', title: 'Simulasi Skenario & Monte Carlo Lab', subtitle: 'Uji ketahanan cuaca ekstrem, trafik mudik, & kenaikan tarif PLN', tab: 'scenariolab', viewMode: 'executive', keywords: 'scenario lab simulasi monte carlo mudik cuaca tarif' },
  { id: 'mod-financial', category: 'modules', title: 'Dampak Finansial, DCF 5-Tahun & Kontrak TowerCo', subtitle: 'NPV +Rp460 Juta, Payback 1,9 Tahun, Shared Savings Mitratel 85/15', tab: 'financial', viewMode: 'executive', keywords: 'financial finansial npv irr payback capex opex towerco mitratel dcf' },
  { id: 'mod-esg', category: 'modules', title: 'Kepatuhan ESG, POJK 51/2017 & Dividen Sosial 3T', subtitle: 'Akuntansi Karbon Scope 2 ESDM Jamali & Reinvestasi Sekolah 3T', tab: 'esg', viewMode: 'executive', keywords: 'esg karbon co2 pojk 51 gri sdg sosial 3t jaga cita' },
  { id: 'mod-digitaltwin', category: 'modules', title: 'Digital Twin Shelter & Termal BTS', subtitle: 'Simulasi termodinamika kabinet, inverter HVAC, & proteksi 32°C', tab: 'digitaltwin', viewMode: 'engineering', keywords: 'digital twin shelter termal suhu ac hvac bts' },
  { id: 'mod-agents', category: 'modules', title: 'Orkestrasi Multi-Agen O-RAN (Non-RT & Near-RT RIC)', subtitle: 'Koordinasi rApp Prophet-RAN & xApp Zero-Wait 28ms Fail-Safe', tab: 'agents', viewMode: 'engineering', keywords: 'agent orkestrasi oran ric rapp xapp ai autonom' },
  { id: 'mod-telemetry', category: 'modules', title: 'Telemetri Jaringan, BYOD CSV & Rekonsiliasi 3-Arah', subtitle: 'Triangulasi Meter PLN AMR, Submeter DC 48V, OSS PRB & Impor Data BYOD Telkomsel', tab: 'telemetry', viewMode: 'engineering', keywords: 'telemetry telemetri pln dc rectifier oss rekonsiliasi bts ingestion byod csv' },
  { id: 'mod-optimization', category: 'modules', title: 'Optimasi Knapsack, Arbitrase WBP BESS & Border Guard', subtitle: 'Alokasi CapEx, Peak-Shaving WBP 17:00–22:00, & Koordinasi Perbatasan Lintas-Vendor', tab: 'optimization', viewMode: 'engineering', keywords: 'optimization optimasi knapsack carrier sleep wbp lwbp bess border guard huawei ericsson' },
  { id: 'mod-architecture', category: 'modules', title: 'Arsitektur Enterprise, Keamanan PP 71/2019 & Cutover', subtitle: 'Topologi Telkom DC Sentul/Surabaya, O1 NETCONF, & Kedaulatan Data', tab: 'architecture', viewMode: 'engineering', keywords: 'architecture arsitektur pp 71 iso 27001 netconf sentul ciso' }
];

export const ACTION_COMMAND_ITEMS = [
  { id: 'act-jury-scorecard', category: 'actions', title: 'Buka Evaluasi Komite Investasi & Scorecard Juri (Sign-Off)', subtitle: 'Uji otomatis 5 pilar kelayakan, beri skor rubrik, & cetak Berita Acara Komite Investasi', actionType: 'OPEN_MODAL', modalKey: 'jury', badge: 'Jury Scorecard', keywords: 'jury juri komite investasi scorecard evaluasi nilai sign-off persetujuan' },
  { id: 'act-pln-dispute-pack', category: 'actions', title: 'Buka Klaim Restitusi PLN (Swadana Rp 95 Jt), IDXCarbon & Master Handover Pack', subtitle: 'BAPB Sengketa Tagihan PLN UID, Valuasi SPE-GRK Bursa Karbon, 4 Sekolah 3T, & 5 Dokumen Cetak', actionType: 'OPEN_MODAL', modalKey: 'jury', badge: 'Deal-Closing Pack', keywords: 'restitusi sengketa pln bapb idxcarbon spe-grk bursa karbon sekolah 3t master handover pack' },
  { id: 'act-it-max-suite', category: 'actions', title: 'Buka Telkomsel IT Enterprise MAX Suite (Open API, 11 Regional & Chaos Lab)', subtitle: 'TMF628/A1-P API Apigee Sandbox, Rollout 43.000 BTS 11 Regional, & Chaos Failover Sentul-Surabaya', actionType: 'OPEN_MODAL', modalKey: 'jury', badge: 'IT MAX Suite', keywords: 'api apigee kafka tmf628 tmf621 11 regional 43000 bts chaos failover sentul surabaya spoofing' },
  { id: 'act-byod-preset', category: 'actions', title: 'Injeksi Cepat: Data BYOD Regional Telkomsel ke BA-RE & SAP', subtitle: 'Muat 3 site regional (Medan, Makassar, Denpasar) langsung ke Berita Acara & Jurnal SAP S/4HANA', actionType: 'LOAD_BYOD_PRESET', badge: 'BYOD Live', keywords: 'byod csv excel medan makassar denpasar regional injeksi ba-re sap' },
  { id: 'act-fop-console', category: 'actions', title: 'Buka Konsol Teknisi FOP Lapangan (Mobile e-WO)', subtitle: 'Simulasikan scan QR shelter BDG-DGO-P04, kalibrasi BLE, & tutup tiket ServiceNow', actionType: 'OPEN_MODAL', modalKey: 'fop', badge: 'FOP Closed-Loop', keywords: 'fop teknisi lapangan mobile qr ble servicenow bdg-dgo-p04' },
  { id: 'act-ba-re', category: 'actions', title: 'Buka Berita Acara Rekonsiliasi Energi Resmi (BA-RE)', subtitle: 'Dokumen hukum Telkomsel & PLN UID Jabar dengan tanda tangan SHA-256', actionType: 'OPEN_MODAL', modalKey: 'bare', badge: 'Legal BA-RE', keywords: 'berita acara ba-re rekonsiliasi pln hukum legal pdf' },
  { id: 'act-sap-voucher', category: 'actions', title: 'Buka Jurnal Akuntansi SAP S/4HANA & BAST Keuangan', subtitle: 'Posting GL 510100, akrual bagi hasil Mitratel, & payload RFC BAPI JSON', actionType: 'OPEN_MODAL', modalKey: 'sap', badge: 'SAP FI-CO', keywords: 'sap s4hana jurnal voucher akuntansi gl 510100 bapi bast' },
  { id: 'act-boq-rks', category: 'actions', title: 'Buka Generator BoQ & RKS Pengadaan (Procurement Kit)', subtitle: 'Rincian Bill of Quantities Fase 0 (Rp95 Jt) & Fase 1 (Rp450 Jt) + TKDN & SLA Shield', actionType: 'OPEN_MODAL', modalKey: 'boq', badge: 'Procurement RKS', keywords: 'boq rks procurement pengadaan tender tkdn sla penalti rab capex' },
  { id: 'act-dual-screen', category: 'actions', title: 'Buka Sinkronisasi Layar Ganda Presenter & Proyektor (Live Sync)', subtitle: 'Sinkronisasi real-time via BroadcastChannel antara layar pembicara & layar juri', actionType: 'OPEN_MODAL', modalKey: 'dualsync', badge: 'Dual-Screen', keywords: 'dual screen presenter proyektor broadcast sync layar ganda juri' },
  { id: 'act-resolve-fop-loop', category: 'actions', title: 'Eksekusi Cepat: Selesaikan Anomali BDG-DGO-P04 (End-to-End Loop)', subtitle: 'Otomatis sinkronkan resolusi FOP ke Telemetry, Berita Acara BA-RE, & Jurnal SAP', actionType: 'RESOLVE_FOP_LOOP', siteId: 'BDG-DGO-P04', badge: 'Instant Loop', keywords: 'resolve selesaikan anomali dago bdg-dgo-p04 loop otomatis' },
  { id: 'act-emergency-112', category: 'actions', title: 'Uji Stress-Test Panggilan Darurat 112 (Rollback < 28ms)', subtitle: 'Buka simulator prioritas keselamatan publik & pembatalan carrier sleep instan', actionType: 'OPEN_MODAL', modalKey: 'emergency', badge: 'Safety 112', keywords: '112 emergency darurat stress test rollback 28ms qos' },
  { id: 'act-bod-defense', category: 'actions', title: 'Buka Pertahanan Q&A Dewan Direksi (BoD Cheat Sheet)', subtitle: '10 jawaban taktis atas pertanyaan kritis CEO, CFO, CTO, CISO, & Komite ESG', actionType: 'OPEN_MODAL', modalKey: 'defense', badge: 'BoD Q&A', keywords: 'bod defense tanya jawab direksi cto cfo ceo komisaris' },
  { id: 'act-exec-memo', category: 'actions', title: 'Cetak Memo Eksekutif Dewan Direksi (A4)', subtitle: 'Dokumen ringkasan persetujuan plafon audit Fase 0 Rp 95 Juta', actionType: 'OPEN_MODAL', modalKey: 'memo', badge: 'Memo A4', keywords: 'memo eksekutif cetak print pdf a4 direksi' },
  { id: 'act-ai-copilot', category: 'actions', title: 'Buka ImpactGrid AI Strategy Copilot', subtitle: 'Asisten penalaran operasional, finansial, dan verifikasi batas klaim', actionType: 'OPEN_MODAL', modalKey: 'copilot', badge: 'AI Copilot', keywords: 'ai copilot asisten tanya analisis' },
  { id: 'act-start-pitch', category: 'actions', title: 'Mulai Guided Pitch Presentasi Direksi (7 Menit)', subtitle: 'Aktifkan teleprompter 8 tahap terkalibrasi waktu dengan lompatan Q&A', actionType: 'START_PITCH', badge: '7-Min Pitch', keywords: 'pitch presentasi 7 menit teleprompter mulai' }
];

export const EVIDENCE_COMMAND_ITEMS = [
  { id: 'ev-did', category: 'evidence', title: 'Bukti Kausalitas: Difference-in-Differences (DiD) 40 vs 10 Site', subtitle: 'Isolasi penghematan murni dari bias cuaca (CDD) dan fluktuasi trafik musiman', tab: 'pilotvalidation', viewMode: 'executive', keywords: 'did difference in differences ekonometrika cuaca kontrol' },
  { id: 'ev-merkle', category: 'evidence', title: 'Bukti Kriptografis: SHA-256 Merkle Audit Ledger', subtitle: 'Setiap interval telemetri 15-menit diikat hash berantai anti-manipulasi (anti-greenwashing)', tab: 'telemetry', viewMode: 'engineering', keywords: 'sha256 merkle hash audit ledger kriptografi anti greenwashing' },
  { id: 'ev-pp71', category: 'evidence', title: 'Kepatuhan Regulasi: PP No. 71 Tahun 2019 & ISO 27001', subtitle: '100% residensi data on-premise di Telkom DC Sentul (Primary) & Surabaya (DR)', tab: 'architecture', viewMode: 'engineering', keywords: 'pp 71 2019 kedaulatan data sentul surabaya iso 27001 ciso' },
  { id: 'ev-pojk51', category: 'evidence', title: 'Kepatuhan ESG: POJK No. 51/POJK.03/2017 & ITU-T L.1331', subtitle: 'Pelaporan keberlanjutan faktor emisi grid ESDM Jamali & metrik kWh/TB', tab: 'esg', viewMode: 'executive', keywords: 'pojk 51 ojk itu-t l1331 esdm jamali emisi karbon' }
];

/**
 * Builds the unified searchable index for the Executive Command Palette (Ctrl+K).
 */
export function buildCommandPaletteIndex() {
  const PILOT_CODE_ALIASES = {
    'JKT-SEL-01': 'JKT-SEL-P01',
    'BDG-DGO-17': 'BDG-DGO-P04',
    'SBY-RKT-29': 'SBY-RKT-C02'
  };

  const siteItems = (SYNTHETIC_PILOT_SITES_50 || []).map((site) => {
    const pilotAlias = PILOT_CODE_ALIASES[site.id] || '';
    return {
      id: `site-${site.id}`,
      category: 'sites',
      siteId: pilotAlias || site.id,
      gisSiteId: site.id,
      title: pilotAlias ? `${site.id} (${pilotAlias}) — ${site.name}` : `${site.id} — ${site.name}`,
      subtitle: `${site.cluster} • ${site.group === 'intervention' ? `Intervensi (-${site.savingsPct}%)` : 'Kontrol Baseline'} • Daya: ${site.measuredDailyKWh} kWh/hr • Drop: ${site.qosDrop}`,
      tab: 'telemetry',
      viewMode: 'engineering',
      badge: site.group === 'intervention' ? `-${site.savingsPct}% kWh` : 'Control Group',
      keywords: `${site.id} ${pilotAlias} ${site.name} ${site.cluster} ${site.group} ${site.mode} bts site menara`.toLowerCase()
    };
  });

  const bodItems = (BOD_DEFENSE_QUESTIONS || []).map((q) => ({
    id: `bod-${q.id}`,
    category: 'bod',
    questionId: q.id,
    title: `[${q.role}] ${q.question}`,
    subtitle: q.shortAnswer,
    tab: q.targetTab || 'overview',
    viewMode: ['digitaltwin', 'agents', 'telemetry', 'optimization', 'architecture'].includes(q.targetTab) ? 'engineering' : 'executive',
    actionType: 'OPEN_BOD_QUESTION',
    badge: q.category,
    keywords: `${q.id} ${q.role} ${q.category} ${q.question} ${q.shortAnswer}`.toLowerCase()
  }));

  return [
    ...ACTION_COMMAND_ITEMS,
    ...MODULE_COMMAND_ITEMS,
    ...EVIDENCE_COMMAND_ITEMS,
    ...bodItems,
    ...siteItems
  ];
}

/**
 * Searches and ranks items in the Command Palette.
 */
export function searchCommandPalette(query = '', { category = 'all', limit = 25 } = {}) {
  const index = buildCommandPaletteIndex();
  const normalizedCategory = category || 'all';
  const filteredByCategory = normalizedCategory === 'all'
    ? index
    : index.filter((item) => item.category === normalizedCategory);

  const trimmed = String(query || '').trim().toLowerCase();
  if (!trimmed) {
    return filteredByCategory.slice(0, limit);
  }

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  const scored = [];

  for (const item of filteredByCategory) {
    const haystack = `${item.title} ${item.subtitle} ${item.keywords || ''} ${item.badge || ''}`.toLowerCase();
    const matchesAllTokens = tokens.every((tok) => haystack.includes(tok));
    if (!matchesAllTokens) continue;

    let score = 0;
    const titleLower = item.title.toLowerCase();
    if (titleLower === trimmed || (item.siteId && item.siteId.toLowerCase() === trimmed)) {
      score += 100;
    } else if (titleLower.startsWith(trimmed)) {
      score += 60;
    } else if (titleLower.includes(trimmed)) {
      score += 40;
    }
    if (item.category === 'actions') score += 15;
    if (item.category === 'modules') score += 10;
    scored.push({ item, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.item);
}

/**
 * Computes the reactive End-to-End Closed-Loop State across:
 * 1. FOP Field Technician Console (Mobile e-WO)
 * 2. Telemetry Triangulation Matrix
 * 3. Official Berita Acara Rekonsiliasi Energi (BA-RE)
 * 4. SAP S/4HANA Accounting Journal Voucher & BAPI RFC Payload
 */
export function computeClosedLoopReconciliation(resolvedSites = [], customByodSites = []) {
  const resolvedSet = new Set(Array.isArray(resolvedSites) ? resolvedSites : []);
  const isBdgResolved = resolvedSet.has('BDG-DGO-P04');

  const evaluatedByodRows = (Array.isArray(customByodSites) ? customByodSites : []).map((raw) =>
    raw && raw.isCustomByod && typeof raw.variancePct === 'number'
      ? evaluateByodSiteRow(raw, resolvedSet)
      : evaluateByodSiteRow(raw, resolvedSet)
  );

  const reconciliationSites = [
    {
      siteId: 'JKT-SEL-P01',
      siteName: 'Kebayoran Baru Macro BTS',
      towerCo: 'Mitratel (Owned)',
      plnMeterKwh: 2966.4,
      rectifierDcKwh: 2556.0,
      ossRadioKwh: 2462.4,
      auxLossKwh: 410.4,
      variancePct: 1.2,
      phantomLossRp: 0,
      recoveredCreditNoteRp: 0,
      status: 'SEIMBANG (VALID)',
      notes: 'Deviasi dalam batas toleransi (<3.0%)'
    },
    isBdgResolved
      ? {
          siteId: 'BDG-DGO-P04',
          siteName: 'Dago Atas Macro Hub',
          towerCo: 'Mitratel (Leased)',
          plnMeterKwh: 2498.4,
          rectifierDcKwh: 2174.4,
          ossRadioKwh: 2073.6,
          auxLossKwh: 324.0,
          variancePct: 0.7,
          phantomLossRp: 0,
          recoveredCreditNoteRp: 3824640,
          status: 'TERKALIBRASI FOP (VALID)',
          notes: 'WO-2026-TSEL-MT-00492 Selesai: Kondensor AC & submeter dikalibrasi. Restitusi Rp 3.824.640 disetujui.'
        }
      : {
          siteId: 'BDG-DGO-P04',
          siteName: 'Dago Atas Macro Hub',
          towerCo: 'Mitratel (Leased)',
          plnMeterKwh: 2772.0,
          rectifierDcKwh: 2174.4,
          ossRadioKwh: 2073.6,
          auxLossKwh: 597.6,
          variancePct: 10.4,
          phantomLossRp: 3824640,
          recoveredCreditNoteRp: 0,
          status: 'ANOMALI (DISPUTE)',
          notes: 'Kebocoran daya +10.4% (>8% threshold). Investigasi AC shelter & rectifier fan.'
        },
    {
      siteId: 'SBY-RKT-C02',
      siteName: 'Rungkut Industri (Control)',
      towerCo: 'Protelindo',
      plnMeterKwh: 3744.0,
      rectifierDcKwh: 3348.0,
      ossRadioKwh: 3225.6,
      auxLossKwh: 396.0,
      variancePct: 0.8,
      phantomLossRp: 0,
      recoveredCreditNoteRp: 0,
      status: 'SEIMBANG (VALID)',
      notes: 'Deviasi stabil, baseline kontrol operasional.'
    },
    ...evaluatedByodRows
  ];

  const baseJournalItems = [
    {
      item: '001',
      postingKey: '40 (Debit)',
      type: 'DEBIT',
      glAccount: '510100',
      glName: 'Beban Listrik & Utilitas BTS Makro PLN',
      amount: 2659000000,
      costCenter: 'CC-REG3-NOPS',
      profitCenter: 'PC-TSEL-RETAIL',
      wbsElement: 'WBS-2026-TSEL-RAN-ENERGY-01',
      text: 'Pengakuan Beban Bruto Listrik PLN Sebelum Carrier Sleep'
    },
    {
      item: '002',
      postingKey: '50 (Credit)',
      type: 'CREDIT',
      glAccount: '510100',
      glName: 'Beban Listrik & Utilitas BTS Makro PLN',
      amount: 2260000000,
      costCenter: 'CC-REG3-NOPS',
      profitCenter: 'PC-TSEL-RETAIL',
      wbsElement: 'WBS-2026-TSEL-RAN-ENERGY-01',
      text: 'Kredit Efisiensi Energi AI O-RAN (Net Savings Telkomsel)'
    },
    {
      item: '003',
      postingKey: '50 (Credit)',
      type: 'CREDIT',
      glAccount: '210150',
      glName: 'Hutang Bagi Hasil Shared Savings TowerCo',
      amount: 399000000,
      costCenter: 'CC-REG3-NOPS',
      profitCenter: 'PC-TSEL-RETAIL',
      wbsElement: 'WBS-2026-TSEL-RAN-ENERGY-01',
      text: 'Akrual Insentif Efisiensi Thermal Shelter Mitratel (15% Share)'
    }
  ];

  const fopSettlementItems = isBdgResolved
    ? [
        {
          item: '004',
          postingKey: '40 (Debit)',
          type: 'DEBIT',
          glAccount: '110420',
          glName: 'Piutang Klaim Restitusi Tagihan Listrik & SLA Shelter',
          amount: 3824640,
          costCenter: 'CC-REG3-NOPS',
          profitCenter: 'PC-TSEL-RETAIL',
          wbsElement: 'WBS-2026-TSEL-RAN-ENERGY-01',
          text: 'Nota Kredit BA-RE Restitusi Anomali Site BDG-DGO-P04 (WO-00492)'
        },
        {
          item: '005',
          postingKey: '50 (Credit)',
          type: 'CREDIT',
          glAccount: '510100',
          glName: 'Beban Listrik & Utilitas BTS Makro PLN',
          amount: 3824640,
          costCenter: 'CC-REG3-NOPS',
          profitCenter: 'PC-TSEL-RETAIL',
          wbsElement: 'WBS-2026-TSEL-RAN-ENERGY-01',
          text: 'Koreksi Beban Phantom Power BDG-DGO-P04 Pasca Kalibrasi FOP'
        }
      ]
    : [];

  const byodJournalItems = [];
  let nextItemSeq = isBdgResolved ? 6 : 4;
  for (const byodRow of evaluatedByodRows) {
    const claimAmount = byodRow.phantomLossRp || byodRow.recoveredCreditNoteRp || 0;
    if (claimAmount > 0) {
      const debitItemNo = String(nextItemSeq++).padStart(3, '0');
      const creditItemNo = String(nextItemSeq++).padStart(3, '0');
      byodJournalItems.push(
        {
          item: debitItemNo,
          postingKey: '40 (Debit)',
          type: 'DEBIT',
          glAccount: '110420',
          glName: 'Piutang Klaim Restitusi Tagihan Listrik & SLA Shelter (BYOD)',
          amount: claimAmount,
          costCenter: 'CC-REG3-NOPS',
          profitCenter: 'PC-TSEL-RETAIL',
          wbsElement: 'WBS-2026-TSEL-RAN-ENERGY-01',
          text: `Klaim Restitusi BYOD ${byodRow.siteId} (IDPEL ${byodRow.idpelPln || '-'})`
        },
        {
          item: creditItemNo,
          postingKey: '50 (Credit)',
          type: 'CREDIT',
          glAccount: '510100',
          glName: 'Beban Listrik & Utilitas BTS Makro PLN (BYOD)',
          amount: claimAmount,
          costCenter: 'CC-REG3-NOPS',
          profitCenter: 'PC-TSEL-RETAIL',
          wbsElement: 'WBS-2026-TSEL-RAN-ENERGY-01',
          text: `Koreksi Beban Phantom Power BYOD ${byodRow.siteId} (+${byodRow.variancePct}%)`
        }
      );
    }
  }

  const sapJournalItems = [...baseJournalItems, ...fopSettlementItems, ...byodJournalItems];
  const totalDebit = sapJournalItems
    .filter((i) => i.type === 'DEBIT')
    .reduce((sum, i) => sum + i.amount, 0);
  const totalCredit = sapJournalItems
    .filter((i) => i.type === 'CREDIT')
    .reduce((sum, i) => sum + i.amount, 0);

  const byodAnomalousCount = evaluatedByodRows.filter((r) => r.status === 'ANOMALI (DISPUTE)').length;
  const byodBalancedCount = evaluatedByodRows.length - byodAnomalousCount;
  const byodDisputeRp = evaluatedByodRows.reduce((s, r) => s + (r.phantomLossRp || 0), 0);
  const byodSettledRp = evaluatedByodRows.reduce((s, r) => s + (r.recoveredCreditNoteRp || 0), 0);

  const sha256Digest = evaluatedByodRows.length > 0
    ? `byod${evaluatedByodRows.length}c8e21a76d03b551c820f9e41207b3a91d64028f7c11e8b3095d2a7e641`
    : isBdgResolved
      ? '9f4c8e21a76d03b551c820f9e41207b3a91d64028f7c11e8b3095d2a7e6419c0'
      : 'e8a1d59f32b8417c80ef749109403a558dc93e0b23f81643217bca89d1084b12';

  const sapBapiPayload = {
    DOCUMENTHEADER: {
      OBJ_TYPE: 'BAPICACHE',
      OBJ_KEY: '$',
      OBJ_SYS: 'TSEL_S4HANA_PRD',
      BUS_ACT: 'RFBU',
      USERNAME: 'SVC_IMPACTGRID_ORCH',
      HEADER_TXT: evaluatedByodRows.length > 0
        ? `ImpactGrid O-RAN + ${evaluatedByodRows.length} BYOD Regional Sites`
        : isBdgResolved
          ? 'ImpactGrid O-RAN Savings + FOP Credit Note BDG-DGO-P04'
          : 'ImpactGrid O-RAN Energy Savings October 2026',
      COMP_CODE: '1000',
      DOC_DATE: '20261030',
      PSTNG_DATE: '20261030',
      FISC_YEAR: '2026',
      FIS_PERIOD: '10',
      DOC_TYPE: 'SA',
      REF_DOC_NO: 'BA-RE/TSEL-NOPS/REG3/X/2026/0894'
    },
    ACCOUNTGL: sapJournalItems.map((entry, idx) => ({
      ITEMNO_ACC: String(idx + 1).padStart(10, '0'),
      GL_ACCOUNT: entry.glAccount.padStart(10, '0'),
      ITEM_TEXT: entry.text.slice(0, 50),
      COSTCENTER: '0000CC_REG3_NOPS',
      PROFIT_CTR: 'PC_TSEL_RETAIL',
      WBS_ELEMENT: entry.wbsElement
    })),
    CURRENCYAMOUNT: sapJournalItems.map((entry, idx) => ({
      ITEMNO_ACC: String(idx + 1).padStart(10, '0'),
      CURRENCY: 'IDR',
      AMT_DOCCUR: entry.type === 'DEBIT' ? entry.amount : -entry.amount
    }))
  };

  return {
    isBdgResolved,
    customByodCount: evaluatedByodRows.length,
    resolvedCount: resolvedSet.size,
    reconciliationSites,
    clusterSummary: {
      totalSitesAudited: 50 + evaluatedByodRows.length,
      balancedSites: (isBdgResolved ? 49 : 48) + byodBalancedCount,
      anomalousSites: (isBdgResolved ? 1 : 2) + byodAnomalousCount,
      fopCalibratedSites: (isBdgResolved ? 1 : 0) + evaluatedByodRows.filter((r) => r.status === 'TERKALIBRASI FOP (VALID)').length,
      activeDisputeRp: (isBdgResolved ? 3824640 : 7649280) + byodDisputeRp,
      settledCreditNoteRp: (isBdgResolved ? 3824640 : 0) + byodSettledRp,
      energySavedKwhCluster: isBdgResolved ? 15094.1 : 14820.5
    },
    sha256Digest,
    sapJournalItems,
    totalDebit,
    totalCredit,
    isBalanced: totalDebit === totalCredit,
    sapBapiPayload
  };
}

/**
 * Procurement Bill of Quantities (BoQ) & RKS (Rencana Kerja & Syarat-Syarat) Data
 */
export const PROCUREMENT_BOQ_PHASES = {
  g0_audit: {
    id: 'g0_audit',
    code: 'RKS-TSEL-PROC/2026/G0-095',
    title: 'Fase 0 — Audit Kesiapan & Kalibrasi Pra-Pilot (Stage-Gate G0)',
    ceilingIDR: 95000000,
    durationLabel: '8 Minggu (2 Bulan)',
    targetScope: '50 Site Kandidat (40 Intervensi + 10 Kontrol) Koridor Jamali',
    contractType: 'Lumsum Jasa Konsultansi & Audit Teknis (No-CapEx Lock-in)',
    items: [
      {
        code: 'G0-01',
        component: 'Sewa & Kalibrasi Clamp Meter IoT Kelas 0.5s (Fluke 376 FC / Hioki)',
        spec: 'Sertifikasi KAN/Tera Metrologi untuk audit komparasi arus AC PLN vs DC Rectifier 48V',
        qty: 10,
        unit: 'Unit-Bulan',
        unitCostIDR: 2200000,
        tkdnPct: 45,
        leadTime: '1 Minggu'
      },
      {
        code: 'G0-02',
        component: 'Audit Integrasi Sandbox Southbound O-RAN O1 (ENM / iMaster NCE)',
        spec: 'Uji konektivitas read-only PM/FM counters & validasi skema YANG/NETCONF di Lab Telkomsel',
        qty: 1,
        unit: 'Paket Integrasi',
        unitCostIDR: 24000000,
        tkdnPct: 80,
        leadTime: '3 Minggu'
      },
      {
        code: 'G0-03',
        component: 'Survei Fisik Panel AC/DC & Termal 50 Shelter BTS Bersama TowerCo',
        spec: 'Inspeksi beban parasitik, kondisi kompresor HVAC, dan berita acara akses bersama Mitratel/Protelindo',
        qty: 50,
        unit: 'Site BTS',
        unitCostIDR: 450000,
        tkdnPct: 90,
        leadTime: '4 Minggu'
      },
      {
        code: 'G0-04',
        component: 'Security Assessment, Hardening ISO 27001 & Kepatuhan PP 71/2019',
        spec: 'Vulnerability Assessment & Penetration Testing (VAPT) oleh tim CISO Telkomsel di DC Sentul',
        qty: 1,
        unit: 'Paket Audit',
        unitCostIDR: 14500000,
        tkdnPct: 85,
        leadTime: '2 Minggu'
      },
      {
        code: 'G0-05',
        component: 'Penyusunan Baseline Ekonometrika Difference-in-Differences (DiD)',
        spec: 'Pembersihan data historis tagihan PLN 12 bulan & pencocokan kovariat 40 site uji vs 10 kontrol',
        qty: 1,
        unit: 'Paket Studi',
        unitCostIDR: 12000000,
        tkdnPct: 95,
        leadTime: '2 Minggu'
      }
    ]
  },
  phase1_pilot: {
    id: 'phase1_pilot',
    code: 'RKS-TSEL-PROC/2027/P1-450',
    title: 'Fase 1 — Turn-Key Pilot 50 Site Makro Jamali (Stage-Gate G1)',
    ceilingIDR: 450000000,
    durationLabel: '9 Bulan Evaluasi Operasional',
    targetScope: '40 Site Intervensi Aktif + 10 Site Kontrol Pembanding',
    contractType: 'Turn-Key CapEx + Performance-Linked SLA Protection',
    items: [
      {
        code: 'P1-01',
        component: 'Smart Submeter Digital 3-Phase AC & 48V DC Hall-Effect (Class 0.5s)',
        spec: 'Protokol Modbus-TCP / DLMS-COSEM, akurasi ±0.5%, dilengkapi CT split-core tanpa pemutusan kabel',
        qty: 50,
        unit: 'Set Shelter',
        unitCostIDR: 3200000,
        tkdnPct: 42,
        leadTime: '4 Minggu'
      },
      {
        code: 'P1-02',
        component: 'Industrial Edge IoT Telemetry Gateway & Smart HVAC IR/Modbus Actuator',
        spec: 'Dual-SIM M2M Telkomsel Private APN, buffer memori lokal 30 hari, suhu kerja -10°C s/d 70°C',
        qty: 50,
        unit: 'Unit BTS',
        unitCostIDR: 2100000,
        tkdnPct: 48,
        leadTime: '4 Minggu'
      },
      {
        code: 'P1-03',
        component: 'Lisensi Platform ImpactGrid Non-RT RIC rApp & Near-RT xApp Guardrail',
        spec: 'Lisensi kluster 50 site (termasuk modul Zero-Wait 28ms 112 Rollback & SHA-256 Merkle Ledger)',
        qty: 1,
        unit: 'Lisensi Kluster',
        unitCostIDR: 75000000,
        tkdnPct: 85,
        leadTime: '2 Minggu'
      },
      {
        code: 'P1-04',
        component: 'Konektor Southbound Multi-Vendor O-RAN O1 (Ericsson ENM & Huawei NCE)',
        spec: 'Lisensi adapter API, mTLS certificate provisioning, dan automated rollback daemon 120 detik',
        qty: 1,
        unit: 'Paket Sistem',
        unitCostIDR: 45000000,
        tkdnPct: 75,
        leadTime: '3 Minggu'
      },
      {
        code: 'P1-05',
        component: 'Jasa Instalasi, Komisioning Lapangan FOP & Kalibrasi 50 Site',
        spec: 'Pemasangan non-intrusif (zero downtime), uji fail-safe 112 per sektor, & penerbitan BAST fisik',
        qty: 50,
        unit: 'Site BTS',
        unitCostIDR: 800000,
        tkdnPct: 95,
        leadTime: '5 Minggu'
      },
      {
        code: 'P1-06',
        component: 'Deployment Kluster Kubernetes High-Availability (Telkom DC Sentul & Surabaya)',
        spec: 'Konfigurasi ClickHouse Time-Series DB, Kafka Bus, dan konektor BAPI SAP S/4HANA FI-CO',
        qty: 1,
        unit: 'Paket Infra',
        unitCostIDR: 25000000,
        tkdnPct: 88,
        leadTime: '2 Minggu'
      }
    ]
  }
};

/**
 * Calculates deterministic BoQ totals, contingency reserve, and weighted TKDN compliance.
 */
export function calculateBoqSummary(phaseKey = 'phase1_pilot', contingencyPct = 0) {
  const phase = PROCUREMENT_BOQ_PHASES[phaseKey] || PROCUREMENT_BOQ_PHASES.phase1_pilot;
  const lineItems = phase.items.map((item) => {
    const subtotalIDR = item.qty * item.unitCostIDR;
    const tkdnValueIDR = Math.round(subtotalIDR * (item.tkdnPct / 100));
    return {
      ...item,
      subtotalIDR,
      tkdnValueIDR
    };
  });

  const baseTotalIDR = lineItems.reduce((sum, i) => sum + i.subtotalIDR, 0);
  const totalTkdnIDR = lineItems.reduce((sum, i) => sum + i.tkdnValueIDR, 0);
  const weightedTkdnPct = baseTotalIDR > 0 ? Number(((totalTkdnIDR / baseTotalIDR) * 100).toFixed(1)) : 0;

  const safeContingencyPct = Math.max(0, Math.min(25, Number(contingencyPct) || 0));
  const contingencyIDR = Math.round(baseTotalIDR * (safeContingencyPct / 100));
  const grandTotalIDR = baseTotalIDR + contingencyIDR;
  const remainingCeilingIDR = phase.ceilingIDR - grandTotalIDR;

  return {
    phaseId: phase.id,
    code: phase.code,
    title: phase.title,
    ceilingIDR: phase.ceilingIDR,
    durationLabel: phase.durationLabel,
    targetScope: phase.targetScope,
    contractType: phase.contractType,
    lineItems,
    baseTotalIDR,
    contingencyPct: safeContingencyPct,
    contingencyIDR,
    grandTotalIDR,
    remainingCeilingIDR,
    isWithinCeiling: grandTotalIDR <= phase.ceilingIDR,
    weightedTkdnPct,
    meetsBumnTkdnMandate: weightedTkdnPct >= 40.0
  };
}

/**
 * Simulates SLA Penalty & QoS Insurance Shield under vendor & TowerCo contract clauses.
 */
export function computeSlaPenaltyShield({
  callDropRatePct = 0.06,
  wakeUpLatencyMs = 24,
  shelterTempC = 27.4,
  monthlyLeasePerSiteRp = 12500000,
  siteCount = 40
} = {}) {
  const cdrThresholdPct = 0.20;
  const latencyThresholdMs = 28;
  const tempThresholdC = 32.0;

  const cdrBreach = callDropRatePct > cdrThresholdPct;
  const latencyBreach = wakeUpLatencyMs > latencyThresholdMs;
  const tempBreach = shelterTempC > tempThresholdC;

  const anyBreach = cdrBreach || latencyBreach || tempBreach;

  // If any breach occurs, xApp triggers instant (<28ms) hardware override and TowerCo/Vendor absorbs SLA credit
  const towerCoThermalPenaltyRp = tempBreach ? 2500000 * Math.max(1, Math.round(siteCount * 0.05)) : 0;
  const vendorQosCreditRp = (cdrBreach || latencyBreach)
    ? Math.round(monthlyLeasePerSiteRp * siteCount * 0.05)
    : 0;

  return {
    callDropRatePct,
    wakeUpLatencyMs,
    shelterTempC,
    thresholds: {
      cdrThresholdPct,
      latencyThresholdMs,
      tempThresholdC
    },
    breaches: {
      cdrBreach,
      latencyBreach,
      tempBreach,
      anyBreach
    },
    protectionStatus: anyBreach
      ? 'AUTO_ROLLBACK_ENGAGED (Zero Telkomsel Revenue Loss — Vendor/TowerCo Penalty Active)'
      : 'NOMINAL_PROTECTED (100% SLA Compliant • Zero Penalty Exposure)',
    rollbackSpeedMs: Math.min(wakeUpLatencyMs, 28),
    towerCoThermalPenaltyRp,
    vendorQosCreditRp,
    totalProtectedIndemnityRp: towerCoThermalPenaltyRp + vendorQosCreditRp,
    telkomselNetRiskExposureRp: 0
  };
}

/**
 * Creates a validated Dual-Screen Presenter Sync message packet.
 */
export function createPresenterSyncMessage(type, payload = {}, senderId = 'presenter-main') {
  return {
    channel: SYNC_CHANNEL_NAME,
    version: '1.0',
    type: String(type || 'STATE_SYNC'),
    payload: payload && typeof payload === 'object' ? payload : {},
    senderId: String(senderId || 'presenter-main'),
    timestamp: Date.now()
  };
}

/**
 * Parses and validates an incoming Dual-Screen Presenter Sync message packet.
 * Returns null if invalid or sent by the same tab instance.
 */
export function parsePresenterSyncMessage(rawMessage, currentSenderId = '') {
  if (!rawMessage || typeof rawMessage !== 'object') return null;
  if (rawMessage.channel !== SYNC_CHANNEL_NAME) return null;
  if (!rawMessage.type || typeof rawMessage.type !== 'string') return null;
  if (currentSenderId && rawMessage.senderId === currentSenderId) return null;
  return {
    type: rawMessage.type,
    payload: rawMessage.payload || {},
    senderId: rawMessage.senderId || 'unknown',
    timestamp: Number(rawMessage.timestamp) || Date.now()
  };
}
