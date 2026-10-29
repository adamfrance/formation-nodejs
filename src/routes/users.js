const { Router } = require('express');
const userService = require('../services/userService');
const HttpError = require('../utils/httpError');
const { parseId } = require('../validation');

const router = Router();

router.post('/', async (req, res) => {
  const { name, email } = req.body ?? {};
  if (typeof name !== 'string' || typeof email !== 'string') {
    throw new HttpError(422, 'Validation échouée', ['name et email : textes attendus']);
  }
  const user = await userService.register({ name: name.trim(), email: email.trim().toLowerCase() });
  res.status(201).location(`/api/users/${user.id}`).json(user);
});

router.get('/:id', async (req, res) => {
  const user = await userService.findById(parseId(req.params.id));
  if (!user) throw new HttpError(404, 'Utilisateur introuvable');
  res.json(user);
});

router.get('/:id/tasks', async (req, res) => {
  const tasks = await userService.tasksOf(parseId(req.params.id));
  if (!tasks) throw new HttpError(404, 'Utilisateur introuvable');
  res.json(tasks);
});

module.exports = router;
