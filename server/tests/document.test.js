const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_samajh_backend_12345';

const { mockSupabaseClient } = require('./testHelper');
const app = require('../src/index');

describe('Document Endpoints and Workflow', () => {
  let user1Token;
  let user2Token;

  beforeEach(async () => {
    mockSupabaseClient.reset();

    // Register User 1
    const res1 = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Deepika',
        email: 'deepika@example.com',
        password: 'password123'
      });
    user1Token = res1.body.token;

    // Register User 2
    const res2 = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Ramesh',
        email: 'ramesh@example.com',
        password: 'password123'
      });
    user2Token = res2.body.token;
  });

  describe('POST /api/documents/analyze (Upload & Analysis)', () => {
    it('should upload and analyze a valid PDF document in Kannada', async () => {
      const res = await request(app)
        .post('/api/documents/analyze')
        .set('Authorization', `Bearer ${user1Token}`)
        .field('language', 'kn')
        .attach('file', Buffer.from('%PDF-1.4 test pdf content'), {
          filename: 'notice.pdf',
          contentType: 'application/pdf'
        });

      assert.equal(res.status, 201);
      assert.ok(res.body.document);
      assert.equal(res.body.document.fileName, 'notice.pdf');
      assert.equal(res.body.document.language, 'kn');
      assert.ok(res.body.document.id);
      assert.ok(res.body.document.analysis);
      assert.equal(res.body.document.analysis.documentType, 'Property Tax Notice');
      assert.equal(res.body.document.analysis.urgency, 'high');
      assert.ok(Array.isArray(res.body.document.analysis.actions));
    });

    it('should upload a valid JPG image in Hindi', async () => {
      const res = await request(app)
        .post('/api/documents/analyze')
        .set('Authorization', `Bearer ${user1Token}`)
        .field('language', 'hi')
        .attach('file', Buffer.from('fake jpg image binary'), {
          filename: 'bill.jpg',
          contentType: 'image/jpeg'
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.document.fileName, 'bill.jpg');
      assert.equal(res.body.document.language, 'hi');
    });

    it('should upload a valid PNG image in English', async () => {
      const res = await request(app)
        .post('/api/documents/analyze')
        .set('Authorization', `Bearer ${user1Token}`)
        .field('language', 'en')
        .attach('file', Buffer.from('fake png image binary'), {
          filename: 'form.png',
          contentType: 'image/png'
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.document.fileName, 'form.png');
    });

    it('should upload a valid WebP image in Kannada', async () => {
      const res = await request(app)
        .post('/api/documents/analyze')
        .set('Authorization', `Bearer ${user1Token}`)
        .field('language', 'kn')
        .attach('file', Buffer.from('fake webp image binary'), {
          filename: 'form.webp',
          contentType: 'image/webp'
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.document.fileName, 'form.webp');
    });

    it('should reject unsupported file types (e.g. text/plain)', async () => {
      const res = await request(app)
        .post('/api/documents/analyze')
        .set('Authorization', `Bearer ${user1Token}`)
        .field('language', 'en')
        .attach('file', Buffer.from('plain text'), {
          filename: 'notes.txt',
          contentType: 'text/plain'
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Unsupported file type.');
    });

    it('should reject requests missing a file', async () => {
      const res = await request(app)
        .post('/api/documents/analyze')
        .set('Authorization', `Bearer ${user1Token}`)
        .field('language', 'en');

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Please provide a document file.');
    });

    it('should reject invalid language values', async () => {
      const res = await request(app)
        .post('/api/documents/analyze')
        .set('Authorization', `Bearer ${user1Token}`)
        .field('language', 'french')
        .attach('file', Buffer.from('%PDF-1.4 test'), {
          filename: 'test.pdf',
          contentType: 'application/pdf'
        });

      assert.equal(res.status, 400);
      assert.match(res.body.error, /Language must be one of: en, hi, kn/);
    });

    it('should reject oversized files exceeding 10 MB', async () => {
      const oversizedBuffer = Buffer.alloc(10 * 1024 * 1024 + 1024); // > 10MB
      const res = await request(app)
        .post('/api/documents/analyze')
        .set('Authorization', `Bearer ${user1Token}`)
        .field('language', 'en')
        .attach('file', oversizedBuffer, {
          filename: 'huge.pdf',
          contentType: 'application/pdf'
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'File size exceeds 10 MB limit.');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/documents/analyze')
        .field('language', 'en')
        .attach('file', Buffer.from('%PDF-1.4 test'), {
          filename: 'test.pdf',
          contentType: 'application/pdf'
        });

      assert.equal(res.status, 401);
    });
  });

  describe('Document Retrieval and Cross-User Isolation', () => {
    let docId;

    beforeEach(async () => {
      const uploadRes = await request(app)
        .post('/api/documents/analyze')
        .set('Authorization', `Bearer ${user1Token}`)
        .field('language', 'kn')
        .attach('file', Buffer.from('%PDF-1.4 test'), {
          filename: 'notice.pdf',
          contentType: 'application/pdf'
        });
      docId = uploadRes.body.document.id;
    });

    it('should list all documents for authenticated user (newest first)', async () => {
      const res = await request(app)
        .get('/api/documents')
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.documents));
      assert.equal(res.body.documents.length, 1);
      assert.equal(res.body.documents[0].id, docId);
    });

    it('should return empty list for user without documents', async () => {
      const res = await request(app)
        .get('/api/documents')
        .set('Authorization', `Bearer ${user2Token}`);

      assert.equal(res.status, 200);
      assert.deepEqual(res.body.documents, []);
    });

    it('should get single document by ID for owner', async () => {
      const res = await request(app)
        .get(`/api/documents/${docId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.document.id, docId);
      assert.equal(res.body.document.fileName, 'notice.pdf');
    });

    it('should BLOCK cross-user access: User 2 getting User 1 document returns 404', async () => {
      const res = await request(app)
        .get(`/api/documents/${docId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      assert.equal(res.status, 404);
      assert.equal(res.body.error, 'Document not found.');
    });

    it('should return 404 for non-existent document ID', async () => {
      const res = await request(app)
        .get('/api/documents/00000000-0000-0000-0000-000000000099')
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 404);
      assert.equal(res.body.error, 'Document not found.');
    });
  });

  describe('POST /api/documents/:id/ask (Question Answering)', () => {
    let docId;

    beforeEach(async () => {
      const uploadRes = await request(app)
        .post('/api/documents/analyze')
        .set('Authorization', `Bearer ${user1Token}`)
        .field('language', 'kn')
        .attach('file', Buffer.from('%PDF-1.4 test'), {
          filename: 'notice.pdf',
          contentType: 'application/pdf'
        });
      docId = uploadRes.body.document.id;
    });

    it('should answer question in Kannada successfully', async () => {
      const res = await request(app)
        .post(`/api/documents/${docId}/ask`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          question: 'What happens if I miss this deadline?',
          language: 'kn'
        });

      assert.equal(res.status, 200);
      assert.ok(res.body.answer);
      assert.match(res.body.answer, /ಗಡು/);
    });

    it('should answer question in Hindi successfully', async () => {
      const res = await request(app)
        .post(`/api/documents/${docId}/ask`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          question: 'अंतिम तिथि क्या है?',
          language: 'hi'
        });

      assert.equal(res.status, 200);
      assert.ok(res.body.answer);
      assert.match(res.body.answer, /समय सीमा/);
    });

    it('should answer question in English successfully', async () => {
      const res = await request(app)
        .post(`/api/documents/${docId}/ask`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          question: 'What documents are needed?',
          language: 'en'
        });

      assert.equal(res.status, 200);
      assert.ok(res.body.answer);
    });

    it('should reject invalid language in question request', async () => {
      const res = await request(app)
        .post(`/api/documents/${docId}/ask`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          question: 'Is this real?',
          language: 'german'
        });

      assert.equal(res.status, 400);
      assert.match(res.body.error, /Language must be one of: en, hi, kn/);
    });

    it('should reject question exceeding 1000 characters', async () => {
      const longQuestion = 'a'.repeat(1001);
      const res = await request(app)
        .post(`/api/documents/${docId}/ask`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          question: longQuestion,
          language: 'en'
        });

      assert.equal(res.status, 400);
      assert.match(res.body.error, /Question cannot exceed 1000 characters/);
    });

    it('should reject empty question', async () => {
      const res = await request(app)
        .post(`/api/documents/${docId}/ask`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          question: '',
          language: 'en'
        });

      assert.equal(res.status, 400);
      assert.match(res.body.error, /Question cannot be empty/);
    });

    it('should BLOCK cross-user question: User 2 cannot ask on User 1 document', async () => {
      const res = await request(app)
        .post(`/api/documents/${docId}/ask`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          question: 'What is this?',
          language: 'en'
        });

      assert.equal(res.status, 404);
      assert.equal(res.body.error, 'Document not found.');
    });

    it('should reject unauthenticated question request', async () => {
      const res = await request(app)
        .post(`/api/documents/${docId}/ask`)
        .send({
          question: 'What is this?',
          language: 'en'
        });

      assert.equal(res.status, 401);
    });
  });

  describe('DELETE /api/documents/:id (Deletion)', () => {
    let docId;

    beforeEach(async () => {
      const uploadRes = await request(app)
        .post('/api/documents/analyze')
        .set('Authorization', `Bearer ${user1Token}`)
        .field('language', 'en')
        .attach('file', Buffer.from('%PDF-1.4 test'), {
          filename: 'doc.pdf',
          contentType: 'application/pdf'
        });
      docId = uploadRes.body.document.id;
    });

    it('should BLOCK cross-user delete: User 2 cannot delete User 1 document', async () => {
      const res = await request(app)
        .delete(`/api/documents/${docId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      assert.equal(res.status, 404);
      assert.equal(res.body.error, 'Document not found.');

      // Verify document still exists for User 1
      const checkRes = await request(app)
        .get(`/api/documents/${docId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      assert.equal(checkRes.status, 200);
    });

    it('should allow owner to delete document successfully', async () => {
      const res = await request(app)
        .delete(`/api/documents/${docId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { success: true });

      // Verify document is now gone
      const checkRes = await request(app)
        .get(`/api/documents/${docId}`)
        .set('Authorization', `Bearer ${user1Token}`);
      assert.equal(checkRes.status, 404);
    });

    it('should return 404 when deleting an already deleted document', async () => {
      await request(app)
        .delete(`/api/documents/${docId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      const res = await request(app)
        .delete(`/api/documents/${docId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      assert.equal(res.status, 404);
    });
  });
});
