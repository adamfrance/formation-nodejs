const http = require('node:http');
const dayjs = require('dayjs');
const { list } = require('./tasks');

const PORT = Number(process.env.PORT ?? 3000);

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    return sendJson(res, 200, {
      status: 'ok',
      node: process.version,
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  if (req.method === 'GET' && req.url === '/tasks') {
    return sendJson(res, 200, list());
  }
  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`TaskFlow prêt sur http://localhost:${PORT}`);
});
