import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getRoleWorkspaceConfig,
  calculateDynamicBusinessRoi,
  calculateRegionalFinancialBenchmark,
  calculateEsgCarbonAndGreenBts,
  scanByodTelemetryAnomalies,
  deriveSite3gppCarrierProfile
} from './roleBasedWorkspaceEngine.js';

test('getRoleWorkspaceConfig returns tailored Business and Operations configurations', () => {
  const bizConfig = getRoleWorkspaceConfig('vp_network', { resolvedSites: ['BDG-DGO-P04'], selectedScale: 'regional' });
  assert.equal(bizConfig.teamCategory, 'TIM BISNIS & EKSEKUTIF');
  assert.equal(bizConfig.quickActions.length, 4);
  assert.ok(bizConfig.primaryKpis[0].value.includes('11,70 Miliar'));

  const opsConfig = getRoleWorkspaceConfig('noc_leader', { resolvedSites: ['BDG-DGO-P04', 'JKT-SEL-P03'], emergencyActive: true });
  assert.equal(opsConfig.teamCategory, 'TIM OPERASIONAL SNOC & FOP');
  assert.equal(opsConfig.primaryKpis[0].value, 'OVERRIDE 112 AKTIF');
});

test('calculateDynamicBusinessRoi computes accurate DCF, TowerCo pass-through split, and breakeven', () => {
  const res = calculateDynamicBusinessRoi({
    siteCount: 40,
    baselineMwhPerSiteYear: 50,
    efficiencyPct: 12,
    tariffPerKwh: 1500,
    waccPct: 10,
    capexPerSiteIdr: 11_250_000,
    opexPerSiteYearIdr: 1_500_000,
    telkomselPassThroughSharePct: 85,
    contingencyReservePct: 10
  });

  assert.equal(res.totalSavedMwhYear, 240);
  assert.equal(res.grossPlnSavingIdrYear, 360_000_000);
  assert.equal(res.telkomselGrossShareIdrYear, 306_000_000);
  assert.equal(res.towerCoIncentiveIdrYear, 54_000_000);
  assert.ok(res.npv5YearIdr > 0);
  assert.equal(res.isViableForStageGateG1, true);
});

test('calculateRegionalFinancialBenchmark ranks all 8 Telkomsel regions by net savings', () => {
  const benchmarks = calculateRegionalFinancialBenchmark({
    efficiencyMultiplier: 1.0,
    telkomselSharePct: 85,
    resolvedSites: ['BDG-DGO-P04']
  });
  assert.equal(benchmarks.length, 8);
  assert.ok(benchmarks[0].telkomselNetSavingIdr >= benchmarks[1].telkomselNetSavingIdr);
  assert.equal(benchmarks[0].regionId, 'REG-02-JABODETABEK');
});

test('calculateEsgCarbonAndGreenBts computes Scope 2 CO2, Carbon Tax, 3T Dividend, and Green BTS tier', () => {
  const esg = calculateEsgCarbonAndGreenBts({
    savedMwhYear: 200,
    emissionFactorKgPerKwh: 0.87,
    carbonTaxRatePerTonIdr: 75_000,
    idxCarbonMarketPricePerTonIdr: 95_000,
    netFinancialBenefitIdr: 240_000_000,
    resolvedSitesCount: 3
  });
  assert.equal(esg.co2ReducedTons, 174);
  assert.equal(esg.socialDividend3tIdr, 36_000_000);
  assert.ok(esg.readinessScorePct >= 92);
  assert.equal(esg.certificationTier, 'PLATINUM GREEN BTS (ITU-T L.1331)');
});

test('scanByodTelemetryAnomalies flags PLN billing drift and shelter thermal runaway', () => {
  const scanResult = scanByodTelemetryAnomalies([], { maxBillingDriftPct: 5.0, maxShelterTempC: 31.0 });
  assert.equal(scanResult.totalScanned, 4);
  assert.equal(scanResult.anomalyCount, 3);
  assert.ok(scanResult.totalMonthlyLeakageIdr > 0);
  const bdg = scanResult.records.find((r) => r.siteId === 'BDG-DGO-P04');
  assert.equal(bdg.severity, 'CRITICAL');
});

test('deriveSite3gppCarrierProfile enforces 0% sleep during Emergency 112 override', () => {
  const normalProfile = deriveSite3gppCarrierProfile({ trafficLoadPct: 25, optimizationMode: 'autonomous', emergencyActive: false });
  assert.ok(normalProfile.aggregateRfSavingPct > 30);

  const emergencyProfile = deriveSite3gppCarrierProfile({ trafficLoadPct: 25, optimizationMode: 'autonomous', emergencyActive: true });
  assert.equal(emergencyProfile.aggregateRfSavingPct, 0);
  assert.equal(emergencyProfile.totalActiveWatts, emergencyProfile.totalBaselineWatts);
});
