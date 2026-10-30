const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const dayjs = require('dayjs');
const Router = require('./router');
const store = require('./store');
const { HttpError, send, readJson } = require('./http-utils');

const PORT = Number(process.env.PORT ?? 3000);
const PUBLIC = path.join(__dirname, '..', 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css' };

function validate(body, { partial = false } = {}) {
  const patch = {};
  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim().length < 3 || body.title.length > 120) {
      throw new HttpError(422, 'title : texte de 3 à 120 caractères');
    }
    patch.title = body.title.trim();
  }
  if (body.done !== undefined) {
    if (typeof body.done !== 'boolean') throw new HttpError(422, 'done : booléen attendu');
    patch.done = body.done;
  }
  return patch;
}

const parseId = (params) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, 'id invalide');
  return id;
};

const router = new Router();

router.get('/health', (req, res) => send(res, 200, {
  status: 'ok',
  node: process.version,
  time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}));

router.get('/api/tasks', async (req, res) => {
  const { done, q, page = '1', limit = '10' } = req.query;
  let tasks = await store.all();
  if (done !== undefined) tasks = tasks.filter((t) => String(t.done) === done);
  if (q) tasks = tasks.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));

  const p = Math.max(1, Number.parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 10));
  res.setHeader('X-Total-Count', tasks.length);
  send(res, 200, tasks.slice((p - 1) * l, p * l));
});

router.get('/api/tasks/:id', async (req, res) => {
  const task = await store.find(parseId(req.params));
  if (!task) throw new HttpError(404, 'Tâche introuvable');
  send(res, 200, task);
});

router.post('/api/tasks', async (req, res) => {
  const task = await store.create(validate(await readJson(req)));
  res.setHeader('Location', `/api/tasks/${task.id}`);
  send(res, 201, task);
});

router.put('/api/tasks/:id', async (req, res) => {
  const task = await store.update(parseId(req.params), validate(await readJson(req), { partial: true }));
  if (!task) throw new HttpError(404, 'Tâche introuvable');
  send(res, 200, task);
});

router.delete('/api/tasks/:id', async (req, res) => {
  if (!(await store.remove(parseId(req.params)))) throw new HttpError(404, 'Tâche introuvable');
  send(res, 204);
});

async function serveStatic(res, pathname) {
  let relative;
  try {
    relative = decodeURIComponent(pathname);        // %2F, %2e%2e... : on décode avant de contrôler
  } catch {
    throw new HttpError(400, 'URL invalide');
  }
  const file = path.normalize(path.join(PUBLIC, relative === '/' ? 'index.html' : relative));
  if (!file.startsWith(PUBLIC + path.sep)) throw new HttpError(403, 'Interdit');
  try {
    const data = await fs.readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    throw new HttpError(404, 'Fichier introuvable');
  }
}

const server = http.createServer(async (req, res) => {
  const started = Date.now();
  res.on('finish', () => console.log(`${req.method} ${req.url} ${res.statusCode} ${Date.now() - started} ms`));
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const found = router.match(req.method, url.pathname);
    if (found) {
      req.params = found.params;
      req.query = Object.fromEntries(url.searchParams);
      return await found.handler(req, res);
    }
    if (req.method === 'GET' && !url.pathname.startsWith('/api/')) {
      return await serveStatic(res, url.pathname);
    }
    throw new HttpError(404, 'Route inconnue');
  } catch (err) {
    if (!err.status) console.error(err);
    if (!res.headersSent) send(res, err.status ?? 500, { error: err.status ? err.message : 'Erreur interne' });
  }
});

server.listen(PORT, () => console.log(`TaskFlow sur http://localhost:${PORT}`));
module.exports = server;
