-- =====================================================
-- DATABASE: bahasa
-- Website Belajar Bahasa Daerah
-- Export untuk phpMyAdmin/XAMPP
-- =====================================================

-- Buat Database
CREATE DATABASE IF NOT EXISTS bahasa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bahasa;

-- =====================================================
-- TABEL: users (Pengguna dan Admin)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('pengguna', 'admin') DEFAULT 'pengguna',
    avatar VARCHAR(255) DEFAULT NULL,
    status ENUM('aktif', 'nonaktif', 'diblokir') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- TABEL: bahasa (Daftar Bahasa Daerah)
-- =====================================================
CREATE TABLE IF NOT EXISTS bahasa_daerah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_bahasa VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    icon VARCHAR(255) DEFAULT NULL,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- TABEL: materi (Materi Pembelajaran)
-- =====================================================
CREATE TABLE IF NOT EXISTS materi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bahasa_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    konten LONGTEXT,
    tipe ENUM('membaca', 'latihan', 'tugas', 'video') DEFAULT 'membaca',
    urutan INT DEFAULT 0,
    durasi_menit INT DEFAULT 10,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bahasa_id) REFERENCES bahasa_daerah(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- TABEL: ujian (Daftar Ujian)
-- =====================================================
CREATE TABLE IF NOT EXISTS ujian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bahasa_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    durasi_menit INT DEFAULT 30,
    passing_grade INT DEFAULT 60,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bahasa_id) REFERENCES bahasa_daerah(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- TABEL: soal_ujian (Soal-soal Ujian)
-- =====================================================
CREATE TABLE IF NOT EXISTS soal_ujian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ujian_id INT NOT NULL,
    pertanyaan TEXT NOT NULL,
    pilihan_a VARCHAR(255) NOT NULL,
    pilihan_b VARCHAR(255) NOT NULL,
    pilihan_c VARCHAR(255) NOT NULL,
    pilihan_d VARCHAR(255) NOT NULL,
    jawaban_benar ENUM('a', 'b', 'c', 'd') NOT NULL,
    urutan INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ujian_id) REFERENCES ujian(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- TABEL: hasil_ujian (Hasil Ujian Pengguna)
-- =====================================================
CREATE TABLE IF NOT EXISTS hasil_ujian (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ujian_id INT NOT NULL,
    nilai INT NOT NULL,
    jumlah_benar INT DEFAULT 0,
    jumlah_soal INT DEFAULT 0,
    status ENUM('lulus', 'tidak_lulus') DEFAULT 'tidak_lulus',
    waktu_selesai INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ujian_id) REFERENCES ujian(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- TABEL: progress_belajar (Progress Pengguna)
-- =====================================================
CREATE TABLE IF NOT EXISTS progress_belajar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    materi_id INT NOT NULL,
    bahasa_id INT NOT NULL,
    status ENUM('belum_mulai', 'sedang_belajar', 'selesai') DEFAULT 'belum_mulai',
    persentase INT DEFAULT 0,
    waktu_belajar INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (materi_id) REFERENCES materi(id) ON DELETE CASCADE,
    FOREIGN KEY (bahasa_id) REFERENCES bahasa_daerah(id) ON DELETE CASCADE,
    UNIQUE KEY unique_progress (user_id, materi_id)
) ENGINE=InnoDB;

-- =====================================================
-- TABEL: komunitas (Forum Diskusi)
-- =====================================================
CREATE TABLE IF NOT EXISTS komunitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bahasa_id INT NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    aturan TEXT,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bahasa_id) REFERENCES bahasa_daerah(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- TABEL: diskusi (Thread Diskusi)
-- =====================================================
CREATE TABLE IF NOT EXISTS diskusi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    komunitas_id INT NOT NULL,
    user_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    konten TEXT NOT NULL,
    status ENUM('aktif', 'ditutup', 'dihapus') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (komunitas_id) REFERENCES komunitas(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- TABEL: komentar_diskusi (Komentar pada Diskusi)
-- =====================================================
CREATE TABLE IF NOT EXISTS komentar_diskusi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    diskusi_id INT NOT NULL,
    user_id INT NOT NULL,
    konten TEXT NOT NULL,
    status ENUM('aktif', 'dihapus') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (diskusi_id) REFERENCES diskusi(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- TABEL: laporan_pelanggaran (Laporan Komunitas)
-- =====================================================
CREATE TABLE IF NOT EXISTS laporan_pelanggaran (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pelapor_id INT NOT NULL,
    terlapor_id INT NOT NULL,
    diskusi_id INT DEFAULT NULL,
    komentar_id INT DEFAULT NULL,
    alasan TEXT NOT NULL,
    status ENUM('menunggu', 'diproses', 'selesai', 'ditolak') DEFAULT 'menunggu',
    tindakan TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pelapor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (terlapor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (diskusi_id) REFERENCES diskusi(id) ON DELETE SET NULL,
    FOREIGN KEY (komentar_id) REFERENCES komentar_diskusi(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- TABEL: umpan_balik (Feedback Pengguna)
-- =====================================================
CREATE TABLE IF NOT EXISTS umpan_balik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    materi_id INT DEFAULT NULL,
    kategori ENUM('materi', 'ujian', 'website', 'lainnya') DEFAULT 'lainnya',
    rating INT DEFAULT 0,
    komentar TEXT NOT NULL,
    status ENUM('menunggu', 'diproses', 'selesai') DEFAULT 'menunggu',
    balasan TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (materi_id) REFERENCES materi(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- DATA AWAL: Admin Default
-- Password: admin123 (harus di-hash di aplikasi)
-- =====================================================
INSERT INTO users (nama, email, password, role, status) VALUES
('Administrator', 'admin@bahasadaerah.id', 'admin123', 'admin', 'aktif'),
('Pengguna Demo', 'demo@bahasadaerah.id', 'demo123', 'pengguna', 'aktif');

-- =====================================================
-- DATA AWAL: Bahasa Daerah
-- =====================================================
INSERT INTO bahasa_daerah (nama_bahasa, deskripsi, status) VALUES
('Bahasa Sunda', 'Bahasa daerah yang digunakan di wilayah Jawa Barat dan Banten. Bahasa Sunda memiliki tingkatan bahasa seperti Sunda halus, sedang, dan kasar.', 'aktif'),
('Bahasa Jawa', 'Bahasa daerah yang digunakan di wilayah Jawa Tengah, Jawa Timur, dan DIY. Memiliki aksara Jawa yang khas.', 'aktif'),
('Bahasa Bali', 'Bahasa daerah masyarakat Bali yang memiliki aksara dan sastra yang kaya.', 'aktif'),
('Bahasa Minang', 'Bahasa daerah masyarakat Minangkabau di Sumatera Barat.', 'aktif');

-- =====================================================
-- DATA AWAL: Materi Bahasa Sunda
-- =====================================================
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES
(1, 'Pengenalan Bahasa Sunda', 'Mengenal dasar-dasar bahasa Sunda dan sejarahnya', 
'<h2>Selamat Datang di Pembelajaran Bahasa Sunda!</h2>
<p>Bahasa Sunda adalah bahasa yang digunakan oleh suku Sunda di Jawa Barat dan Banten. Bahasa ini memiliki beberapa tingkatan:</p>
<ul>
<li><strong>Basa Lemes (Bahasa Halus)</strong> - Digunakan untuk berbicara dengan orang yang lebih tua atau dihormati</li>
<li><strong>Basa Sedeng (Bahasa Sedang)</strong> - Digunakan dalam percakapan sehari-hari</li>
<li><strong>Basa Kasar (Bahasa Kasar)</strong> - Digunakan di antara teman sebaya dalam suasana informal</li>
</ul>
<h3>Sapaan Dasar</h3>
<p>Berikut beberapa sapaan dasar dalam Bahasa Sunda:</p>
<ul>
<li>Wilujeng énjing - Selamat pagi</li>
<li>Wilujeng siang - Selamat siang</li>
<li>Wilujeng sonten - Selamat sore</li>
<li>Wilujeng wengi - Selamat malam</li>
<li>Kumaha damang? - Apa kabar?</li>
<li>Hatur nuhun - Terima kasih</li>
</ul>', 
'membaca', 1, 15),

(1, 'Kosakata Dasar Bahasa Sunda', 'Mempelajari kosakata sehari-hari dalam bahasa Sunda',
'<h2>Kosakata Dasar Bahasa Sunda</h2>
<h3>Angka (Wilangan)</h3>
<ul>
<li>1 - Hiji</li>
<li>2 - Dua</li>
<li>3 - Tilu</li>
<li>4 - Opat</li>
<li>5 - Lima</li>
<li>6 - Genep</li>
<li>7 - Tujuh</li>
<li>8 - Dalapan</li>
<li>9 - Salapan</li>
<li>10 - Sapuluh</li>
</ul>
<h3>Keluarga (Kulawarga)</h3>
<ul>
<li>Bapa - Ayah</li>
<li>Ibu/Ema - Ibu</li>
<li>Lanceuk - Kakak</li>
<li>Adi - Adik</li>
<li>Aki - Kakek</li>
<li>Nini - Nenek</li>
</ul>',
'membaca', 2, 20),

(1, 'Latihan Percakapan Sunda', 'Berlatih percakapan sederhana dalam bahasa Sunda',
'<h2>Latihan Percakapan</h2>
<h3>Percakapan 1: Perkenalan</h3>
<p><strong>A:</strong> Wilujeng énjing, nami abdi Siti. Nami anjeun saha?</p>
<p><em>(Selamat pagi, nama saya Siti. Nama kamu siapa?)</em></p>
<p><strong>B:</strong> Wilujeng énjing, nami abdi Budi.</p>
<p><em>(Selamat pagi, nama saya Budi.)</em></p>
<p><strong>A:</strong> Resep tepang sareng anjeun.</p>
<p><em>(Senang bertemu dengan kamu.)</em></p>

<h3>Percakapan 2: Di Pasar</h3>
<p><strong>Pembeli:</strong> Ieu téh sabaraha hargana?</p>
<p><em>(Ini berapa harganya?)</em></p>
<p><strong>Penjual:</strong> Dua puluh rébu rupiah.</p>
<p><em>(Dua puluh ribu rupiah.)</em></p>
<p><strong>Pembeli:</strong> Tiasa ditawar?</p>
<p><em>(Bisa ditawar?)</em></p>',
'latihan', 3, 25),

(1, 'Tugas: Menulis Kalimat Sunda', 'Membuat kalimat sederhana dalam bahasa Sunda',
'<h2>Tugas Pembelajaran</h2>
<p>Setelah mempelajari materi-materi sebelumnya, sekarang waktunya kamu berlatih!</p>
<h3>Instruksi:</h3>
<ol>
<li>Buatlah 5 kalimat perkenalan diri dalam bahasa Sunda</li>
<li>Tuliskan percakapan singkat antara 2 orang dalam bahasa Sunda</li>
<li>Terjemahkan kalimat berikut ke bahasa Sunda:
<ul>
<li>Saya pergi ke sekolah</li>
<li>Ibu memasak di dapur</li>
<li>Kami bermain di taman</li>
</ul>
</li>
</ol>
<p>Selamat mengerjakan!</p>',
'tugas', 4, 30);

-- =====================================================
-- DATA AWAL: Ujian Bahasa Sunda
-- =====================================================
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES
(1, 'Ujian Dasar Bahasa Sunda', 'Menguji pemahaman dasar bahasa Sunda', 30, 60),
(1, 'Ujian Kosakata Sunda', 'Menguji penguasaan kosakata bahasa Sunda', 20, 70);

-- =====================================================
-- DATA AWAL: Soal Ujian
-- =====================================================
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES
(1, 'Apa arti "Wilujeng énjing" dalam bahasa Indonesia?', 'Selamat siang', 'Selamat pagi', 'Selamat sore', 'Selamat malam', 'b', 1),
(1, 'Bagaimana cara mengatakan "Terima kasih" dalam bahasa Sunda?', 'Punten', 'Hatur nuhun', 'Hampura', 'Wilujeng', 'b', 2),
(1, 'Angka 5 dalam bahasa Sunda adalah...', 'Hiji', 'Dua', 'Lima', 'Opat', 'c', 3),
(1, 'Apa arti kata "Bapa" dalam bahasa Sunda?', 'Ibu', 'Kakak', 'Ayah', 'Adik', 'c', 4),
(1, '"Kumaha damang?" artinya adalah...', 'Mau ke mana?', 'Apa kabar?', 'Siapa namamu?', 'Dari mana?', 'b', 5),
(2, 'Angka 7 dalam bahasa Sunda adalah...', 'Tujuh', 'Genep', 'Dalapan', 'Salapan', 'a', 1),
(2, 'Apa bahasa Sunda dari "Kakek"?', 'Nini', 'Aki', 'Bapa', 'Ema', 'b', 2),
(2, '"Lanceuk" artinya adalah...', 'Adik', 'Kakak', 'Paman', 'Bibi', 'b', 3),
(2, 'Bagaimana mengatakan "Selamat malam" dalam bahasa Sunda?', 'Wilujeng énjing', 'Wilujeng siang', 'Wilujeng sonten', 'Wilujeng wengi', 'd', 4),
(2, 'Angka 10 dalam bahasa Sunda adalah...', 'Salapan', 'Sapuluh', 'Sawelas', 'Dua welas', 'b', 5);

-- =====================================================
-- DATA AWAL: Komunitas
-- =====================================================
INSERT INTO komunitas (bahasa_id, nama, deskripsi, aturan) VALUES
(1, 'Komunitas Belajar Sunda', 'Tempat diskusi dan berbagi pengalaman belajar bahasa Sunda', 
'1. Gunakan bahasa yang sopan
2. Jangan melakukan spam
3. Saling membantu sesama pelajar
4. Dilarang promosi produk
5. Hormati perbedaan pendapat');

-- =====================================================
-- INDEXING untuk performa
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_materi_bahasa ON materi(bahasa_id);
CREATE INDEX idx_ujian_bahasa ON ujian(bahasa_id);
CREATE INDEX idx_progress_user ON progress_belajar(user_id);
CREATE INDEX idx_diskusi_komunitas ON diskusi(komunitas_id);
CREATE INDEX idx_umpan_balik_status ON umpan_balik(status);
CREATE INDEX idx_laporan_status ON laporan_pelanggaran(status);

-- =====================================================
-- SELESAI
-- Import file ini ke phpMyAdmin untuk membuat database
-- =====================================================
