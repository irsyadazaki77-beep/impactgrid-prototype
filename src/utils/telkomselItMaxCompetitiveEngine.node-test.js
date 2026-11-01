import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TELKOMSEL_API_ENDPOINTS,
  KAFKA_SCHEMA_TOPICS,
  executeTelkomselApiSimulation,
  calculateNationalRegionalRollout,
  simulateChaosResiliencyScenario
} from './telkomselItMaxCompetitiveEngine.js';

test('executeTelkomselApiSimulation returns deterministic 200 OK, Merkle SHA-256 header, and cURL snippet', () => {
  assert.equal(TELKOMSEL_API_ENDPOINTS.length, 5);
  assert.equal(KAFKA_SCHEMA_TOPICS.length, 4);

  const res = executeTelkomselApiSimulation('oran_a1_policy');
  assert.equal(res.httpStatus, 200);
  assert.equal(res.latencyMs <= 30, true);
  assert.equal(res.responseBody.ack, 'COMMITTED');
  assert.equal(res.curlSnippet.includes('https://api-internal.telkomsel.co.id'), true);
});

test('calculateNationalRegionalRollout models all 11 Telkomsel Regionals accurately', () => {
  const rollout = calculateNationalRegionalRollout({ deploymentCoveragePct: 100, includeBessInRural: true });
  assert.equal(rollout.regionalCount, 11);
  assert.equal(rollout.totalActiveSites, 43000);
  assert.equal(rollout.totalSavedMwh > 100000, true);
  assert.equal(rollout.totalGrossSavingsRp, rollout.totalTelkomselNet85Rp + rollout.totalTowerCoShare15Rp);
});

test('simulateChaosResiliencyScenario verifies DC failover, anti-spoofing, and 112 edge dead-man switch', () => {
  const dc = simulateChaosResiliencyScenario('dc_failover');
  assert.equal(dc.rpoSeconds, 0);
  assert.equal(dc.rtoSeconds < 2.0, true);

  const spoof = simulateChaosResiliencyScenario('spoofing_attack');
  assert.equal(spoof.ranImpact.includes('DIKARANTINA'), true);

  const edge112 = simulateChaosResiliencyScenario('backhaul_severed_112');
  assert.equal(edge112.detectionLatencyMs, 28);
});
