--tabel subscription
CREATE TABLE IF NOT EXISTS subscription(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  name TEXT,
  phone TEXT,
  plan TEXT,
  meals TEXT,
  days TEXT,
  allergies TEXT,
  totalPrice INTEGER,
  status TEXT DEFAULT 'active',
  pauseStart TEXT,
  pauseEnd TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
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