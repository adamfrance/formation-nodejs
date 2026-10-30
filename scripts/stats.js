const fs = require('node:fs/promises');
const path = require('node:path');

const FILE = path.join(__dirname, '..', 'data', 'tasks.json');

async function readTasks(file = FILE) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, '[]\n');
      return [];
    }
    throw err;
  }
}

function computeStats(tasks) {
  const done = tasks.filter((t) => t.done).length;
  return { total: tasks.length, done, todo: tasks.length - done };
}

module.exports = { readTasks, computeStats, FILE };

if (require.main === module) {
  readTasks()
    .then((tasks) => console.table(computeStats(tasks)))
    .catch((err) => { console.error('Lecture impossible :', err.message); process.exit(1); });
}
