// Driver pg : pool de connexions, requête paramétrée et injection SQL
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_DEMO ?? 'postgres://taskflow:secret@localhost:5432/taskflow_demo',
  max: 5,
});

async function main() {
  await pool.query('TRUNCATE tasks, users RESTART IDENTITY CASCADE');
  await pool.query("INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.org')");
  await pool.query("INSERT INTO tasks (title, user_id) VALUES ('Écrire le cours', 1), ('Relire le cours', 1)");

  const title = process.argv[2] ?? 'Écrire le cours';

  const mauvais = await pool.query(`SELECT id, title FROM tasks WHERE title = '${title}'`);
  console.log('concaténation :', mauvais.rowCount, 'ligne(s)');

  const bon = await pool.query('SELECT id, title FROM tasks WHERE title = $1', [title]);
  console.log('paramétrée    :', bon.rowCount, 'ligne(s)');

  await pool.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
