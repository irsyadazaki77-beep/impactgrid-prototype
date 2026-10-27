import { describe, it, expect } from 'vitest';
import { runMonteCarloSimulation } from '../src/utils/monteCarloEngine.js';
import { verifyAuditPayload, computeSha256 } from '../src/utils/auditHashEngine.js';
import { deriveSimulationMetrics, DEFAULT_SIM_CONFIG } from '../src/utils/simulationEngine.js';
import { calculateDiDMetrics, evaluateExecutiveDecisionGates } from '../src/utils/evidenceEngine.js';
import { PILOT_SITES_SAMPLE } from '../src/data/mockData.js';

describe('ImpactGrid demo reliability boundaries', () => {
  it('does not calculate stochastic forecasts without verified inputs', () => {
    const result = runMonteCarloSimulation({ iterations: 1000, seed: 12345 });
    expect(result.status).toBe('NOT_CALCULATED');
    expect(result.p5).toBeNull();
    expect(result.p50).toBeNull();
    expect(result.p95).toBeNull();
    expect(result.histogram).toEqual([]);
  });

  it('returns unavailable operational metrics rather than implying a measured outcome', () => {
    expect(DEFAULT_SIM_CONFIG.dataClassification).toBe('SYNTHETIC');
    const metrics = deriveSimulationMetrics({ scenarioKey: 'normal', simHour: 2 });
    expect(metrics.dataClassification).toBe('NOT_MEASURED');
    expect(metrics.energySavedKWh).toBeNull();
    expect(metrics.qosAvailabilityPct).toBeNull();
    expect(metrics.latencyDeltaMs).toBeNull();
  });

  it('keeps DiD and decision gates pending until site evidence exists', () => {
    const did = calculateDiDMetrics();
    expect(did.meta.dataClassification).toBe('DATA_NOT_AVAILABLE');
    expect(did.meta.interventionCount).toBeNull();
    expect(did.didResults.isolatedEnergySavedKWh).toBeNull();

    const decision = evaluateExecutiveDecisionGates(did);
    expect(decision.gates).toHaveLength(4);
    expect(decision.gates.every((gate) => gate.status === 'PENDING')).toBe(true);
    expect(decision.overall.recommendation).toBe('PENDING');
  });

  it('does not derive intervention results from a planned scope', () => {
    expect(PILOT_SITES_SAMPLE).toEqual([]);
  });

  it('hashes canonical objects deterministically and detects changed payloads', async () => {
    const payload = { batchId: 'demo-01', savedKwh: null, sites: [] };
    const sameContentDifferentKeyOrder = { sites: [], savedKwh: null, batchId: 'demo-01' };
    const hash = await computeSha256(payload);
    expect(await computeSha256(sameContentDifferentKeyOrder)).toBe(hash);

    const valid = await verifyAuditPayload({ payload, expectedHash: hash });
    expect(valid.verified).toBe(true);
    expect(valid.status).toBe('VERIFIED');

    const invalid = await verifyAuditPayload({ payload: { ...payload, batchId: 'changed' }, expectedHash: hash });
    expect(invalid.verified).toBe(false);
    expect(invalid.status).toBe('FAILED');
  });

  describe('PARAMETRIC_SANDBOX What-If & Monte Carlo Engine', () => {
    it('computes deterministic parametric metrics in PARAMETRIC_SANDBOX mode', () => {
      const config = {
        simulationMode: 'PARAMETRIC_SANDBOX',
        targetEfficiencyPct: 8.5,
        siteCount: 40,
        avgSiteAnnualKWh: 42000,
        tariffPerKWh: 1500,
        discountRate: 0.10,
        capexPerSiteIDR: 25000000,
        annualOpexPerSiteIDR: 2500000,
        scenarioKey: 'normal',
      };
      const metrics = deriveSimulationMetrics(config);

      expect(metrics.simulationMode).toBe('PARAMETRIC_SANDBOX');
      expect(metrics.dataClassification).toBe('PARAMETRIC_PROJECTION');
      expect(metrics.annualBaselineKWh).toBe(1680000); // 40 * 42000
      expect(metrics.projectedEnergySavingsKWh).toBe(142800); // 1680000 * 8.5%
      expect(metrics.energySavedKWh).toBe(142800);
      expect(metrics.projectedEmissionsReductionTons).toBeCloseTo(130.420, 2); // 142800 * 0.000913308
      expect(metrics.grossAnnualSavingsIDR).toBe(214200000); // 142800 * 1500
      expect(metrics.totalCapexIDR).toBe(1000000000); // 40 * 25 jt
      expect(metrics.annualOpexIDR).toBe(100000000); // 40 * 2.5 jt
      expect(metrics.netAnnualBenefitIDR).toBe(114200000); // 214.2 jt - 100 jt
      expect(metrics.projectedNpv5YearsIDR).toBe(-567092151); // -1M + sum_{t=1..5}(114.2M / 1.1^t)
      expect(metrics.paybackYears).toBe(8.76); // 1000M / 114.2M
      expect(metrics.fiveYearProjection).toHaveLength(5);
      expect(metrics.qosStatus).toBe('GUARDRAIL_ACTIVE_SLA_SAFE');
    });

    it('forces energy savings to 0% and protects QoS under emergency conditions', () => {
      const normalResult = deriveSimulationMetrics({
        simulationMode: 'PARAMETRIC_SANDBOX',
        targetEfficiencyPct: 8.5,
        emergencyActive: false,
        scenarioKey: 'normal',
      });
      expect(normalResult.projectedEnergySavingsKWh).toBeGreaterThan(0);

      const emergencyScenario = deriveSimulationMetrics({
        simulationMode: 'PARAMETRIC_SANDBOX',
        targetEfficiencyPct: 8.5,
        emergencyActive: false,
        scenarioKey: 'emergency',
      });
      expect(emergencyScenario.projectedEnergySavingsKWh).toBe(0);
      expect(emergencyScenario.effectiveEfficiencyPct).toBe(0);
      expect(emergencyScenario.qosStatus).toBe('EMERGENCY_OVERRIDE_MAX_POWER');

      const emergencyActiveFlag = deriveSimulationMetrics({
        simulationMode: 'PARAMETRIC_SANDBOX',
        targetEfficiencyPct: 8.5,
        emergencyActive: true,
        scenarioKey: 'normal',
      });
      expect(emergencyActiveFlag.projectedEnergySavingsKWh).toBe(0);
      expect(emergencyActiveFlag.effectiveEfficiencyPct).toBe(0);
      expect(emergencyActiveFlag.qosStatus).toBe('EMERGENCY_OVERRIDE_MAX_POWER');
    });

    it('executes deterministic Monte Carlo simulation with Mulberry32 PRNG', () => {
      const params = {
        simulationMode: 'PARAMETRIC_SANDBOX',
        iterations: 1000,
        seed: 20260324,
        siteCount: 40,
        avgSiteAnnualKWh: 42000,
        targetEfficiencyPct: 8.5,
        tariffPerKWh: 1500,
        discountRate: 0.10,
        capexPerSiteIDR: 25000000,
        annualOpexPerSiteIDR: 2500000,
      };

      const run1 = runMonteCarloSimulation(params);
      const run2 = runMonteCarloSimulation(params);

      expect(run1.status).toBe('SIMULATED_PARAMETRIC');
      expect(run1.dataClassification).toBe('PARAMETRIC_PROJECTION');
      expect(run1.iterations).toBe(1000);

      // Deterministic reproducibility: run1 and run2 must match exactly
      expect(run1.p5).toBe(run2.p5);
      expect(run1.p50).toBe(run2.p50);
      expect(run1.p95).toBe(run2.p95);
      expect(run1.mean).toBe(run2.mean);
      expect(run1.probabilityPositive).toBe(run2.probabilityPositive);

      // Percentile monotonicity: p5 <= p50 <= p95
      expect(run1.p5).toBeLessThanOrEqual(run1.p50);
      expect(run1.p50).toBeLessThanOrEqual(run1.p95);

      // Histogram bin count
      expect(run1.histogram).toHaveLength(20);
      const totalCount = run1.histogram.reduce((sum, b) => sum + b.count, 0);
      expect(totalCount).toBe(1000);
    });
  });
});
