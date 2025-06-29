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
