// Fil d'exécution séparé : fait le calcul et renvoie le résultat au thread principal
const { parentPort, workerData } = require('node:worker_threads');

const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));

parentPort.postMessage(fib(workerData));
