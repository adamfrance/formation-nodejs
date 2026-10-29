// Où trouver les données du client : req.params, req.query, req.body
const express = require('express');

const app = express();
app.use(express.json());

const livres = express.Router();

livres.param('id', (req, res, next, valeur) => {
  req.id = Number(valeur);
  next();
});

livres.get('/', (req, res) => res.json({ query: req.query }));

livres.get('/:id', (req, res) => {
  res.json({ params: req.params, type: typeof req.params.id, id: req.id });
});

livres.post('/', (req, res) => {
  res.status(201).location('/api/livres/7').json({ body: req.body });
});

livres.delete('/:id', (req, res) => res.sendStatus(204));

app.use('/api/livres', livres);

app.listen(3500, () => console.log('Démo des routes sur http://localhost:3500'));
