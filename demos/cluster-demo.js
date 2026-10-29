const cluster = require('node:cluster');
const http = require('node:http');
const os = require('node:os');

const PORT = Number(process.env.PORT ?? 3200);
const WORKERS = Number(process.env.WORKERS ?? Math.min(2, os.availableParallelism()));
cluster.schedulingPolicy = cluster.SCHED_RR;
if (cluster.isPrimary) {
  let stopping = false;
  for (let i = 0; i < WORKERS; i++) cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    if (stopping) {
      if (Object.keys(cluster.workers).length === 0) { console.log('[primary] arrêt complet'); process.exit(0); }
      return;
    }
    console.log(`[primary] worker ${worker.process.pid} arrêté (${signal ?? code}) : redémarrage`);
    cluster.fork();
  });

  for (const signal of ['SIGTERM', 'SIGINT']) {
    process.on(signal, () => {
      stopping = true;
      console.log(`[primary] ${signal} reçu`);
      for (const worker of Object.values(cluster.workers)) worker.process.kill('SIGTERM');
    });
  }
} else {
  const server = http.createServer((req, res) => {
    if (req.url === '/crash') process.exit(1);
    res.end(`réponse du worker ${process.pid}\n`);
  });
  server.listen(PORT, () => console.log(`[worker ${process.pid}] à l'écoute sur ${PORT}`));

  let closing = false;
  const stop = () => {
    if (closing) return;
    closing = true;
    console.log(`[worker ${process.pid}] arrêt propre`);
    server.close(() => process.exit(0));
    server.closeIdleConnections();
    setTimeout(() => process.exit(1), 5000).unref();
  };
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
}
