'use strict';
// Run only against your local/demo MySQL-backed Express server, not a production service.
const assert = require('node:assert/strict');
const base = (process.env.API_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
const email = `demo.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`;
let id;

async function api(method, path, body) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  return { status: response.status, data };
}

async function main() {
  const health = await api('GET', '/api/health');
  assert.equal(health.status, 200, `Health endpoint: ${JSON.stringify(health)}`);
  assert.equal(health.data.database, 'connected');
  assert.equal(health.data.driver, 'MySQL');
  console.log('PASS: MySQL connection');

  const original = {
    fullName: 'Sample Student', email, course: 'BSIT', yearLevel: 2, status: 'ACTIVE'
  };
  const created = await api('POST', '/api/students', original);
  assert.equal(created.status, 201, `Create failed: ${JSON.stringify(created)}`);
  id = created.data.id;
  assert.ok(Number.isSafeInteger(id) && id > 0);
  console.log('PASS: CREATE');

  const list = await api('GET', '/api/students');
  assert.equal(list.status, 200);
  assert.ok(list.data.some(s => s.id === id && s.email === email));
  const read = await api('GET', `/api/students/${id}`);
  assert.equal(read.status, 200);
  assert.equal(read.data.fullName, original.fullName);
  console.log('PASS: READ (list and detail)');

  const duplicate = await api('POST', '/api/students', original);
  assert.equal(duplicate.status, 409);
  console.log('PASS: Duplicate email protection');

  const updated = await api('PUT', `/api/students/${id}`, {
    ...original, fullName: 'Updated Student', status: 'INACTIVE'
  });
  assert.equal(updated.status, 200, `Update failed: ${JSON.stringify(updated)}`);
  const checkUpdate = await api('GET', `/api/students/${id}`);
  assert.equal(checkUpdate.data.fullName, 'Updated Student');
  assert.equal(checkUpdate.data.status, 'INACTIVE');
  console.log('PASS: UPDATE');

  const removed = await api('DELETE', `/api/students/${id}`);
  assert.equal(removed.status, 204);
  id = undefined;
  assert.equal((await api('GET', `/api/students/${created.data.id}`)).status, 404);
  console.log('PASS: DELETE');
  console.log('MySQL + Prisma + Express CRUD smoke test completed successfully.');
}

main().catch(async error => {
  console.error('FAIL:', error);
  if (id) {
    try { await api('DELETE', `/api/students/${id}`); } catch (_) {}
  }
  process.exitCode = 1;
});
