const { Router } = require('express');
const { upload, UPLOAD_DIR } = require('./upload');

const router = Router();
const tasks = [{ id: 1, title: 'Découvrir Express', done: false, attachment: null }];
let nextId = 2;

const findTask = (req) => tasks.find((t) => t.id === Number(req.params.id));

router.get('/', (req, res) => {
  res.render('tasks/index', { title: 'Mes tâches', tasks });
});

router.get('/new', (req, res) => {
  res.render('tasks/new', { title: 'Nouvelle tâche', error: null, values: {} });
});

router.post('/', (req, res) => {
  const title = String(req.body?.title ?? '').trim();
  if (title.length < 3) {
    return res.status(422).render('tasks/new', {
      title: 'Nouvelle tâche',
      error: 'Le titre doit contenir au moins 3 caractères.',
      values: { title },
    });
  }
  tasks.push({ id: nextId++, title, done: false, attachment: null });
  res.redirect(303, '/tasks');
});

router.post('/:id/toggle', (req, res) => {
  const task = findTask(req);
  if (!task) return res.status(404).render('error', { title: 'Erreur', message: 'Tâche inconnue' });
  task.done = !task.done;
  res.redirect(303, '/tasks');
});

router.post('/:id/attachment', upload.single('file'), (req, res) => {
  const task = findTask(req);
  if (!task) return res.status(404).render('error', { title: 'Erreur', message: 'Tâche inconnue' });
  if (!req.file) {
    return res.status(415).render('error', { title: 'Envoi refusé', message: 'Type de fichier non autorisé (png, jpeg, pdf).' });
  }
  task.attachment = req.file.filename;
  res.redirect(303, '/tasks');
});

// Les fichiers sont stockés hors du dossier public et servis par une route contrôlée
router.get('/files/:name', (req, res) => {
  res.sendFile(req.params.name, { root: UPLOAD_DIR, dotfiles: 'deny' }, (err) => {
    if (err) res.status(404).render('error', { title: 'Erreur', message: 'Fichier introuvable' });
  });
});

module.exports = router;
