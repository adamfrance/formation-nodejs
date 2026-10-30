// Version async/await
const fs = require('node:fs/promises');

async function loadTasks(file = 'data/tasks.json') {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return []; // fichier absent : liste vide
    throw err;                            // autre erreur : on la remonte
  }
}

module.exports = { loadTasks };
