const express = require('express');
const path = require('node:path');
const { MulterError } = require('multer');
const routes = require('./routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');
app.locals.appName = 'TaskFlow';

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/tasks'));
app.use('/tasks', routes);

app.use((req, res) => {
  res.status(404).render('error', { title: 'Page introuvable', message: 'Cette page n\'existe pas.' });
});

// Middleware d'erreur : 4 arguments, déclaré en dernier
app.use((err, req, res, next) => {
  if (err instanceof MulterError) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).render('error', { title: 'Envoi refusé', message: err.message });
  }
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  res.status(status).render('error', { title: 'Erreur', message: status >= 500 ? 'Erreur interne' : err.message });
});

module.exports = app;
