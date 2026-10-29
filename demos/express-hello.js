// Express en quelques lignes : une application, une route, l'écoute
const express = require('express');

const app = express();

app.get('/bonjour/:nom', (req, res) => {
  res.json({ message: `Bonjour ${req.params.nom}` });
});

app.listen(3200, () => console.log('Express sur http://localhost:3200'));
