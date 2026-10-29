const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

describe('API /api/users', () => {
  it('crée un utilisateur avec sa tâche de bienvenue (transaction)', async () => {
    const { body: user } = await request(app).post('/api/users')
      .send({ name: 'Alice', email: 'ALICE@example.org' }).expect(201);
    assert.equal(user.email, 'alice@example.org');

    const { body: tasks } = await request(app).get(`/api/users/${user.id}/tasks`).expect(200);
    assert.equal(tasks.length, 1);
    assert.match(tasks[0].title, /Bienvenue Alice/);
  });

  it('refuse un email déjà utilisé : 409', async () => {
    await request(app).post('/api/users').send({ name: 'Alice', email: 'a@example.org' }).expect(201);
    await request(app).post('/api/users').send({ name: 'Autre', email: 'a@example.org' }).expect(409);
  });

  it('refuse un email invalide : 422', async () => {
    await request(app).post('/api/users').send({ name: 'Bob', email: 'pas-un-email' }).expect(422);
  });

  it('refuse une tâche qui référence un utilisateur inconnu : 422', async () => {
    await request(app).post('/api/tasks').send({ title: 'Orpheline', userId: 999 }).expect(422);
  });

  it('GET /api/users/:id/tasks : 404 pour un utilisateur inconnu', async () => {
    await request(app).get('/api/users/999/tasks').expect(404);
  });
});
