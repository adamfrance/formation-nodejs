const assert = require('node:assert/strict');
const { mock } = require('node:test');
const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('API /api/tasks', () => {
  describe('POST /api/tasks', () => {
    it('crée une tâche : 201, Location et corps JSON', async () => {
      const res = await request(app).post('/api/tasks').send({ title: 'Écrire le rapport' })
        .expect(201).expect('Content-Type', /json/);
      assert.match(res.headers.location, /^\/api\/tasks\/\d+$/);
      assert.equal(res.body.title, 'Écrire le rapport');
      assert.equal(res.body.done, false);
    });

    it('refuse un titre invalide : 422 avec le détail', async () => {
      const res = await request(app).post('/api/tasks').send({ title: 'x' }).expect(422);
      assert.ok(res.body.details.length > 0);
    });

    it('refuse un JSON malformé : 400', async () => {
      await request(app).post('/api/tasks').set('Content-Type', 'application/json').send('{oups').expect(400);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await taskService.create({ title: 'Première tâche', done: true });
      await taskService.create({ title: 'Deuxième tâche' });
    });

    it('liste les tâches et renvoie le total dans X-Total-Count', async () => {
      const res = await request(app).get('/api/tasks').expect(200);
      assert.equal(res.body.length, 2);
      assert.equal(res.headers['x-total-count'], '2');
    });

    it('filtre avec ?done=false', async () => {
      const res = await request(app).get('/api/tasks?done=false').expect(200);
      assert.deepEqual(res.body.map((t) => t.title), ['Deuxième tâche']);
    });

    it('refuse un filtre invalide : 400', async () => {
      await request(app).get('/api/tasks?done=peut-etre').expect(400);
    });
  });

  describe('/api/tasks/:id', () => {
    it('GET : 404 si la tâche n\'existe pas', async () => {
      await request(app).get('/api/tasks/999').expect(404);
    });

    it('GET : 400 si l\'identifiant est invalide', async () => {
      await request(app).get('/api/tasks/abc').expect(400);
    });

    it('PATCH puis DELETE : cycle complet', async () => {
      const { body: created } = await request(app).post('/api/tasks').send({ title: 'Cycle de vie' });
      const patched = await request(app).patch(`/api/tasks/${created.id}`).send({ done: true }).expect(200);
      assert.equal(patched.body.done, true);
      await request(app).delete(`/api/tasks/${created.id}`).expect(204);
      await request(app).get(`/api/tasks/${created.id}`).expect(404);
    });

    it('renvoie 404 sans interroger la base (service remplacé par une doublure)', async () => {
      mock.method(taskService, 'findById', async () => null);
      await request(app).get('/api/tasks/42').expect(404);
      assert.equal(taskService.findById.mock.callCount(), 1);
    });

    it('masque le détail d\'une erreur interne : 500 générique', async () => {
      mock.method(console, 'error', () => {});                 // silence le journal attendu
      mock.method(taskService, 'findById', async () => { throw new Error('connexion perdue'); });
      const res = await request(app).get('/api/tasks/1').expect(500);
      assert.equal(res.body.error, 'Erreur interne');
    });
  });
});
