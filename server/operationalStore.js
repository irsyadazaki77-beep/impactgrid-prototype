import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE_PATH = path.join(DATA_DIR, 'impactgrid-operational-db.json');

export const DEFAULT_SLA_THRESHOLDS = {
  maxPrbSleepPct: 70.0,
  maxShelterTempC: 32.0,
  maxCdrPct: 0.08,
  phantomDiscrepancyThresholdPct: 12.0,
  rectifierConversionEfficiency: 0.90,
  plnTariffIdr: 1500,
  gridEmissionFactorKgCo2: 0.87,
  updatedAt: '2026-10-30T08:00:00.000Z',
  updatedBy: 'SYSTEM_DEFAULT'
};

export const DIVISION_ACCOUNTS = [
  {
    id: 'vp_network',
    nik: '8810429',
    name: 'Ir. Bambang Hariyanto, M.T.',
    email: 'bambang.hariyanto@telkomsel.co.id',
    roleId: 'vp_network',
    title: 'VP Network Operations & Quality',
    department: 'Network Operations & Quality Directorate',
    permissions: ['VIEW_EXECUTIVE', 'APPROVE_GATE', 'SIGN_BARE', 'TRIGGER_112', 'MANAGE_SITES', 'DISPATCH_ORAN', 'POST_SAP']
  },
  {
    id: 'noc_leader',
    nik: '9102384',
    name: 'Ir. Reza Pahlevi, S.T.',
    email: 'reza.pahlevi@telkomsel.co.id',
    roleId: 'noc_leader',
    title: 'NOC Incident Commander & Shift Leader',
    department: 'Network Operations Center (NOC) 24/7',
    permissions: ['VIEW_ENGINEERING', 'INGEST_TELEMETRY', 'MANAGE_SITES', 'DISPATCH_ORAN', 'DISPATCH_FOP', 'TRIGGER_112']
  },
  {
    id: 'rno_engineer',
    nik: '9304812',
    name: 'Dr. Eng. Nadia Kusuma',
    email: 'nadia.kusuma@telkomsel.co.id',
    roleId: 'rno_engineer',
    title: 'Radio Planning & O-RAN Engineer',
    department: 'RAN Planning, Optimization & Engineering',
    permissions: ['VIEW_ENGINEERING', 'INGEST_TELEMETRY', 'MANAGE_SITES', 'CALIBRATE_SLA', 'DISPATCH_ORAN']
  },
  {
    id: 'fop_technician',
    nik: '8921044',
    name: 'Ir. Andi Pratama (FOP Mitratel)',
    email: 'andi.pratama@mitratel.co.id',
    roleId: 'noc_leader',
    title: 'Lead FOP Field Engineer (Mitratel Regional)',
    department: 'Field Operations & Shelter Maintenance',
    permissions: ['VIEW_ENGINEERING', 'RESOLVE_FOP', 'CALIBRATE_SUBMETER']
  },
  {
    id: 'finance_sap',
    nik: '8709123',
    name: 'Dra. Ratna Wijaya, Ak., CA.',
    email: 'ratna.wijaya@telkomsel.co.id',
    roleId: 'vp_network',
    title: 'VP Financial Accounting & TowerCo Settlement',
    department: 'Financial Accounting & Treasury Directorate',
    permissions: ['VIEW_EXECUTIVE', 'SIGN_BARE', 'POST_SAP', 'EXPORT_AUDIT']
  },
  {
    id: 'esg_lead',
    nik: '9005129',
    name: 'Arif Budiman, M.Env.',
    email: 'arif.budiman@telkomsel.co.id',
    roleId: 'esg_lead',
    title: 'Head of ESG & Sustainability Governance',
    department: 'Corporate Sustainability & Governance Office',
    permissions: ['VIEW_EXECUTIVE', 'EXPORT_AUDIT', 'VERIFY_SHA256']
  },
  {
    id: 'auditor',
    nik: '8603910',
    name: 'Hendra Gunawan, CISA, CISSP',
    email: 'hendra.gunawan@telkomsel.co.id',
    roleId: 'auditor',
    title: 'Corporate Internal Auditor & CISO',
    department: 'Internal Audit & Information Security',
    permissions: ['VIEW_EXECUTIVE', 'VIEW_ENGINEERING', 'EXPORT_AUDIT', 'VERIFY_SHA256']
  }
];

const BASE_SITE_TEMPLATES = [
  { id: 'JKT-SEL-P01', name: 'Senopati Macro Hub', cluster: 'Jabodetabek', province: 'DKI Jakarta', lat: -6.2297, lng: 106.8096, towerCo: 'Mitratel', pln: 4.82, dc: 4.35, rf: 3.42, prb: 38.5, temp: 27.4, cdr: 0.06, carriers: 4 },
  { id: 'JKT-PST-P02', name: 'Thamrin Commercial Hub', cluster: 'Jabodetabek', province: 'DKI Jakarta', lat: -6.1944, lng: 106.8229, towerCo: 'Protelindo', pln: 5.90, dc: 5.32, rf: 4.18, prb: 52.1, temp: 28.2, cdr: 0.08, carriers: 4 },
  { id: 'JKT-BRT-P03', name: 'Tomang Interchange Macro', cluster: 'Jabodetabek', province: 'DKI Jakarta', lat: -6.1767, lng: 106.7922, towerCo: 'Mitratel', pln: 4.65, dc: 4.20, rf: 3.30, prb: 34.0, temp: 27.1, cdr: 0.05, carriers: 4 },
  { id: 'JKT-UTR-P04', name: 'Kelapa Gading Boulevard', cluster: 'Jabodetabek', province: 'DKI Jakarta', lat: -6.1574, lng: 106.9080, towerCo: 'TBIG', pln: 5.15, dc: 4.62, rf: 3.65, prb: 42.5, temp: 28.8, cdr: 0.07, carriers: 4 },
  { id: 'JKT-TMR-P05', name: 'Cawang Transit Macro', cluster: 'Jabodetabek', province: 'DKI Jakarta', lat: -6.2442, lng: 106.8722, towerCo: 'Mitratel', pln: 5.40, dc: 4.85, rf: 3.82, prb: 48.0, temp: 29.0, cdr: 0.06, carriers: 4 },
  { id: 'BDG-DGO-P04', name: 'Dago Atas Macro Hub', cluster: 'Bandung', province: 'Jawa Barat', lat: -6.8821, lng: 107.6189, towerCo: 'Mitratel', pln: 4.12, dc: 3.71, rf: 2.88, prb: 24.3, temp: 26.8, cdr: 0.05, carriers: 3 },
  { id: 'BDG-RNG-P06', name: 'Riau Business District', cluster: 'Bandung', province: 'Jawa Barat', lat: -6.9080, lng: 107.6186, towerCo: 'Protelindo', pln: 4.70, dc: 4.22, rf: 3.32, prb: 36.8, temp: 27.5, cdr: 0.06, carriers: 4 },
  { id: 'BDG-BBR-P07', name: 'Buah Batu Macro', cluster: 'Bandung', province: 'Jawa Barat', lat: -6.9430, lng: 107.6335, towerCo: 'Mitratel', pln: 4.35, dc: 3.90, rf: 3.05, prb: 29.5, temp: 27.0, cdr: 0.05, carriers: 3 },
  { id: 'SMG-SIM-P03', name: 'Simpang Lima Macro', cluster: 'Semarang', province: 'Jawa Tengah', lat: -6.9904, lng: 110.4230, towerCo: 'Mitratel', pln: 4.45, dc: 4.01, rf: 3.15, prb: 33.2, temp: 27.9, cdr: 0.06, carriers: 3 },
  { id: 'SMG-PMH-P08', name: 'Pemuda Financial District', cluster: 'Semarang', province: 'Jawa Tengah', lat: -6.9765, lng: 110.4152, towerCo: 'TBIG', pln: 4.80, dc: 4.31, rf: 3.40, prb: 39.0, temp: 28.4, cdr: 0.07, carriers: 4 },
  { id: 'SBY-GUB-P02', name: 'Gubeng Transit Station', cluster: 'Surabaya', province: 'Jawa Timur', lat: -7.2653, lng: 112.7520, towerCo: 'Protelindo', pln: 5.10, dc: 4.60, rf: 3.65, prb: 41.0, temp: 29.1, cdr: 0.07, carriers: 4 },
  { id: 'SBY-BJM-P09', name: 'Basuki Rahmat Hub', cluster: 'Surabaya', province: 'Jawa Timur', lat: -7.2689, lng: 112.7412, towerCo: 'Mitratel', pln: 5.60, dc: 5.02, rf: 3.98, prb: 49.2, temp: 29.8, cdr: 0.08, carriers: 4 },
  { id: 'SBY-DAR-P10', name: 'Darmo Macro Residence', cluster: 'Surabaya', province: 'Jawa Timur', lat: -7.2892, lng: 112.7344, towerCo: 'TBIG', pln: 4.55, dc: 4.08, rf: 3.20, prb: 31.4, temp: 28.0, cdr: 0.05, carriers: 3 },
  { id: 'MLG-IJN-P05', name: 'Ijen Boulevard Heritage', cluster: 'Malang', province: 'Jawa Timur', lat: -7.9730, lng: 112.6240, towerCo: 'Mitratel', pln: 3.88, dc: 3.49, rf: 2.72, prb: 19.4, temp: 25.5, cdr: 0.04, carriers: 3 },
  { id: 'MLG-SBT-P11', name: 'Soekarno Hatta Campus', cluster: 'Malang', province: 'Jawa Timur', lat: -7.9465, lng: 112.6155, towerCo: 'Protelindo', pln: 4.25, dc: 3.82, rf: 3.00, prb: 28.0, temp: 26.2, cdr: 0.05, carriers: 3 }
];

export function generateSeedSites(presetKey = 'jamali50') {
  const sites = [];
  const vendors = ['Ericsson', 'Huawei', 'ZTE'];
  const targetCount = presetKey === 'jabodetabek15' ? 15 : presetKey === 'jabarRural10' ? 10 : 50;

  for (let i = 0; i < targetCount; i++) {
    const template = BASE_SITE_TEMPLATES[i % BASE_SITE_TEMPLATES.length];
    const indexStr = String(i + 1).padStart(2, '0');
    const cluster = presetKey === 'jabodetabek15' ? 'Jabodetabek' : presetKey === 'jabarRural10' ? 'Jawa Barat' : template.cluster;
    const vendor = vendors[i % 2]; // Ericsson & Huawei primary
    const isControl = i >= 40;
    const factor = 1 + ((i % 5) - 2) * 0.04;
    const plnAc = +(template.pln * factor).toFixed(2);
    const isPhantomAnomaly = (i === 4 || i === 5 || i === 18);
    const dcRect = isPhantomAnomaly ? +(plnAc * 0.76).toFixed(2) : +(plnAc * 0.90).toFixed(2);
    const rfPower = +(dcRect * 0.78).toFixed(2);
    const prb = Math.min(95, Math.max(10, +(template.prb * factor).toFixed(1)));
    const temp = (i === 7 || i === 10) ? 34.2 : +(template.temp + ((i % 3) - 1) * 0.8).toFixed(1);
    const cdr = +(template.cdr + (i === 12 ? 0.05 : 0)).toFixed(2);

    // Preserve canonical IDs for first key pilot sites so closed-loop lookups match
    let siteId = `${cluster.slice(0, 3).toUpperCase()}-SITE-${indexStr}`;
    let siteName = `${template.name} #${indexStr}`;
    if (i === 0) {
      siteId = 'JKT-SEL-P01';
      siteName = 'Kebayoran Baru / Senopati Macro BTS';
    } else if (i === 5) {
      siteId = 'BDG-DGO-P04';
      siteName = 'Dago Atas Macro Hub';
    } else if (i === 10) {
      siteId = 'SBY-GUB-P02';
      siteName = 'Gubeng Transit Station';
    } else if (i === 42) {
      siteId = 'SBY-RKT-C02';
      siteName = 'Rungkut Industri (Control)';
    }

    sites.push({
      site_id: siteId,
      site_name: siteName,
      cluster,
      province: template.province,
      lat: +(template.lat + ((i % 7) - 3) * 0.012).toFixed(5),
      lng: +(template.lng + ((i % 5) - 2) * 0.012).toFixed(5),
      vendor,
      tower_provider: template.towerCo,
      group_type: isControl ? 'control' : 'intervention',
      timestamp: '2026-10-30 14:00:00',
      pln_ac_kwh: plnAc,
      dc_rectifier_kwh: dcRect,
      radio_rf_kwh: rfPower,
      prb_utilization_pct: prb,
      shelter_temp_c: temp,
      call_drop_rate_pct: cdr,
      carrier_count: template.carriers,
      sleep_mode_status: isControl ? 'BASELINE_FULL_LOAD' : (prb < 35 ? 'DEEP_SLEEP_ACTIVE' : 'CARRIER_SLEEP_B3'),
      calibrated_fop: false
    });
  }

  return sites;
}

export function evaluateSiteMetrics(row, thresholds = DEFAULT_SLA_THRESHOLDS, resolvedSiteIds = []) {
  const resolvedSet = new Set(Array.isArray(resolvedSiteIds) ? resolvedSiteIds : []);
  const isCalibrated = Boolean(row.calibrated_fop || resolvedSet.has(row.site_id));

  const plnAc = Number(row.pln_ac_kwh) || 0;
  const rawDc = Number(row.dc_rectifier_kwh) || 0;
  const dcRect = isCalibrated ? +(plnAc * 0.905).toFixed(2) : rawDc;
  const rfPower = Number(row.radio_rf_kwh) || +(dcRect * 0.78).toFixed(2);
  const shelterTemp = isCalibrated && Number(row.shelter_temp_c) > 30 ? 26.4 : (Number(row.shelter_temp_c) || 27.5);
  const cdr = Number(row.call_drop_rate_pct) || 0.06;
  const prb = Number(row.prb_utilization_pct) || 35.0;

  const expectedAcFromDc = dcRect * 1.10;
  const discrepancyPct = plnAc > 0 ? +(Math.abs(plnAc - expectedAcFromDc) / plnAc * 100).toFixed(1) : 0;

  const isPhantom = !isCalibrated && discrepancyPct > (thresholds.phantomDiscrepancyThresholdPct ?? 12.0);
  const isThermal = !isCalibrated && shelterTemp > (thresholds.maxShelterTempC ?? 32.0);
  const isSlaRisk = cdr > (thresholds.maxCdrPct ?? 0.80);

  const sleepMultiplier = row.group_type === 'control'
    ? 0.01
    : row.sleep_mode_status === 'EMERGENCY_112_FULL_POWER'
      ? 0.0
      : row.sleep_mode_status === 'DEEP_SLEEP_ACTIVE'
        ? 0.195
        : 0.165;

  const rfSavingKwh = rfPower * sleepMultiplier;
  const hvacSavingKwh = Math.max(0, plnAc - dcRect) * (row.group_type === 'control' ? 0.01 : 0.14);
  const totalSavingKwh = +(rfSavingKwh + hvacSavingKwh).toFixed(2);
  const savingPct = plnAc > 0 ? +(totalSavingKwh / plnAc * 100).toFixed(1) : 0;

  return {
    ...row,
    dc_rectifier_kwh: dcRect,
    radio_rf_kwh: rfPower,
    shelter_temp_c: shelterTemp,
    prb_utilization_pct: prb,
    call_drop_rate_pct: cdr,
    calibrated_fop: isCalibrated,
    discrepancyPct,
    isPhantom,
    isThermal,
    isSlaRisk,
    hasAnomaly: isPhantom || isThermal || isSlaRisk,
    totalSavingKwh,
    savingPct
  };
}

export function computeOperationalSummary(state) {
  const sites = Array.isArray(state?.sites) ? state.sites : [];
  const thresholds = state?.slaThresholds || DEFAULT_SLA_THRESHOLDS;
  const resolvedSites = Array.isArray(state?.resolvedSites) ? state.resolvedSites : [];

  const rowDetails = sites.map((s) => evaluateSiteMetrics(s, thresholds, resolvedSites));
  const siteCount = rowDetails.length;
  const interventionRows = rowDetails.filter((r) => r.group_type !== 'control');
  const controlRows = rowDetails.filter((r) => r.group_type === 'control');

  let totalPlnKwh = 0;
  let totalDcKwh = 0;
  let totalRfKwh = 0;
  let totalPotentialSavingsKwh = 0;
  let phantomAnomaliesCount = 0;
  let thermalAnomaliesCount = 0;
  let slaAlertCount = 0;
  let sumPrb = 0;
  let sumTemp = 0;
  let sumCdr = 0;

  for (const r of rowDetails) {
    totalPlnKwh += r.pln_ac_kwh;
    totalDcKwh += r.dc_rectifier_kwh;
    totalRfKwh += r.radio_rf_kwh;
    totalPotentialSavingsKwh += r.totalSavingKwh;
    if (r.isPhantom) phantomAnomaliesCount++;
    if (r.isThermal) thermalAnomaliesCount++;
    if (r.isSlaRisk) slaAlertCount++;
    sumPrb += r.prb_utilization_pct;
    sumTemp += r.shelter_temp_c;
    sumCdr += r.call_drop_rate_pct;
  }

  const overallSavingsPct = totalPlnKwh > 0 ? +((totalPotentialSavingsKwh / totalPlnKwh) * 100).toFixed(1) : 0;
  const avgDiscrepancy = siteCount > 0
    ? +(rowDetails.reduce((acc, r) => acc + r.discrepancyPct, 0) / siteCount).toFixed(1)
    : 0;

  const avgInterventionSavingPct = interventionRows.length > 0
    ? interventionRows.reduce((acc, r) => acc + r.savingPct, 0) / interventionRows.length
    : overallSavingsPct;
  const avgControlSavingPct = controlRows.length > 0
    ? controlRows.reduce((acc, r) => acc + r.savingPct, 0) / controlRows.length
    : 1.1;
  const didNetEffectPct = +Math.max(0, avgInterventionSavingPct - avgControlSavingPct).toFixed(1);

  const tariffIdr = Number(thresholds.plnTariffIdr) || 1500;
  const emissionFactor = Number(thresholds.gridEmissionFactorKgCo2) || 0.87;

  // Hourly & Annualized impact (24h * 365d = 8760 hours)
  const avoidedCostHourlyIdr = Math.round(totalPotentialSavingsKwh * tariffIdr);
  const annualizedSavedKwh = +(totalPotentialSavingsKwh * 8760).toFixed(0);
  const annualizedSavedMwh = +(annualizedSavedKwh / 1000).toFixed(1);
  const annualizedSavedIdr = Math.round(annualizedSavedKwh * tariffIdr);
  const avoidedEmissionsKgHourly = +(totalPotentialSavingsKwh * emissionFactor).toFixed(1);
  const annualizedEmissionsTon = +((annualizedSavedKwh * emissionFactor) / 1000).toFixed(1);

  const dataQualityScore = siteCount > 0
    ? Math.max(80, Math.min(100, +(100 - avgDiscrepancy * 0.5 - (phantomAnomaliesCount / siteCount) * 20).toFixed(1)))
    : 100;

  const latestAuditEntry = Array.isArray(state?.auditLedger) && state.auditLedger.length > 0
    ? state.auditLedger[0]
    : null;

  return {
    siteCount,
    interventionCount: interventionRows.length,
    controlCount: controlRows.length,
    totalPlnKwh: +totalPlnKwh.toFixed(2),
    totalDcKwh: +totalDcKwh.toFixed(2),
    totalRfKwh: +totalRfKwh.toFixed(2),
    totalPotentialSavingsKwh: +totalPotentialSavingsKwh.toFixed(2),
    overallSavingsPct,
    didNetEffectPct,
    avgDiscrepancy,
    avgPrbPct: siteCount > 0 ? +(sumPrb / siteCount).toFixed(1) : 0,
    avgTempC: siteCount > 0 ? +(sumTemp / siteCount).toFixed(1) : 27.5,
    avgCdrPct: siteCount > 0 ? +(sumCdr / siteCount).toFixed(3) : 0.06,
    avoidedCostIDR: avoidedCostHourlyIdr,
    annualizedSavedMwh,
    annualizedSavedIdr,
    avoidedEmissionsKg: avoidedEmissionsKgHourly,
    annualizedEmissionsTon,
    phantomAnomaliesCount,
    thermalAnomaliesCount,
    slaAlertCount,
    totalAnomalies: phantomAnomaliesCount + thermalAnomaliesCount + slaAlertCount,
    dataQualityScore,
    resolvedSitesCount: resolvedSites.length,
    openWorkOrdersCount: (state?.workOrders || []).filter((w) => w.status !== 'RESOLVED_CLOSED' && w.status !== 'Resolved').length,
    signedBareCount: (state?.bareDocuments || []).length,
    postedSapVouchersCount: (state?.sapVouchers || []).length,
    latestAuditHash: latestAuditEntry?.currentHash || 'e8a1d59f32b8417c80ef749109403a558dc93e0b23f81643217bca89d1084b12',
    rowDetails
  };
}

function createInitialDbState() {
  const genesisHash = crypto.createHash('sha256').update('IMPACTGRID-GENESIS-TELKOMSEL-2026').digest('hex');
  return {
    version: '2.5.0-enterprise',
    datasetKey: 'jamali50',
    lastUpdated: new Date().toISOString(),
    slaThresholds: { ...DEFAULT_SLA_THRESHOLDS },
    sites: generateSeedSites('jamali50'),
    resolvedSites: [],
    workOrders: [
      {
        id: 'WO-2026-TSEL-MT-00492',
        incidentNumber: 'INC-2026-TSEL-0492',
        siteId: 'BDG-DGO-P04',
        siteName: 'Dago Atas Macro Hub',
        anomalyType: 'Phantom Load Drift (+14.2% DC-AC Discrepancy) & AC Overheating',
        priority: 'P2 - Mayor',
        status: 'On-Site',
        technician: 'Ir. Andi Pratama (FOP ID: 8921-MT)',
        vendorTeam: 'Mitratel Regional Maintenance Team 04',
        createdAt: '2026-10-30T06:30:00.000Z',
        closedAt: null,
        resolutionNotes: ''
      },
      {
        id: 'WO-2026-TSEL-SBY-00742',
        incidentNumber: 'INC-2026-TSEL-0742',
        siteId: 'SBY-GUB-P02',
        siteName: 'Gubeng Transit Station',
        anomalyType: 'Shelter Heat Dissipation Risk (34.2°C > 32°C Threshold)',
        priority: 'P1 - Kritis',
        status: 'Dispatched',
        technician: 'Dedi Kurniawan (FOP ID: 4410-PR)',
        vendorTeam: 'Protelindo HVAC Regional East Specialist',
        createdAt: '2026-10-30T07:15:00.000Z',
        closedAt: null,
        resolutionNotes: ''
      }
    ],
    oranPolicies: [
      {
        policyId: 'A1-POL-TSEL-2026-001',
        targetCluster: 'Jabodetabek & Bandung',
        targetSiteId: 'ALL_INTERVENTION',
        policyType: 'MIMO_DEEP_SLEEP_ADAPTIVE',
        sleepMode: 'CARRIER_SLEEP_B3',
        prbWakeUpThresholdPct: 70,
        status: 'ACTIVE_ENFORCED',
        dispatchedBy: 'Dr. Eng. Nadia Kusuma (O-RAN Engineer)',
        dispatchedAt: '2026-10-30T07:00:00.000Z'
      }
    ],
    bareDocuments: [
      {
        docNumber: 'BA-RE/TSEL-NOPS/REG3/X/2026/0894',
        cluster: 'Jawa Barat & Jabodetabek Macro Cluster',
        period: '01 Oktober 2026 s/d 30 Oktober 2026',
        status: 'SIGNED_INITIAL',
        creditNoteIdr: 3824640,
        signedBy: 'Ir. Bambang Hariyanto, M.T. (NIK: 8810429)',
        signedAt: '2026-10-30T08:00:00.000Z',
        sha256Digest: genesisHash
      }
    ],
    sapVouchers: [
      {
        docNumber: 'SAP-2026-FI-088192',
        companyCode: '1000',
        plant: '1102 (Telkomsel Jabar)',
        docType: 'SA (G/L Account Document)',
        postingDate: '30.10.2026',
        referenceBare: 'BA-RE/TSEL-NOPS/REG3/X/2026/0894',
        totalDebitIdr: 2659000000,
        totalCreditIdr: 2659000000,
        restitutionCreditIdr: 0,
        status: 'POSTED_BASELINE',
        postedBy: 'Dra. Ratna Wijaya, Ak., CA.',
        postedAt: '2026-10-30T08:15:00.000Z'
      }
    ],
    auditLedger: [
      {
        id: 'AUD-GENESIS-001',
        timestamp: '2026-10-30T08:00:00.000Z',
        action: 'SYSTEM_GENESIS_INITIALIZED',
        actor: 'ImpactGrid Core Engine',
        category: 'GOVERNANCE',
        detail: '50 Pilot Sites Makro Jamali (40 Intervensi + 10 Kontrol) dimuat ke penyimpanan persisten.',
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
        currentHash: genesisHash
      }
    ]
  };
}

let memoryState = null;

function shouldPersistToDisk() {
  return process.env.NODE_ENV !== 'test';
}

export function loadOperationalState() {
  if (memoryState) return memoryState;

  if (shouldPersistToDisk()) {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.sites) && parsed.sites.length > 0) {
          memoryState = parsed;
          return memoryState;
        }
      }
    } catch {
      // Fallback to fresh initial state if file is unreadable
    }
  }

  memoryState = createInitialDbState();
  saveOperationalState(memoryState);
  return memoryState;
}

export function saveOperationalState(nextState) {
  memoryState = {
    ...nextState,
    lastUpdated: new Date().toISOString()
  };

  if (shouldPersistToDisk()) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(memoryState, null, 2), 'utf-8');
    } catch {
      // Ignore write error in read-only container environments
    }
  }

  return memoryState;
}

export function appendAuditEntry(state, { action, actor = 'Telkomsel Operator', category = 'OPERATIONS', detail = '' }) {
  const prevHash = state.auditLedger?.[0]?.currentHash || '0000000000000000000000000000000000000000000000000000000000000000';
  const timestamp = new Date().toISOString();
  const payload = `${prevHash}|${timestamp}|${action}|${actor}|${category}|${detail}`;
  const currentHash = crypto.createHash('sha256').update(payload).digest('hex');

  const entry = {
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    timestamp,
    action,
    actor,
    category,
    detail,
    prevHash,
    currentHash
  };

  state.auditLedger = [entry, ...(state.auditLedger || [])].slice(0, 100);
  return entry;
}

export function resetOperationalState(presetKey = 'jamali50') {
  const fresh = createInitialDbState();
  fresh.datasetKey = presetKey;
  fresh.sites = generateSeedSites(presetKey);
  appendAuditEntry(fresh, {
    action: 'DATASET_PRESET_LOADED',
    actor: 'System Controller',
    category: 'TELEMETRY',
    detail: `Dataset preset "${presetKey}" (${fresh.sites.length} site BTS) diinisialisasi ulang.`
  });
  return saveOperationalState(fresh);
}

export function upsertOperationalSite(siteInput, actor = 'NOC Engineer') {
  const state = loadOperationalState();
  const siteId = String(siteInput.site_id || siteInput.siteId || '').trim().toUpperCase();
  if (!siteId) {
    throw new Error('site_id wajib diisi.');
  }

  const existingIndex = state.sites.findIndex((s) => s.site_id === siteId);
  const existing = existingIndex >= 0 ? state.sites[existingIndex] : {};

  const plnAc = Number(siteInput.pln_ac_kwh ?? existing.pln_ac_kwh ?? 4.5);
  const dcRect = Number(siteInput.dc_rectifier_kwh ?? existing.dc_rectifier_kwh ?? +(plnAc * 0.9).toFixed(2));
  const rfPower = Number(siteInput.radio_rf_kwh ?? existing.radio_rf_kwh ?? +(dcRect * 0.78).toFixed(2));

  const normalizedSite = {
    site_id: siteId,
    site_name: String(siteInput.site_name ?? existing.site_name ?? `BTS Macro ${siteId}`).trim(),
    cluster: String(siteInput.cluster ?? existing.cluster ?? 'Jabodetabek').trim(),
    province: String(siteInput.province ?? existing.province ?? 'DKI Jakarta').trim(),
    lat: Number(siteInput.lat ?? existing.lat ?? -6.2297),
    lng: Number(siteInput.lng ?? existing.lng ?? 106.8096),
    vendor: String(siteInput.vendor ?? existing.vendor ?? 'Ericsson').trim(),
    tower_provider: String(siteInput.tower_provider ?? existing.tower_provider ?? 'Mitratel').trim(),
    group_type: siteInput.group_type || existing.group_type || 'intervention',
    timestamp: siteInput.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19),
    pln_ac_kwh: +plnAc.toFixed(2),
    dc_rectifier_kwh: +dcRect.toFixed(2),
    radio_rf_kwh: +rfPower.toFixed(2),
    prb_utilization_pct: Number(siteInput.prb_utilization_pct ?? existing.prb_utilization_pct ?? 34.0),
    shelter_temp_c: Number(siteInput.shelter_temp_c ?? existing.shelter_temp_c ?? 27.5),
    call_drop_rate_pct: Number(siteInput.call_drop_rate_pct ?? existing.call_drop_rate_pct ?? 0.06),
    carrier_count: Number(siteInput.carrier_count ?? existing.carrier_count ?? 4),
    sleep_mode_status: siteInput.sleep_mode_status || existing.sleep_mode_status || 'CARRIER_SLEEP_B3',
    calibrated_fop: Boolean(siteInput.calibrated_fop ?? existing.calibrated_fop ?? false)
  };

  if (existingIndex >= 0) {
    state.sites[existingIndex] = normalizedSite;
  } else {
    state.sites = [normalizedSite, ...state.sites];
  }

  appendAuditEntry(state, {
    action: existingIndex >= 0 ? 'BTS_SITE_UPDATED' : 'BTS_SITE_CREATED',
    actor,
    category: 'INVENTORY',
    detail: `Site ${normalizedSite.site_id} (${normalizedSite.site_name}) disimpan — PLN: ${normalizedSite.pln_ac_kwh} kW, DC: ${normalizedSite.dc_rectifier_kwh} kW, Suhu: ${normalizedSite.shelter_temp_c}°C`
  });

  saveOperationalState(state);
  return { site: normalizedSite, summary: computeOperationalSummary(state) };
}

export function deleteOperationalSite(siteId, actor = 'NOC Engineer') {
  const state = loadOperationalState();
  const normalizedId = String(siteId || '').trim().toUpperCase();
  const beforeCount = state.sites.length;
  state.sites = state.sites.filter((s) => s.site_id !== normalizedId);
  if (state.sites.length === beforeCount) {
    throw new Error(`Site ${normalizedId} tidak ditemukan.`);
  }

  appendAuditEntry(state, {
    action: 'BTS_SITE_DELETED',
    actor,
    category: 'INVENTORY',
    detail: `Site ${normalizedId} dihapus dari inventaris aktif.`
  });

  saveOperationalState(state);
  return { deletedSiteId: normalizedId, summary: computeOperationalSummary(state) };
}

export function updateOperationalSlaThresholds(patch, actor = 'O-RAN Engineer') {
  const state = loadOperationalState();
  state.slaThresholds = {
    ...state.slaThresholds,
    ...(patch.maxPrbSleepPct !== undefined ? { maxPrbSleepPct: Number(patch.maxPrbSleepPct) } : {}),
    ...(patch.maxShelterTempC !== undefined ? { maxShelterTempC: Number(patch.maxShelterTempC) } : {}),
    ...(patch.maxCdrPct !== undefined ? { maxCdrPct: Number(patch.maxCdrPct) } : {}),
    ...(patch.phantomDiscrepancyThresholdPct !== undefined ? { phantomDiscrepancyThresholdPct: Number(patch.phantomDiscrepancyThresholdPct) } : {}),
    ...(patch.plnTariffIdr !== undefined ? { plnTariffIdr: Number(patch.plnTariffIdr) } : {}),
    ...(patch.gridEmissionFactorKgCo2 !== undefined ? { gridEmissionFactorKgCo2: Number(patch.gridEmissionFactorKgCo2) } : {}),
    updatedAt: new Date().toISOString(),
    updatedBy: actor
  };

  appendAuditEntry(state, {
    action: 'SLA_THRESHOLDS_CALIBRATED',
    actor,
    category: 'GOVERNANCE',
    detail: `Threshold SLA dikalibrasi: Max PRB Sleep=${state.slaThresholds.maxPrbSleepPct}%, Max Suhu=${state.slaThresholds.maxShelterTempC}°C, Max CDR=${state.slaThresholds.maxCdrPct}%, Tarif=Rp${state.slaThresholds.plnTariffIdr}/kWh`
  });

  saveOperationalState(state);
  return { slaThresholds: state.slaThresholds, summary: computeOperationalSummary(state) };
}

export function dispatchOranPolicyAction({ targetCluster = 'ALL', targetSiteId = null, policyType = 'MIMO_DEEP_SLEEP', sleepMode = 'DEEP_SLEEP_ACTIVE', actor = 'O-RAN Non-RT RIC' }) {
  const state = loadOperationalState();
  let affectedCount = 0;

  state.sites = state.sites.map((site) => {
    const matchesSite = targetSiteId ? site.site_id === targetSiteId : (targetCluster === 'ALL' || site.cluster.toLowerCase() === targetCluster.toLowerCase());
    if (!matchesSite || site.group_type === 'control') return site;

    affectedCount++;
    if (sleepMode === 'EMERGENCY_112_FULL_POWER') {
      return {
        ...site,
        sleep_mode_status: 'EMERGENCY_112_FULL_POWER',
        radio_rf_kwh: +(site.dc_rectifier_kwh * 0.85).toFixed(2)
      };
    }

    const rfFactor = sleepMode === 'DEEP_SLEEP_ACTIVE' ? 0.72 : 0.78;
    return {
      ...site,
      sleep_mode_status: sleepMode,
      radio_rf_kwh: +(site.dc_rectifier_kwh * rfFactor).toFixed(2)
    };
  });

  const policyRecord = {
    policyId: `A1-POL-TSEL-${Date.now().toString().slice(-6)}`,
    targetCluster,
    targetSiteId: targetSiteId || 'CLUSTER_WIDE',
    policyType,
    sleepMode,
    affectedSites: affectedCount,
    status: 'ENFORCED_NETCONF_OK',
    dispatchedBy: actor,
    dispatchedAt: new Date().toISOString()
  };

  state.oranPolicies = [policyRecord, ...(state.oranPolicies || [])].slice(0, 30);

  appendAuditEntry(state, {
    action: sleepMode === 'EMERGENCY_112_FULL_POWER' ? 'ORAN_EMERGENCY_112_WAKEUP' : 'ORAN_A1_O1_POLICY_DISPATCHED',
    actor,
    category: 'O-RAN_RIC',
    detail: `Policy ${policyRecord.policyId} (${policyType} -> ${sleepMode}) diterapkan ke ${affectedCount} site BTS melalui O1 NETCONF.`
  });

  saveOperationalState(state);
  return { policy: policyRecord, summary: computeOperationalSummary(state) };
}

export function resolveSiteAnomalyFop({ siteId = 'BDG-DGO-P04', technician = 'Ir. Andi Pratama (FOP ID: 8921-MT)', resolutionNotes = 'Kondensor AC dibersihkan, gas R-410A diisi, smart submeter Kelas 0.5s dikalibrasi ulang.', checklist = {} }) {
  const state = loadOperationalState();
  const targetId = String(siteId || 'BDG-DGO-P04').trim().toUpperCase();

  if (!state.resolvedSites.includes(targetId)) {
    state.resolvedSites = [...state.resolvedSites, targetId];
  }

  state.sites = state.sites.map((site) => {
    if (site.site_id !== targetId) return site;
    const calibratedDc = +(site.pln_ac_kwh * 0.905).toFixed(2);
    return {
      ...site,
      dc_rectifier_kwh: calibratedDc,
      shelter_temp_c: Math.min(site.shelter_temp_c, 26.4),
      calibrated_fop: true
    };
  });

  const woId = `WO-2026-TSEL-FOP-${Date.now().toString().slice(-4)}`;
  const existingWoIndex = (state.workOrders || []).findIndex((w) => w.siteId === targetId);
  const closedWo = {
    id: existingWoIndex >= 0 ? state.workOrders[existingWoIndex].id : woId,
    incidentNumber: `INC-2026-TSEL-${targetId}`,
    siteId: targetId,
    siteName: state.sites.find((s) => s.site_id === targetId)?.site_name || targetId,
    anomalyType: 'Phantom Load & Shelter Thermal Drift — Calibrated',
    priority: 'P2 - Solved',
    status: 'RESOLVED_CLOSED',
    technician,
    vendorTeam: 'Mitratel Regional Maintenance Team',
    checklist,
    resolutionNotes,
    closedAt: new Date().toISOString()
  };

  if (existingWoIndex >= 0) {
    state.workOrders[existingWoIndex] = closedWo;
  } else {
    state.workOrders = [closedWo, ...(state.workOrders || [])];
  }

  const auditEntry = appendAuditEntry(state, {
    action: 'FOP_WORK_ORDER_RESOLVED',
    actor: technician,
    category: 'RECONCILIATION',
    detail: `Tiket FOP ${closedWo.id} pada site ${targetId} selesai dikalibrasi. Discrepancy dinormalisasi (<1%) & siap diterbitkan BA-RE / SAP Voucher.`
  });

  saveOperationalState(state);
  return {
    workOrder: closedWo,
    resolvedSites: state.resolvedSites,
    auditEntry,
    summary: computeOperationalSummary(state)
  };
}

export function signOfficialBareDocument({ docNumber, signedBy = 'Ir. Bambang Hariyanto, M.T. (VP Network Ops)', cluster = 'Jawa Barat & Jabodetabek Cluster', creditNoteIdr = 3824640 }) {
  const state = loadOperationalState();
  const auditEntry = appendAuditEntry(state, {
    action: 'OFFICIAL_BARE_SIGNED',
    actor: signedBy,
    category: 'LEGAL_SETTLEMENT',
    detail: `Berita Acara Rekonsiliasi Energi (${docNumber || 'BA-RE/TSEL-NOPS/REG3/X/2026/0894'}) disahkan secara kriptografis. Nilai Restitusi: Rp ${Number(creditNoteIdr).toLocaleString('id-ID')}`
  });

  const docRecord = {
    docNumber: docNumber || `BA-RE/TSEL-NOPS/REG3/X/2026/${Date.now().toString().slice(-4)}`,
    cluster,
    period: '01 Oktober 2026 s/d 30 Oktober 2026',
    status: state.resolvedSites.includes('BDG-DGO-P04') ? 'FOP_SETTLED_SIGNED' : 'LEGALLY_SIGNED',
    creditNoteIdr: Number(creditNoteIdr) || 3824640,
    resolvedSites: [...state.resolvedSites],
    signedBy,
    signedAt: new Date().toISOString(),
    sha256Digest: auditEntry.currentHash
  };

  state.bareDocuments = [docRecord, ...(state.bareDocuments || [])].slice(0, 20);
  saveOperationalState(state);
  return { bareDocument: docRecord, auditEntry, summary: computeOperationalSummary(state) };
}

export function postSapAccountingVoucher({ referenceBare = 'BA-RE/TSEL-NOPS/REG3/X/2026/0894', postedBy = 'Dra. Ratna Wijaya, Ak., CA.', restitutionCreditIdr = 3824640 }) {
  const state = loadOperationalState();
  const isFopSettled = state.resolvedSites.length > 0;
  const effectiveRestitution = isFopSettled ? (Number(restitutionCreditIdr) || 3824640) : 0;
  const totalAmount = 2659000000 + effectiveRestitution;
  const docNumber = `SAP-2026-FI-${Math.floor(100000 + Math.random() * 899999)}`;

  const auditEntry = appendAuditEntry(state, {
    action: 'SAP_S4HANA_VOUCHER_POSTED',
    actor: postedBy,
    category: 'FINANCE_SAP',
    detail: `Jurnal SAP S/4HANA ${docNumber} berhasil diposting via BAPI_ACC_DOCUMENT_POST (Total Debit/Kredit: Rp ${totalAmount.toLocaleString('id-ID')}).`
  });

  const voucherRecord = {
    docNumber,
    companyCode: '1000',
    plant: '1102 (Telkomsel Jabar)',
    docType: 'SA (G/L Account Document)',
    postingDate: new Date().toLocaleDateString('id-ID'),
    referenceBare,
    totalDebitIdr: totalAmount,
    totalCreditIdr: totalAmount,
    restitutionCreditIdr: effectiveRestitution,
    status: isFopSettled ? 'POSTED_WITH_RESTITUTION' : 'POSTED_SAP_FI',
    postedBy,
    postedAt: new Date().toISOString(),
    sha256Digest: auditEntry.currentHash
  };

  state.sapVouchers = [voucherRecord, ...(state.sapVouchers || [])].slice(0, 20);
  saveOperationalState(state);
  return { sapVoucher: voucherRecord, auditEntry, summary: computeOperationalSummary(state) };
}
