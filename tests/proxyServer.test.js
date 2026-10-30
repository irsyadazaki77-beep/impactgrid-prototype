import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer } from 'node:http';

let server;
let baseUrl;

beforeAll(async () => {
  process.env.GEMINI_API_KEY = '';
  const { default: app } = await import('../server/proxyServer.js');
  server = createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

describe('optional AI proxy integration', () => {
  it('reports availability without disclosing provider credentials', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.aiAvailable).toBe(false);
    expect(JSON.stringify(body)).not.toContain('GEMINI_API_KEY');
  });

  it('uses a safe offline response when provider credentials are absent', async () => {
    const response = await fetch(`${baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'Jelaskan ImpactGrid' }),
    });
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body).toMatchObject({ fallback: true });
    expect(body.error).not.toContain('GEMINI_API_KEY');
  });

  it('rejects invalid models and malformed message values', async () => {
    const invalidModel = await fetch(`${baseUrl}/api/ai/chat`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'Halo', model: 'other-model' }),
    });
    expect(invalidModel.status).toBe(400);
    const invalidMessage = await fetch(`${baseUrl}/api/ai/chat`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: { text: 'Halo' } }),
    });
    expect(invalidMessage.status).toBe(400);
  });

  it('allows configured local dev origin and rejects unrelated CORS origins', async () => {
    const allowed = await fetch(`${baseUrl}/api/health`, { headers: { origin: 'http://localhost:5173' } });
    expect(allowed.headers.get('access-control-allow-origin')).toBe('http://localhost:5173');
    const denied = await fetch(`${baseUrl}/api/health`, { headers: { origin: 'https://untrusted.example' } });
    expect(denied.headers.get('access-control-allow-origin')).toBeNull();
  });
});

describe('Kubernetes health probes and Prometheus metrics', () => {
  it('returns healthy status for /healthz liveness probe', async () => {
    const res = await fetch(`${baseUrl}/healthz`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('healthy');
    expect(body.service).toBe('impactgrid-enterprise-core');
    expect(typeof body.uptime_seconds).toBe('number');
  });

  it('returns ready status with Telkom DC region for /readyz readiness probe', async () => {
    const res = await fetch(`${baseUrl}/readyz`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ready');
    expect(body.dc_region).toBe('TELKOM_DC_SENTUL_SURABAYA');
    expect(body.checks.ingestion_engine).toBe('ok');
  });

  it('serves metrics formatted for Prometheus scraping', async () => {
    const res = await fetch(`${baseUrl}/metrics`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/plain');
    const text = await res.text();
    expect(text).toContain('impactgrid_telemetry_ingest_total');
    expect(text).toContain('impactgrid_anomalies_detected_total{type="phantom_load"}');
    expect(text).toContain('impactgrid_reconciled_batches_total');
    expect(text).toContain('impactgrid_potential_savings_kwh');
  });
});

describe('Live REST Telemetry Ingestion endpoint', () => {
  it('rejects non-array or empty records payload with 400', async () => {
    const res = await fetch(`${baseUrl}/api/v1/telemetry/ingest`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ records: [] })
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it('processes a valid batch, detects anomalies, and computes audit hash', async () => {
    const sampleBatch = {
      batch_id: 'BATCH-TEST-001',
      source: 'TELKOMSEL_EDGEX_GW',
      records: [
        {
          site_id: 'TSEL-BDG-001',
          pln_kwh: 45.2,
          rectifier_dc_kwh: 41.5,
          smart_meter_kwh: 45.0,
          temp_celsius: 28.5,
          power_factor: 0.96
        },
        {
          site_id: 'TSEL-BDG-042',
          pln_kwh: 58.0,
          rectifier_dc_kwh: 42.0,
          smart_meter_kwh: 49.5, // 14.6% discrepancy -> phantom power anomaly!
          temp_celsius: 38.5,    // > 34°C -> thermal anomaly!
          power_factor: 0.82     // < 0.85 -> low power factor anomaly!
        }
      ]
    };

    const res = await fetch(`${baseUrl}/api/v1/telemetry/ingest`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(sampleBatch)
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.batch_id).toBe('BATCH-TEST-001');
    expect(body.records_processed).toBe(2);
    expect(body.anomalies_count).toBeGreaterThan(0);
    expect(typeof body.audit_hash).toBe('string');
    expect(body.audit_hash.length).toBe(64); // SHA-256 hex length
    expect(body.anomalies.some((a) => a.type === 'PHANTOM_POWER_DISCREPANCY')).toBe(true);
    expect(body.anomalies.some((a) => a.type === 'SHELTER_HEAT_DISSIPATION')).toBe(true);
  });

  it('streams live SSE telemetry events on /api/v1/telemetry/stream', async () => {
    const controller = new AbortController();
    const res = await fetch(`${baseUrl}/api/v1/telemetry/stream`, {
      signal: controller.signal
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/event-stream');

    const reader = res.body.getReader();
    const { value } = await reader.read();
    const text = new TextDecoder().decode(value);
    expect(text).toContain('data:');
    expect(text).toContain('CONNECTED');
    expect(text).toContain('TELKOM_DC_SENTUL_01');

    controller.abort();
  });
});
