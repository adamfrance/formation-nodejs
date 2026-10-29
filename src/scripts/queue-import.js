const async = require('async');
const { flakyFetch, stats } = require('./flaky');

const CONCURRENCY = 2;
const imported = [];
const failed = [];

// File de travail : au plus 2 imports simultanés, 3 essais par ressource
const queue = async.queue(async (job) => {
  const task = await async.retry({ times: 3, interval: 50 }, async () => flakyFetch(job.id));
  imported.push(task);
}, CONCURRENCY);

queue.error((err, job) => failed.push({ id: job.id, reason: err.message }));

async function main() {
  const ids = Array.from({ length: 10 }, (_, i) => i + 1);
  queue.push(ids.map((id) => ({ id })));
  await queue.drain();                       // résolu quand la file est vide

  console.log(`Importées : ${imported.length}, en échec : ${failed.length}`);
  console.log('Échecs :', failed);
  console.log('Concurrence maximale observée :', stats().maxInFlight, `(limite ${CONCURRENCY})`);
  console.log('Tâches nécessitant un 2e essai :', imported.filter((t) => t.attempts > 1).map((t) => t.id).join(', '));
}

main();
