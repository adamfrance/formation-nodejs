// EventEmitter : abonner des écouteurs, déclencher des événements
const EventEmitter = require('node:events');

const bus = new EventEmitter();

bus.on('task:created', (task) => console.log('Écouteur : tâche créée ->', task.title));
bus.once('boot', () => console.log('Écouteur : démarrage (une seule fois)'));

bus.emit('boot');
bus.emit('task:created', { id: 1, title: 'Lire le cours' });
bus.emit('boot');

console.log('Fin du script : emit est synchrone, les écouteurs sont déjà passés');
