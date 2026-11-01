import { describe, it, expect } from 'vitest';
import {
  TELKOMSEL_API_ENDPOINTS,
  KAFKA_SCHEMA_TOPICS,
  executeTelkomselApiSimulation,
  calculateNationalRegionalRollout,
  simulateChaosResiliencyScenario
} from '../src/utils/telkomselItMaxCompetitiveEngine.js';

describe('Telkomsel IT MAX Competitive Suite: Open API & Kafka Bus, 11-Regional Rollout, and Chaos Resiliency Lab', () => {
  it('simulates all 5 Telkomsel Enterprise Open APIs (TMF628, O-RAN A1-P, TMF621, SAP OData, ESG Merkle)', () => {
    expect(TELKOMSEL_API_ENDPOINTS).toHaveLength(5);
    expect(KAFKA_SCHEMA_TOPICS).toHaveLength(4);

    for (const ep of TELKOMSEL_API_ENDPOINTS) {
      const sim = executeTelkomselApiSimulation(ep.id);
      expect(sim.httpStatus).toBe(200);
      expect(sim.responseBody.ack).toBe('COMMITTED');
      expect(sim.responseHeaders['x-data-residency']).toContain('PP 71/2019');
      expect(sim.curlSnippet).toContain(ep.path);
    }
  });

  it('calculates National 11-Regional Telkomsel Rollout (43,000 Macro BTS) with exact 85/15 TowerCo split', () => {
    const fullNational = calculateNationalRegionalRollout({ deploymentCoveragePct: 100, includeBessInRural: true });
    expect(fullNational.regionalCount).toBe(11);
    expect(fullNational.totalActiveSites).toBe(43000);
    expect(fullNational.totalSavedMwh).toBeGreaterThan(200000);
    expect(fullNational.totalScope2AbatedTons).toBeGreaterThan(150000);
    expect(fullNational.totalTelkomselNet85Rp + fullNational.totalTowerCoShare15Rp).toBe(fullNational.totalGrossSavingsRp);
  });

  it('verifies Chaos Engineering & Cyber-Physical Resiliency scenarios (Sentul->Surabaya DR, Anti-Spoofing, 112 Dead-Man Switch)', () => {
    const dcFailover = simulateChaosResiliencyScenario('dc_failover');
    expect(dcFailover.rpoSeconds).toBe(0);
    expect(dcFailover.rtoSeconds).toBeLessThan(2);

    const spoofing = simulateChaosResiliencyScenario('spoofing_attack');
    expect(spoofing.verdict).toMatch(/LULUS UJI CISO/);

    const fiberCut112 = simulateChaosResiliencyScenario('backhaul_severed_112');
    expect(fiberCut112.detectionLatencyMs).toBe(28);
  });
});
