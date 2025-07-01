const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("./db");
const {body, validationResult} = require("express-validator");

router.post("/register", 
  body("email").isEmail(),
  body("phone").isMobilePhone("id-ID"),
  async (req, res) =>{
  const {name, email, password, phone} = req.body;
  const normalizedName = name.trim().toLowerCase().normalize("NFKC");
  const normalizedPhone = phone.trim();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array()});
  }

  if(!name || !email || !password || !phone){
    return res.status(400).json({success: false, message: "Semua kolom wajib diisi."});
  }

  const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if(!pwRegex.test(password)){
    return res.status(400).json({success: false, message: "Password minimal 8 karakter dan mengandung huruf besar, kecil, angka, dan simbol."});
  }

  try{
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, hashedPassword],
      function(err){
        if(err){
          if(err.message.includes("UNIQUE")){
            return res.status(400).json({success: false, message: "Email sudah terdaftar."});
          }
          return res.status(500).json({success: false});          
        }
        const newUserId = this.lastID;
        db.run(
          `UPDATE subscription 
           SET userId = ? 
           WHERE userId IS NULL AND LOWER(name) = ? AND phone = ?`,
          [newUserId, name.toLowerCase(), phone],
          function(err){
            if(err){
              console.error("Gagal update userId di subscription:", err.message);
            }else{
              console.log("Berhasil update subscription dengan userId:", newUserId);
              console.log("Baris yang diperbarui:", this.changes);
            }
            res.json({ success: true, id: newUserId });
          }
        );
      }
    );
  } catch(err){
    console.error(err);
    res.status(500).json({ success: false});
  }
});

router.post("/login", (req, res) =>{
  const {email, password} = req.body;
  if(!email || !password){
    return res.status(400).json({success: false, message: "Email dan password wajib diisi."});
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) =>{
    if(err) return res.status(500).json({success: false});
    if(!user) return res.status(401).json({success: false, message: "Email tidak ditemukan."});

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(401).json({success: false, message: "Password salah."});

    req.session.user = {id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin};
    res.json({success: true});
  });
});

router.post("/logout", (req, res) =>{
  req.session.destroy();
  res.json({success: true});
});

router.get("/me", (req, res) =>{
  if(req.session && req.session.user){
    return res.json({loggedIn: true, user: req.session.user });
  }else{
    return res.json({loggedIn: false });
  }
});

module.exports = router;
