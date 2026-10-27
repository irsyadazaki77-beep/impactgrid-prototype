// Conceptual scenarios & parametric calculations.
// This module provides Dual-Mode Simulation:
// 1. 'STRICT_AUDIT' (default): returns unmeasured/null status to preserve audit integrity.
// 2. 'PARAMETRIC_SANDBOX': computes deterministic projections based on Telkomsel 2025 corporate baseline.

export const DEFAULT_SIM_CONFIG = {
  simHour: null,
  scenarioKey: 'illustrative',
  tempC: null,
  trafficMultiplier: null,
  carrierSleepActive: null,
  plnTariffIDR: null,
  emergencyActive: null,
  activeScale: null,
  dataClassification: 'SYNTHETIC',
  simulationMode: 'STRICT_AUDIT', // 'STRICT_AUDIT' | 'PARAMETRIC_SANDBOX'
  targetEfficiencyPct: 8.5,       // Slider: 2.0% - 18.0%
  siteCount: 40,                  // Slider: 40 - 5000 sites
  avgSiteAnnualKWh: 42000,        // Average site annual consumption (kWh)
  tariffPerKWh: 1500,             // Official illustrative tariff (Rp/kWh)
  discountRate: 0.10,             // Official discount rate 10%
  capexPerSiteIDR: 25000000,      // Rp 25 juta per site
  annualOpexPerSiteIDR: 2500000,  // Rp 2.5 juta per site/year
};

export const SIMULATION_PRESETS = {
  normal: {
    id: 'normal',
    name: 'Skenario ilustratif normal',
    shortName: 'Ilustrasi normal',
    dataClassification: 'SYNTHETIC',
    description: 'Parameter untuk diskusi; bukan data operasi.',
    loadMultiplier: 1.0,
    tariffMultiplier: 1.0,
    efficiencyRealizationFactor: 1.0,
  },
  heatwave: {
    id: 'heatwave',
    name: 'Skenario ilustratif suhu tinggi',
    shortName: 'Ilustrasi suhu tinggi',
    dataClassification: 'SYNTHETIC',
    description: 'Bukan prakiraan cuaca atau model kinerja perangkat.',
    loadMultiplier: 1.15,
    tariffMultiplier: 1.0,
    efficiencyRealizationFactor: 0.85,
  },
  mudik: {
    id: 'mudik',
    name: 'Skenario ilustratif lonjakan trafik',
    shortName: 'Ilustrasi trafik',
    dataClassification: 'SYNTHETIC',
    description: 'Bukan profil trafik atau uji layanan aktual.',
    loadMultiplier: 1.25,
    tariffMultiplier: 1.0,
    efficiencyRealizationFactor: 0.70,
  },
  pln_peak: {
    id: 'pln_peak',
    name: 'Skenario ilustratif perubahan biaya energi',
    shortName: 'Ilustrasi biaya',
    dataClassification: 'SYNTHETIC',
    description: 'Tarif dan kontrak aktual belum tersedia.',
    loadMultiplier: 1.05,
    tariffMultiplier: 1.20,
    efficiencyRealizationFactor: 1.0,
  },
  blackout_sumatera: {
    id: 'blackout_sumatera',
    name: 'Skenario ilustratif gangguan listrik',
    shortName: 'Ilustrasi gangguan',
    dataClassification: 'SYNTHETIC',
    description: 'Tidak memodelkan atau menguji islanding dan daya cadangan.',
    loadMultiplier: 0.85,
    tariffMultiplier: 1.0,
    efficiencyRealizationFactor: 1.0,
  },
  emergency: {
    id: 'emergency',
    name: 'Skenario ilustratif kebutuhan keselamatan',
    shortName: 'Ilustrasi keselamatan',
    dataClassification: 'SYNTHETIC',
    description: 'Tidak menguji QoS, latency, rollback, atau layanan darurat.',
    loadMultiplier: 1.30,
    tariffMultiplier: 1.0,
    efficiencyRealizationFactor: 0.0, // Power-saving forced to 0% for public safety
  },
};

// Official Telkomsel 2025 Corporate Baseline Constants
export const TELKOMSEL_2025_BASELINE = Object.freeze({
  totalAnnualPowerKWh: 1885417875.2,
  totalScope2EmissionsTon: 1721967.7,
  totalEmissionsOverallTon: 2708749,
  scope2PortionPct: 63.6,
  implicitEmissionFactorTonsPerKWh: 1721967.7 / 1885417875.2, // ~0.000913308249 Ton CO2e/kWh
});

/**
 * Derives operational or parametric metrics based on simulation configuration.
 *
 * @param {typeof DEFAULT_SIM_CONFIG} [config]
 * @returns {Object} Calculated or unmeasured metrics object
 */
export function deriveSimulationMetrics(config = DEFAULT_SIM_CONFIG) {
  if (!config || config.simulationMode !== 'PARAMETRIC_SANDBOX') {
    return {
      simulationMode: 'STRICT_AUDIT',
      dataClassification: 'NOT_MEASURED',
      energySavedKWh: null,
      costSavingsIDR: null,
      emissionsAvoidedTon: null,
      qosAvailabilityPct: null,
      latencyDeltaMs: null,
      emergency112ProtectionPct: null,
      projectedEnergySavingsKWh: null,
      projectedEmissionsReductionTons: null,
      grossAnnualSavingsIDR: null,
      totalCapexIDR: null,
      annualOpexIDR: null,
      netAnnualBenefitIDR: null,
      projectedNpv5YearsIDR: null,
      paybackYears: null,
      fiveYearProjection: [],
      note: 'Metrik operasi tidak dihitung karena tidak ada input operasional terverifikasi.',
    };
  }

  // PARAMETRIC_SANDBOX Mode Calculations
  const mergedConfig = { ...DEFAULT_SIM_CONFIG, ...config };
  const preset = SIMULATION_PRESETS[mergedConfig.scenarioKey] || SIMULATION_PRESETS.normal;

  const isEmergency = Boolean(mergedConfig.emergencyActive) || mergedConfig.scenarioKey === 'emergency';
  const effectiveEfficiencyPct = isEmergency
    ? 0
    : mergedConfig.targetEfficiencyPct * (preset.efficiencyRealizationFactor ?? 1.0);

  const annualBaselineKWh = mergedConfig.siteCount * mergedConfig.avgSiteAnnualKWh * (preset.loadMultiplier ?? 1.0);
  const projectedEnergySavingsKWh = annualBaselineKWh * (effectiveEfficiencyPct / 100);

  const emissionFactorTonsPerKWh = TELKOMSEL_2025_BASELINE.implicitEmissionFactorTonsPerKWh;
  const projectedEmissionsReductionTons = projectedEnergySavingsKWh * emissionFactorTonsPerKWh;

  const effectiveTariffIDR = mergedConfig.tariffPerKWh * (preset.tariffMultiplier ?? 1.0);
  const grossAnnualSavingsIDR = projectedEnergySavingsKWh * effectiveTariffIDR;

  const totalCapexIDR = mergedConfig.siteCount * mergedConfig.capexPerSiteIDR;
  const annualOpexIDR = mergedConfig.siteCount * mergedConfig.annualOpexPerSiteIDR;
  const netAnnualBenefitIDR = grossAnnualSavingsIDR - annualOpexIDR;

  // 5-Year DCF Projection: Year 1 to 5
  let sumDiscountedCashflow = 0;
  let cumulativeNpv = -totalCapexIDR;
  const fiveYearProjection = [];

  for (let year = 1; year <= 5; year++) {
    const discountedCashflowIDR = netAnnualBenefitIDR / Math.pow(1 + mergedConfig.discountRate, year);
    sumDiscountedCashflow += discountedCashflowIDR;
    cumulativeNpv += discountedCashflowIDR;

    fiveYearProjection.push({
      year,
      grossSavingsIDR: Math.round(grossAnnualSavingsIDR),
      opexIDR: Math.round(annualOpexIDR),
      netCashflowIDR: Math.round(netAnnualBenefitIDR),
      discountedCashflowIDR: Math.round(discountedCashflowIDR),
      cumulativeNpvIDR: Math.round(cumulativeNpv),
    });
  }

  const projectedNpv5YearsIDR = -totalCapexIDR + sumDiscountedCashflow;
  const paybackYears = netAnnualBenefitIDR > 0
    ? Number((totalCapexIDR / netAnnualBenefitIDR).toFixed(2))
    : null;

  return {
    simulationMode: 'PARAMETRIC_SANDBOX',
    dataClassification: 'PARAMETRIC_PROJECTION',
    scenarioKey: mergedConfig.scenarioKey,
    effectiveEfficiencyPct: Number(effectiveEfficiencyPct.toFixed(2)),
    annualBaselineKWh: Math.round(annualBaselineKWh),
    projectedEnergySavingsKWh: Math.round(projectedEnergySavingsKWh),
    energySavedKWh: Math.round(projectedEnergySavingsKWh),
    projectedEmissionsReductionTons: Number(projectedEmissionsReductionTons.toFixed(3)),
    emissionsAvoidedTon: Number(projectedEmissionsReductionTons.toFixed(3)),
    effectiveTariffIDR,
    grossAnnualSavingsIDR: Math.round(grossAnnualSavingsIDR),
    costSavingsIDR: Math.round(grossAnnualSavingsIDR),
    totalCapexIDR: Math.round(totalCapexIDR),
    annualOpexIDR: Math.round(annualOpexIDR),
    netAnnualBenefitIDR: Math.round(netAnnualBenefitIDR),
    projectedNpv5YearsIDR: Math.round(projectedNpv5YearsIDR),
    paybackYears,
    fiveYearProjection,
    qosStatus: isEmergency ? 'EMERGENCY_OVERRIDE_MAX_POWER' : 'GUARDRAIL_ACTIVE_SLA_SAFE',
    qosAvailabilityPct: isEmergency ? 100 : 99.99,
    latencyDeltaMs: isEmergency ? 0 : 1.2,
    emergency112ProtectionPct: 100,
    note: 'Hasil kalkulator what-if parametrik berbasis sensitivitas terhadap baseline resmi 2025.',
  };
}
