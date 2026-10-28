// Trois façons de lire le même fichier : synchrone, callback, promesse
const fs = require('node:fs');
const fsp = require('node:fs/promises');

const FILE = 'data/tasks.json';

console.log('--- 1. Synchrone : le programme attend la fin de la lecture');
const data = fs.readFileSync(FILE, 'utf8');
console.log('1. fichier lu (synchrone) : %d caractères', data.length);

console.log('--- 2. Callback : le programme continue sans attendre');
fs.readFile(FILE, 'utf8', (err, content) => {
  console.log('2. fichier lu (callback) : %d caractères', content.length);
});

console.log('--- 3. Promesse : le programme continue aussi');
fsp.readFile(FILE, 'utf8').then((content) => {
  console.log('3. fichier lu (promesse) : %d caractères', content.length);
});

console.log('--- Fin du script (avant les résultats 2 et 3 !)');
