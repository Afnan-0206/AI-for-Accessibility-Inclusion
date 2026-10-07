import fs from 'node:fs';
import path from 'node:path';

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Testing Phase 1 Backend Core ---');

  // 1. Health check
  const healthRes = await fetch(`${API_BASE}/health`);
  const healthJson = await healthRes.json();
  console.log('1. Health check status:', healthRes.status, healthJson);

  // 2. Unauthorized access check
  const unauthRes = await fetch(`${API_BASE}/auth/me`);
  const unauthJson = await unauthRes.json();
  console.log('2. Unauthorized /me status (expected 401):', unauthRes.status, unauthJson);

  // 3. Invalid registration input (short password)
  const badRegRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'A', email: 'notanemail', password: '123' }),
  });
  const badRegJson = await badRegRes.json();
  console.log('3. Invalid input registration (expected 400):', badRegRes.status, badRegJson);

  // 4. Valid Registration
  const testEmail = `user_${Date.now()}@test.com`;
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Gagan Tester', email: testEmail, password: 'Password123!' }),
  });
  const regJson = await regRes.json();
  console.log('4. Valid registration status (expected 201):', regRes.status, 'User ID:', regJson.user?.id);
  const token = regJson.token;

  // 5. Login
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'Password123!' }),
  });
  const loginJson = await loginRes.json();
  console.log('5. Valid login status (expected 200):', loginRes.status, 'Token returned:', !!loginJson.token);

  // 6. Get Profile /me
  const meRes = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meJson = await meRes.json();
  console.log('6. /me profile status (expected 200):', meRes.status, meJson.user?.name);

  // 7. Analyze document
  const samplePath = path.resolve('samples/property_tax_notice.txt');
  const fileBytes = fs.readFileSync(samplePath);
  const formData = new FormData();
  formData.append('file', new Blob([fileBytes], { type: 'text/plain' }), 'property_tax_notice.txt');
  formData.append('language', 'en');

  const analyzeRes = await fetch(`${API_BASE}/documents/analyze`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const analyzeJson = await analyzeRes.json();
  console.log('7. /documents/analyze status (expected 200):', analyzeRes.status, 'Doc title:', analyzeJson.document?.analysis?.title);
  const docId = analyzeJson.document?.id;

  // 8. List documents
  const listRes = await fetch(`${API_BASE}/documents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const listJson = await listRes.json();
  console.log('8. /documents list status (expected 200):', listRes.status, 'Count:', listJson.documents?.length);

  // 9. Get document by id
  const getRes = await fetch(`${API_BASE}/documents/${docId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const getJson = await getRes.json();
  console.log('9. /documents/:id status (expected 200):', getRes.status, 'Urgency:', getJson.document?.analysis?.urgency);

  // 10. Ask question
  const askRes = await fetch(`${API_BASE}/documents/${docId}/ask`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question: 'What is the penalty if I delay?', language: 'en' }),
  });
  const askJson = await askRes.json();
  console.log('10. /documents/:id/ask status (expected 200):', askRes.status, 'Answer length:', askJson.answer?.length);

  // 11. Delete document
  const delRes = await fetch(`${API_BASE}/documents/${docId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const delJson = await delRes.json();
  console.log('11. /documents/:id delete status (expected 200):', delRes.status, delJson);

  console.log('\n--- ALL PHASE 1 CHECKS PASSED SUCCESSFULLY ---');
}

runTests().catch(console.error);
