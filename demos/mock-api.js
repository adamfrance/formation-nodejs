// API de secours pour travailler sans accès Internet
const http = require('node:http');

const todos = [
  { id: 1, title: 'delectus aut autem', completed: false },
  { id: 2, title: 'quis ut nam facilis', completed: true },
  { id: 3, title: 'fugiat veniam minus', completed: false },
];

function start(port = 4100) {
  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/todos')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(todos));
    }
    if (req.url === '/slow') return;
    res.writeHead(404).end();
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

module.exports = { start };

if (require.main === module) start().then(() => console.log('Mock API sur http://localhost:4100'));
