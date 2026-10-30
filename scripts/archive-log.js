const fs = require('node:fs');
const zlib = require('node:zlib');
const { pipeline } = require('node:stream/promises');

async function archive(source = 'server.log') {
  const target = `${source}.gz`;
  const start = process.hrtime.bigint();
  await pipeline(fs.createReadStream(source), zlib.createGzip(), fs.createWriteStream(target));
  const ms = Number(process.hrtime.bigint() - start) / 1e6;
  const before = fs.statSync(source).size;
  const after = fs.statSync(target).size;
  console.log(`${source} : ${before} o → ${target} : ${after} o en ${ms.toFixed(0)} ms`);
}

archive().catch((err) => { console.error('Archivage échoué :', err.message); process.exit(1); });
