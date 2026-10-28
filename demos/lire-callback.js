// 1. Callback : Node appelle la fonction quand la lecture est finie
const fs = require('node:fs');

fs.readFile('data/tasks.json', 'utf8', (err, data) => {
  if (err) return console.error('Erreur :', err.message);
  console.log('callback :', JSON.parse(data).length, 'tâches');
});
