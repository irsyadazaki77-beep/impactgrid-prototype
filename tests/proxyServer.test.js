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
