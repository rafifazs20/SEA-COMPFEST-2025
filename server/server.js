const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const {body, validationResult} = require("express-validator");
const { ensureAuthenticated, ensureAdmin } = require("./middleware/auth");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: "sea-catering-secret",
  resave: false,
  saveUninitialized: false
}));

const authRoutes = require("./auth");
app.use(authRoutes);

const db = new sqlite3.Database("./database.db", (err) => {
  if(err) console.error(err.message);
  else console.log("Terhubung ke database SQLite");
});

db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT,
  plan TEXT,
  meals TEXT,
  days TEXT,
  allergies TEXT,
  totalPrice INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  message TEXT,
  rating INTEGER
)`);

app.post(
  "/submit",
  body("name").trim().escape(),
  body("phone").trim().escape(),
  body("plan").trim().escape(),
  body("meals").isArray(),
  body("days").isArray(),
  body("allergies").optional().trim().escape(),
  body("totalPrice").isInt(),
  (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({success: false, errors: errors.array()});
    }

    const userId = req.session?.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Login dulu ya." });
    const { name, phone, plan, meals, days, allergies, totalPrice } = req.body;


    const query = `INSERT INTO subscriptions (userId, name, phone, plan, meals, days, allergies, totalPrice)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [userId, name, phone, plan, meals.join(", "), days.join(", "), allergies, totalPrice];


    db.run(query, values, function(err){
      if(err){
        console.error(err.message);
        res.status(500).json({success: false});
      }else{
        res.json({success: true, id: this.lastID});
      }
    });
  }
);

app.post(
  "/testimonials",
  body("name").trim().escape(),
  body("message").trim().escape(),
  body("rating").isInt({ min: 1, max: 5 }),
  (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({success: false, errors: errors.array()});
    }

    const{name, message, rating} = req.body;

    db.run(
      `INSERT INTO testimonials (name, message, rating) VALUES (?, ?, ?)`,
      [name, message, rating],
      function(err){
        if(err){
          console.error(err.message);
          return res.status(500).json({ success: false });
        }
        res.json({ success: true, id: this.lastID });
      }
    );
  }
);


app.get("/testimonials", (req, res) =>{
    db.all("SELECT * FROM testimonials ORDER BY id DESC", (err, rows) =>{
    if(err) return res.status(500).json({success: false});
    res.json(rows);
});
});

app.listen(port, () =>{
  console.log(`Server berjalan di http://localhost:${port}`);
});

app.get("/mysubscription", ensureAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  db.get(`SELECT * FROM subscriptions WHERE userId = ? AND status = 'active'`, [userId], (err, row) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, subscription: row });
  });
});

app.post("/pause", ensureAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const { start, end } = req.body;
  db.run(
    `UPDATE subscriptions SET status = 'paused', pauseStart = ?, pauseEnd = ? WHERE userId = ?`,
    [start, end, userId],
    function (err) {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    }
  );
});

app.post("/cancel", ensureAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  db.run(
    `UPDATE subscriptions SET status = 'cancelled' WHERE userId = ?`,
    [userId],
    function (err) {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    }
  );
});

app.get("/admin/stats", ensureAdmin, (req, res) => {
  const { start, end } = req.query;

  const stats = {
    newSubscriptions: 0,
    mrr: 0,
    reactivations: 0,
    totalActive: 0,
    success: true
  };

  const newSubQuery = `SELECT COUNT(*) as count FROM subscriptions WHERE createdAt BETWEEN ? AND ?`;
  const mrrQuery = `SELECT SUM(totalPrice) as total FROM subscriptions WHERE status = 'active' AND createdAt BETWEEN ? AND ?`;
  const reactivationQuery = `SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active' AND updatedAt BETWEEN ? AND ? AND pauseStart IS NOT NULL`;
  const totalActiveQuery = `SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'`;

  db.get(newSubQuery, [start, end], (err, row) => {
    if (err) return res.status(500).json({ success: false });
    stats.newSubscriptions = row.count;

    db.get(mrrQuery, [start, end], (err, row) => {
      stats.mrr = row.total || 0;

      db.get(reactivationQuery, [start, end], (err, row) => {
        stats.reactivations = row.count;

        db.get(totalActiveQuery, [], (err, row) => {
          stats.totalActive = row.count;
          res.json(stats);
        });
      });
    });
  });
});
