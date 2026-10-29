const assert = require('node:assert/strict');
const taskService = require('../src/services/taskService');
const userService = require('../src/services/userService');

describe('taskService', () => {
  it('crée une tâche avec ses étiquettes normalisées', async () => {
    const task = await taskService.create({ title: 'Préparer la démo', tags: ['Travail', 'travail', ' urgent '] });
    assert.equal(task.done, false);
    assert.deepEqual(task.tags, ['travail', 'urgent']);
  });

  it('retourne null pour une tâche inconnue', async () => {
    assert.equal(await taskService.findById(999), null);
  });

  it('filtre par statut, recherche et pagine', async () => {
    for (const [title, done] of [['Écrire le cours', true], ['Écrire les tests', false], ['Déployer', false]]) {
      await taskService.create({ title, done });
    }
    const open = await taskService.list({ done: false });
    assert.equal(open.total, 2);
    const found = await taskService.list({ q: 'écrire' });
    assert.equal(found.total, 2);
    const page = await taskService.list({ limit: 2, page: 2 });
    assert.equal(page.items.length, 1);
    assert.equal(page.total, 3);
  });

  it('traite % et _ comme des caractères ordinaires dans la recherche', async () => {
    await taskService.create({ title: 'Remise 50% sur tout' });
    await taskService.create({ title: 'Autre tâche' });
    assert.equal((await taskService.list({ q: '%' })).total, 1);
  });

  it('met à jour puis supprime', async () => {
    const { id } = await taskService.create({ title: 'À modifier' });
    const updated = await taskService.update(id, { done: true, tags: ['fait'] });
    assert.equal(updated.done, true);
    assert.deepEqual(updated.tags, ['fait']);
    assert.equal(await taskService.remove(id), true);
    assert.equal(await taskService.remove(id), false);
  });

  it('annule tout si la transaction échoue (rollback)', async () => {
    await assert.rejects(() => userService.register({ name: 'Zoé', email: 'pas-un-email' }));
    const { total } = await taskService.list();
    assert.equal(total, 0, 'aucune tâche de bienvenue ne doit rester');
  });
});
