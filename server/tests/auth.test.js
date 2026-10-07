const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_samajh_backend_12345';

const { mockSupabaseClient } = require('./testHelper');
const app = require('../src/index');

describe('Authentication Endpoints', () => {
  beforeEach(() => {
    mockSupabaseClient.reset();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return token with safe user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Deepika',
          email: 'deepika@example.com',
          password: 'password123'
        });

      assert.equal(res.status, 201);
      assert.ok(res.body.token, 'Token must be returned');
      assert.ok(res.body.user, 'User object must be returned');
      assert.equal(res.body.user.name, 'Deepika');
      assert.equal(res.body.user.email, 'deepika@example.com');
      assert.ok(res.body.user.id, 'User ID must be present');
      assert.equal(res.body.user.password, undefined);
      assert.equal(res.body.user.passwordHash, undefined);
    });

    it('should return 409 Conflict if email is already registered', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Deepika',
          email: 'deepika@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another Deepika',
          email: 'DEEPIKA@example.com', // case-insensitive check
          password: 'password123'
        });

      assert.equal(res.status, 409);
      assert.equal(res.body.error, 'Email is already registered.');
    });

    it('should return 400 Bad Request if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Deepika',
          email: 'deepika@example.com',
          password: 'short'
        });

      assert.equal(res.status, 400);
      assert.match(res.body.error, /Password must be at least 8 characters/);
    });

    it('should return 400 Bad Request if name is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'D',
          email: 'deepika@example.com',
          password: 'password123'
        });

      assert.equal(res.status, 400);
      assert.match(res.body.error, /Name must be between 2 and 60 characters/);
    });

    it('should return 400 Bad Request if email format is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Deepika',
          email: 'not-an-email',
          password: 'password123'
        });

      assert.equal(res.status, 400);
      assert.match(res.body.error, /Invalid email address/);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Deepika',
          email: 'deepika@example.com',
          password: 'password123'
        });
    });

    it('should log in successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'deepika@example.com',
          password: 'password123'
        });

      assert.equal(res.status, 200);
      assert.ok(res.body.token);
      assert.equal(res.body.user.name, 'Deepika');
      assert.equal(res.body.user.email, 'deepika@example.com');
      assert.equal(res.body.user.password, undefined);
      assert.equal(res.body.user.passwordHash, undefined);
    });

    it('should return 401 Unauthorized for incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'deepika@example.com',
          password: 'wrongpassword'
        });

      assert.equal(res.status, 401);
      assert.equal(res.body.error, 'Invalid email or password.');
    });

    it('should return 401 Unauthorized for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      assert.equal(res.status, 401);
      assert.equal(res.body.error, 'Invalid email or password.');
    });
  });

  describe('GET /api/auth/me', () => {
    let token;
    let userId;

    beforeEach(async () => {
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Deepika',
          email: 'deepika@example.com',
          password: 'password123'
        });
      token = regRes.body.token;
      userId = regRes.body.user.id;
    });

    it('should return current user when valid JWT is supplied', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.user.id, userId);
      assert.equal(res.body.user.name, 'Deepika');
      assert.equal(res.body.user.email, 'deepika@example.com');
      assert.equal(res.body.user.passwordHash, undefined);
    });

    it('should return 401 Unauthorized when token is missing', async () => {
      const res = await request(app).get('/api/auth/me');

      assert.equal(res.status, 401);
      assert.match(res.body.error, /Unauthorized/);
    });

    it('should return 401 Unauthorized when token is invalid or malformed', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.value');

      assert.equal(res.status, 401);
      assert.match(res.body.error, /Unauthorized/);
    });
  });
});
