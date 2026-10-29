const { Op } = require('sequelize');
const { sequelize, Task, Tag } = require('../models');

const TAG_INCLUDE = { model: Tag, as: 'tags', through: { attributes: [] } };

// Représentation publique d'une tâche (aucune instance Sequelize ne sort du service)
function toDTO(task) {
  return {
    id: task.id,
    title: task.title,
    done: task.done,
    dueDate: task.dueDate,
    userId: task.userId,
    tags: (task.tags ?? []).map((t) => t.label).sort(),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

const escapeLike = (text) => text.replace(/[\\%_]/g, '\\$&');

async function list({ done, q, page = 1, limit = 10 } = {}) {
  const where = {};
  if (done !== undefined) where.done = done;
  if (q) where.title = { [Op.iLike]: `%${escapeLike(q)}%` };

  const { rows, count } = await Task.findAndCountAll({
    where,
    include: [TAG_INCLUDE],
    distinct: true,                     // compte les tâches, pas les lignes de jointure
    order: [['id', 'ASC']],
    limit,
    offset: (page - 1) * limit,
  });
  return { items: rows.map(toDTO), total: count };
}

async function findById(id, options = {}) {
  const task = await Task.findByPk(id, { include: [TAG_INCLUDE], ...options });
  return task ? toDTO(task) : null;
}

async function syncTags(task, labels, transaction) {
  const tags = [];
  for (const label of new Set(labels.map((l) => l.trim().toLowerCase()).filter(Boolean))) {
    const [tag] = await Tag.findOrCreate({ where: { label }, transaction });
    tags.push(tag);
  }
  await task.setTags(tags, { transaction });
}

function create({ title, done, dueDate, userId, tags = [] }) {
  return sequelize.transaction(async (transaction) => {
    const task = await Task.create({ title, done, dueDate, userId }, { transaction });
    await syncTags(task, tags, transaction);
    return findById(task.id, { transaction });
  });
}

function update(id, data) {
  return sequelize.transaction(async (transaction) => {
    const task = await Task.findByPk(id, { transaction });
    if (!task) return null;
    const { tags, ...fields } = data;
    await task.update(fields, { transaction });
    if (tags) await syncTags(task, tags, transaction);
    return findById(id, { transaction });
  });
}

async function remove(id) {
  return (await Task.destroy({ where: { id } })) > 0;
}

module.exports = { list, findById, create, update, remove };
