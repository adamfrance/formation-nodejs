-- On repart de tables vides : le fichier peut être relancé
TRUNCATE tasks, users RESTART IDENTITY CASCADE;

-- Create
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.org');
INSERT INTO tasks (title, user_id) VALUES ('Planifier la revue', 1) RETURNING *;

-- Read
SELECT id, title FROM tasks WHERE done = false ORDER BY created_at DESC LIMIT 20;

-- Update
UPDATE tasks SET done = true WHERE id = 1;

-- Delete
DELETE FROM tasks WHERE id = 1;
