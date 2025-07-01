const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const {body, validationResult} = require("express-validator");
const { ensureAuthenticated, ensureAdmin } = require("./middleware/auth");
const path = require("path");

const app = express();

const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});


app.use(express.static(path.join(__dirname, "public")));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: "sea-catering-secret",
  resave: false,
  saveUninitialized: false
}));

const authRoutes = require("./auth");
app.use(authRoutes);

const db = new sqlite3.Database("db/database.db", (err) =>{
  if(err) console.error(err.message);
  else console.log("Terhubung ke database SQLite");
});

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

    const userId = req.session?.user?.id || null;
    const {name, phone, plan, meals, days, allergies, totalPrice} = req.body;
    const normalizedName = name.trim().toLowerCase().normalize("NFKC");
    const normalizedPhone = phone.trim();

    const query = `INSERT INTO subscription (userId, name, phone, plan, meals, days, allergies, totalPrice)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      userId,
      normalizedName,
      normalizedPhone,
      plan,
      meals.join(", "),
      days.join(", "),
      allergies,
      totalPrice
    ];


    db.run(query, values, function (err) {
      if(err){
        console.error(err.message);
        res.status(500).json({ success: false });
      }else{
        res.json({ success: true, id: this.lastID });
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

app.get("/mysubscription", ensureAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  db.get(`SELECT * FROM subscription WHERE userId = ? AND status = 'active'`, [userId], (err, row) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, subscription: row });
  });
});

app.post("/pause", ensureAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const {start, end} = req.body;
  db.run(
    `UPDATE subscription
     SET status = 'paused', pauseStart = ?, pauseEnd = ?, updatedAt = CURRENT_TIMESTAMP 
     WHERE userId = ?`,
    [start, end, userId],
    function(err){
      if(err) return res.status(500).json({success: false});
      res.json({ success: true });
    }
  );
});

app.post("/cancel", ensureAuthenticated, (req, res) =>{
  const userId = req.session.user.id;
  db.run(
    `UPDATE subscription 
     SET status = 'cancelled', updatedAt = CURRENT_TIMESTAMP 
     WHERE userId = ?`,
    [userId],
    function(err){
      if(err) return res.status(500).json({success: false});
      res.json({success: true});
    }
  );
});

app.get("/admin/stats", ensureAdmin, (req, res) =>{
  const{start, end} = req.query;

  const stats ={
    newSubscription: 0,
    mrr: 0,
    reactivations: 0,
    totalActive: 0,
    success: true
  };

  const newSubQuery = `SELECT COUNT(*) as count FROM subscription WHERE createdAt BETWEEN ? AND ?`;
  const mrrQuery = `SELECT SUM(totalPrice) as total FROM subscription WHERE status = 'active' AND createdAt BETWEEN ? AND ?`;
  const reactivationQuery = `SELECT COUNT(*) as count FROM subscription WHERE status = 'active' AND updatedAt BETWEEN ? AND ? AND pauseStart IS NOT NULL`;
  const totalActiveQuery = `SELECT COUNT(*) as count FROM subscription WHERE status = 'active'`;

  db.get(newSubQuery, [start, end], (err, row) =>{
    if(err) return res.status(500).json({ success: false });
    stats.newSubscription = row.count;

    db.get(mrrQuery, [start, end], (err, row) =>{
      stats.mrr = row.total || 0;

      db.get(reactivationQuery, [start, end], (err, row) =>{
        stats.reactivations = row.count;

        db.get(totalActiveQuery, [], (err, row) =>{
          stats.totalActive = row.count;
          res.json(stats);
        });
      });
    });
  });
});

app.get("/me", (req, res) =>{
  if(req.session && req.session.user){
    res.json({loggedIn: true, user: req.session.user});
  }else{
    res.json({loggedIn: false });
  }
});