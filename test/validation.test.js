const assert = require('node:assert/strict');
const { validateTask, parseId, parsePagination } = require('../src/validation');

describe('validation', () => {
  describe('validateTask()', () => {
    it('accepte un titre valide et le nettoie', () => {
      assert.deepEqual(validateTask({ title: '  Écrire  ' }), { title: 'Écrire' });
    });

    it('refuse un titre trop court avec un statut 422', () => {
      assert.throws(() => validateTask({ title: 'ab' }), { status: 422 });
    });

    it('refuse un corps absent', () => {
      assert.throws(() => validateTask(undefined), { status: 422 });
    });

    it('contrôle dueDate, userId et tags', () => {
      assert.deepEqual(
        validateTask({ title: 'Valide', dueDate: '2026-11-02', userId: 3, tags: ['a'] }),
        { title: 'Valide', dueDate: '2026-11-02', userId: 3, tags: ['a'] },
      );
      for (const bad of [{ dueDate: '02/11/2026' }, { userId: '3' }, { tags: 'a' }, { tags: [''] }]) {
        assert.throws(() => validateTask({ title: 'Valide', ...bad }), { status: 422 });
      }
    });

    it('en mode partiel, ne contrôle que les champs fournis', () => {
      assert.deepEqual(validateTask({ done: true }, { partial: true }), { done: true });
      assert.throws(() => validateTask({ done: 'oui' }, { partial: true }), { status: 422 });
    });
  });

  describe('parseId()', () => {
    it('convertit une chaîne numérique', () => assert.equal(parseId('42'), 42));
    for (const bad of ['abc', '0', '-1', '1.5', '']) {
      it(`rejette ${JSON.stringify(bad)}`, () => assert.throws(() => parseId(bad), { status: 400 }));
    }
  });

  describe('parsePagination()', () => {
    it('applique des valeurs par défaut', () => assert.deepEqual(parsePagination({}), { page: 1, limit: 10 }));
    it('borne la limite à 100', () => assert.equal(parsePagination({ limit: '5000' }).limit, 100));
  });
});
