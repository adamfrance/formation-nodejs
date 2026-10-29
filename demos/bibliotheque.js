// Deux modèles Sequelize et leur association : un auteur a plusieurs livres
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL_DEMO ?? 'postgres://taskflow:secret@localhost:5432/taskflow_demo', {
  logging: false,
});

const Auteur = sequelize.define('Auteur', {
  nom: { type: DataTypes.STRING(80), allowNull: false, validate: { len: [2, 80] } },
}, { tableName: 'auteurs', underscored: true });

const Livre = sequelize.define('Livre', {
  titre: { type: DataTypes.STRING(120), allowNull: false },
}, { tableName: 'livres', underscored: true });

// hook : appelé avant chaque validation d'un livre
Livre.beforeValidate((livre) => {
  if (typeof livre.titre === 'string') livre.titre = livre.titre.trim();
});

Auteur.hasMany(Livre, { foreignKey: 'auteurId', as: 'livres', onDelete: 'CASCADE' });
Livre.belongsTo(Auteur, { foreignKey: 'auteurId', as: 'auteur' });

module.exports = { sequelize, Auteur, Livre };
