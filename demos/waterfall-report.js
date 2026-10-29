const async = require('async');
const fs = require('node:fs/promises');
const path = require('node:path');

const SOURCE = path.join(__dirname, 'tasks.json');
const REPORT = path.join(__dirname, 'report.txt');

// waterfall : chaque étape reçoit le résultat de la précédente ; une erreur interrompt la chaîne
async function buildReport() {
  return async.waterfall([
    (cb) => fs.readFile(SOURCE, 'utf8').then((raw) => cb(null, JSON.parse(raw)), cb),
    (tasks, cb) => {
      const done = tasks.filter((t) => t.done).length;
      cb(null, `Tâches : ${tasks.length}\nTerminées : ${done}\nÀ faire : ${tasks.length - done}\n`);
    },
    (text, cb) => fs.writeFile(REPORT, text).then(() => cb(null, REPORT), cb),
  ]);
}

(async () => {
  await fs.writeFile(SOURCE, JSON.stringify([{ title: 'a', done: true }, { title: 'b', done: false }]));
  console.log('Rapport écrit dans', path.basename(await buildReport()));
  console.log(await fs.readFile(REPORT, 'utf8'));
  await fs.rm(SOURCE);
  await fs.rm(REPORT);

  await buildReport().catch((err) => console.log('Chaîne interrompue :', err.code));
})();
