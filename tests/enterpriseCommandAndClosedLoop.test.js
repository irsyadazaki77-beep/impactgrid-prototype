import { describe, it, expect } from 'vitest';
import {
  buildCommandPaletteIndex,
  searchCommandPalette,
  computeClosedLoopReconciliation,
  calculateBoqSummary,
  computeSlaPenaltyShield,
  createPresenterSyncMessage,
  parsePresenterSyncMessage,
  SYNC_CHANNEL_NAME
} from '../src/utils/enterpriseCommandAndClosedLoopEngine.js';

describe('Enterprise Command Palette, Closed-Loop State, Procurement BoQ & Dual-Screen Sync', () => {
  it('builds a complete Command Palette index covering 50 BTS sites, 10 BoD Q&As, 10 modules, and actions', () => {
    const index = buildCommandPaletteIndex();
    const sites = index.filter((item) => item.category === 'sites');
    const bod = index.filter((item) => item.category === 'bod');
    const modules = index.filter((item) => item.category === 'modules');
    const actions = index.filter((item) => item.category === 'actions');

    expect(sites).toHaveLength(50);
    expect(bod).toHaveLength(10);
    expect(modules).toHaveLength(10);
    expect(actions.length).toBeGreaterThanOrEqual(8);
  });

  it('searches Command Palette accurately by BTS site ID, BoD keyword, and category filter', () => {
    const dagoResults = searchCommandPalette('BDG-DGO-P04');
    expect(dagoResults.length).toBeGreaterThan(0);
    expect(dagoResults.some((r) => r.siteId === 'BDG-DGO-P04' || r.id === 'act-resolve-fop-loop')).toBe(true);

    const pojkResults = searchCommandPalette('POJK 51');
    expect(pojkResults.length).toBeGreaterThan(0);
    expect(pojkResults[0].title).toMatch(/POJK|ESG/i);

    const sitesOnly = searchCommandPalette('JKT', { category: 'sites' });
    expect(sitesOnly.length).toBeGreaterThan(0);
    expect(sitesOnly.every((r) => r.category === 'sites')).toBe(true);
  });

  it('synchronizes End-to-End Closed-Loop state from FOP resolution to BA-RE and SAP S/4HANA ledger', () => {
    // Before FOP resolution
    const beforeLoop = computeClosedLoopReconciliation([]);
    expect(beforeLoop.isBdgResolved).toBe(false);
    expect(beforeLoop.clusterSummary.balancedSites).toBe(48);
    expect(beforeLoop.clusterSummary.anomalousSites).toBe(2);
    expect(beforeLoop.sapJournalItems).toHaveLength(3);
    expect(beforeLoop.totalDebit).toBe(2659000000);
    expect(beforeLoop.totalCredit).toBe(2659000000);
    expect(beforeLoop.isBalanced).toBe(true);

    // After FOP technician resolves BDG-DGO-P04
    const afterLoop = computeClosedLoopReconciliation(['BDG-DGO-P04']);
    expect(afterLoop.isBdgResolved).toBe(true);
    expect(afterLoop.clusterSummary.balancedSites).toBe(49);
    expect(afterLoop.clusterSummary.anomalousSites).toBe(1);
    expect(afterLoop.clusterSummary.settledCreditNoteRp).toBe(3824640);

    const bdgSite = afterLoop.reconciliationSites.find((s) => s.siteId === 'BDG-DGO-P04');
    expect(bdgSite.variancePct).toBe(0.7);
    expect(bdgSite.status).toBe('TERKALIBRASI FOP (VALID)');
    expect(bdgSite.recoveredCreditNoteRp).toBe(3824640);

    // SAP S/4HANA automatically adds debit & credit settlement line items while keeping Debit == Credit
    expect(afterLoop.sapJournalItems).toHaveLength(5);
    expect(afterLoop.totalDebit).toBe(2662824640);
    expect(afterLoop.totalCredit).toBe(2662824640);
    expect(afterLoop.isBalanced).toBe(true);

    const netBapiSum = afterLoop.sapBapiPayload.CURRENCYAMOUNT.reduce((sum, item) => sum + item.AMT_DOCCUR, 0);
    expect(netBapiSum).toBe(0);
    expect(afterLoop.sha256Digest).not.toBe(beforeLoop.sha256Digest);
  });

  it('calculates Procurement BoQ & RKS totals within Stage-Gate ceilings and verifies BUMN TKDN mandate', () => {
    const g0 = calculateBoqSummary('g0_audit', 0);
    expect(g0.baseTotalIDR).toBe(95000000);
    expect(g0.isWithinCeiling).toBe(true);
    expect(g0.meetsBumnTkdnMandate).toBe(true);
    expect(g0.weightedTkdnPct).toBeGreaterThanOrEqual(40);

    const p1 = calculateBoqSummary('phase1_pilot', 0);
    expect(p1.baseTotalIDR).toBe(450000000);
    expect(p1.isWithinCeiling).toBe(true);
    expect(p1.meetsBumnTkdnMandate).toBe(true);
    expect(p1.lineItems).toHaveLength(6);
  });

  it('evaluates SLA Penalty & QoS Insurance Shield accurately for nominal and breach conditions', () => {
    const nominal = computeSlaPenaltyShield({ callDropRatePct: 0.06, wakeUpLatencyMs: 22, shelterTempC: 27.4 });
    expect(nominal.breaches.anyBreach).toBe(false);
    expect(nominal.telkomselNetRiskExposureRp).toBe(0);
    expect(nominal.totalProtectedIndemnityRp).toBe(0);

    const breach = computeSlaPenaltyShield({ callDropRatePct: 0.25, wakeUpLatencyMs: 35, shelterTempC: 34.5, siteCount: 40 });
    expect(breach.breaches.anyBreach).toBe(true);
    expect(breach.towerCoThermalPenaltyRp).toBeGreaterThan(0);
    expect(breach.vendorQosCreditRp).toBeGreaterThan(0);
    expect(breach.telkomselNetRiskExposureRp).toBe(0);
  });

  it('creates and parses Dual-Screen Presenter BroadcastChannel messages safely', () => {
    const msg = createPresenterSyncMessage('STEP_CHANGE', { stepIndex: 3, tab: 'pilotvalidation' }, 'presenter-1');
    expect(msg.channel).toBe(SYNC_CHANNEL_NAME);
    expect(msg.type).toBe('STEP_CHANGE');

    // Ignore message from same senderId
    expect(parsePresenterSyncMessage(msg, 'presenter-1')).toBeNull();

    // Accept message from another tab/window
    const parsed = parsePresenterSyncMessage(msg, 'audience-projector-2');
    expect(parsed).not.toBeNull();
    expect(parsed.type).toBe('STEP_CHANGE');
    expect(parsed.payload.stepIndex).toBe(3);
  });
});
