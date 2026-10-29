const TaskService = require('./task-service');
const { attachLogger } = require('./activity-logger');
const { loadTasks } = require('./load-tasks');

async function main() {
  const service = new TaskService();
  attachLogger(service);

  service.once('created', (t) => console.log('Première tâche créée :', t.title));
  const a = service.create('Lire le cours');
  service.create('Faire le TP');
  service.create('   ');                // déclenche « error » (géré par le logger)
  service.complete(a.id);
  service.remove(2);

  console.log('Tâches restantes :', service.list());
  console.log('Fichier absent :', await loadTasks('data/absent.json'));
}

main().catch((err) => { console.error(err); process.exit(1); });
