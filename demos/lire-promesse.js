// 2. Promesse : readFile renvoie tout de suite une promesse, la suite va dans then
const fs = require('node:fs/promises');

fs.readFile('data/tasks.json', 'utf8')
  .then((data) => console.log('promesse :', JSON.parse(data).length, 'tâches'))
  .catch((err) => console.error('Erreur :', err.message));
