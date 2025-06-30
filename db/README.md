# SEA Catering - Fullstack Web App

SEA Catering adalah sebuah proyek aplikasi web yang dikembangkan sebagai bagian dari program pelatihan Software Engineer Academy. Aplikasi ini menyediakan layanan langganan katering sehat (Healthy Meal Plan Subscription) bagi pengguna, lengkap dengan fitur testimoni, otentikasi pengguna, dashboard pengguna dan admin, serta perlindungan keamanan modern.

---

## 🏗️ Fitur Utama

### 1. Halaman Publik
- **Homepage (`index.html`)**: Berisi pengantar SEA Catering, slogan, dan ajakan untuk berlangganan.
- **Menu (`menu.html`)**: Menampilkan 3 jenis paket katering: Diet, Protein, dan Royal lengkap dengan gambar dan deskripsi.
- **Subscription (`subscription.html`)**: Form untuk pengguna melakukan pemesanan meal plan.
- **Testimonials (`testimonials.html`)**: Form testimoni + carousel review pelanggan.
- **Contact (`contact.html`)**: Info kontak dan alamat perusahaan.

### 2. Autentikasi & Otorisasi
- **Register & Login (`regist.html`, `login.html`)**:
  - Validasi password kompleks
  - Penyimpanan password dengan hashing (bcrypt)
  - Sistem session-based login
- **Role-based access**:
  - Hanya user yang login yang dapat melakukan atau melihat langganan.
  - Admin memiliki akses ke dashboard statistik langganan.

### 3. User Dashboard (`userDash.html`)
- Melihat langganan aktif
- Pause subscription (pilih tanggal mulai & akhir)
- Cancel subscription dengan konfirmasi

### 4. Admin Dashboard (`adminDash.html`)
- Menampilkan statistik:
  - Jumlah langganan baru
  - MRR (Monthly Recurring Revenue)
  - Reactivations
  - Total langganan aktif
- Bisa disaring berdasarkan rentang tanggal

---

## 🔒 Fitur Keamanan

| Fitur                         | Status |
|------------------------------|--------|
| Register/login aman          | ✅     |
| Hashed password (bcrypt)     | ✅     |
| Autentikasi pakai session    | ✅     |
| Authorization role-based     | ✅     |
| Validasi & sanitasi input    | ✅     |
| SQL Injection prevention     | ✅     |
| XSS protection               | ✅     |
| CSRF protection (via session validation) | ✅     |

---

## 🧠 Teknologi yang Digunakan

### Frontend
- HTML5 + CSS3
- JavaScript (vanilla)
- Swiper.js (untuk carousel testimoni)

### Backend
- Node.js + Express.js
- SQLite3 (database ringan & embedded)
- express-session
- bcrypt (hashing password)
- express-validator (validasi & sanitasi input)
- CORS & Body-parser

---

## 🗃️ Struktur Folder
sea-catering/
├── public/
│ ├── index.html
│ ├── login.html
│ ├── regist.html
│ ├── userDash.html
│ ├── adminDash.html
│ ├── subscription.html
│ ├── menu.html
│ ├── testimonials.html
│ ├── contact.html
│ ├── style.css
│ ├── script.js
│ └── assets/ # (gambar menu, logo, dll)
├── server/
│ ├── server.js
│ ├── auth.js
│ ├── db.js
│ └── middleware/
│ └── auth.js
├── db/
│ ├── database.db
│ └── schema.sql
├── package.json
└── README.md


---

## 🧪 Cara Menjalankan Proyek

### 1. Clone repository
```bash
git clone https://github.com/username/sea-catering.git
cd sea-catering
npm install
node server/server.js
Buka browser dan buka:
http://localhost:3000/index.html