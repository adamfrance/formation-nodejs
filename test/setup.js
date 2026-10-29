// Chargé par Mocha avant les tests (voir .mocharc.json) : hooks « racine » partagés
process.env.NODE_ENV = 'test';

const { mock } = require('node:test');
const { sequelize } = require('../src/models');

exports.mochaHooks = {
  async beforeAll() {
    await sequelize.sync({ force: true });          // base de test dédiée : schéma recréé
  },
  async beforeEach() {
    await sequelize.truncate({ cascade: true, restartIdentity: true });
  },
  afterEach() {
    mock.restoreAll();                              // retire les doublures installées par un test
  },
  async afterAll() {
    await sequelize.close();
  },
};
