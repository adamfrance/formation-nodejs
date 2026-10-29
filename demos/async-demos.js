// Les fonctions de la bibliothèque async, en quelques lignes
const async = require('async');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.time('series');
  const s = await async.series([
    async () => { await sleep(50); return 'étape 1'; },
    async () => 'étape 2',
  ]);
  console.log('series      :', s);
  console.timeEnd('series');

  const total = await async.waterfall([
    (cb) => cb(null, 10, 5),
    (a, b, cb) => cb(null, a + b),
  ]);
  console.log('waterfall   :', total);

  console.time('parallel');
  const p = await async.parallel({
    utilisateurs: async () => { await sleep(100); return 2; },
    taches: async () => { await sleep(100); return 3; },
  });
  console.log('parallel    :', p);
  console.timeEnd('parallel');

  let enCours = 0; let max = 0;
  const codes = await async.mapLimit([1, 2, 3, 4, 5, 6], 3, async (n) => {
    enCours += 1; max = Math.max(max, enCours);
    await sleep(50);
    enCours -= 1;
    return n * 10;
  });
  console.log('mapLimit    :', codes, '(simultanés au plus :', max + ')');

  let essais = 0;
  const data = await async.retry({ times: 3, interval: 50 }, async () => {
    essais += 1;
    if (essais < 3) throw new Error('échec temporaire');
    return 'ok';
  });
  console.log('retry       :', data, 'après', essais, 'essais');
}

main();
