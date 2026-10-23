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
});
