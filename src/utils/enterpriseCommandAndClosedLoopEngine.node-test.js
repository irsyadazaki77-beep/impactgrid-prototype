import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCommandPaletteIndex,
  searchCommandPalette,
  computeClosedLoopReconciliation,
  calculateBoqSummary,
  computeSlaPenaltyShield,
  createPresenterSyncMessage,
  parsePresenterSyncMessage
} from './enterpriseCommandAndClosedLoopEngine.js';

test('Command Palette index contains all 50 BTS sites and 10 BoD questions', () => {
  const index = buildCommandPaletteIndex();
  assert.equal(index.filter((i) => i.category === 'sites').length, 50);
  assert.equal(index.filter((i) => i.category === 'bod').length, 10);
});

test('searchCommandPalette finds BDG-DGO-P04 and filters by category', () => {
  const res = searchCommandPalette('BDG-DGO-P04');
  assert.equal(res.length > 0, true);
  const siteMatch = searchCommandPalette('BDG-DGO-P04', { category: 'sites' });
  assert.equal(siteMatch[0].siteId, 'BDG-DGO-P04');
});

test('computeClosedLoopReconciliation updates BA-RE and SAP S/4HANA in balance', () => {
  const unresolved = computeClosedLoopReconciliation([]);
  assert.equal(unresolved.isBdgResolved, false);
  assert.equal(unresolved.totalDebit, 2659000000);
  assert.equal(unresolved.totalCredit, 2659000000);

  const resolved = computeClosedLoopReconciliation(['BDG-DGO-P04']);
  assert.equal(resolved.isBdgResolved, true);
  assert.equal(resolved.totalDebit, 2662824640);
  assert.equal(resolved.totalCredit, 2662824640);
  assert.equal(resolved.isBalanced, true);
});

test('calculateBoqSummary and computeSlaPenaltyShield validate ceilings and SLA shield', () => {
  const g0 = calculateBoqSummary('g0_audit', 0);
  assert.equal(g0.baseTotalIDR, 95000000);
  assert.equal(g0.isWithinCeiling, true);

  const p1 = calculateBoqSummary('phase1_pilot', 0);
  assert.equal(p1.baseTotalIDR, 450000000);
  assert.equal(p1.meetsBumnTkdnMandate, true);

  const shield = computeSlaPenaltyShield({ callDropRatePct: 0.28, wakeUpLatencyMs: 32, shelterTempC: 35.0 });
  assert.equal(shield.breaches.anyBreach, true);
  assert.equal(shield.telkomselNetRiskExposureRp, 0);
});

test('Presenter Sync message serialization and loop prevention', () => {
  const packet = createPresenterSyncMessage('STEP_CHANGE', { stepIndex: 2 }, 'tab-a');
  assert.equal(parsePresenterSyncMessage(packet, 'tab-a'), null);
  const received = parsePresenterSyncMessage(packet, 'tab-b');
  assert.equal(received.payload.stepIndex, 2);
});
