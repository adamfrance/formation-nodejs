// Quelques requêtes Sequelize : filtre, jointure, transaction annulée
const { Op } = require('sequelize');
const { sequelize, User, Task, Tag } = require('../models');

async function main() {
  const ouvertes = await Task.count({ where: { done: false } });
  console.log('tâches ouvertes :', ouvertes);

  const taches = await Task.findAll({
    where: { title: { [Op.iLike]: '%cours%' } },
    include: [
      { model: User, as: 'owner', attributes: ['name'] },
      { model: Tag, as: 'tags', through: { attributes: [] } },
    ],
  });
  console.log(taches.map((t) => `${t.title} (par ${t.owner?.name ?? '?'})`));

  // Transaction : tout ou rien
  try {
    await sequelize.transaction(async (transaction) => {
      await User.create({ name: 'Zoé', email: 'zoe@example.org' }, { transaction });
      throw new Error('échec simulé après la création');
    });
  } catch (err) {
    console.log('transaction annulée :', err.message);
  }
  console.log('Zoé existe en base ?', Boolean(await User.findOne({ where: { email: 'zoe@example.org' } })));
}

main().catch((err) => { console.error(err); process.exit(1); }).finally(() => sequelize.close());
