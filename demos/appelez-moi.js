// « Ne nous appelez pas, nous vous appellerons » : le callback est appelé quand le fichier est prêt
const fs = require('node:fs');

console.log('1. je demande le fichier');
fs.readFile('data/tasks.json', 'utf8', (err, data) => {
  console.log('3. fichier reçu (%d caractères)', data.length);
});
console.log('2. je continue sans attendre');
