// 3. async / await : le même code, écrit de haut en bas
const fs = require('node:fs/promises');

async function lire() {
  try {
    const data = await fs.readFile('data/tasks.json', 'utf8');
    console.log('async/await :', JSON.parse(data).length, 'tâches');
  } catch (err) {
    console.error('Erreur :', err.message);
  }
}

lire();
