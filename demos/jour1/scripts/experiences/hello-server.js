// Le plus petit serveur HTTP possible
const http = require('node:http');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Bonjour TaskFlow !\n');
});

server.listen(3000, () => {
  console.log('Serveur prêt sur http://localhost:3000');
});
