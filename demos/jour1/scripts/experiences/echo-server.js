// Serveur TCP d'écho : renvoie tout ce qu'il reçoit
const net = require('node:net');

net.createServer((socket) => {
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => socket.write(`écho : ${JSON.stringify(chunk)}\n`));
}).listen(4000, () => console.log('Écho TCP sur le port 4000'));
