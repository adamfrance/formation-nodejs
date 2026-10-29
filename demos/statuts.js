// Trois réponses, trois codes de statut
const http = require('node:http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/tasks') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end('[]');
  }
  if (req.method === 'POST' && req.url === '/tasks') {
    res.writeHead(201, { 'Content-Type': 'application/json', Location: '/tasks/1' });
    return res.end('{"id":1}');
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end('{"error":"Not found"}');
});

server.listen(3000, () => console.log('Serveur prêt sur http://localhost:3000'));
