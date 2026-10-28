// Chemin relatif ou chemin construit avec __dirname
const fs = require('node:fs/promises');
const path = require('node:path');

const FILE = path.join(__dirname, 'data', 'tasks.json');

async function lire(label, file) {
  try {
    const tasks = JSON.parse(await fs.readFile(file, 'utf8'));
    console.log(`${label} : ${tasks.length} tâches`);
  } catch (err) {
    console.log(`${label} : ${err.code}`);
  }
}

async function main() {
  console.log('lancé depuis :', path.basename(process.cwd()));
  await lire('relatif  ', 'data/tasks.json');
  await lire('__dirname', FILE);
}

main();
