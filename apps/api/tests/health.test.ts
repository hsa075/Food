import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';

describe('Healthcheck Endpoints', () => {
  test('GET /health returns 200 with status ok', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'GET',
      url: '/health',
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.equal(body.status, 'ok');
  });

  test('GET /api/health returns 200 with service metadata', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'GET',
      url: '/api/health',
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'uttara-api');
    assert.equal(body.version, '1.0.0');
    assert.ok(body.timestamp);
  });
});
