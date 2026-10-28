const fs = require('node:fs');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');

async function* lines(n) {
  for (let i = 1; i <= n; i++) yield `${new Date().toISOString()} INFO requête n°${i} traitée\n`;
}

pipeline(Readable.from(lines(200_000)), fs.createWriteStream('server.log'))
  .then(() => console.log('server.log généré'))
  .catch(console.error);
