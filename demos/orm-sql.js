// Sequelize : on décrit une table, il écrit le SQL et envoie les valeurs à part
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL_DEMO ?? 'postgres://taskflow:secret@localhost:5432/taskflow_demo', {
  logging: false,
});

const Note = sequelize.define('Note', {
  text: { type: DataTypes.STRING(80), allowNull: false },
}, { tableName: 'notes', timestamps: false });

// affiche le SQL envoyé à la base
const montrer = { logging: (sql) => console.log(sql.replace(/^Executing \([^)]*\): /, 'SQL : ')) };

async function main() {
  await Note.sync({ force: true });
  await Note.create({ text: 'Acheter du pain' }, montrer);
  const notes = await Note.findAll({ where: { text: "x' OR '1'='1" }, ...montrer });
  console.log('Notes trouvées :', notes.length);
  await sequelize.close();
}

main().catch((err) => { console.error(err.message); process.exit(1); });
