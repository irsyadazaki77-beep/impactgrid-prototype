import { describe, it, expect } from 'vitest';
import { runMonteCarloSimulation } from '../src/utils/monteCarloEngine';
import { verifyAuditPayload, computeSha256 } from '../src/utils/auditHashEngine';
import { deriveSimulationMetrics, DEFAULT_SIM_CONFIG } from '../src/utils/simulationEngine';
import { calculateDiDMetrics, evaluateExecutiveDecisionGates } from '../src/utils/evidenceEngine';
import { PILOT_SITES_SAMPLE } from '../src/data/mockData';

describe('ImpactGrid Trust & Reliability Engine Test Suite', () => {
  describe('Monte Carlo Stochastic Modeling', () => {
    it('executes 1,000 stochastic iterations with reproducible seed', () => {
      const res1 = runMonteCarloSimulation({ iterations: 1000, seed: 12345 });
      const res2 = runMonteCarloSimulation({ iterations: 1000, seed: 12345 });

      expect(res1.iterations).toBe(1000);
      expect(res1.p5).toBe(res2.p5);
      expect(res1.p50).toBe(res2.p50);
      expect(res1.p95).toBe(res2.p95);
      expect(res1.mean).toBe(res2.mean);

      // P5 < P50 < P95 monotonicity
      expect(res1.p5).toBeLessThanOrEqual(res1.p50);
      expect(res1.p50).toBeLessThanOrEqual(res1.p95);

      // Financial viability check: Positive NPV probability > 95%
      expect(res1.probabilityPositive).toBeGreaterThan(95);
    });

    it('generates 7 distribution histogram bins totaling 1,000 iterations', () => {
      const res = runMonteCarloSimulation({ iterations: 1000, seed: 99 });
      const totalCount = res.histogram.reduce((acc, bin) => acc + bin.count, 0);
      expect(totalCount).toBe(1000);
      expect(res.histogram.length).toBe(7);
    });
  });

  describe('Deterministic SHA-256 Audit Hash Verification', () => {
    it('returns VERIFIED when payload and expectedHash match exactly', async () => {
      const payload = {
        batchId: 'BATCH-2026-10-22-01',
        standard: 'ITU-T L.1331',
        savedKwh: 201500,
        sites: 40
      };
      const hash = await computeSha256(payload);

      const verification = await verifyAuditPayload({
        payload,
        expectedHash: hash
      });

      expect(verification.verified).toBe(true);
      expect(verification.status).toBe('VERIFIED');
      expect(verification.computedHash).toBe(hash);
    });

    it('returns FAILED when payload has been tampered or altered', async () => {
      const originalPayload = {
        batchId: 'BATCH-2026-10-22-01',
        savedKwh: 201500
      };
      const tamperedPayload = {
        batchId: 'BATCH-2026-10-22-01',
        savedKwh: 999999 // unauthorized alteration
      };

      const originalHash = await computeSha256(originalPayload);

      const verification = await verifyAuditPayload({
        payload: tamperedPayload,
        expectedHash: originalHash
      });

      expect(verification.verified).toBe(false);
      expect(verification.status).toBe('FAILED');
      expect(verification.computedHash).not.toBe(originalHash);
    });
  });

  describe('Unified Simulation Engine & Emergency Guardrails', () => {
    it('calculates off-peak power reduction under normal operations', () => {
      const normalDayState = { ...DEFAULT_SIM_CONFIG, simHour: 14 };
      const normalNightState = { ...DEFAULT_SIM_CONFIG, simHour: 3 };

      const metricsDay = deriveSimulationMetrics(normalDayState);
      const metricsNight = deriveSimulationMetrics(normalNightState);

      expect(metricsNight.isOffPeak).toBe(true);
      expect(metricsNight.savingsRatioPct).toBeGreaterThan(metricsDay.savingsRatioPct);
      expect(metricsNight.optimizedKwPerBts).toBeLessThan(metricsDay.optimizedKwPerBts);
    });

    it('enforces CTO Emergency Guardrail by bypassing carrier sleep during emergency', () => {
      const emergencyState = {
        ...DEFAULT_SIM_CONFIG,
        emergencyActive: true,
        carrierSleepActive: false
      };

      const metrics = deriveSimulationMetrics(emergencyState);

      // Latency impact must be 0ms (no sleep degradation allowed during disaster / 112 calls)
      expect(metrics.avgLatencyDeltaMs).toBe(0.0);
      // Radio sleep savings must drop
      expect(metrics.savingsRatioPct).toBeLessThan(5.0);
    });
  });

  describe('Evidence Intelligence: Mathematical DiD & Decision Gates', () => {
    it('verifies Mathematical Difference-in-Differences and 95% Confidence Interval', () => {
      const did = calculateDiDMetrics({
        sites: PILOT_SITES_SAMPLE,
        simState: { plnTariffIDR: 1500, tempC: 28, trafficMultiplier: 1.0, carrierSleepActive: true }
      });

      // 40 Intervention vs 10 Control
      expect(did.meta.interventionCount).toBe(40);
      expect(did.meta.controlCount).toBe(10);

      // Isolated energy savings should be statistically significant (p < 0.05)
      expect(did.didResults.isolatedEnergySavedKWh).toBeGreaterThan(150000);
      expect(did.didResults.isSignificant).toBe(true);

      // Confidence Interval lower bound must be less than upper bound
      expect(did.didResults.confidenceInterval95.lower).toBeLessThan(did.didResults.confidenceInterval95.upper);

      // Pre-trend assumption check passes (parallel trends assumption holds)
      expect(did.preTrendTest.passed).toBe(true);
    });

    it('evaluates Executive Decision Gates as GO when all 4 gates pass', () => {
      const did = calculateDiDMetrics({
        sites: PILOT_SITES_SAMPLE,
        simState: { plnTariffIDR: 1500, tempC: 28, trafficMultiplier: 1.0, carrierSleepActive: true }
      });

      const evaluation = evaluateExecutiveDecisionGates(did);
      expect(evaluation.gates.length).toBe(4);
      expect(evaluation.overall.recommendation).toBe('GO');
      expect(evaluation.overall.badgeColor).toBe('emerald');
    });

    it('triggers NO-GO or CONDITIONAL_GO when emergency or extreme stress drops savings below threshold', () => {
      // In extreme grid blackout / complete emergency bypass
      const emergencyDid = calculateDiDMetrics({
        sites: PILOT_SITES_SAMPLE,
        simState: { plnTariffIDR: 1500, tempC: 38, trafficMultiplier: 3.0, carrierSleepActive: false, emergencyActive: true }
      });

      const evaluation = evaluateExecutiveDecisionGates(emergencyDid);
      // Net energy savings will drop due to total carrier sleep bypass
      expect(emergencyDid.didResults.isolatedEnergySavedKWh).toBeLessThan(50000);
      expect(['CONDITIONAL_GO', 'NO-GO']).toContain(evaluation.overall.recommendation);
    });

    it('maintains data consistency between 50 sample sites and DiD aggregations', () => {
      const totalSites = PILOT_SITES_SAMPLE.length;
      expect(totalSites).toBe(50);

      const treatCount = PILOT_SITES_SAMPLE.filter(s => s.type === 'Intervensi').length;
      const ctrlCount = PILOT_SITES_SAMPLE.filter(s => s.type.includes('Pembanding')).length;

      expect(treatCount).toBe(40);
      expect(ctrlCount).toBe(10);
    });
  });
});
