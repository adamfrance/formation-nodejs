const fs = require('node:fs');

// Depuis le module principal : l'ordre n'est PAS garanti
setTimeout(() => console.log('timeout   (module principal)'), 0);
setImmediate(() => console.log('immediate (module principal)'));

// Dans un callback d'E/S : setImmediate passe TOUJOURS avant setTimeout
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout   (dans un callback d\'E/S)'), 0);
  setImmediate(() => console.log('immediate (dans un callback d\'E/S)'));
});
