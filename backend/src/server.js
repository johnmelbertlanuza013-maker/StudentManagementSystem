'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { parseStudent, parseId } = require('./validation');

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT || 5000);

app.disable('x-powered-by');
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '16kb' }));

app.get('/api/health', async (req, res, next) => {
  try {
    await prisma.student.count();
    res.json({ ok: true, database: 'connected', orm: 'Prisma ORM', driver: 'MySQL' });
  } catch (error) { next(error); }
});

app.get('/api/students', async (req, res, next) => {
  try {
    const students = await prisma.student.findMany({ orderBy: { id: 'desc' } });
    res.json(students);
  } catch (error) { next(error); }
});

app.get('/api/students/:id', async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid student ID.' });
  try {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return res.status(404).json({ error: 'Student not found.' });
    res.json(student);
  } catch (error) { next(error); }
});

app.post('/api/students', async (req, res, next) => {
  const parsed = parseStudent(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  try {
    const student = await prisma.student.create({ data: parsed.data });
    res.status(201).json(student);
  } catch (error) { next(error); }
});

app.put('/api/students/:id', async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid student ID.' });
  const parsed = parseStudent(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });
  try {
    res.json(await prisma.student.update({ where: { id }, data: parsed.data }));
  } catch (error) { next(error); }
});

app.delete('/api/students/:id', async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid student ID.' });
  try {
    await prisma.student.delete({ where: { id } });
    res.status(204).end();
  } catch (error) { next(error); }
});

app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));
app.use((err, req, res, next) => {
  if (err?.code === 'P2002') return res.status(409).json({ error: 'This email already exists.' });
  if (err?.code === 'P2025') return res.status(404).json({ error: 'Student not found.' });
  if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ error: 'Invalid JSON request.' });
  if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'Request is too large.' });
  console.error('Server/database error:', err);
  res.status(500).json({ error: 'The server could not access the database. Check its terminal and connection.' });
});

if (require.main === module) {
  const server = app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
  async function close() {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  }
  process.on('SIGINT', close);
  process.on('SIGTERM', close);
}

module.exports = app;
