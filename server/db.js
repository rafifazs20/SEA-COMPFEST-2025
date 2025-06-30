const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const db = new sqlite3.Database("./database.db", (err) =>{
  if(err) return console.error(err.message);
  console.log("Terhubung ke database SQLite");

  const schemaPath = path.join(__dirname, "../db/schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  db.exec(schema, (err) =>{
    if(err) console.error("Gagal inisialisasi schema:", err.message);
    else console.log("Schema berhasil di-load");
  });
});

module.exports = db;