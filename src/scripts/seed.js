const { sequelize, User, Task, Tag } = require('../models');

async function main() {
  await sequelize.sync({ force: true });          // ⚠ efface les données : développement uniquement
  const alice = await User.create({ name: 'Alice', email: 'alice@example.org' });
  const bob = await User.create({ name: 'Bob', email: 'bob@example.org' });
  const [work, home] = await Promise.all(['travail', 'maison'].map((label) => Tag.create({ label })));

  const t1 = await Task.create({ title: 'Préparer la démo', userId: alice.id, dueDate: '2026-11-02' });
  const t2 = await Task.create({ title: 'Faire les courses', userId: bob.id });
  await Task.create({ title: 'Relire le cours Node.js', userId: alice.id, done: true });
  await t1.setTags([work]);
  await t2.setTags([home]);
  console.log('Base initialisée :', await Task.count(), 'tâches');
}

main().catch((err) => { console.error(err); process.exit(1); }).finally(() => sequelize.close());
