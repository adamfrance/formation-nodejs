// Illustration de l'ordre d'exécution des hooks
describe('groupe', () => {
  before(() => console.log('  before     : 1 fois, avant tous les tests'));
  beforeEach(() => console.log('  beforeEach : avant CHAQUE test'));
  afterEach(() => console.log('  afterEach  : après CHAQUE test'));
  after(() => console.log('  after      : 1 fois, après tous les tests'));

  it('test A', () => console.log('    -> test A'));
  it('test B', () => console.log('    -> test B'));
});
