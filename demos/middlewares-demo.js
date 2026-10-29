// Un pipeline de middlewares : l'ordre de déclaration est l'ordre d'exécution
const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('1. journal      :', req.method, req.url);
  next();
});

app.use((req, res, next) => {
  console.log('2. authentifié  : alice (fictif)');
  req.user = 'alice';
  next();
});

app.get('/ping', (req, res) => {
  console.log('3. route /ping');
  res.send(`pong pour ${req.user}\n`);
});

app.get('/gele', (req, res, next) => {
  console.log('3. route /gele : ni réponse, ni next()');
});

app.use((req, res) => {
  console.log('4. aucune route ne correspond');
  res.status(404).send('inconnu\n');
});

app.listen(3400, () => console.log('Express prêt sur http://localhost:3400'));
