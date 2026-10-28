// Le routeur seul : quelle route correspond à quelle requête ?
const Router = require('../../src/router');

const router = new Router();
router.get('/api/tasks', () => 'liste');
router.get('/api/tasks/:id', () => 'une tâche');
router.post('/api/tasks', () => 'création');

const essais = [['GET', '/api/tasks'], ['GET', '/api/tasks/42'], ['POST', '/api/tasks'], ['DELETE', '/api/tasks/42'], ['GET', '/api/tasks/a%20b']];
for (const [method, path] of essais) {
  const found = router.match(method, path);
  const resultat = found ? `${found.handler()} ${JSON.stringify(found.params)}` : 'aucune route';
  console.log(method.padEnd(7), path.padEnd(18), '->', resultat);
}
