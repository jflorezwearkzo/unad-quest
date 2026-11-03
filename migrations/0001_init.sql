-- Esquema inicial de UNAD Quest (ya aplicado en remoto al crear la base)
CREATE TABLE IF NOT EXISTS progress (email TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at INTEGER NOT NULL);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY, email TEXT NOT NULL, course_id TEXT, title TEXT NOT NULL, details TEXT,
  due TEXT, priority INTEGER DEFAULT 0, done INTEGER DEFAULT 0, deleted INTEGER DEFAULT 0,
  created_at INTEGER, updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS tasks_email_upd ON tasks(email, updated_at);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY, email TEXT NOT NULL, course_id TEXT, title TEXT, body TEXT, ink TEXT,
  deleted INTEGER DEFAULT 0, created_at INTEGER, updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS notes_email_upd ON notes(email, updated_at);
