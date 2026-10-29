// Le calcul part dans un worker : le fil principal reste libre pendant ce temps
const { Worker } = require('node:worker_threads');
const path = require('node:path');

const n = 3_000_000;
const battement = setInterval(() => process.stdout.write('.'), 100);   // la boucle tourne toujours

const worker = new Worker(path.join(__dirname, 'premiers-worker.js'), { workerData: n });
worker.once('message', (total) => {
  clearInterval(battement);
  console.log(`\n${total} nombres premiers sous ${n}`);
});
worker.once('error', (err) => {
  clearInterval(battement);
  console.error(err);
});
