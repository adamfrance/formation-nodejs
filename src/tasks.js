// Module CommonJS : stockage des tâches en mémoire
const tasks = [];
let nextId = 1;

function add(title) {
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  return task;
}

function list() {
  return [...tasks]; // copie : on n'expose pas le tableau interne
}

add('Installer Node.js');
add('Écrire mon premier serveur');

module.exports = { add, list };
