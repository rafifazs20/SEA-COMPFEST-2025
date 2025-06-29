const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error(err.message);
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

app.post("/submit", (req, res) =>{
  const { name, phone, plan, meals, days, allergies, totalPrice } = req.body;

  const query = `INSERT INTO subscriptions (name, phone, plan, meals, days, allergies, totalPrice)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [name, phone, plan, meals.join(", "), days.join(", "), allergies, totalPrice];

  db.run(query, values, function (err){
    if(err){
      console.error(err.message);
      res.status(500).json({ success: false });
    }else{
      res.json({ success: true, id: this.lastID });
    }
  });
});

app.listen(port, () =>{
  console.log(`Server berjalan di http://localhost:${port}`);
});

db.run(`CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  message TEXT,
  rating INTEGER
)`);

app.post("/testimonials", (req, res) =>{
  const { name, message, rating } = req.body;
  db.run(
    `INSERT INTO testimonials (name, message, rating) VALUES (?, ?, ?)`,
    [name, message, rating],
    function (err){
      if(err){
        console.error(err.message);
        res.status(500).json({ success: false });
      }else{
        res.json({ success: true, id: this.lastID });
      }
    }
  );
});

app.get("/testimonials", (req, res) =>{
  db.all("SELECT * FROM testimonials ORDER BY id DESC", (err, rows) =>{
    if(err) return res.status(500).json({ success: false });
    res.json(rows);
  });
});

