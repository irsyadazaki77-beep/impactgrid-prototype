import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_BYOD_CSV_TEXT,
  DEFAULT_BYOD_REGIONAL_PRESET,
  parseAndReconcileByodCsv,
  simulateWbpLwbpBessArbitrage,
  simulateCrossVendorBorderGuard,
  evaluateInvestmentCommitteeScorecard
} from './telkomselNextGenOperationsEngine.js';
import { computeClosedLoopReconciliation } from './enterpriseCommandAndClosedLoopEngine.js';

test('parseAndReconcileByodCsv parses custom Telkomsel regional CSV and feeds into BA-RE & SAP S/4HANA', () => {
  const parsed = parseAndReconcileByodCsv(DEFAULT_BYOD_CSV_TEXT, []);
  assert.equal(parsed.length, 3);
  assert.equal(parsed[0].siteId, 'MDN-PLB-99');
  assert.equal(parsed[0].status, 'ANOMALI (DISPUTE)');
  assert.equal(parsed[0].phantomLossRp > 0, true);

  const closedLoopWithByod = computeClosedLoopReconciliation(['BDG-DGO-P04'], DEFAULT_BYOD_REGIONAL_PRESET);
  assert.equal(closedLoopWithByod.customByodCount, 3);
  assert.equal(closedLoopWithByod.reconciliationSites.length, 6);
  assert.equal(closedLoopWithByod.isBalanced, true);
  assert.equal(closedLoopWithByod.totalDebit, closedLoopWithByod.totalCredit);
  assert.equal(closedLoopWithByod.totalDebit > 2662824640, true);
});

test('simulateWbpLwbpBessArbitrage models 24-hour LWBP sleep charging and WBP 17:00-22:00 peak-shaving', () => {
  const sim = simulateWbpLwbpBessArbitrage({ bessCapacityKwh: 15, topologyMode: 'jamali_pln_wbp', siteCount: 40 });
  assert.equal(sim.hourlyProfile.length, 24);
  assert.equal(sim.wbpTariffRp, 2250);
  assert.equal(sim.dailySavedPerSiteRp > 0, true);
  assert.equal(sim.wbpPeakSavingsPerSiteRp > 0, true);

  const wbpHour19 = sim.hourlyProfile.find((h) => h.hour === 19);
  assert.equal(wbpHour19.bessAction, 'PEAK_SHAVING_DISCHARGE');
  assert.equal(wbpHour19.ranMode.includes('100% Active Carriers'), true);
});

test('simulateCrossVendorBorderGuard prevents coverage holes across Ericsson, Huawei, and ZTE boundaries', () => {
  const unguarded = simulateCrossVendorBorderGuard({ borderGuardEnabled: false });
  assert.equal(unguarded.coverageHoleDetected, true);
  assert.equal(unguarded.handoverSuccessRatePct < 96, true);

  const guarded = simulateCrossVendorBorderGuard({ borderGuardEnabled: true });
  assert.equal(guarded.coverageHoleDetected, false);
  assert.equal(guarded.handoverSuccessRatePct >= 99.9, true);
  assert.equal(guarded.neighborTxPowerBoostDb, 1.8);
});

test('evaluateInvestmentCommitteeScorecard computes weighted 5-pillar score and GO verdict', () => {
  const scorecard = evaluateInvestmentCommitteeScorecard({}, { isBdgResolved: true, customByodCount: 3 });
  assert.equal(scorecard.pillars.length, 5);
  assert.equal(scorecard.allChecksPassed, true);
  assert.equal(scorecard.weightedTotalScore >= 90, true);
  assert.equal(scorecard.decisionVerdict.startsWith('GO'), true);
});
