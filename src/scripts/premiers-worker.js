// Worker : compte les nombres premiers inférieurs à n, hors du fil principal
const { parentPort, workerData } = require('node:worker_threads');

function estPremier(k) {
  for (let d = 2; d * d <= k; d++) if (k % d === 0) return false;
  return k > 1;
}

let total = 0;
for (let k = 2; k < workerData; k++) if (estPremier(k)) total++;
parentPort.postMessage(total);
