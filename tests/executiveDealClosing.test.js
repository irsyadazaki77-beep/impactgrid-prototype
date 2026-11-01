import { describe, it, expect } from 'vitest';
import {
  RUBRIC_EVIDENCE_NAVIGATOR_ITEMS,
  calculatePlnBillingDisputeDossier,
  calculateCarbonAnd3TSocialDividend,
  generateMasterHandoverPackDossier
} from '../src/utils/executiveDealClosingEngine.js';

describe('Executive Deal-Closing & Perfect Alignment Engine', () => {
  it('maps all 5 rubric evaluation pillars totaling 100% weight', () => {
    expect(RUBRIC_EVIDENCE_NAVIGATOR_ITEMS).toHaveLength(5);
    const sum = RUBRIC_EVIDENCE_NAVIGATOR_ITEMS.reduce((a, b) => a + b.weightPct, 0);
    expect(sum).toBe(100);
  });

  it('calculates PLN Billing Dispute & Restitution Dossier proving Phase 0 self-funding', () => {
    const res = calculatePlnBillingDisputeDossier({ resolvedSites: ['BDG-DGO-P04'] });
    expect(res.phase0BudgetIdr).toBe(95000000);
    expect(res.totalAnnualRecoveryIdr).toBeGreaterThan(100000000);
    expect(res.isSelfFundingUnderQuarter).toBe(true);
  });

  it('computes IDXCarbon SPE-GRK valuation and 3T school blueprint', () => {
    const res = calculateCarbonAnd3TSocialDividend({ scale: 'pilot', carbonPricePerTonIdr: 95000 });
    expect(res.annualCo2ReducedTons).toBe(662);
    expect(res.schools).toHaveLength(4);
    expect(res.totalStudentsImpacted).toBeGreaterThan(1000);
  });

  it('generates the 5-document Master Executive Handover Pack', () => {
    const pack = generateMasterHandoverPackDossier({ resolvedSites: ['BDG-DGO-P04'], weightedScore: 97.2 });
    expect(pack.documents).toHaveLength(5);
    expect(pack.closedLoop.isBalanced).toBe(true);
  });
});
