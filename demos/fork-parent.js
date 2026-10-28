// Le parent lance fork-fils.js dans un autre processus Node et lui envoie des tâches
const { fork } = require('node:child_process');
const path = require('node:path');

console.log('parent, pid', process.pid);
const fils = fork(path.join(__dirname, 'fork-fils.js'));

fils.on('message', (stats) => {
  console.log('réponse du fils :', stats);
  fils.disconnect();
});
fils.on('exit', (code) => console.log('fils arrêté, code', code));

fils.send({ tasks: [{ done: true }, { done: false }, { done: false }] });
