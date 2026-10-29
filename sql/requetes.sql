-- 0. On vide les tables et on remet les compteurs d'identifiants
TRUNCATE tasks, users RESTART IDENTITY CASCADE;

-- 1. Deux utilisateurs
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.org'), ('Bob', 'bob@example.org');

-- 2. Trois lignes dans la table tasks
INSERT INTO tasks (title, user_id) VALUES
  ('Planifier la revue', 1),
  ('Relire le rapport', 1),
  ('Envoyer le planning', 2);

-- 3. Relire le rapport : fait
UPDATE tasks SET done = true WHERE title = 'Relire le rapport';

-- 4. Ce qui n'est pas fait, avec le nom de la personne (jointure)
SELECT tasks.title, users.name
FROM tasks
JOIN users ON users.id = tasks.user_id
WHERE tasks.done = false
ORDER BY tasks.title;

-- 5. Combien de lignes par personne (GROUP BY)
SELECT users.name, count(*) AS nombre
FROM tasks
JOIN users ON users.id = tasks.user_id
GROUP BY users.name
ORDER BY users.name;
