# SEA Catering - Fullstack Web App

SEA Catering adalah aplikasi web langganan katering sehat yang dibangun sebagai proyek latihan fullstack development. Aplikasi ini memungkinkan pengguna untuk memilih meal plan, mendaftar/melakukan login, memberikan testimoni, dan mengelola langganan. Admin juga dapat melihat statistik langganan melalui dashboard.

---

## 🌐 Link Deploy (Live Demo)

- **Frontend (Vercel)**: [https://sea-catering.vercel.app](https://sea-catering.vercel.app)
- **Backend (Render)**: [https://sea-catering-api.onrender.com](https://sea-catering-api.onrender.com)

---

## 🏗️ Fitur Utama

### Halaman Publik
- **Homepage**: Info pengantar dan ajakan langganan
- **Menu**: 3 paket meal plan (Diet, Protein, Royal)
- **Subscription**: Form pemesanan katering
- **Testimonials**: Carousel ulasan pelanggan & form testimoni
- **Contact**: Info kontak dan lokasi

### Autentikasi & Otorisasi
- **Register/Login** dengan validasi password dan hashing
- **Role-based access**:
  - User biasa: akses langganan dan dashboard user
  - Admin: akses dashboard statistik langganan

### Dashboard User
- Melihat status langganan
- Pause / Cancel subscription

### Dashboard Admin
- Filter statistik berdasarkan tanggal:
  - Langganan Baru
  - Monthly Recurring Revenue (MRR)
  - Reaktivasi
  - Total Langganan Aktif

---

## 🔒 Fitur Keamanan

| Fitur                         | Status |
|------------------------------|--------|
| Validasi register/login      | ✅     |
| Password hashing (bcrypt)    | ✅     |
| Session-based authentication | ✅     |
| Role-based authorization     | ✅     |
| Input validation & sanitasi  | ✅     |
| SQL Injection prevention     | ✅     |
| Basic XSS protection         | ✅     |

---

## 🧠 Teknologi yang Digunakan

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Swiper.js (carousel testimoni)
- Deploy: Railway

### Backend
- Node.js + Express.js
- SQLite3
- express-session
- bcrypt
- express-validator
- CORS, Body-parser
- Deploy: Railway

---


## 🚀 Cara Menjalankan 

## 🛠️ Deployment

### Railway (Direkomendasikan)
1. Yuk, login atau buat akun di [railway.app](https://railway.app).
2. Klik **New Project → Deploy from GitHub**, pilih repo `SEA-COMPFEST-2025`.
3. Tambahkan env vars:
   - `SESSION_SECRET`: string rahasia untuk session.
4. Railway auto build & deploy Express app kamu.
5. Dapat URL publik — langsung buka dan coba!

> 🎯 Note: pastikan `database.db` SQLite berada di folder yang tidak di-clean saat deploy agar data tetap persisten.
