// TaskService émet « error » pour un titre vide : sans écouteur, le programme s'arrête
const TaskService = require('./task-service');

const service = new TaskService();
service.on('created', (task) => console.log('created :', task.title));

service.create('Lire le cours');
service.create('   ');
console.log('Ligne jamais affichée');
