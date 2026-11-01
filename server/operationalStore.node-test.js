import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';

import {
  DIVISION_ACCOUNTS,
  loadOperationalState,
  resetOperationalState,
  computeOperationalSummary,
  upsertOperationalSite,
  deleteOperationalSite,
  updateOperationalSlaThresholds,
  dispatchOranPolicyAction,
  resolveSiteAnomalyFop,
  signOfficialBareDocument,
  postSapAccountingVoucher
} from './operationalStore.js';

test('operationalStore: initializes 50 BTS sites and computes 3-Way Reconciliation & DiD metrics', () => {
  const state = resetOperationalState('jamali50');
  const summary = computeOperationalSummary(state);

  assert.equal(summary.siteCount, 50);
  assert.equal(summary.interventionCount, 40);
  assert.equal(summary.controlCount, 10);
  assert.ok(summary.totalPlnKwh > 150);
  assert.ok(summary.totalPotentialSavingsKwh > 0);
  assert.ok(summary.didNetEffectPct > 0);
  assert.equal(DIVISION_ACCOUNTS.length, 7);
});

test('operationalStore: supports BTS site CRUD (Add, Edit, Delete) and updates summary metrics', () => {
  resetOperationalState('jamali50');

  // Add new BTS site
  const afterAdd = upsertOperationalSite({
    site_id: 'DPS-KUT-P99',
    site_name: 'Kuta Beach Macro 5G',
    cluster: 'Denpasar',
    province: 'Bali',
    vendor: 'Ericsson',
    tower_provider: 'Mitratel',
    group_type: 'intervention',
    pln_ac_kwh: 4.5,
    dc_rectifier_kwh: 4.05,
    radio_rf_kwh: 3.15,
    prb_utilization_pct: 24,
    shelter_temp_c: 27.1
  });

  assert.equal(afterAdd.summary.siteCount, 51);
  assert.equal(afterAdd.site.site_id, 'DPS-KUT-P99');

  // Edit existing BTS site
  const afterEdit = upsertOperationalSite({
    site_id: 'DPS-KUT-P99',
    site_name: 'Kuta Beach Macro 5G Updated',
    pln_ac_kwh: 4.8,
    shelter_temp_c: 26.4
  });
  assert.equal(afterEdit.site.site_name, 'Kuta Beach Macro 5G Updated');
  assert.equal(afterEdit.site.pln_ac_kwh, 4.8);

  // Delete BTS site
  const afterDelete = deleteOperationalSite('DPS-KUT-P99');
  assert.equal(afterDelete.summary.siteCount, 50);
  assert.equal(afterDelete.deletedSiteId, 'DPS-KUT-P99');
});

test('operationalStore: updates SLA thresholds and dispatches O-RAN A1/O1 policies with emergency rollback', () => {
  resetOperationalState('jamali50');

  const updatedSla = updateOperationalSlaThresholds({
    maxCdrPct: 0.12,
    maxPrbSleepPct: 65,
    plnTariffIdr: 1700
  });
  assert.equal(updatedSla.slaThresholds.maxCdrPct, 0.12);
  assert.equal(updatedSla.slaThresholds.maxPrbSleepPct, 65);
  assert.equal(updatedSla.slaThresholds.plnTariffIdr, 1700);

  // Emergency 112 Rollback wakes all sleeping carriers immediately
  const rollbackResult = dispatchOranPolicyAction({
    policyType: 'EMERGENCY_112_OVERRIDE',
    sleepMode: 'EMERGENCY_112_FULL_POWER',
    actor: 'NOC Commander'
  });
  assert.equal(rollbackResult.policy.sleepMode, 'EMERGENCY_112_FULL_POWER');
  assert.equal(rollbackResult.policy.affectedSites, 40);
});

test('operationalStore: executes end-to-end FOP -> BA-RE -> SAP S/4HANA closed-loop persistence', () => {
  resetOperationalState('jamali50');

  const beforeSummary = computeOperationalSummary(loadOperationalState());
  const bdgBefore = beforeSummary.rowDetails.find((s) => s.site_id === 'BDG-DGO-P04');
  assert.equal(bdgBefore.isPhantom, true);

  // 1. Resolve via FOP
  const afterFop = resolveSiteAnomalyFop({
    siteId: 'BDG-DGO-P04',
    technician: 'Ir. Andi Pratama (FOP ID: 8921-MT)'
  });

  assert.ok(afterFop.resolvedSites.includes('BDG-DGO-P04'));
  const bdgAfter = afterFop.summary.rowDetails.find((s) => s.site_id === 'BDG-DGO-P04');
  assert.equal(bdgAfter.isPhantom, false);
  assert.equal(bdgAfter.calibrated_fop, true);

  // 2. Sign Official BA-RE
  const afterBare = signOfficialBareDocument({ creditNoteIdr: 3824640 });
  assert.equal(afterBare.bareDocument.status, 'FOP_SETTLED_SIGNED');
  assert.equal(afterBare.bareDocument.sha256Digest.length, 64);

  // 3. Post SAP S/4HANA Accounting Voucher
  const afterSap = postSapAccountingVoucher({ restitutionCreditIdr: 3824640 });
  assert.equal(afterSap.sapVoucher.status, 'POSTED_WITH_RESTITUTION');
  assert.equal(afterSap.sapVoucher.totalDebitIdr, afterSap.sapVoucher.totalCreditIdr);
  assert.equal(afterSap.sapVoucher.totalDebitIdr, 2662824640);
});
