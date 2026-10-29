const { Router } = require('express');
// On passe par l'objet module (taskService.x) pour pouvoir le « mocker » dans les tests
const taskService = require('../services/taskService');
const HttpError = require('../utils/httpError');
const { validateTask, parseId, parsePagination } = require('../validation');

const router = Router();

router.param('id', (req, res, next, value) => {
  req.taskId = parseId(value);
  next();
});

router.get('/', async (req, res) => {
  const { done, q } = req.query;
  if (done !== undefined && !['true', 'false'].includes(done)) {
    throw new HttpError(400, 'done : true ou false attendu');
  }
  const { page, limit } = parsePagination(req.query);
  const { items, total } = await taskService.list({ done: done === undefined ? undefined : done === 'true', q, page, limit });
  res.set('X-Total-Count', String(total));
  res.json(items);
});

router.post('/', async (req, res) => {
  const task = await taskService.create(validateTask(req.body));
  res.status(201).location(`/api/tasks/${task.id}`).json(task);
});

router.get('/:id', async (req, res) => {
  const task = await taskService.findById(req.taskId);
  if (!task) throw new HttpError(404, 'Tâche introuvable');
  res.json(task);
});

router.put('/:id', async (req, res) => {
  const data = validateTask(req.body);
  const task = await taskService.update(req.taskId, { ...data, done: data.done ?? false });
  if (!task) throw new HttpError(404, 'Tâche introuvable');
  res.json(task);
});

router.patch('/:id', async (req, res) => {
  const task = await taskService.update(req.taskId, validateTask(req.body, { partial: true }));
  if (!task) throw new HttpError(404, 'Tâche introuvable');
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  if (!(await taskService.remove(req.taskId))) throw new HttpError(404, 'Tâche introuvable');
  res.sendStatus(204);
});

module.exports = router;
