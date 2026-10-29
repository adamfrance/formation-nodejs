// Même serveur, mais le calcul est délégué à un worker thread
const express = require('express');
const { Worker } = require('node:worker_threads');
const path = require('node:path');

const app = express();

function runFib(n) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'fib-worker.js'), { workerData: n });
    worker.once('message', resolve);
    worker.once('error', reject);
  });
}

app.get('/fib/:n', async (req, res) => res.json({ result: await runFib(Number(req.params.n)) }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(3301, () => console.log('http://localhost:3301 (fib avec worker)'));
