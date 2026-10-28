// Client TCP : envoie deux messages d'affilée et affiche ce que le serveur reçoit
const net = require('node:net');

const client = net.connect(4000, 'localhost', () => {
  client.write('un');
  client.write('deux');
});
client.setEncoding('utf8');
client.on('data', (data) => process.stdout.write(data));
setTimeout(() => client.end(), 300);
