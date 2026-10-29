const cluster = require('node:cluster');
const os = require('node:os');

const WORKERS = Number(process.env.WORKERS ?? os.availableParallelism());
cluster.schedulingPolicy = cluster.SCHED_RR;    // à tour de rôle, y compris sous Windows
if (cluster.isPrimary) {
  const { sequelize } = require('./models');
  let stopping = false;

  (async () => {
    await sequelize.sync();                   // le schéma est créé une seule fois, par le primaire
    await sequelize.close();
    for (let i = 0; i < WORKERS; i++) cluster.fork();
    console.log(`[primary ${process.pid}] ${WORKERS} workers démarrés`);
  })().catch((err) => { console.error(err); process.exit(1); });

  cluster.on('exit', (worker, code, signal) => {
    if (stopping) {
      if (Object.keys(cluster.workers).length === 0) process.exit(0);
      return;
    }
    console.log(`[primary] worker ${worker.process.pid} arrêté (${signal ?? code}) : redémarrage`);
    cluster.fork();
  });

  const stop = (signal) => {
    if (stopping) return;                     // un second signal ne relance pas l'arrêt
    stopping = true;
    console.log(`[primary] ${signal} : arrêt des workers`);
    for (const worker of Object.values(cluster.workers)) {
      if (worker.isConnected()) worker.send('shutdown');   // un message : sous Windows, kill() arrête net
    }
    if (Object.keys(cluster.workers).length === 0) process.exit(0);
  };
  process.on('SIGTERM', () => stop('SIGTERM'));
  process.on('SIGINT', () => stop('SIGINT'));
} else {
  const { start, installShutdown } = require('./server');
  start({ sync: false }).then(installShutdown).catch((err) => { console.error(err); process.exit(1); });
}
