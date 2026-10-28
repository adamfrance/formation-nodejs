// Un flux lit le fichier par morceaux, sans jamais le charger en entier
const fs = require('node:fs');

let morceaux = 0;
let plusGros = 0;

fs.createReadStream('server.log')
  .on('data', (chunk) => {
    morceaux += 1;
    plusGros = Math.max(plusGros, chunk.length);
  })
  .on('end', () => console.log(`${morceaux} morceaux, le plus gros fait ${plusGros} octets`))
  .on('error', (err) => console.error('Erreur :', err.message));
