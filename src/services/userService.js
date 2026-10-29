const { sequelize, User, Task } = require('../models');

const toDTO = (u) => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });

// Transaction : l'utilisateur et sa tâche de bienvenue sont créés ensemble ou pas du tout
function register({ name, email }) {
  return sequelize.transaction(async (transaction) => {
    const user = await User.create({ name, email }, { transaction });
    await Task.create({ title: `Bienvenue ${user.name} !`, userId: user.id }, { transaction });
    return toDTO(user);
  });
}

async function findById(id) {
  const user = await User.findByPk(id);
  return user ? toDTO(user) : null;
}

async function tasksOf(userId) {
  const user = await User.findByPk(userId, {
    include: [{ model: Task, as: 'tasks' }],
    order: [[{ model: Task, as: 'tasks' }, 'id', 'ASC']],
  });
  if (!user) return null;
  return user.tasks.map((t) => ({ id: t.id, title: t.title, done: t.done }));
}

module.exports = { register, findById, tasksOf };
