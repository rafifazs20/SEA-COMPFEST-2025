--tabel subscription
CREATE TABLE IF NOT EXISTS subscriptions(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT,
  plan TEXT,
  meals TEXT,
  days TEXT,
  allergies TEXT,
  totalPrice INTEGER
);

--tabel testi
CREATE TABLE IF NOT EXISTS testimonials(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  message TEXT,
  rating INTEGER
);

--tabel user
CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  isAdmin INTEGER DEFAULT 0
);

ALTER TABLE subscriptions ADD COLUMN userId INTEGER;

ALTER TABLE subscriptions ADD COLUMN status TEXT DEFAULT 'active';
ALTER TABLE subscriptions ADD COLUMN pauseStart TEXT;
ALTER TABLE subscriptions ADD COLUMN pauseEnd TEXT;
ALTER TABLE subscriptions ADD COLUMN createdAt TEXT DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE subscriptions ADD COLUMN updatedAt TEXT DEFAULT CURRENT_TIMESTAMP;

CREATE TRIGGER IF NOT EXISTS update_subscriptions_updatedAt
AFTER UPDATE ON subscriptions
FOR EACH ROW
BEGIN
  UPDATE subscriptions SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;


