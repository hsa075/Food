import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';
import { config } from '../src/config.js';

describe('Security & Role-Based Access Control', () => {
  test('Unauthenticated request to /api/admin/dashboard is rejected with 401', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'GET',
      url: '/api/admin/dashboard',
    });

    assert.equal(res.statusCode, 401);
    const body = JSON.parse(res.payload);
    assert.equal(body.error, 'Unauthorized');
  });

  test('Customer role attempting to access /api/admin/dashboard is rejected with 403', async () => {
    const app = await buildApp();

    // Create valid JWT signed with app secret for a customer
    const customerToken = app.jwt.sign({
      userId: 'test-cust-id',
      email: 'customer@uttara.in',
      role: 'customer',
    });

    const res = await app.inject({
      method: 'GET',
      url: '/api/admin/dashboard',
      headers: {
        authorization: `Bearer ${customerToken}`,
      },
    });

    assert.equal(res.statusCode, 403);
    const body = JSON.parse(res.payload);
    assert.equal(body.error, 'Forbidden');
  });

  test('Unauthenticated request to /api/kitchen/dashboard is rejected with 401', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'GET',
      url: '/api/kitchen/dashboard',
    });

    assert.equal(res.statusCode, 401);
  });
});
