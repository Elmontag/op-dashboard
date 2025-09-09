const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../index');

// Ensure a clean state before each test by removing the projects file
const projectsFile = path.join(__dirname, '..', 'data', 'projects.json');
test.beforeEach(() => {
  if (fs.existsSync(projectsFile)) {
    fs.unlinkSync(projectsFile);
  }
});

test('GET /health returns ok', async () => {
  const res = await request(app).get('/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok' });
});

test('GET /api/projects returns empty array initially', async () => {
  const res = await request(app).get('/api/projects');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, []);
});

test('POST /api/projects adds a project', async () => {
  const res = await request(app).post('/api/projects').send({ name: 'Demo' });
  assert.equal(res.status, 201);
  assert.equal(res.body.name, 'Demo');

  const list = await request(app).get('/api/projects');
  assert.equal(list.body.length, 1);
  assert.equal(list.body[0].name, 'Demo');
});

