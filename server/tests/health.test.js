const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_samajh_backend_12345';

const app = require('../src/index');

describe('Health and System Endpoints', () => {
  it('GET /api/health should return 200 with status ok', async () => {
    const res = await request(app).get('/api/health');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: 'ok' });
  });

  it('GET /api/nonexistent-route should return 404 with Route not found.', async () => {
    const res = await request(app).get('/api/nonexistent-route');

    assert.equal(res.status, 404);
    assert.equal(res.body.error, 'Route not found.');
  });
});
