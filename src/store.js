const fs = require('node:fs/promises');
const path = require('node:path');

const FILE = process.env.DATA_FILE ?? path.join(__dirname, '..', 'data', 'tasks.json');

// Les écritures sont sérialisées : jamais deux lectures-modifications-écritures en parallèle
let lock = Promise.resolve();
function withLock(fn) {
  const result = lock.then(fn);
  lock = result.catch(() => {});
  return result;
}

async function load() {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function save(tasks) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(tasks, null, 2));
  await fs.rename(tmp, FILE);
}

const all = () => load();
const find = async (id) => (await load()).find((t) => t.id === id) ?? null;

const create = ({ title, done = false }) => withLock(async () => {
  const tasks = await load();
  const task = { id: Math.max(0, ...tasks.map((t) => t.id)) + 1, title, done };
  await save([...tasks, task]);
  return task;
});

const update = (id, patch) => withLock(async () => {
  const tasks = await load();
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  Object.assign(task, patch);
  await save(tasks);
  return task;
});

const remove = (id) => withLock(async () => {
  const tasks = await load();
  const rest = tasks.filter((t) => t.id !== id);
  if (rest.length === tasks.length) return false;
  await save(rest);
  return true;
});

module.exports = { all, find, create, update, remove };
