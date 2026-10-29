const fs = require('node:fs/promises');
const path = require('node:path');

const LOG_FILE = path.join(__dirname, 'activity.log');

function attachLogger(service, file = LOG_FILE) {
  // Les écritures sont mises en file : appendFile lancés en parallèle ne garantissent pas l'ordre des lignes
  let file_d_attente = Promise.resolve();
  const write = (event, task) => {
    const line = `${new Date().toISOString()} ${event} #${task.id} ${task.title}\n`;
    file_d_attente = file_d_attente
      .then(() => fs.appendFile(file, line))
      .catch((err) => console.error('Journal indisponible :', err.message));
  };

  service.on('created', (task) => write('created', task));
  service.on('completed', (task) => write('completed', task));
  service.on('removed', (task) => write('removed', task));
  service.on('error', (err) => console.error('Erreur service :', err.message));
}

module.exports = { attachLogger, LOG_FILE };
