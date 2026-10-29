const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

describe('API /api/tasks (compléments : PUT)', () => {
  it('PUT sans titre : 422, car PUT remplace la ressource en entier', async () => {
    const { body: created } = await request(app).post('/api/tasks').send({ title: 'À remplacer' });
    await request(app).put(`/api/tasks/${created.id}`).send({ done: true }).expect(422);
  });

  it('PUT remplace entièrement : done retombe à false s\'il est omis', async () => {
    const { body: created } = await request(app).post('/api/tasks').send({ title: 'À remplacer', done: true });
    const res = await request(app).put(`/api/tasks/${created.id}`).send({ title: 'Remplacée' }).expect(200);
    assert.equal(res.body.title, 'Remplacée');
    assert.equal(res.body.done, false);
  });
});
