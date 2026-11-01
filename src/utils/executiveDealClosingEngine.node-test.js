import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RUBRIC_EVIDENCE_NAVIGATOR_ITEMS,
  calculatePlnBillingDisputeDossier,
  calculateCarbonAnd3TSocialDividend,
  generateMasterHandoverPackDossier
} from './executiveDealClosingEngine.js';

test('RUBRIC_EVIDENCE_NAVIGATOR_ITEMS covers 5 official pillars totaling 100% weight', () => {
  assert.equal(RUBRIC_EVIDENCE_NAVIGATOR_ITEMS.length, 5);
  const totalWeight = RUBRIC_EVIDENCE_NAVIGATOR_ITEMS.reduce((acc, item) => acc + item.weightPct, 0);
  assert.equal(totalWeight, 100);
});

test('calculatePlnBillingDisputeDossier proves Phase 0 Rp 95 Juta self-funding payback', () => {
  const dossier = calculatePlnBillingDisputeDossier({
    resolvedSites: ['BDG-DGO-P04'],
    customByodSites: []
  });

  assert.equal(dossier.phase0BudgetIdr, 95000000);
  assert.ok(dossier.sites.length >= 4);
  assert.ok(dossier.totalMonthlyRecoveryIdr > 9000000);
  assert.ok(dossier.phase0SelfFundingMonths < 10);
  assert.equal(dossier.isSelfFundingUnderQuarter, true);
  const bdg = dossier.sites.find((s) => s.siteId === 'BDG-DGO-P04');
  assert.equal(bdg.status, 'RESTITUTION_APPROVED_AND_CALIBRATED');
});

test('calculateCarbonAnd3TSocialDividend computes IDXCarbon SPE-GRK and 3T school allocations', () => {
  const pilot = calculateCarbonAnd3TSocialDividend({
    scale: 'pilot',
    carbonPricePerTonIdr: 100000,
    socialDividendSharePct: 15
  });

  assert.equal(pilot.annualCo2ReducedTons, 662);
  assert.equal(pilot.idxCarbonGrossValueIdr, 66200000);
  assert.equal(pilot.socialDividendPoolIdr, 91800000);
  assert.equal(pilot.schools.length, 4);
  assert.ok(pilot.totalStudentsImpacted > 1000);
});

test('generateMasterHandoverPackDossier cross-references all 5 executive documents', () => {
  const pack = generateMasterHandoverPackDossier({
    resolvedSites: ['BDG-DGO-P04'],
    customByodSites: [],
    weightedScore: 96.8
  });

  assert.equal(pack.documents.length, 5);
  assert.ok(pack.masterSealHash.includes('SETTLED'));
  assert.equal(pack.documents[3].status, 'SAP_BAPI_BALANCED_ZERO_VARIANCE');
});
