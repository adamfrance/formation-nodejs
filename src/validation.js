const HttpError = require('./utils/httpError');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// partial = true : mise à jour partielle (PATCH), seuls les champs fournis sont contrôlés
function validateTask(body, { partial = false } = {}) {
  const errors = [];
  const data = {};

  if (!partial || body?.title !== undefined) {
    if (typeof body?.title !== 'string' || body.title.trim().length < 3 || body.title.trim().length > 120) {
      errors.push('title : texte de 3 à 120 caractères');
    } else {
      data.title = body.title.trim();
    }
  }
  if (body?.done !== undefined) {
    if (typeof body.done === 'boolean') data.done = body.done;
    else errors.push('done : booléen attendu');
  }
  if (body?.dueDate !== undefined && body.dueDate !== null) {
    if (typeof body.dueDate === 'string' && DATE_RE.test(body.dueDate) && !Number.isNaN(Date.parse(body.dueDate))) {
      data.dueDate = body.dueDate;
    } else {
      errors.push('dueDate : date au format AAAA-MM-JJ');
    }
  }
  if (body?.userId !== undefined && body.userId !== null) {
    if (Number.isInteger(body.userId) && body.userId > 0) data.userId = body.userId;
    else errors.push('userId : entier positif');
  }
  if (body?.tags !== undefined) {
    const ok = Array.isArray(body.tags) && body.tags.length <= 10
      && body.tags.every((t) => typeof t === 'string' && t.trim().length > 0 && t.length <= 40);
    if (ok) data.tags = body.tags;
    else errors.push('tags : tableau de 10 textes maximum (40 caractères chacun)');
  }
  if (errors.length > 0) throw new HttpError(422, 'Validation échouée', errors);
  return data;
}

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, 'id invalide');
  return id;
}

function parsePagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 10));
  return { page, limit };
}

module.exports = { validateTask, parseId, parsePagination };
