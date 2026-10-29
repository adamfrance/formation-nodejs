// Créer les tables, écrire, relire avec une jointure, voir une validation refusée
const { sequelize, Auteur, Livre } = require('./bibliotheque');

async function main() {
  await sequelize.sync({ force: true });
  const hugo = await Auteur.create({ nom: 'Victor Hugo' });
  await Livre.create({ titre: '  Les Misérables ', auteurId: hugo.id });
  await Livre.create({ titre: 'Notre-Dame de Paris', auteurId: hugo.id });

  const auteur = await Auteur.findByPk(hugo.id, {
    include: [{ model: Livre, as: 'livres' }],
    order: [[{ model: Livre, as: 'livres' }, 'id', 'ASC']],
  });
  console.log(auteur.nom, '->', auteur.livres.map((l) => l.titre));

  try {
    await Auteur.create({ nom: 'X' });
  } catch (err) {
    console.log('Refusé :', err.errors[0].message);
  }
  await sequelize.close();
}

main().catch((err) => { console.error(err.message); process.exit(1); });
