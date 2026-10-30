// Teste loadTasks (async/await) et sa version promisify sur trois cas
const fs = require('node:fs/promises');
const path = require('node:path');
const { loadTasks } = require('./load-tasks');
const { loadTasks: loadTasksPromisified } = require('./load-promisify');

const INVALIDE = path.join(__dirname, '..', 'data', 'invalide.json');

async function essayer(label, fn) {
  try {
    const tasks = await fn();
    console.log(`${label} : OK, ${tasks.length} tâche(s)`);
  } catch (err) {
    console.log(`${label} : ERREUR ${err.name} (${err.code ?? err.message})`);
  }
}

async function main() {
  await fs.writeFile(INVALIDE, '{oups');           // fichier volontairement invalide
  await essayer('async/await   fichier présent', () => loadTasks('data/tasks.json'));
  await essayer('async/await   fichier absent ', () => loadTasks('data/absent.json'));
  await essayer('async/await   JSON invalide  ', () => loadTasks(INVALIDE));
  await essayer('promisify     fichier présent', () => loadTasksPromisified('data/tasks.json'));
  await essayer('promisify     fichier absent ', () => loadTasksPromisified('data/absent.json'));
  await fs.rm(INVALIDE);
}

main();
