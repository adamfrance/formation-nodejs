// Requêtes Sequelize : le piège du N+1, la jointure, une transaction annulée
const { Op } = require('sequelize');
const { sequelize, Auteur, Livre } = require('./bibliotheque');

let requetes = 0;
const compter = { logging: () => { requetes += 1; } };
const montrer = { logging: (sql) => console.log(sql.replace(/^Executing \([^)]*\): /, 'SQL : ')) };

async function main() {
  await sequelize.sync({ force: true });
  const hugo = await Auteur.create({ nom: 'Victor Hugo' });
  const sand = await Auteur.create({ nom: 'George Sand' });
  await Livre.bulkCreate([
    { titre: 'Les Misérables', auteurId: hugo.id },
    { titre: 'Notre-Dame de Paris', auteurId: hugo.id },
    { titre: 'La Mare au diable', auteurId: sand.id },
  ]);

  requetes = 0;
  const livres = await Livre.findAll(compter);
  for (const livre of livres) await livre.getAuteur(compter);
  console.log('Sans include :', requetes, 'requêtes pour', livres.length, 'livres');

  requetes = 0;
  await Livre.findAll({ include: [{ model: Auteur, as: 'auteur' }], ...compter });
  console.log('Avec include :', requetes, 'requête');

  const trouves = await Livre.findAll({ where: { titre: { [Op.iLike]: '%paris%' } } });
  console.log('Titre contenant « paris » :', trouves.map((l) => l.titre));

  try {
    await sequelize.transaction(montrer, async (transaction) => {
      await Auteur.create({ nom: 'Zoé' }, { transaction, ...montrer });
      throw new Error('échec simulé après la création');
    });
  } catch (err) {
    console.log('Transaction annulée :', err.message);
  }
  console.log('Zoé existe en base ?', Boolean(await Auteur.findOne({ where: { nom: 'Zoé' } })));
  await sequelize.close();
}

main().catch((err) => { console.error(err.message); process.exit(1); });
