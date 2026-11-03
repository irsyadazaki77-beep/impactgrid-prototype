// Pure Business & Operational Logic Engine for ImpactGrid Telkomsel Role-Based Workspace
// Decoupled for deterministic unit testing (node:test) and real-time UI reactivity

export const TELKOMSEL_REGIONAL_BENCHMARKS = [
  {
    regionId: 'REG-01-SUMBAGUT',
    regionName: 'Regional Sumbagut & Sumbagsel (Sumatera)',
    hubCity: 'Medan & Palembang',
    macroSites: 1450,
    pilotSampleSites: 8,
    baselineMwhYear: 72500,
    tariffPerKwh: 1480,
    avgEfficiencyPct: 12.4,
    towerCoMix: 'Mitratel 58% · Protelindo 42%',
    anomalyCount: 2,
    greenBtsScore: 88
  },
  {
    regionId: 'REG-02-JABODETABEK',
    regionName: 'Regional Jabodetabek & Banten',
    hubCity: 'Jakarta Selatan',
    macroSites: 2200,
    pilotSampleSites: 14,
    baselineMwhYear: 118800,
    tariffPerKwh: 1550,
    avgEfficiencyPct: 15.2,
    towerCoMix: 'Mitratel 52% · Protelindo 48%',
    anomalyCount: 2,
    greenBtsScore: 94
  },
  {
    regionId: 'REG-03-JABAR',
    regionName: 'Regional Jawa Barat',
    hubCity: 'Bandung (Dago Hub)',
    macroSites: 1150,
    pilotSampleSites: 10,
    baselineMwhYear: 57500,
    tariffPerKwh: 1500,
    avgEfficiencyPct: 14.6,
    towerCoMix: 'Mitratel 64% · Protelindo 36%',
    anomalyCount: 1,
    greenBtsScore: 92
  },
  {
    regionId: 'REG-04-JATENG',
    regionName: 'Regional Jawa Tengah & DIY',
    hubCity: 'Semarang & Yogyakarta',
    macroSites: 980,
    pilotSampleSites: 6,
    baselineMwhYear: 47040,
    tariffPerKwh: 1460,
    avgEfficiencyPct: 13.1,
    towerCoMix: 'Mitratel 60% · Protelindo 40%',
    anomalyCount: 1,
    greenBtsScore: 89
  },
  {
    regionId: 'REG-05-JATIM',
    regionName: 'Regional Jawa Timur',
    hubCity: 'Surabaya (Gubeng)',
    macroSites: 1320,
    pilotSampleSites: 8,
    baselineMwhYear: 66000,
    tariffPerKwh: 1520,
    avgEfficiencyPct: 14.9,
    towerCoMix: 'Mitratel 55% · Protelindo 45%',
    anomalyCount: 1,
    greenBtsScore: 93
  },
  {
    regionId: 'REG-06-BALINUSRA',
    regionName: 'Regional Bali & Nusa Tenggara',
    hubCity: 'Denpasar & Mataram',
    macroSites: 640,
    pilotSampleSites: 4,
    baselineMwhYear: 30720,
    tariffPerKwh: 1560,
    avgEfficiencyPct: 13.8,
    towerCoMix: 'Mitratel 62% · Protelindo 38%',
    anomalyCount: 0,
    greenBtsScore: 91
  },
  {
    regionId: 'REG-07-KALIMANTAN',
    regionName: 'Regional Kalimantan (IKN Nusantara)',
    hubCity: 'Balikpapan & IKN',
    macroSites: 1120,
    pilotSampleSites: 0,
    baselineMwhYear: 56000,
    tariffPerKwh: 1540,
    avgEfficiencyPct: 11.8,
    towerCoMix: 'Mitratel 70% · Protelindo 30%',
    anomalyCount: 1,
    greenBtsScore: 90
  },
  {
    regionId: 'REG-08-SULAWESI-PUMA',
    regionName: 'Regional Sulawesi & Papua-Maluku (3T)',
    hubCity: 'Makassar & Jayapura',
    macroSites: 1140,
    pilotSampleSites: 0,
    baselineMwhYear: 59280,
    tariffPerKwh: 1620,
    avgEfficiencyPct: 11.2,
    towerCoMix: 'Mitratel 75% · USO/3T Hybrid 25%',
    anomalyCount: 1,
    greenBtsScore: 86
  }
];

/**
 * Returns Role-Based Workspace configuration for Telkomsel Business & Operations personas
 */
export function getRoleWorkspaceConfig(roleId = 'vp_network', context = {}) {
  const resolvedCount = Array.isArray(context.resolvedSites) ? context.resolvedSites.length : 0;
  const activeScale = context.selectedScale || 'pilot';
  const emergencyActive = Boolean(context.emergencyActive);

  const configs = {
    vp_network: {
      roleId: 'vp_network',
      teamCategory: 'TIM BISNIS & EKSEKUTIF',
      title: 'VP Network Operations, Finance & Investment Committee',
      focusHeadline: 'Kendali ROI Investasi, Kontrak Bagi-Hasil TowerCo & Settlement SAP S/4HANA',
      missionSummary:
        'Memastikan efisiensi OPEX listrik melampaui titik impas 6,85%, mengawal kontrak pass-through TowerCo (85% Telkomsel / 15% Mitratel-Protelindo), dan mengotorisasi klaim restitusi BA-RE PLN.',
      primaryKpis: [
        {
          label: 'Proyeksi NPV 5-Tahun',
          value: activeScale === 'national' ? '+Rp 41,48 Miliar' : activeScale === 'regional' ? '+Rp 11,70 Miliar' : '+Rp 460 Juta',
          sub: 'WACC 10% · Payback < 2 Tahun'
        },
        {
          label: 'Porsi Bagi-Hasil Telkomsel',
          value: '85,0% Pass-Through',
          sub: '15% Insentif SLA Mitratel/Protelindo'
        },
        {
          label: 'Status Klaim BA-RE & SAP',
          value: `Rp ${(Math.max(1, resolvedCount) * 3_824_640).toLocaleString('id-ID')}`,
          sub: `${resolvedCount} Site Anomali Terkalibrasi FOP`
        }
      ],
      quickActions: [
        { id: 'open_roi_calc', label: 'Kalkulator ROI & TowerCo', targetTab: 'financial', variant: 'primary' },
        { id: 'open_bare_doc', label: 'Terbitkan BA-RE PLN', modalKey: 'bare', variant: 'secondary' },
        { id: 'open_sap_doc', label: 'Posting Jurnal SAP S/4HANA', modalKey: 'sap', variant: 'secondary' },
        { id: 'open_boq_doc', label: 'Rincian BoQ & Kontrak', modalKey: 'boq', variant: 'outline' }
      ]
    },
    noc_leader: {
      roleId: 'noc_leader',
      teamCategory: 'TIM OPERASIONAL SNOC & FOP',
      title: 'SNOC 24/7 Incident Commander & FOP Dispatch Lead',
      focusHeadline: 'Triase Alarm Real-Time, Disposisi Tiket e-WO FOP & Guardrail Darurat 112',
      missionSummary:
        'Memantau deviasi meteran PLN vs Sub-meter DC shelter, mengirim teknisi FOP untuk kalibrasi fisik AC/CT-Clamp, dan menjaga ketersediaan kanal darurat 112 (< 50ms wake-up).',
      primaryKpis: [
        {
          label: 'Status Guardrail 112 & VIP',
          value: emergencyActive ? 'OVERRIDE 112 AKTIF' : 'Siaga Zero-Wait (28ms)',
          sub: emergencyActive ? 'Semua Radio 100% PRB Penuh' : 'Call Drop Rate 0,06% (Aman)'
        },
        {
          label: 'Antrean Tiket Anomali FOP',
          value: `${Math.max(0, 4 - resolvedCount)} Site Perlu Kalibrasi`,
          sub: `${resolvedCount} Site Selesai Closed-Loop`
        },
        {
          label: 'Akurasi Rekonsiliasi 3-Arah',
          value: resolvedCount >= 4 ? '99,4% Klop (<1,5%)' : '96,2% (4 Drift Terdeteksi)',
          sub: 'AMR PLN vs Rectifier DC vs RAN'
        }
      ],
      quickActions: [
        { id: 'open_telemetry_hub', label: 'Triase Telemetri & Ingest BYOD', targetTab: 'telemetry', variant: 'primary' },
        { id: 'open_fop_console', label: 'Konsol Tiket Teknisi FOP', modalKey: 'fop', variant: 'secondary' },
        { id: 'open_emergency_drill', label: 'Kendali Siaga 112 & VIP Guard', modalKey: 'emergency', variant: 'secondary' },
        { id: 'open_twin_inspector', label: 'Inspeksi Digital Twin BTS', targetTab: 'digitaltwin', variant: 'outline' }
      ]
    },
    rno_engineer: {
      roleId: 'rno_engineer',
      teamCategory: 'TIM TEKNIS RAN & O-RAN',
      title: 'Radio Planning, 3GPP Rel-18 & O-RAN rApp Engineer',
      focusHeadline: 'Eksekusi NETCONF O-RAN O1, Carrier Micro-Sleep & Termodinamika PINN',
      missionSummary:
        'Mengatur ambang batas PRB untuk Deep/Symbol Carrier Sleep multi-vendor (Ericsson, Huawei, ZTE) dan mengoptimalkan setpoint inverter HVAC shelter berbasis model fisika PINN.',
      primaryKpis: [
        {
          label: 'Kebijakan O-RAN rApp Aktif',
          value: emergencyActive ? 'Dibekukan (Prioritas 112)' : '3GPP Rel-18 Adaptive Sleep',
          sub: 'Multi-Vendor O1 NETCONF/YANG'
        },
        {
          label: 'Efisiensi Termal & PUE',
          value: 'PUE 1,21 · COP 4,1',
          sub: 'Setpoint Dinamis 25,0°C – 26,5°C'
        },
        {
          label: 'Latensi Wake-Up Carrier',
          value: '18 – 28 ms',
          sub: 'Memenuhi SLA Trafik VIP & VoLTE'
        }
      ],
      quickActions: [
        { id: 'open_twin_3gpp', label: 'Inspektur 3GPP & Digital Twin', targetTab: 'digitaltwin', variant: 'primary' },
        { id: 'open_opt_knapsack', label: 'Optimasi Parameter & Knapsack', targetTab: 'optimization', variant: 'secondary' },
        { id: 'open_agents_orch', label: 'Orkestrasi Agen O-RAN', targetTab: 'agents', variant: 'secondary' },
        { id: 'open_telemetry_mlops', label: 'Deteksi Sensor Drift & BYOD', targetTab: 'telemetry', variant: 'outline' }
      ]
    },
    esg_lead: {
      roleId: 'esg_lead',
      teamCategory: 'TIM BISNIS KEBERLANJUTAN & ESG',
      title: 'Head of ESG, Carbon Tax & Green BTS Governance',
      focusHeadline: 'Dekarbonisasi Scope 2, Mitigasi Pajak Karbon & Sertifikasi Green BTS',
      missionSummary:
        'Mengonversi penghematan MWh listrik menjadi penurunan emisi tCO₂e terverifikasi (IFRS S2 / POJK 51/2017), menghitung penghematan Pajak Karbon, dan menyalurkan 15% Dividen Sosial 3T.',
      primaryKpis: [
        {
          label: 'Reduksi Emisi Scope 2',
          value: activeScale === 'national' ? '12.702 tCO₂e/thn' : activeScale === 'regional' ? '5.046 tCO₂e/thn' : '174 tCO₂e/thn',
          sub: 'Faktor Emisi ESDM 0,87 kgCO₂e/kWh'
        },
        {
          label: 'Kesiapan Sertifikasi Green BTS',
          value: '91,2% Skor Kepatuhan',
          sub: 'Standar ITU-T L.1331 & ISO 14064'
        },
        {
          label: 'Alokasi Dividen Sosial 3T',
          value: activeScale === 'national' ? 'Rp 2,23 Miliar/thn' : activeScale === 'regional' ? 'Rp 720 Juta/thn' : 'Rp 36 Juta/thn',
          sub: '15% Manfaat Bersih untuk Energi 3T'
        }
      ],
      quickActions: [
        { id: 'open_esg_carbon', label: 'Kalkulator Pajak Karbon & Green BTS', targetTab: 'esg', variant: 'primary' },
        { id: 'open_pilot_did', label: 'Bukti Kausal DiD (Anti-Greenwashing)', targetTab: 'pilotvalidation', variant: 'secondary' },
        { id: 'open_bare_esg', label: 'Dokumen Rekonsiliasi BA-RE', modalKey: 'bare', variant: 'secondary' },
        { id: 'open_exec_memo', label: 'Unduh Dossier ESG & BoD', modalKey: 'memo', variant: 'outline' }
      ]
    },
    auditor: {
      roleId: 'auditor',
      teamCategory: 'TIM TATA KELOLA, RISIKO & AUDIT',
      title: 'Corporate Internal Auditor, Risk & CISO Governance',
      focusHeadline: 'Verifikasi Hash SHA-256, Kepatuhan Stage-Gate G0–G3 & Kedaulatan Data',
      missionSummary:
        'Memastikan setiap klaim penghematan memiliki bukti rekonsiliasi 3-arah yang tidak dapat dimanipulasi, patuh pada PP 71/2019 & UU PDP, serta memenuhi syarat pencairan modal G0–G3.',
      primaryKpis: [
        {
          label: 'Integritas Buku Besar Audit',
          value: 'SHA-256 Terverifikasi',
          sub: 'Zero Tampering · Siap Audit Big-4'
        },
        {
          label: 'Pengendalian Plafon Gerbang G0',
          value: 'Maks Rp 95 Juta',
          sub: 'Syarat Efisiensi Awal ≥ 7,5%'
        },
        {
          label: 'Kepatuhan Kedaulatan Data',
          value: '100% On-Prem Telkom DC',
          sub: 'Sentul Tier-III · PP 71/2019 & UU PDP'
        }
      ],
      quickActions: [
        { id: 'open_arch_audit', label: 'Arsitektur Keamanan & Kepatuhan IT', targetTab: 'architecture', variant: 'primary' },
        { id: 'open_esg_ledger', label: 'Verifikator Rantai Hash SHA-256', targetTab: 'esg', variant: 'secondary' },
        { id: 'open_sap_audit', label: 'Audit Voucher Jurnal SAP S/4HANA', modalKey: 'sap', variant: 'secondary' },
        { id: 'open_pilot_gate', label: 'Evaluasi Stage-Gate G0–G3', targetTab: 'pilotvalidation', variant: 'outline' }
      ]
    }
  };

  return configs[roleId] || configs.vp_network;
}

/**
 * Dynamic Business ROI, TowerCo Lease Share & CapEx/OpEx Simulator
 */
export function calculateDynamicBusinessRoi({
  siteCount = 40,
  baselineMwhPerSiteYear = 50,
  efficiencyPct = 12,
  tariffPerKwh = 1500,
  waccPct = 10,
  capexPerSiteIdr = 11_250_000,
  opexPerSiteYearIdr = 1_500_000,
  telkomselPassThroughSharePct = 85,
  contingencyReservePct = 10
} = {}) {
  const safeSites = Math.max(1, Number(siteCount) || 40);
  const safeEff = Math.max(1, Math.min(35, Number(efficiencyPct) || 12));
  const safeTariff = Math.max(1000, Number(tariffPerKwh) || 1500);
  const safeWacc = Math.max(1, Number(waccPct) || 10) / 100;
  const safeShare = Math.max(50, Math.min(100, Number(telkomselPassThroughSharePct) || 85)) / 100;
  const safeContingency = Math.max(0, Math.min(30, Number(contingencyReservePct) || 10)) / 100;

  const totalBaselineMwhYear = safeSites * baselineMwhPerSiteYear;
  const totalSavedMwhYear = Number((totalBaselineMwhYear * (safeEff / 100)).toFixed(1));
  const grossPlnSavingIdrYear = Math.round(totalSavedMwhYear * 1000 * safeTariff);

  // Split between Telkomsel and TowerCo partner (Mitratel / Protelindo)
  const telkomselGrossShareIdrYear = Math.round(grossPlnSavingIdrYear * safeShare);
  const towerCoIncentiveIdrYear = grossPlnSavingIdrYear - telkomselGrossShareIdrYear;

  const baseCapexIdr = Math.round(safeSites * capexPerSiteIdr);
  const contingencyCapexIdr = Math.round(baseCapexIdr * safeContingency);
  const totalCapexWithContingencyIdr = baseCapexIdr + contingencyCapexIdr;
  const annualOpexIdr = Math.round(safeSites * opexPerSiteYearIdr);

  const netAnnualCashflowTelkomselIdr = telkomselGrossShareIdrYear - annualOpexIdr;

  // 5-Year DCF Calculation
  let cumulativeDiscountedCashflow = 0;
  for (let year = 1; year <= 5; year += 1) {
    // Year 1 ramps at 75% during rollout, Years 2-5 at 100% with 2% tariff inflation hedge
    const rampFactor = year === 1 ? 0.85 : 1 + (year - 1) * 0.02;
    const cashflowYear = netAnnualCashflowTelkomselIdr * rampFactor;
    cumulativeDiscountedCashflow += cashflowYear / Math.pow(1 + safeWacc, year);
  }

  const npv5YearIdr = Math.round(cumulativeDiscountedCashflow - totalCapexWithContingencyIdr);
  const paybackYears = netAnnualCashflowTelkomselIdr > 0
    ? Number((totalCapexWithContingencyIdr / netAnnualCashflowTelkomselIdr).toFixed(2))
    : 99.9;
  const profitabilityIndex = totalCapexWithContingencyIdr > 0
    ? Number((cumulativeDiscountedCashflow / totalCapexWithContingencyIdr).toFixed(2))
    : 0;

  // Breakeven efficiency % needed to cover Annual OpEx + annualized CapEx recovery
  const annualizedRequiredGrossIdr = (annualOpexIdr + totalCapexWithContingencyIdr / 3.79) / safeShare;
  const maxPossibleGrossIdr = totalBaselineMwhYear * 1000 * safeTariff;
  const breakevenEfficiencyPct = maxPossibleGrossIdr > 0
    ? Number(((annualizedRequiredGrossIdr / maxPossibleGrossIdr) * 100).toFixed(2))
    : 6.85;

  return {
    siteCount: safeSites,
    totalBaselineMwhYear,
    totalSavedMwhYear,
    grossPlnSavingIdrYear,
    telkomselGrossShareIdrYear,
    towerCoIncentiveIdrYear,
    baseCapexIdr,
    contingencyCapexIdr,
    totalCapexWithContingencyIdr,
    annualOpexIdr,
    netAnnualCashflowTelkomselIdr,
    npv5YearIdr,
    paybackYears,
    profitabilityIndex,
    breakevenEfficiencyPct,
    isViableForStageGateG1: safeEff >= breakevenEfficiencyPct && npv5YearIdr > 0
  };
}

/**
 * Real-Time Financial & Operational Benchmark across Telkomsel Regions
 */
export function calculateRegionalFinancialBenchmark({
  efficiencyMultiplier = 1.0,
  telkomselSharePct = 85,
  carbonPricePerTonIdr = 75_000,
  resolvedSites = []
} = {}) {
  const shareRatio = Math.max(50, Math.min(100, Number(telkomselSharePct) || 85)) / 100;
  const resolvedCount = Array.isArray(resolvedSites) ? resolvedSites.length : 0;

  return TELKOMSEL_REGIONAL_BENCHMARKS.map((reg) => {
    const adjustedEffPct = Number((reg.avgEfficiencyPct * efficiencyMultiplier).toFixed(1));
    const savedMwhYear = Number(((reg.baselineMwhYear * adjustedEffPct) / 100).toFixed(1));
    const grossSavingIdr = Math.round(savedMwhYear * 1000 * reg.tariffPerKwh);
    const telkomselNetSavingIdr = Math.round(grossSavingIdr * shareRatio);
    const co2ReducedTons = Math.round(savedMwhYear * 0.87);
    const carbonValueIdr = Math.round(co2ReducedTons * carbonPricePerTonIdr);
    const remainingAnomalies = Math.max(0, reg.anomalyCount - (resolvedCount > 0 ? 1 : 0));

    return {
      ...reg,
      adjustedEffPct,
      savedMwhYear,
      grossSavingIdr,
      telkomselNetSavingIdr,
      co2ReducedTons,
      carbonValueIdr,
      remainingAnomalies,
      reconciliationStatus: remainingAnomalies === 0 ? 'TERVERIFIKASI BA-RE' : `${remainingAnomalies} SITE ANOMALI`
    };
  }).sort((a, b) => b.telkomselNetSavingIdr - a.telkomselNetSavingIdr);
}

/**
 * ESG Compliance, Carbon Tax Exposure & Green BTS Certification Calculator
 */
export function calculateEsgCarbonAndGreenBts({
  savedMwhYear = 200,
  emissionFactorKgPerKwh = 0.87,
  carbonTaxRatePerTonIdr = 75_000,
  idxCarbonMarketPricePerTonIdr = 95_000,
  netFinancialBenefitIdr = 240_000_000,
  resolvedSitesCount = 0
} = {}) {
  const safeMwh = Math.max(0, Number(savedMwhYear) || 0);
  const co2ReducedTons = Number((safeMwh * emissionFactorKgPerKwh).toFixed(1));
  const carbonTaxAvoidedIdr = Math.round(co2ReducedTons * carbonTaxRatePerTonIdr);
  const idxCarbonCreditValueIdr = Math.round(co2ReducedTons * idxCarbonMarketPricePerTonIdr);
  const totalCarbonEconomicValueIdr = carbonTaxAvoidedIdr + idxCarbonCreditValueIdr;
  const socialDividend3tIdr = Math.round(Math.max(0, netFinancialBenefitIdr) * 0.15);
  const solarMicrogridEquivalentKwp = Number((socialDividend3tIdr / 14_500_000).toFixed(1));

  // Green BTS Certification Readiness Score (ITU-T L.1331 + POJK 51/2017 + ISO 14064)
  const calibrationBonus = Math.min(6, resolvedSitesCount * 1.5);
  const readinessScorePct = Number(Math.min(99.5, 89.0 + calibrationBonus).toFixed(1));

  return {
    savedMwhYear: safeMwh,
    co2ReducedTons,
    carbonTaxAvoidedIdr,
    idxCarbonCreditValueIdr,
    totalCarbonEconomicValueIdr,
    socialDividend3tIdr,
    solarMicrogridEquivalentKwp,
    readinessScorePct,
    certificationTier: readinessScorePct >= 92 ? 'PLATINUM GREEN BTS (ITU-T L.1331)' : 'GOLD GREEN BTS READY'
  };
}

/**
 * Automated BYOD Telemetry Anomaly Scanner for PLN Meter Drift & Shelter Thermal Runaway
 */
export function scanByodTelemetryAnomalies(records = [], thresholds = {}) {
  const maxDriftPct = Number(thresholds.maxBillingDriftPct) || 5.0;
  const maxTempC = Number(thresholds.maxShelterTempC) || 31.0;

  const defaultRecords = [
    {
      siteId: 'BDG-DGO-P04',
      siteName: 'Dago Bandung Macro Hub',
      region: 'Jawa Barat',
      vendor: 'Ericsson',
      plnKwh: 142.8,
      dcSubmeterKwh: 117.5,
      shelterTempC: 34.2,
      prbLoadPct: 24
    },
    {
      siteId: 'JKT-SEL-P03',
      siteName: 'Kuningan Rasuna Macro',
      region: 'Jabodetabek',
      vendor: 'Huawei',
      plnKwh: 168.4,
      dcSubmeterKwh: 151.2,
      shelterTempC: 32.1,
      prbLoadPct: 48
    },
    {
      siteId: 'SBY-GUB-P02',
      siteName: 'Gubeng Surabaya Macro',
      region: 'Jawa Timur',
      vendor: 'ZTE',
      plnKwh: 124.0,
      dcSubmeterKwh: 122.9,
      shelterTempC: 26.8,
      prbLoadPct: 19
    },
    {
      siteId: 'BKS-MET-P06',
      siteName: 'Bekasi Barat Industrial',
      region: 'Jabodetabek',
      vendor: 'Ericsson',
      plnKwh: 155.0,
      dcSubmeterKwh: 139.8,
      shelterTempC: 31.8,
      prbLoadPct: 35
    }
  ];

  const sourceList = Array.isArray(records) && records.length > 0 ? records : defaultRecords;

  const scanned = sourceList.map((item, idx) => {
    const pln = Number(item.plnKwh ?? item.plnKw ?? item.pln ?? 130);
    const sub = Number(item.dcSubmeterKwh ?? item.submeterKw ?? item.dc ?? pln * 0.96);
    const temp = Number(item.shelterTempC ?? item.tempC ?? item.temp ?? 27.5);
    const prb = Number(item.prbLoadPct ?? item.prb ?? 30);

    const driftPct = sub > 0 ? Number((((pln - sub) / sub) * 100).toFixed(1)) : 0;
    const hasBillingAnomaly = Math.abs(driftPct) > maxDriftPct;
    const hasThermalAnomaly = temp > maxTempC;

    let rootCause = 'Operasi Normal · Meteran PLN & Sub-meter DC Klop';
    let recommendedFopAction = 'Pertahankan kebijakan O-RAN Adaptive Carrier Sleep';
    let estimatedMonthlyLeakageIdr = 0;

    if (hasBillingAnomaly && hasThermalAnomaly) {
      rootCause = `Deviasi Tagihan PLN +${driftPct}% & Suhu Shelter Tinggi (${temp}°C)`;
      recommendedFopAction = 'Terbitkan e-WO FOP: Bersihkan evaporator AC, kalibrasi CT-Clamp & klaim BA-RE PLN';
      estimatedMonthlyLeakageIdr = Math.round(Math.max(10, pln - sub) * 30 * 1500);
    } else if (hasBillingAnomaly) {
      rootCause = `Selisih Meter AMR PLN vs Sub-meter DC (+${driftPct}%)`;
      recommendedFopAction = 'Terbitkan e-WO FOP: Audit faktor kali CT meter PLN & rekonsiliasi BA-RE';
      estimatedMonthlyLeakageIdr = Math.round(Math.max(8, pln - sub) * 30 * 1500);
    } else if (hasThermalAnomaly) {
      rootCause = `Beban Pendingin Shelter Berlebih (${temp}°C > ${maxTempC}°C)`;
      recommendedFopAction = 'Kirim perintah O1 HVAC Inverter Boost & jadwalkan cek freon R-410A';
      estimatedMonthlyLeakageIdr = 1_250_000;
    }

    return {
      siteId: item.siteId || item.id || item.code || `SITE-PILOT-${String(idx + 1).padStart(2, '0')}`,
      siteName: item.siteName || item.name || 'Telkomsel Macro BTS',
      region: item.region || item.cluster || 'Jamali',
      vendor: item.vendor || 'Ericsson',
      plnKwh: pln,
      dcSubmeterKwh: sub,
      driftPct,
      shelterTempC: temp,
      prbLoadPct: prb,
      isAnomaly: hasBillingAnomaly || hasThermalAnomaly,
      severity: hasBillingAnomaly && hasThermalAnomaly ? 'CRITICAL' : hasBillingAnomaly || hasThermalAnomaly ? 'WARNING' : 'NOMINAL',
      rootCause,
      recommendedFopAction,
      estimatedMonthlyLeakageIdr
    };
  });

  const anomalySites = scanned.filter((s) => s.isAnomaly);
  const totalMonthlyLeakageIdr = anomalySites.reduce((acc, s) => acc + s.estimatedMonthlyLeakageIdr, 0);

  return {
    totalScanned: scanned.length,
    anomalyCount: anomalySites.length,
    nominalCount: scanned.length - anomalySites.length,
    totalMonthlyLeakageIdr,
    records: scanned
  };
}

/**
 * Deep 3GPP Rel-18 Per-Carrier Telemetry Inspector for Digital Twin
 */
export function deriveSite3gppCarrierProfile({
  siteId = 'BDG-DGO-P04',
  vendor = 'Ericsson',
  trafficLoadPct = 38,
  optimizationMode = 'autonomous',
  emergencyActive = false
} = {}) {
  const isSleepAllowed = !emergencyActive && optimizationMode !== 'manual';

  const carriers = [
    {
      band: 'L900 (Band 8 · 900 MHz)',
      role: 'Coverage & Emergency 112 Anchor',
      bandwidthMhz: 10,
      prbUtilizationPct: Math.min(98, Math.max(18, Math.round(trafficLoadPct * 1.15))),
      sleepState: 'ALWAYS ON (Coverage Anchor & 112 Guard)',
      paPowerWatts: 320,
      savingPct: 0,
      wakeUpLatencyMs: 0
    },
    {
      band: 'L1800 (Band 3 · 1800 MHz)',
      role: 'Primary Capacity Layer 4G',
      bandwidthMhz: 20,
      prbUtilizationPct: Math.min(95, Math.max(12, Math.round(trafficLoadPct * 0.95))),
      sleepState: !isSleepAllowed
        ? 'ACTIVE FULL POWER'
        : trafficLoadPct <= 35
          ? '3GPP Symbol & Micro-Sleep Aktif'
          : 'Adaptive MIM0 2T2R Scaling',
      paPowerWatts: !isSleepAllowed ? 460 : trafficLoadPct <= 35 ? 290 : 380,
      savingPct: !isSleepAllowed ? 0 : trafficLoadPct <= 35 ? 37.0 : 17.4,
      wakeUpLatencyMs: 18
    },
    {
      band: 'L2100 (Band 1 · 2100 MHz)',
      role: 'Secondary Capacity Layer 4G',
      bandwidthMhz: 15,
      prbUtilizationPct: Math.min(92, Math.max(8, Math.round(trafficLoadPct * 0.75))),
      sleepState: !isSleepAllowed
        ? 'ACTIVE FULL POWER'
        : trafficLoadPct <= 50
          ? 'Deep Carrier Sleep (RF TRX Muted)'
          : 'Symbol Muting Aktif',
      paPowerWatts: !isSleepAllowed ? 420 : trafficLoadPct <= 50 ? 110 : 330,
      savingPct: !isSleepAllowed ? 0 : trafficLoadPct <= 50 ? 73.8 : 21.4,
      wakeUpLatencyMs: 24
    },
    {
      band: 'N40 (5G NR · 2300 MHz Massive MIMO)',
      role: 'High-Speed 5G TDD Layer (64T64R)',
      bandwidthMhz: 50,
      prbUtilizationPct: Math.min(96, Math.max(5, Math.round(trafficLoadPct * 0.65))),
      sleepState: !isSleepAllowed
        ? '64T64R MAX THROUGHPUT (VIP/112)'
        : trafficLoadPct <= 30
          ? 'Deep Dormancy + Antenna Branch Muting (8T8R)'
          : trafficLoadPct <= 60
            ? 'Dynamic 32T32R Array Scaling'
            : 'Full 64T64R Active',
      paPowerWatts: !isSleepAllowed ? 680 : trafficLoadPct <= 30 ? 210 : trafficLoadPct <= 60 ? 410 : 640,
      savingPct: !isSleepAllowed ? 0 : trafficLoadPct <= 30 ? 69.1 : trafficLoadPct <= 60 ? 39.7 : 5.9,
      wakeUpLatencyMs: 28
    }
  ];

  const totalActiveWatts = carriers.reduce((sum, c) => sum + c.paPowerWatts, 0);
  const totalBaselineWatts = 320 + 460 + 420 + 680;
  const aggregateRfSavingPct = Number((((totalBaselineWatts - totalActiveWatts) / totalBaselineWatts) * 100).toFixed(1));

  return {
    siteId,
    vendor,
    emergencyActive,
    totalActiveWatts,
    totalBaselineWatts,
    aggregateRfSavingPct,
    carriers
  };
}
