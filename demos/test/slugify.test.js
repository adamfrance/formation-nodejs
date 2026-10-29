const assert = require('node:assert/strict');
const { slugify } = require('../slugify');

describe('slugify()', () => {
  it('met le texte en minuscules', () => {
    assert.equal(slugify('Hello'), 'hello');
  });

  it('remplace les espaces par des tirets', () => {
    assert.equal(slugify('Mon Titre'), 'mon-titre');
  });
});
