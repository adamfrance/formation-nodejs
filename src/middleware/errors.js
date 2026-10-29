const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

function notFound(req, res) {
  res.status(404).json({ error: `Route inconnue : ${req.method} ${req.originalUrl}` });
}

// Traduit les erreurs techniques (Sequelize, body-parser) en réponses HTTP propres
function toHttpError(err) {
  if (err instanceof UniqueConstraintError) return { status: 409, message: 'Valeur déjà utilisée', details: err.errors.map((e) => e.message) };
  if (err instanceof ValidationError) return { status: 422, message: 'Validation échouée', details: err.errors.map((e) => e.message) };
  if (err instanceof ForeignKeyConstraintError) return { status: 422, message: 'Référence inconnue' };
  if (err.type === 'entity.parse.failed') return { status: 400, message: 'JSON invalide' };
  return { status: err.status ?? err.statusCode ?? 500, message: err.message, details: err.details };
}

// Middleware d'erreur : 4 arguments, déclaré en dernier
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const { status, message, details } = toHttpError(err);
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 ? 'Erreur interne' : message,
    ...(details ? { details } : {}),
  });
}

module.exports = { notFound, errorHandler };
