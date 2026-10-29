const app = require('./app');
const config = require('./config');
const { sequelize } = require('./models');

async function start({ sync = true } = {}) {
  await sequelize.authenticate();
  if (sync) await sequelize.sync();            // développement : en production, utiliser des migrations
  return new Promise((resolve) => {
    const server = app.listen(config.port, () => {
      console.log(`[${process.pid}] TaskFlow sur http://localhost:${config.port}`);
      resolve(server);
    });
  });
}

// Arrêt propre : on cesse d'accepter des connexions, on termine les requêtes, on ferme la base
function installShutdown(server) {
  let closing = false;
  const shutdown = (signal) => {
    if (closing) return;
    closing = true;
    console.log(`[${process.pid}] ${signal} reçu : arrêt en cours`);
    const timer = setTimeout(() => process.exit(1), 10_000);
    timer.unref();
    server.close(async () => {
      await sequelize.close();
      process.exit(0);
    });
    server.closeIdleConnections?.();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('message', (msg) => {                // en cluster : demande d'arrêt envoyée par le primaire
    if (msg === 'shutdown') shutdown('shutdown');
  });
}

module.exports = { start, installShutdown };

if (require.main === module) {
  start().then(installShutdown).catch((err) => {
    console.error('Démarrage impossible :', err.message);
    process.exit(1);
  });
}
