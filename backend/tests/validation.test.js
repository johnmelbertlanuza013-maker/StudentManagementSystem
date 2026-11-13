'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseStudent, parseId } = require('../src/validation');
const valid = {
  fullName: 'Alex Example', email: 'Alex@Example.com', course: 'BSIT',
  yearLevel: '2', status: 'active'
};

test('accepts valid record and normalizes email/status', () => {
  const result = parseStudent(valid);
  assert.equal(result.error, undefined);
  assert.equal(result.data.email, 'alex@example.com');
  assert.equal(result.data.status, 'ACTIVE');
  assert.equal(result.data.yearLevel, 2);
});
test('rejects invalid name', () => assert.ok(parseStudent({ ...valid, fullName: 'A' }).error));
test('rejects invalid email', () => assert.ok(parseStudent({ ...valid, email: 'bad' }).error));
test('rejects invalid year level', () => assert.ok(parseStudent({ ...valid, yearLevel: 10 }).error));
test('rejects invalid status', () => assert.ok(parseStudent({ ...valid, status: 'PENDING' }).error));
test('rejects missing payload', () => assert.ok(parseStudent(null).error));
test('validates numeric student IDs', () => {
  assert.equal(parseId('12'), 12);
  assert.equal(parseId('0'), null);
  assert.equal(parseId('abc'), null);
  assert.equal(parseId('01'), null);
});
