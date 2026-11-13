'use strict';

function parseStudent(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { error: 'Please provide student details.' };
  }
  const fullName = typeof raw.fullName === 'string' ? raw.fullName.trim() : '';
  const email = typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : '';
  const course = typeof raw.course === 'string' ? raw.course.trim() : '';
  const yearLevel = Number(raw.yearLevel);
  const status = typeof raw.status === 'string' ? raw.status.trim().toUpperCase() : '';

  if (fullName.length < 2 || fullName.length > 100) {
    return { error: 'Full name must contain 2–100 characters.' };
  }
  if (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Enter a valid email address.' };
  }
  if (course.length < 2 || course.length > 80) {
    return { error: 'Course must contain 2–80 characters.' };
  }
  if (!Number.isInteger(yearLevel) || yearLevel < 1 || yearLevel > 4) {
    return { error: 'Year level must be 1, 2, 3, or 4.' };
  }
  if (!['ACTIVE', 'INACTIVE'].includes(status)) {
    return { error: 'Status must be Active or Inactive.' };
  }
  return { data: { fullName, email, course, yearLevel, status } };
}

function parseId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 && String(id) === value ? id : null;
}

module.exports = { parseStudent, parseId };
