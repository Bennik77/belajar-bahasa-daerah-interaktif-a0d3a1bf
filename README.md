# Belajar Bahasa Daerah Interaktif

Platform pembelajaran digital yang dirancang khusus untuk membantu pengguna mempelajari berbagai bahasa daerah di Indonesia (Sunda, Jawa, Bali) melalui materi interaktif, latihan soal, dan forum komunitas.

## ✨ Fitur Utama

- **Kurikulum Terstruktur**: Materi belajar yang dibagi berdasarkan tingkatan bahasa.
- **Ujian Interaktif**: Uji kemampuan bahasa Anda dengan sistem penilaian otomatis.
- **Forum Komunitas**: Berdiskusi dan bertanya jawab dengan sesama pembelajar.
- **Progress Tracking**: Pantau perkembangan belajar Anda melalui dashboard pribadi.
- **Leaderboard**: Lihat peringkat Anda dibandingkan pengguna lainnya.
- **Panel Admin**: Kelola konten materi, soal ujian, dan moderasi forum.

## 🚀 Teknologi yang Digunakan

- **Frontend**: React.js, TypeScript, Vite.
- **Styling**: Tailwind CSS, Shadcn UI.
- **Backend API**: PHP 7.4+ (PDO).
- **Database**: MySQL 8.0.

---

## 🛠️ Panduan Instalasi & Cara Menjalankan

Ikuti langkah-langkah di bawah ini untuk menjalankan project di lingkungan lokal.

### 1. Prasyarat
Sebelum memulai, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (Versi terbaru direkomendasikan)
- [XAMPP](https://www.apachefriends.org/) (Untuk menjalankan Apache & MySQL)

### 2. Setup Database
1. Jalankan **XAMPP Control Panel** dan start **Apache** serta **MySQL**.
2. Buka browser dan akses [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Buat database baru dengan nama: `bahasa`.
4. Pilih database `bahasa` tersebut, lalu klik tab **Import**.
5. Pilih file database yang berada di: `public/belajar_bahasa_daerah.sql`.
6. Klik **Go** (atau Import) untuk memproses.

### 3. Setup Backend (API PHP)
1. Salin folder `public/api` dari project ini.
2. Tempel (Paste) folder tersebut ke dalam direktori `htdocs` XAMPP Anda:
   - **Windows**: `C:\xampp\htdocs\api`
   - **macOS**: `/Applications/XAMPP/htdocs/api`
   - **Linux**: `/opt/lampp/htdocs/api`
3. Konfigurasi Database: Buka file `C:\xampp\htdocs\api\config.php` dan sesuaikan jika perlu:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'bahasa');
   define('DB_USER', 'root');   // Default XAMPP
   define('DB_PASS', '');       // Kosongkan jika tidak ada password
   ```

### 4. Konfigurasi Koneksi Frontend
1. Kembali ke folder project utama.
2. Buka file `src/lib/api.ts`.
3. Pastikan `API_BASE_URL` mengarah ke folder API di XAMPP Anda:
   ```typescript
   const API_BASE_URL = 'http://localhost/api';
   ```

### 5. Menjalankan Frontend
1. Buka terminal di folder project utama.
2. **Install Dependensi**:
   ```bash
   npm install
   ```
3. **Jalankan Project**:
   ```bash
   npm run dev
   ```
4. Buka browser dan akses ke: [http://localhost:8080](http://localhost:8080).

---

## 🔑 Akun Demo
Gunakan akun berikut untuk mencoba fitur-fitur aplikasi:

- **Admin**: `admin@bahasadaerah.id` / `admin123`
- **Pengguna**: `demo@bahasadaerah.id` / `demo123`

## 📡 Struktur API Endpoints
Berikut adalah daftar file logika/API yang digunakan:
- `/api/users.php`: Autentikasi & manajemen pengguna.
- `/api/bahasa.php`: Manajemen data bahasa daerah.
- `/api/materi.php`: Materi pembelajaran.
- `/api/ujian.php`: Soal dan sistem ujian.
- `/api/komunitas.php`: Forum diskusi & laporan.
- `/api/umpan-balik.php`: Feedback pengguna.
- `/api/progress.php`: Pelacakan progres belajar.

## 📝 Catatan Tambahan
- **Mode Mock Data**: Jika database belum siap, aplikasi secara default dapat menggunakan data simulasi dari `src/lib/mockData.ts`.
- **Beralih ke Database**: Untuk menggunakan database sungguhan, pastikan semua langkah setup di atas sudah benar dan hook di `DataContext.tsx` memanggil fungsi dari `src/lib/api.ts`.

---
Dibuat dengan ❤️ untuk melestarikan budaya Indonesia.
