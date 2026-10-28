// Lire le corps d'une requête : il arrive par morceaux, on compte les octets
const http = require('node:http');

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function send(res, status, body) {
  if (body === undefined) {
    res.writeHead(status);
    return res.end();
  }
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function readBody(req, limit = 1_000_000) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new HttpError(413, 'Corps trop volumineux');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

const server = http.createServer(async (req, res) => {
  try {
    const body = await readBody(req, 100);
    send(res, 200, { recu: body, octets: Buffer.byteLength(body) });
  } catch (err) {
    send(res, err.status ?? 500, { error: err.status ? err.message : 'Erreur interne' });
  }
});

server.listen(3100, () => console.log('Démo du corps sur http://localhost:3100'));
