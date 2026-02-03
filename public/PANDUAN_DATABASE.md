# Belajar Bahasa Daerah - Panduan Koneksi Database

Website pembelajaran bahasa daerah Indonesia dengan fitur lengkap.

## Panduan Menjalankan di Lokal dengan XAMPP

### 1. Persiapan XAMPP

1. Download dan install [XAMPP](https://www.apachefriends.org/)
2. Jalankan XAMPP Control Panel
3. Start **Apache** dan **MySQL**

### 2. Setup Database

1. Buka browser dan akses `http://localhost/phpmyadmin`
2. Buat database baru dengan nama: `bahasa`
3. Pilih database `bahasa` yang baru dibuat
4. Klik tab **Import**
5. Pilih file `public/belajar_bahasa_daerah.sql`
6. Klik **Go** untuk import

### 3. Setup Backend PHP

1. Copy folder `public/api` ke folder `htdocs` di instalasi XAMPP Anda:
   - Windows: `C:\xampp\htdocs\api`
   - Mac: `/Applications/XAMPP/htdocs/api`
   - Linux: `/opt/lampp/htdocs/api`

2. Edit file `api/config.php` jika diperlukan:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'bahasa');
   define('DB_USER', 'root');       // Sesuaikan jika berbeda
   define('DB_PASS', '');           // Sesuaikan jika ada password
   ```

### 4. Konfigurasi Frontend

1. Buka file `src/lib/api.ts`
2. Sesuaikan `API_BASE_URL`:
   ```typescript
   const API_BASE_URL = 'http://localhost/api';
   ```

### 5. Menjalankan Frontend

1. Install dependencies:
   ```bash
   npm install
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```

3. Buka browser dan akses: `http://localhost:5173`

## Struktur API Endpoints

| Endpoint | Deskripsi |
|----------|-----------|
| `/api/users.php` | Autentikasi & manajemen pengguna |
| `/api/bahasa.php` | CRUD bahasa daerah |
| `/api/materi.php` | CRUD materi pembelajaran |
| `/api/ujian.php` | CRUD ujian & soal |
| `/api/komunitas.php` | Komunitas, diskusi, laporan |
| `/api/umpan-balik.php` | Umpan balik pengguna |
| `/api/progress.php` | Progress belajar |

## Akun Demo

- **Admin**: admin@bahasadaerah.id / admin123
- **Pengguna**: demo@bahasadaerah.id / demo123

## Catatan Penting

- Pastikan Apache dan MySQL di XAMPP sudah berjalan sebelum mengakses website
- Jika mengalami error CORS, pastikan file `config.php` sudah ter-copy dengan benar
- Untuk mode offline/tanpa database, website akan menggunakan mock data dari `src/lib/mockData.ts`

## Beralih dari Mock Data ke Database

Untuk menggunakan database MySQL:
1. Pastikan backend PHP sudah di-setup dengan benar
2. Ubah context/hook untuk menggunakan API service dari `src/lib/api.ts`
3. Ganti fungsi CRUD di `DataContext.tsx` dengan API calls

Contoh:
```typescript
// Sebelum (mock data)
const addMateri = (newMateri) => {
  setMateri([...materi, { ...newMateri, id: Date.now() }]);
};

// Sesudah (API)
const addMateri = async (newMateri) => {
  const result = await materiApi.create(newMateri);
  if (result.success) {
    // Refresh data dari database
    const response = await materiApi.list();
    setMateri(response.data);
  }
};
```
