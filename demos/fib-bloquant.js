// Un serveur dont la route /fib bloque la boucle d'événements
const express = require('express');
const app = express();

const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));

app.get('/fib/:n', (req, res) => res.json({ result: fib(Number(req.params.n)) }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(3300, () => console.log('http://localhost:3300 (fib bloquant)'));
