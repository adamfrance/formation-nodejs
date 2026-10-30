const fs = require('node:fs/promises');
const { readTasks, FILE } = require('./stats');

const REMOTE_URL = process.env.REMOTE_URL ?? 'https://jsonplaceholder.typicode.com/todos?_limit=5';

async function fetchRemoteTodos(url = REMOTE_URL, timeoutMs = 5000) {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`);
  const todos = await res.json();
  if (!Array.isArray(todos)) throw new Error('Réponse inattendue : tableau attendu');
  return todos;
}

async function importRemote(url) {
  const local = await readTasks();
  const known = new Set(local.map((t) => t.title));
  let nextId = Math.max(0, ...local.map((t) => t.id)) + 1;

  const added = [];
  for (const todo of await fetchRemoteTodos(url)) {
    if (known.has(todo.title)) continue;           // pas de doublon
    added.push({ id: nextId++, title: todo.title, done: Boolean(todo.completed) });
  }

  const tmp = `${FILE}.tmp`;                        // écriture atomique
  await fs.writeFile(tmp, JSON.stringify([...local, ...added], null, 2));
  await fs.rename(tmp, FILE);
  return added.length;
}

module.exports = { fetchRemoteTodos, importRemote };

if (require.main === module) {
  importRemote()
    .then((n) => console.log(`${n} tâche(s) importée(s)`))
    .catch((err) => {
      const reason = err.name === 'TimeoutError' ? 'délai dépassé' : err.message;
      console.error('Import impossible :', reason);
      process.exit(1);
    });
}
