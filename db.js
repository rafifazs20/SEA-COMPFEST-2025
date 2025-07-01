const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbPath = path.resolve(__dirname, "db/database.db");
const schemaPath = path.resolve(__dirname, "db/schema.sql");

const db = new sqlite3.Database(dbPath, (err) =>{
  if (err) return console.error("DB Error:", err.message);
  console.log("Terhubung ke database SQLite");

  if(fs.existsSync(schemaPath)){
    const schema = fs.readFileSync(schemaPath, "utf8");
    db.exec(schema,(err) =>{
      if(err) console.error("Gagal inisialisasi schema:", err.message);
      else console.log("Schema berhasil di-load");
    });
  }else{
    console.warn("File schema.sql tidak ditemukan di:", schemaPath);
  }
});

module.exports = db;