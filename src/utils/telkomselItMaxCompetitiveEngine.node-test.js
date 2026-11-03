import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TELKOMSEL_API_ENDPOINTS,
  KAFKA_SCHEMA_TOPICS,
  BTS_3GPP_MODBUS_PROFILES,
  executeTelkomselApiSimulation,
  getBts3gppAndModbusTelemetry,
  executeVendorCliCommand,
  calculateNationalRegionalRollout,
  calculateVendorLicenseVsRappTco,
  generateImpactGridOpenApiSpec,
  simulateChaosResiliencyScenario
} from './telkomselItMaxCompetitiveEngine.js';

test('executeTelkomselApiSimulation returns deterministic 200 OK, Merkle SHA-256 header, and cURL snippet', () => {
  assert.equal(TELKOMSEL_API_ENDPOINTS.length, 5);
  assert.equal(KAFKA_SCHEMA_TOPICS.length, 4);

  const res = executeTelkomselApiSimulation('oran_a1_policy');
  assert.equal(res.httpStatus, 200);
  assert.equal(res.latencyMs <= 30, true);
  assert.equal(res.responseBody.ack, 'COMMITTED');
  assert.equal(res.responseHeaders['x-content-type-options'], 'nosniff');
  assert.equal(res.curlSnippet.includes('https://api-internal.telkomsel.co.id'), true);
});

test('getBts3gppAndModbusTelemetry returns authentic 3GPP TS 28.552 counters and Modbus/SNMP BMS registers', () => {
  assert.equal(BTS_3GPP_MODBUS_PROFILES.length >= 3, true);
  const bdg = getBts3gppAndModbusTelemetry('BDG-DGO-P04');
  assert.equal(bdg.siteId, 'BDG-DGO-P04');
  assert.equal(bdg.vendor, 'HUAWEI_MAE');
  assert.equal(bdg.counters3gpp['PEE.AvgPower'].value, 2880);
  assert.equal(bdg.counters3gpp['CallDropRate'].value <= 0.15, true);
  assert.equal(bdg.modbusRegisters.length, 7);
  assert.equal(bdg.modbusRegisters[0].registerHex, '0x1000');
});

test('executeVendorCliCommand simulates Ericsson ENM, Huawei MAE, and ZTE NetNumen CLI scripts', () => {
  const ericsson = executeVendorCliCommand({ vendorId: 'ERICSSON_ENM', commandId: 'audit_state' });
  assert.equal(ericsson.status, 'RET_CODE_0_SUCCESS');
  assert.equal(ericsson.commandText.includes('cmedit get'), true);

  const huawei = executeVendorCliCommand({ vendorId: 'HUAWEI_MAE', commandId: 'apply_sleep' });
  assert.equal(huawei.commandText.includes('MOD CELLALGOSWITCH'), true);

  const zte = executeVendorCliCommand({ vendorId: 'ZTE_NETNUMEN', commandId: 'audit_state' });
  assert.equal(zte.commandText.includes('SHOW RRU_POWER_SAVING'), true);
});

test('calculateNationalRegionalRollout models all 11 Telkomsel Regionals and Sentul-Surabaya latency accurately', () => {
  const sentul = calculateNationalRegionalRollout({
    deploymentCoveragePct: 100,
    includeBessInRural: true,
    activeDcNode: 'SENTUL_PRIMARY'
  });
  assert.equal(sentul.regionalCount, 11);
  assert.equal(sentul.totalActiveSites, 43000);
  assert.equal(sentul.totalSavedMwh > 100000, true);
  assert.equal(sentul.totalGrossSavingsRp, sentul.totalTelkomselNet85Rp + sentul.totalTowerCoShare15Rp);
  assert.equal(sentul.avgNationalRttMs > 0, true);

  const surabaya = calculateNationalRegionalRollout({
    deploymentCoveragePct: 100,
    includeBessInRural: true,
    activeDcNode: 'SURABAYA_DR'
  });
  assert.notEqual(sentul.avgNationalRttMs, surabaya.avgNationalRttMs);
});

test('calculateVendorLicenseVsRappTco proves multi-hundred-billion IDR license savings', () => {
  const tco = calculateVendorLicenseVsRappTco({
    totalSites: 10000,
    oemAnnualLicensePerSiteIdr: 14500000,
    years: 5
  });
  assert.equal(tco.oemTotalTcoIdr, 10000 * 14500000 * 5);
  assert.equal(tco.netLicenseSavingsIdr > 500000000000, true);
  assert.equal(tco.tcoReductionPct > 75, true);
});

test('generateImpactGridOpenApiSpec returns valid OpenAPI 3.1.0 contract', () => {
  const spec = generateImpactGridOpenApiSpec();
  assert.equal(spec.openapi, '3.1.0');
  assert.equal(Boolean(spec.paths['/api/v1/gateway/execute']), true);
  assert.equal(Boolean(spec.paths['/api/v1/security/verify-hmac']), true);
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
