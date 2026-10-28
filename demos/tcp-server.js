const net = require('node:net');
const dgram = require('node:dgram');
const readline = require('node:readline');
const TaskService = require('./task-service');

const PORT = Number(process.env.TCP_PORT ?? 4000);
const service = new TaskService();
service.on('error', () => {});

// Bonus : chaque création est signalée en UDP au collecteur de métriques
const udp = dgram.createSocket('udp4');
service.on('created', (t) => udp.send(`created:${t.id}`, 4001, 'localhost', () => {}));

function handleLine(line, socket) {
  const [cmd, ...rest] = line.trim().split(' ');
  const arg = rest.join(' ');
  switch ((cmd ?? '').toUpperCase()) {
    case 'LIST':
      return socket.write(`${JSON.stringify(service.list())}\n`);
    case 'ADD': {
      if (!arg) return socket.write('ERR title requis\n');
      const task = service.create(arg);
      return socket.write(`OK ${task.id}\n`);
    }
    case 'DONE': {
      const task = service.complete(Number(arg));
      return socket.write(task ? `OK ${task.id}\n` : 'ERR tâche inconnue\n');
    }
    case 'QUIT':
      return socket.end('BYE\n');
    default:
      return socket.write('ERR commande inconnue\n');
  }
}

const server = net.createServer((socket) => {
  socket.setEncoding('utf8');
  socket.on('error', (err) => console.error('Socket :', err.code));
  readline.createInterface({ input: socket }).on('line', (line) => handleLine(line, socket));
});

server.listen(PORT, () => console.log(`Serveur TCP sur le port ${PORT}`));
module.exports = server;
