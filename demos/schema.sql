CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(80)  NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE
);

CREATE TABLE tasks (
  id         SERIAL PRIMARY KEY,
  title      VARCHAR(120) NOT NULL,
  done       BOOLEAN      NOT NULL DEFAULT false,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_tasks_user ON tasks(user_id);
