import { describe, it, expect } from 'vitest';
import {
  DEFAULT_BYOD_CSV_TEXT,
  DEFAULT_BYOD_REGIONAL_PRESET,
  parseAndReconcileByodCsv,
  simulateWbpLwbpBessArbitrage,
  simulateCrossVendorBorderGuard,
  evaluateInvestmentCommitteeScorecard
} from '../src/utils/telkomselNextGenOperationsEngine.js';
import { computeClosedLoopReconciliation } from '../src/utils/enterpriseCommandAndClosedLoopEngine.js';

describe('Telkomsel Next-Gen Operations: BYOD Dynamic BA-RE/SAP, WBP/LWBP BESS Arbitrage, Cross-Vendor Border Guard & Jury Scorecard', () => {
  it('parses custom Telkomsel BYOD CSV rows and dynamically updates BA-RE and SAP S/4HANA journals in balance', () => {
    const rows = parseAndReconcileByodCsv(DEFAULT_BYOD_CSV_TEXT, []);
    expect(rows).toHaveLength(3);
    expect(rows[0].siteId).toBe('MDN-PLB-99');
    expect(rows[0].status).toBe('ANOMALI (DISPUTE)');
    expect(rows[0].phantomLossRp).toBeGreaterThan(0);
    expect(rows[1].siteId).toBe('MKS-PNK-88');
    expect(rows[1].status).toBe('SEIMBANG (VALID)');

    const closedLoop = computeClosedLoopReconciliation(['BDG-DGO-P04'], DEFAULT_BYOD_REGIONAL_PRESET);
    expect(closedLoop.customByodCount).toBe(3);
    expect(closedLoop.reconciliationSites).toHaveLength(6);
    expect(closedLoop.isBalanced).toBe(true);
    expect(closedLoop.totalDebit).toBe(closedLoop.totalCredit);
    expect(closedLoop.totalDebit).toBeGreaterThan(2662824640);
  });

  it('simulates 24-hour PLN WBP/LWBP & BESS LiFePO4 peak-shaving and 3T diesel hybrid arbitrage', () => {
    const jamali = simulateWbpLwbpBessArbitrage({ bessCapacityKwh: 15, topologyMode: 'jamali_pln_wbp', siteCount: 40 });
    expect(jamali.hourlyProfile).toHaveLength(24);
    expect(jamali.wbpTariffRp).toBe(2250);
    expect(jamali.dailySavedPerSiteRp).toBeGreaterThan(0);
    expect(jamali.wbpPeakSavingsPerSiteRp).toBeGreaterThan(0);

    const rural = simulateWbpLwbpBessArbitrage({ bessCapacityKwh: 30, topologyMode: 'rural_3t_diesel_hybrid', siteCount: 15 });
    expect(rural.annualClusterSavingsRp).toBeGreaterThan(0);
    expect(rural.costReductionPct).toBeGreaterThan(15);
  });

  it('simulates Cross-Vendor Border Handover Guard between Ericsson, Huawei, and ZTE clusters', () => {
    const siloed = simulateCrossVendorBorderGuard({ borderGuardEnabled: false });
    expect(siloed.coverageHoleDetected).toBe(true);
    expect(siloed.borderRsrpDbm).toBeLessThan(-105);

    const guarded = simulateCrossVendorBorderGuard({ borderGuardEnabled: true });
    expect(guarded.coverageHoleDetected).toBe(false);
    expect(guarded.handoverSuccessRatePct).toBeGreaterThanOrEqual(99.9);
    expect(guarded.neighborRetTiltDeg).toBe(-4.5);
  });

  it('evaluates the 5-pillar Investment Committee & Jury Due-Diligence Scorecard', () => {
    const result = evaluateInvestmentCommitteeScorecard(
      { business_financial: 98, technical_oran_safety: 97 },
      { isBdgResolved: true, customByodCount: 3 }
    );
    expect(result.pillars).toHaveLength(5);
    expect(result.allChecksPassed).toBe(true);
    expect(result.weightedTotalScore).toBeGreaterThan(90);
    expect(result.decisionVerdict).toMatch(/^GO/);
  });
});
