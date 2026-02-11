-- =====================================================
-- DATABASE: bahasa
-- Website Belajar Bahasa Daerah
-- Export untuk phpMyAdmin/XAMPP
-- Updated with TRULY MASSIVE Data
-- Strategy: Individual INSERTS for maximum volume & clarity
-- =====================================================

CREATE DATABASE IF NOT EXISTS bahasa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bahasa;

-- =====================================================
-- TABLE STRUCTURES
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

CREATE TABLE IF NOT EXISTS bahasa_daerah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_bahasa VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    icon VARCHAR(255) DEFAULT NULL,
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

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

CREATE TABLE IF NOT EXISTS flashcard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bahasa_id INT NOT NULL,
    kata_daerah VARCHAR(255) NOT NULL,
    kata_indonesia VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) DEFAULT 'Umum',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bahasa_id) REFERENCES bahasa_daerah(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS kamus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bahasa_id INT NOT NULL,
    kata_daerah VARCHAR(255) NOT NULL,
    kata_indonesia VARCHAR(255) NOT NULL,
    contoh_kalimat TEXT DEFAULT NULL,
    kategori VARCHAR(100) DEFAULT 'Umum',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bahasa_id) REFERENCES bahasa_daerah(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- =====================================================
-- DATA: USERS & BAHASA
-- =====================================================
INSERT INTO users (nama, email, password, role, status) VALUES ('Administrator', 'admin@bahasadaerah.id', 'admin123', 'admin', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Budi Santoso', 'budi@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Siti Aminah', 'siti@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Made Wijaya', 'made@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Rina Minang', 'rina@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Asep Sunarya', 'asep@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Dewi Lestari', 'dewi@demo.com', 'demo123', 'pengguna', 'nonaktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Joko Widodo', 'joko@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Ni Luh Putu', 'niluh@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Ujang Komarudin', 'ujang@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Sutan Sjahrir', 'sutan@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Butet Kertaradjasa', 'butet@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Happy Salma', 'happy@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('User Baru 1', 'user1@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('User Baru 2', 'user2@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Spammer', 'spam@bad.com', 'bad123', 'pengguna', 'diblokir');

INSERT INTO bahasa_daerah (nama_bahasa, deskripsi, icon, status) VALUES ('Bahasa Sunda', 'Bahasa daerah yang digunakan di wilayah Jawa Barat dan Banten.', '🎻', 'aktif');
INSERT INTO bahasa_daerah (nama_bahasa, deskripsi, icon, status) VALUES ('Bahasa Jawa', 'Bahasa daerah yang digunakan di Jawa Tengah, Jawa Timur, dan DIY.', '🎭', 'aktif');
INSERT INTO bahasa_daerah (nama_bahasa, deskripsi, icon, status) VALUES ('Bahasa Bali', 'Bahasa daerah masyarakat Bali yang kaya akan budaya dan sastra.', '⛩️', 'aktif');
INSERT INTO bahasa_daerah (nama_bahasa, deskripsi, icon, status) VALUES ('Bahasa Minang', 'Bahasa daerah masyarakat Minangkabau di Sumatera Barat.', '🏠', 'aktif');

-- =====================================================
-- DATA: MATERIALS (ALL ROUNDS)
-- =====================================================
-- SUNDA
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (1, 'Pengenalan Bahasa Sunda', 'Dasar-dasar', '<h2>Wilujeng Sumping</h2><p>Diajar basa Sunda.</p>', 'membaca', 1, 15);
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (1, 'Kosakata Dasar', 'Sehari-hari', '<h2>Kosakata</h2><p>Abdi (Saya), Anjeun (Kamu).</p>', 'membaca', 2, 20);
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (1, 'Paribasa Sunda', 'Peribahasa', '<h2>Paribasa</h2><p>Cikaracak ninggang batu.</p>', 'membaca', 3, 25);
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (1, 'Pupuh Sunda', 'Seni Suara (Intermediate)', '<h2>Pupuh</h2><p>Mengenal 17 Pupuh: Kinanti, Sinom, jsb.</p>', 'membaca', 4, 30);
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (1, 'Cerita Rakyat: Lutung Kasarung', 'Folklore (Round 3)', '<h2>Lutung Kasarung</h2><p>Kisah Purbasari.</p>', 'membaca', 5, 35);
-- JAWA
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (2, 'Unggah-Ungguh Basa', 'Tata krama', '<h2>Unggah-Ungguh</h2><p>Ngoko & Krama.</p>', 'membaca', 1, 15);
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (2, 'Aksara Jawa', 'Hanacaraka', '<h2>Aksara</h2><p>Ha Na Ca Ra Ka.</p>', 'membaca', 2, 25);
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (2, 'Filosofi Asta Brata', 'Kepemimpinan', '<h2>Asta Brata</h2><p>Filosofi alam.</p>', 'membaca', 3, 30);
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (2, 'Tokoh Wayang', 'Budaya (Intermediate)', '<h2>Pandawa Lima</h2><p>Yudhistira, Bima, Arjuna, Nakula, Sadewa.</p>', 'membaca', 4, 30);
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (2, 'Cerita Rakyat: Timun Mas', 'Folklore (Round 3)', '<h2>Timun Mas</h2><p>Kisah raksasa.</p>', 'membaca', 5, 35);
-- BALI
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (3, 'Sapaan Bali', 'Basics', '<h2>Om Swastiastu</h2><p>Salam.</p>', 'membaca', 1, 10);
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (3, 'Subak', 'Budaya', '<h2>Subak</h2><p>Irigasi.</p>', 'membaca', 2, 15);
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (3, 'Cerita Rakyat: Calonarang', 'Folklore (Round 3)', '<h2>Calonarang</h2><p>Rangda.</p>', 'membaca', 3, 30);
-- MINANG
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (4, 'Kato Nan Ampek', 'Etika', '<h2>Etika</h2><p>Mandaki, Manurun.</p>', 'membaca', 1, 20);
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (4, 'Filosofi Rendang', 'Budaya', '<h2>Rendang</h2><p>Musyawarah.</p>', 'membaca', 2, 25);
INSERT INTO materi (bahasa_id, judul, deskripsi, konten, tipe, urutan, durasi_menit) VALUES (4, 'Cerita Rakyat: Malin Kundang', 'Folklore (Round 3)', '<h2>Malin Kundang</h2><p>Batu.</p>', 'membaca', 3, 30);

-- =====================================================
-- DATA: UJIAN & SOAL (ALL ROUNDS)
-- =====================================================
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES (1, 'Evaluasi Dasar', 'Tes Basic', 30, 65);
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES (1, 'Kuis Paribasa', 'Tes Intermediate', 20, 70);
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES (1, 'Pemahaman Bacaan', 'Tes Advanced (Folklore)', 20, 70);
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES (2, 'Kuis Aksara', 'Tes Basic', 20, 70);
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES (2, 'Kuis Wayang', 'Tes Intermediate', 25, 75);
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES (2, 'Timun Mas', 'Tes Advanced (Folklore)', 25, 75);
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES (3, 'Sapaan Bali', 'Tes Basic', 15, 60);
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES (4, 'Budaya Minang', 'Tes Basic', 15, 60);

-- DATA: ADDITIONAL EXAMS (UTS)
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES (1, 'Ujian Tengah Semester Sunda', 'Tes komprehensif level basic-intermediate.', 45, 75);
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES (2, 'Ujian Tengah Semester Jawa', 'Tes komprehensif materi aksara lan unggah-ungguh.', 45, 75);
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES (3, 'Ujian Tengah Semester Bali', 'Ujian tengah materi sapaan lan budaya subak.', 40, 70);
INSERT INTO ujian (bahasa_id, judul, deskripsi, durasi_menit, passing_grade) VALUES (4, 'Ujian Tengah Semester Minang', 'Ujian materi Kato nan Ampek lan Budaya.', 40, 70);

INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (1, 'Arti "Wilujeng"?', 'Selamat', 'Halo', 'Apa kabar', 'Pergi', 'a', 1);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (2, 'Arti "Cikaracak"?', 'Air menetes', 'Batu', 'Sungai', 'Hujan', 'a', 1);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (3, 'Siapa kakak Purbasari?', 'Purbararang', 'Dayang Sumbi', 'Roro Kidul', 'Kabayan', 'a', 1);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (4, 'Huruf pertama Hanacaraka?', 'Ha', 'Na', 'Ca', 'Ra', 'a', 1);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (5, 'Anak tertua Pandawa?', 'Yudhistira', 'Bima', 'Arjuna', 'Nakula', 'a', 1);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (6, 'Musuh Timun Mas?', 'Buto Ijo', 'Gendruwo', 'Wewe', 'Banaspati', 'a', 1);

-- =====================================================
-- DATA: ADMIN & PROGRESS
-- =====================================================
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status, balasan) VALUES (2, 1, 'materi', 5, 'Mantap!', 'selesai', 'Makasih!');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status, balasan) VALUES (3, 3, 'website', 4, 'Oke.', 'menunggu', NULL);
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status, balasan) VALUES (4, 2, 'ujian', 3, 'Susah.', 'diproses', 'Dicek.');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status, balasan) VALUES (5, NULL, 'lainnya', 5, 'Keren.', 'selesai', 'Sip.');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status, balasan) VALUES (6, 4, 'materi', 2, 'Error.', 'menunggu', NULL);

INSERT INTO laporan_pelanggaran (pelapor_id, terlapor_id, alasan, status, tindakan) VALUES (2, 14, 'Spam.', 'selesai', 'Blokir');
INSERT INTO laporan_pelanggaran (pelapor_id, terlapor_id, alasan, status, tindakan) VALUES (3, 14, 'Kasar.', 'menunggu', NULL);
INSERT INTO laporan_pelanggaran (pelapor_id, terlapor_id, alasan, status, tindakan) VALUES (5, 6, 'OOT.', 'ditolak', 'Aman');
INSERT INTO laporan_pelanggaran (pelapor_id, terlapor_id, alasan, status, tindakan) VALUES (10, 14, 'SARA.', 'diproses', 'Peringatan');
INSERT INTO laporan_pelanggaran (pelapor_id, terlapor_id, alasan, status, tindakan) VALUES (8, 6, 'Trolling.', 'menunggu', NULL);
INSERT INTO laporan_pelanggaran (pelapor_id, terlapor_id, alasan, status, tindakan) VALUES (2, 15, 'Akun palsu.', 'menunggu', NULL);
INSERT INTO laporan_pelanggaran (pelapor_id, terlapor_id, alasan, status, tindakan) VALUES (4, 14, 'Komentar tidak layak.', 'selesai', 'Hapus Komentar');

INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (2, 1, 1, 'selesai', 100, 15);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (2, 2, 1, 'sedang_belajar', 50, 10);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (3, 1, 1, 'selesai', 100, 20);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (4, 5, 2, 'sedang_belajar', 20, 5);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (5, 12, 4, 'selesai', 100, 25);

INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (2, 1, 80, 4, 5, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (3, 1, 40, 2, 5, 'tidak_lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (5, 6, 100, 5, 5, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (6, 1, 90, 9, 10, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (8, 4, 75, 15, 20, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (9, 9, 85, 17, 20, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (10, 10, 60, 12, 20, 'tidak_lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (2, 9, 95, 19, 20, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (3, 9, 30, 6, 20, 'tidak_lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (4, 11, 80, 16, 20, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (11, 12, 85, 17, 20, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (12, 1, 70, 7, 10, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (13, 11, 90, 18, 20, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (5, 2, 100, 10, 10, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (2, 10, 80, 16, 20, 'lulus');

-- =====================================================
-- MERGED DICTIONARY (ALL CATEGORIES FROM ROUND 2-4 + NEW)
-- =====================================================
-- Categories: Sapaan, Keluarga, Hewan, Buah/Sayur, Sekolah, Dapur,
-- Adat, Tubuh, Sifat, Pakaian, Emosi, Transportasi, Arah, Profesi,
-- Kesehatan, Olahraga, Alat, Kerja.
-- =====================================================
-- 1. UMUM (Sapaan/Basics)
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Wilujeng', 'Selamat', 'Wilujeng tepang.', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Punten', 'Permisi', 'Punten.', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Sampurasun', 'Salam', 'Sampurasun sadayana.', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Rampes', 'Jawab Salam', 'Rampes.', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Kumaha', 'Bagaimana', 'Kumaha damang?', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Sugeng', 'Selamat', 'Sugeng rawuh.', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Nuwun', 'Permisi', 'Nuwun sewu.', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Monggo', 'Silakan', 'Monggo pinarak.', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Piye', 'Gimana', 'Piye kabare?', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Rahajeng', 'Selamat', 'Rahajeng.', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Suksema', 'Makasih', 'Suksema.', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Kenken', 'Gimana', 'Kenken kabare?', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Assalamualaikum', 'Salam', 'Salam.', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Tarimo kasih', 'Makasih', 'Ok.', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Apo', 'Apa', 'Apo kabar?', 'Sapaan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Onde', 'Aduh', 'Onde mande.', 'Sapaan');

-- 2. KELUARGA
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Bapa', 'Bapak', 'Bapa.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Indung', 'Ibu', 'Indung.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Lanceuk', 'Kakak', 'Lanceuk abdi.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Adi', 'Adik', 'Adi abdi.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Bapak', 'Bapak', 'Bapak.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Simbok', 'Ibu', 'Simbok.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Kakang', 'Kakak', 'Kakang.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Adhi', 'Adik', 'Adhi.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Bapa', 'Bapak', 'Bapa.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Meme', 'Ibu', 'Meme.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Beli', 'Kakak L', 'Beli.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Mbok', 'Kakak P', 'Mbok.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Apak', 'Bapak', 'Apak.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Amak', 'Ibu', 'Amak.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Uda', 'Kakak', 'Uda.', 'Keluarga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Uni', 'Kakak', 'Uni.', 'Keluarga');

-- 3. HEWAN
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Maung', 'Harimau', 'Maung.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Ucing', 'Kucing', 'Ucing.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Monyet', 'Monyet', 'Monyet.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Hayam', 'Ayam', 'Hayam.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Macan', 'Harimau', 'Macan.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Kucing', 'Kucing', 'Kucing.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Pitik', 'Ayam', 'Pitik.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Wedhus', 'Kambing', 'Wedhus.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Macan', 'Harimau', 'Macan.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Meong', 'Kucing', 'Meong.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Siap', 'Ayam', 'Siap.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Inyiak', 'Harimau', 'Inyiak.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Kuciang', 'Kucing', 'Kuciang.', 'Hewan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Ayam', 'Ayam', 'Ayam.', 'Hewan');

-- 4. BUAH & SAYUR
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Cau', 'Pisang', 'Cau.', 'Buah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Bonteng', 'Timun', 'Bonteng.', 'Sayur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Peuteuy', 'Pete', 'Peuteuy.', 'Sayur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Jengkol', 'Jengkol', 'Jengkol.', 'Sayur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Gedhang', 'Pisang', 'Gedhang.', 'Buah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Timun', 'Timun', 'Timun.', 'Sayur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Kates', 'Pepaya', 'Kates.', 'Buah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Biu', 'Pisang', 'Biu.', 'Buah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Timun', 'Timun', 'Timun.', 'Sayur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Gedang', 'Pepaya', 'Gedang.', 'Buah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Pisang', 'Pisang', 'Pisang.', 'Buah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Timun', 'Timun', 'Timun.', 'Sayur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Batik', 'Pepaya', 'Batik.', 'Buah');

-- 5. SEKOLAH & ALAT TULIS
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Sakola', 'Sekolah', 'Sakola.', 'Sekolah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Patlot', 'Pensil', 'Patlot.', 'Sekolah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Buku', 'Buku', 'Buku.', 'Sekolah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Meja', 'Meja', 'Meja.', 'Sekolah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Sekolah', 'Sekolah', 'Sekolah.', 'Sekolah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Potlot', 'Pensil', 'Potlot.', 'Sekolah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Buku', 'Buku', 'Buku.', 'Sekolah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Sekolah', 'Sekolah', 'Sekolah.', 'Sekolah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Potlot', 'Pensil', 'Potlot.', 'Sekolah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Cakepan', 'Buku', 'Cakepan.', 'Sekolah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Sakola', 'Sekolah', 'Sakola.', 'Sekolah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Pena', 'Pena', 'Pena.', 'Sekolah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Buku', 'Buku', 'Buku.', 'Sekolah');

-- 6. DAPUR & PERABOTAN
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Hawu', 'Tungku', 'Hawu.', 'Dapur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Kasur', 'Kasur', 'Kasur.', 'Perabotan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Kompor', 'Kompor', 'Kompor.', 'Dapur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Lomari', 'Lemari', 'Lomari.', 'Perabotan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Pawon', 'Dapur', 'Pawon.', 'Dapur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Amben', 'Tempat Tidur', 'Amben.', 'Perabotan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Wajan', 'Wajan', 'Wajan.', 'Dapur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Lemari', 'Lemari', 'Lemari.', 'Perabotan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Paon', 'Dapur', 'Paon.', 'Dapur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Sakenem', 'Bale', 'Sakenem.', 'Perabotan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Payuk', 'Periuk', 'Payuk.', 'Dapur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Dapua', 'Dapur', 'Dapua.', 'Dapur');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Kasua', 'Kasur', 'Kasua.', 'Perabotan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Kuali', 'Kuali', 'Kuali.', 'Dapur');

-- 7. ADAT, BUDAYA, PAKAIAN
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Wayang', 'Wayang', 'Wayang.', 'Adat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Kabaya', 'Kebaya', 'Kabaya.', 'Pakaian');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Gamelan', 'Gamelan', 'Gamelan.', 'Adat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Samping', 'Sarung', 'Samping.', 'Pakaian');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Keris', 'Keris', 'Keris.', 'Adat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Blangkon', 'Topi', 'Blangkon.', 'Pakaian');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Batik', 'Batik', 'Batik.', 'Adat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Jarik', 'Kain', 'Jarik.', 'Pakaian');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Canang', 'Sesajen', 'Canang.', 'Adat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Udeng', 'Ikat Kepala', 'Udeng.', 'Pakaian');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Pura', 'Kuil', 'Pura.', 'Adat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Kamben', 'Sarung', 'Kamben.', 'Pakaian');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Rendang', 'Masakan', 'Rendang.', 'Adat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Deta', 'Ikat Kepala', 'Deta.', 'Pakaian');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Songket', 'Kain', 'Songket.', 'Adat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Baju', 'Baju', 'Baju.', 'Pakaian');

-- 8. TUBUH & KESEHATAN (New)
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Hulu', 'Kepala', 'Hulu.', 'Tubuh');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Nyeri', 'Sakit', 'Nyeri.', 'Kesehatan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Ubar', 'Obat', 'Ubar.', 'Kesehatan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Panon', 'Mata', 'Panon.', 'Tubuh');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Sirah', 'Kepala', 'Sirah.', 'Tubuh');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Lara', 'Sakit', 'Lara.', 'Kesehatan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Jamu', 'Obat', 'Jamu.', 'Kesehatan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Mripat', 'Mata', 'Mripat.', 'Tubuh');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Sirah', 'Kepala', 'Sirah.', 'Tubuh');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Sakit', 'Sakit', 'Sakit.', 'Kesehatan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Ubad', 'Obat', 'Ubad.', 'Kesehatan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Mata', 'Mata', 'Mata.', 'Tubuh');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Kapalo', 'Kepala', 'Kapalo.', 'Tubuh');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Sakik', 'Sakit', 'Sakik.', 'Kesehatan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Ubaya', 'Obat', 'Ubaya.', 'Kesehatan');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Mato', 'Mata', 'Mato.', 'Tubuh');

-- 9. SIFAT & EMOSI
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Bageur', 'Baik', 'Bageur.', 'Sifat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Bungah', 'Senang', 'Bungah.', 'Emosi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Jahat', 'Jahat', 'Jahat.', 'Sifat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Sedih', 'Sedih', 'Sedih.', 'Emosi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Apik', 'Baik', 'Apik.', 'Sifat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Seneng', 'Senang', 'Seneng.', 'Emosi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Elek', 'Jelek', 'Elek.', 'Sifat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Susah', 'Sedih', 'Susah.', 'Emosi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Melah', 'Baik', 'Melah.', 'Sifat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Demen', 'Senang', 'Demen.', 'Emosi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Jelek', 'Buruk', 'Jelek.', 'Sifat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Pedih', 'Marah', 'Pedih.', 'Emosi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Baiak', 'Baik', 'Baiak.', 'Sifat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Sanang', 'Senang', 'Sanang.', 'Emosi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Jahek', 'Jahat', 'Jahek.', 'Sifat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Sadih', 'Sedih', 'Sadih.', 'Emosi');

-- 10. TRANSPORTASI & ARAH (New from Phase 4/Round 2)
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Mobil', 'Mobil', 'Mobil.', 'Transportasi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Kenca', 'Kiri', 'Kenca.', 'Arah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Katuhu', 'Kanan', 'Katuhu.', 'Arah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Motor', 'Motor', 'Motor.', 'Transportasi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Meja', 'Mobil', 'Mobil.', 'Transportasi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Kiwa', 'Kiri', 'Kiwa.', 'Arah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Tengen', 'Kanan', 'Tengen.', 'Arah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Sepur', 'Kereta', 'Sepur.', 'Transportasi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Mobil', 'Mobil', 'Mobil.', 'Transportasi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Boten', 'Kiri', 'Boten.', 'Arah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Tengen', 'Kanan', 'Tengen.', 'Arah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Montor', 'Motor', 'Montor.', 'Transportasi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Otto', 'Mobil', 'Otto.', 'Transportasi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Kiri', 'Kiri', 'Kiri.', 'Arah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Kanan', 'Kanan', 'Kanan.', 'Arah');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Kapal', 'Pesawat', 'Kapal.', 'Transportasi');

-- 11. PROFESI & KERJA (New from Phase 4/Round 2)
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Tani', 'Petani', 'Bapa tani.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Padagang', 'Pedagang', 'Padagang.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Dokter', 'Dokter', 'Dokter.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Pulisi', 'Polisi', 'Pulisi.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Tani', 'Petani', 'Pak tani.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Bakul', 'Pedagang', 'Bakul.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Mantri', 'Perawat', 'Mantri.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Sopir', 'Supir', 'Sopir.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Tani', 'Petani', 'Tani.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Dagang', 'Pedagang', 'Dagang.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Balian', 'Dukun', 'Balian.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Undagi', 'Tukang', 'Undagi.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Tani', 'Petani', 'Tani.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Panggaleh', 'Pedagang', 'Panggaleh.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Datuak', 'Tetua', 'Datuak.', 'Profesi');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Cadiak', 'Cendekiawan', 'Cadiak.', 'Profesi');

-- 12. ALAT & OLAHRAGA (New from Phase 5)
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Pacul', 'Cangkul', 'Pacul.', 'Alat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Maen Bola', 'Main Bola', 'Maen.', 'Olahraga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Bedog', 'Golok', 'Bedog.', 'Alat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (1, 'Lari', 'Lari', 'Lari.', 'Olahraga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Pacul', 'Cangkul', 'Pacul.', 'Alat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Bal-balan', 'Sepak Bola', 'Bal-balan.', 'Olahraga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Arit', 'Sabit', 'Arit.', 'Alat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (2, 'Mlayu', 'Lari', 'Mlayu.', 'Olahraga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Pacul', 'Cangkul', 'Pacul.', 'Alat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Mebola', 'Main Bola', 'Mebola.', 'Olahraga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Tiuk', 'Pisau', 'Tiuk.', 'Alat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (3, 'Melaib', 'Lari', 'Melaib.', 'Olahraga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Cangkua', 'Cangkul', 'Cangkua.', 'Alat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Main Bola', 'Main Bola', 'Main.', 'Olahraga');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Parang', 'Parang', 'Parang.', 'Alat');
INSERT INTO kamus (bahasa_id, kata_daerah, kata_indonesia, contoh_kalimat, kategori) VALUES (4, 'Lari', 'Lari', 'Lari.', 'Olahraga');

-- DATA: FLASHCARDS (Auto-generated from Kamus - FULL SYNC)
-- =====================================================
TRUNCATE TABLE flashcard;
INSERT INTO flashcard (bahasa_id, kata_daerah, kata_indonesia, kategori)
SELECT bahasa_id, kata_daerah, kata_indonesia, kategori FROM kamus;

-- =====================================================
-- DATA: COMMUNITIES & DISCUSSIONS (BASE)
-- =====================================================
INSERT INTO komunitas (bahasa_id, nama, deskripsi, aturan) VALUES (1, 'Baraya Sunda', 'Wadah silaturahmi urang Sunda.', 'Sopan santun.');
INSERT INTO komunitas (bahasa_id, nama, deskripsi, aturan) VALUES (2, 'Paguyuban Jawi', 'Pelestari budaya Jawa.', 'Unggah-ungguh.');
INSERT INTO komunitas (bahasa_id, nama, deskripsi, aturan) VALUES (3, 'Tridatu Bali', 'Belajar budaya Bali.', 'Om Swastiastu.');
INSERT INTO komunitas (bahasa_id, nama, deskripsi, aturan) VALUES (4, 'Ranah Minang', 'Perantau Minang.', 'Adat basandi syarak.');

INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (1, 2, 'Wilujeng Sumping!', 'Halo sadayana, abdi budi.');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (2, 3, 'Sugeng Rawuh', 'Pripun kabare dulur?');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (3, 4, 'Om Swastiastu', 'Salam kenal saking Bali.');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (4, 5, 'Salamaik Datang', 'Apo kaba dunsanak?');

INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (1, 6, 'Wilujeng sumping oge!');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (2, 8, 'Apik mas, matur nuwun.');

-- =====================================================
-- DATA: ADDITIONAL COMMUNITIES & DISCUSSIONS (ROUND 6)
-- =====================================================
INSERT INTO komunitas (bahasa_id, nama, deskripsi, aturan) VALUES (1, 'Sastra & Seni Sunda', 'Wadah diskusi sastra, pupuh, dan seni Sunda.', 'Jaga etika dan sopan santun.');
INSERT INTO komunitas (bahasa_id, nama, deskripsi, aturan) VALUES (2, 'Aksara & Sastra Jawa', 'Sinau bareng aksara Jawa lan sastra.', 'Sopan santun lan asah asih asuh.');
INSERT INTO komunitas (bahasa_id, nama, deskripsi, aturan) VALUES (3, 'Pariwisata & Budaya Bali', 'Diskusi pariwisata lan adat istiadat Bali.', 'Om Swastiastu.');
INSERT INTO komunitas (bahasa_id, nama, deskripsi, aturan) VALUES (4, 'Kuliner & Petuah Minang', 'Membahas kuliner dan tambo Minangkabau.', 'Adat basandi syarak.');

-- New Discussions (Komunitas ID 5-8)
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (5, 6, 'Belajar Pupuh Kinanti', 'Ada yang punya lirik pupuh kinanti yang lengkap?');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (5, 10, 'Suling Sunda', 'Bagaimana teknik meniup suling yang benar agar merdu?');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (6, 8, 'Aksara Murda', 'Kapan kita harus menggunakan aksara murda?');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (6, 11, 'Serat Centhini', 'Ada yang sedang mengkaji Serat Centhini? Bagus sekali.');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (7, 4, 'Hari Raya Galungan', 'Persiapan apa saja yang biasanya dilakukan di desa kalian?');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (7, 9, 'Tari Kecak Uluwatu', 'Pengalaman menonton tari kecak paling berkesan dimana?');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (8, 5, 'Rahasia Rendang Enak', 'Berapa jam idealnya mengaduk rendang agar hitam sempurna?');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (8, 11, 'Pepatah Padang', 'Ada yang tahu arti "Lain lubuk lain ikannya"?');

-- New Comments
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (5, 1, 'Coba cek di materi pembelajaran bagian Pupuh, sudah ada dasarnya.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (5, 2, 'Saya punya bukunya, nanti saya fotokan.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (5, 3, 'Pupuh Kinanti memang paling syahdu.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (5, 6, 'Hatur nuhun sarannya min!');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (6, 1, 'Aksara murda digunakan untuk menulis nama orang terhormat, gelar, atau kota.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (6, 3, 'Oh pantesan kemarin saya salah tulis di tugas.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (6, 2, 'Betul, jangan sembarangan pakai aksara murda ya dulur.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (7, 13, 'Di Ubud vibes-nya paling terasa menurut saya.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (7, 4, 'Kalau saya biasanya pulang kampung ke Singaraja.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (7, 10, 'Galungan bareng keluarga memang momen terbaik.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (8, 1, 'Kalau saya biasanya 4-6 jam, api harus kecil.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (8, 11, 'Wah lama juga ya, tapi hasilnya memang beda.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (8, 6, 'Bumbu rahasianya pakai kelapa pilihan kan uda?');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (4, 2, 'Tarimo kasih infonyo Uda!');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (1, 10, 'Sampurasun! Abdi oge urang Bandung.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (2, 12, 'Sugeng siang, kulo saking Jogja.');

-- More Discussions (Round 6 Expansion)
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (1, 2, 'Tempat Wisata Sunda', 'Rekomendasi tempat wisata alam di Bandung yang lagi hits apa ya?');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (2, 3, 'Kuliner Jawa', 'Sego kucing paling enak nang ndi yo Cah?');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (3, 4, 'Belajar Tari Bali', 'Dimana ada sanggar tari untuk pemula di daerah Denpasar?');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (5, 14, 'Lomba Pupuh', 'Ada info lomba pupuh tingkat kabupaten tidak?');

-- Replies to More Discussions
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (9, 6, 'Gunung Putri Lembang bagus buat camping mang!');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (9, 3, 'Ke Orchid Forest juga seru lho.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (9, 8, 'Hati-hati macet kalau akhir pekan ya.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (10, 8, 'Coba rono nang Angkringan Lik Man, joss!');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (10, 11, 'Angkringan KR oge lumayan enak mas.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (10, 12, 'Nang tugu akeh seng dodol sego kucing.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (11, 9, 'Di ARMA Ubud sering ada workshop tari buat turis dan pemula.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (11, 13, 'Bener, kemarin saya baru dari sana.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (11, 4, 'Jangan lupa pakai pakaian adat ya kalau masuk.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (12, 1, 'Lombanya biasanya bulan Agustus buat agustusan.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (12, 10, 'Sip, pantau terus IG dinas pariwisata ya.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (12, 5, 'Saya juga ingin ikut daftar, menarik.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (1, 11, 'Abdi ti Sumedang hadir!');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (2, 2, 'Kulo saking Solo, salam kenal.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (3, 6, 'Rahajeng semeng!');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (4, 9, 'Onde mande, rami nampaknyo ko.');

-- =====================================================
-- DATA: MORE FEEDBACK (15+ ENTRIES)
-- =====================================================
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (2, 4, 'materi', 5, 'Materi Pupuh sangat membantu!', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (3, 5, 'materi', 5, 'Lutung Kasarung favorit saya.', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (4, 9, 'materi', 4, 'Wayang kulit seru penjelasannya.', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (5, 12, 'materi', 5, 'Malin Kundang sedih ceritanya.', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (6, NULL, 'website', 3, 'Navigasinya tolong diperbaiki sedikit.', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (8, NULL, 'website', 5, 'Desainnya clean dan modern.', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (9, NULL, 'ujian', 4, 'Waktu ujiannya pas.', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (10, 1, 'materi', 5, 'Sangat edukatif.', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (11, NULL, 'lainnya', 5, 'Ingin ada fitur voice note.', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (12, NULL, 'website', 4, 'Bagus bangeet.', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (13, 2, 'materi', 5, 'Kosakata dasar sangat komplit.', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (14, 3, 'materi', 1, 'Hanya mengetes report.', 'diproses');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (1, 4, 'materi', 5, 'Review dari Admin sendiri hehe.', 'selesai');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (15, NULL, 'lainnya', 5, 'Website ini masa depan bahasa daerah.', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (2, NULL, 'ujian', 4, 'Soal-soalnya menantang.', 'menunggu');
INSERT INTO umpan_balik (user_id, materi_id, kategori, rating, komentar, status) VALUES (3, NULL, 'website', 5, 'Saya belajar banyak disini.', 'menunggu');

-- DATA: ADDITIONAL EXAMS (UTS) - MOVED TO TOP

-- Questions for Exam ID 9 (Sunda UTS)
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (9, 'Pupuh anu ngagambarkeun rasa nungguan nyaeta?', 'Kinanti', 'Sinom', 'Asmarandana', 'Maskumambang', 'a', 1);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (9, 'Sapaan halus untuk orang tua?', 'Mamah/Bapa', 'Indung/Bapa', 'Ema/Abah', 'Tuang/Sangu', 'b', 2);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (9, 'Arti kata "Gumbira" adalah?', 'Sedih', 'Senang', 'Marah', 'Takut', 'b', 3);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (9, 'Manakah yang termasuk kecap barang?', 'Dahar', 'Sangu', 'Ulin', 'Saru', 'b', 4);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (9, 'Bahasa halusnya "Makan" untuk diri sendiri?', 'Neda', 'Tuang', 'Dahar', 'Nyatu', 'a', 5);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (9, 'Karakter utama dalam Lutung Kasarung?', 'Purbasari', 'Dayang Sumbi', 'Sangkuriang', 'Si Kabayan', 'a', 6);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (9, 'Apa arti "Wilujeng Sumping"?', 'Selamat Jalan', 'Selamat Datang', 'Selamat Pagi', 'Selamat Malam', 'b', 7);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (9, 'Contoh paribasa Sunda?', 'Cikaracak ninggang batu', 'Ada gula ada semut', 'Besar pasak daripada tiang', 'Tong kosong nyaring bunyinya', 'a', 8);

-- Questions for Exam ID 10 (Jawa UTS)
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (10, 'Sapa wae Pandawa Lima?', 'Yudhistira-Bima-Arjuna-Nakula-Sadewa', 'Puntadewa-Werkudara-Janaka-Nakula-Sadewa', 'Bener kabeh', 'Salah kabeh', 'c', 1);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (10, 'Aksara kapisan ing Hanacaraka?', 'Ha', 'Na', 'Ca', 'Ra', 'a', 2);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (10, 'Arti "Matur Nuwun"?', 'Permisi', 'Terima Kasih', 'Sama-sama', 'Minta Maaf', 'b', 3);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (10, 'Basa krama inggil "Jeneng"?', 'Asmo', 'Nami', 'Wasta', 'Aran', 'a', 4);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (10, 'Karakter wayang sing awake gede?', 'Arjuna', 'Bima', 'Yudhistira', 'Nakula', 'b', 5);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (10, 'Negara asal Pandawa?', 'Amarta', 'Astina', 'Alengka', 'Madukara', 'a', 6);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (10, 'Tembung "Simbok" artine?', 'Bapak', 'Ibu', 'Kakak', 'Adik', 'b', 7);

-- Questions for Exam ID 11 (Bali UTS)
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (11, 'Om Swastiastu adalah salam dari?', 'Bali', 'Jawa', 'Sunda', 'Madura', 'a', 1);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (11, 'Sistem irigasi tradisional di Bali?', 'Subak', 'Terasering', 'Waduk', 'Parit', 'a', 2);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (11, 'Sesajen khas Bali?', 'Canang Sari', 'Tumpeng', 'Rujak', 'Ketupat', 'a', 3);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (11, 'Kakak laki-laki dalam bahasa Bali?', 'Beli', 'Mbok', 'Adek', 'Paman', 'a', 4);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (11, 'Topi khas Bali?', 'Udeng', 'Blangkon', 'Peci', 'Baret', 'a', 5);

-- Questions for Exam ID 12 (Minang UTS)
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (12, 'Pepatah Minang: Adat basandi syarak, syarak basandi...', 'Adat', 'Kitabullah', 'Budaya', 'Negara', 'b', 1);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (12, 'Sistem kekerabatan di Minang?', 'Patrilineal', 'Matrilineal', 'Ambilineal', 'Bilateral', 'b', 2);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (12, 'Apa itu "Rumah Gadang"?', 'Rumah kecil', 'Rumah besar/adat', 'Rumah makan', 'Rumah ibadah', 'b', 3);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (12, 'Arti "Apo kaba"?', 'Siapa kamu', 'Apa kabar', 'Dimana kamu', 'Kapan datang', 'b', 4);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (9, 'Apa arti "Sampurasun"?', 'Permisi', 'Halo/Salam', 'Terima Kasih', 'Sama-sama', 'b', 9);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (9, 'Anggota tubuh "Panon" adalah?', 'Telinga', 'Mata', 'Hidung', 'Mulut', 'b', 10);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (10, 'Tembung "Pitik" artine?', 'Bebek', 'Ayam', 'Burung', 'Kambing', 'b', 8);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (10, 'Sebutna salah siji arane kembang?', 'Mawar', 'Melati', 'Bener kabeh', 'Salah kabeh', 'c', 9);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (10, 'Aksara "Na" niku urutan kaping pira?', '1', '2', '3', '4', 'b', 10);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (11, 'Apa yang dilakukan saat Hari Raya Nyepi?', 'Berpesta', 'Berdiam diri', 'Bekerja', 'Bepergian', 'b', 6);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (11, 'Gunung tertinggi di Bali?', 'Agung', 'Batur', 'Rinjani', 'Semeru', 'a', 7);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (11, 'Bahasa Bali "Makan"?', 'Ngerajeng', 'Ngajeng', 'Madaar', 'Bener kabeh', 'd', 8);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (12, 'Gunung Merapi berada di provinsi?', 'Sumatera Barat', 'Jawa Tengah', 'Bali', 'Jawa Timur', 'a', 6);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (12, 'Siapa nama ibu Malin Kundang?', 'Mande Rubayah', 'Dayang Sumbi', 'Nyi Roro Kidul', 'Bawang Merah', 'a', 7);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (12, 'Makanan "Sate Padang" bumbunya berwarna?', 'Kuning/Cokelat', 'Merah', 'Hijau', 'Hitam', 'a', 8);

-- =====================================================
-- DATA: MORE USER PROGRESS
-- =====================================================
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (6, 1, 1, 'selesai', 100, 12);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (8, 6, 2, 'selesai', 100, 15);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (9, 11, 3, 'sedang_belajar', 40, 8);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (10, 1, 1, 'selesai', 100, 20);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (11, 14, 4, 'selesai', 100, 30);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (12, 1, 1, 'sedang_belajar', 10, 5);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (13, 11, 3, 'selesai', 100, 25);

-- =====================================================
-- DATA: EXPLICIT FLASHCARDS (ROUND 6)
-- =====================================================
INSERT INTO flashcard (bahasa_id, kata_daerah, kata_indonesia, kategori) VALUES (1, 'Buku', 'Buku', 'Sekolah');
INSERT INTO flashcard (bahasa_id, kata_daerah, kata_indonesia, kategori) VALUES (1, 'Patlot', 'Pensil', 'Sekolah');
INSERT INTO flashcard (bahasa_id, kata_daerah, kata_indonesia, kategori) VALUES (2, 'Kucing', 'Kucing', 'Hewan');
INSERT INTO flashcard (bahasa_id, kata_daerah, kata_indonesia, kategori) VALUES (2, 'Wedhus', 'Kambing', 'Hewan');
INSERT INTO flashcard (bahasa_id, kata_daerah, kata_indonesia, kategori) VALUES (3, 'Tiuk', 'Pisau', 'Alat');
INSERT INTO flashcard (bahasa_id, kata_daerah, kata_indonesia, kategori) VALUES (3, 'Biu', 'Pisang', 'Buah');
INSERT INTO flashcard (bahasa_id, kata_daerah, kata_indonesia, kategori) VALUES (4, 'Otto', 'Mobil', 'Transportasi');
INSERT INTO flashcard (bahasa_id, kata_daerah, kata_indonesia, kategori) VALUES (4, 'Amak', 'Ibu', 'Keluarga');
INSERT INTO flashcard (bahasa_id, kata_daerah, kata_indonesia, kategori) VALUES (1, 'Hatur Nuhun', 'Terima Kasih', 'Sapaan');
INSERT INTO flashcard (bahasa_id, kata_daerah, kata_indonesia, kategori) VALUES (2, 'Matur Nuwun', 'Terima Kasih', 'Sapaan');

-- =====================================================
-- DATA: ADDITIONAL USERS (ROUND 7)
-- =====================================================
INSERT INTO users (nama, email, password, role, status) VALUES ('Andi Pratama', 'andi@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Dian Saputri', 'dian@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Rizki Ramadhan', 'rizki@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Wulan Sari', 'wulan@demo.com', 'demo123', 'pengguna', 'aktif');
INSERT INTO users (nama, email, password, role, status) VALUES ('Fajar Nugroho', 'fajar@demo.com', 'demo123', 'pengguna', 'aktif');

-- =====================================================
-- DATA: MORE SOAL FOR BASIC EXAMS (ROUND 7)
-- =====================================================
-- Exam 1: Evaluasi Dasar Sunda (more questions)
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (1, 'Apa bahasa Sunda dari "Tiga"?', 'Dua', 'Tilu', 'Opat', 'Lima', 'b', 2);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (1, '"Hatur nuhun" artinya?', 'Permisi', 'Terima kasih', 'Maaf', 'Selamat', 'b', 3);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (1, 'Bahasa Sunda dari "Adik"?', 'Lanceuk', 'Aki', 'Adi', 'Nini', 'c', 4);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (1, '"Kumaha damang" berarti?', 'Siapa nama kamu', 'Apa kabar', 'Mau ke mana', 'Dari mana', 'b', 5);

-- Exam 2: Kuis Paribasa Sunda (more questions)
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (2, 'Arti peribahasa "Hade gogog hade tagog"?', 'Baik perilaku baik penampilan', 'Baik hati jahat rupa', 'Jelek semua', 'Tidak ada yang benar', 'a', 2);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (2, 'Apa arti "Leungit" dalam bahasa Indonesia?', 'Hilang', 'Jatuh', 'Lupa', 'Pergi', 'a', 3);

-- Exam 3: Pemahaman Bacaan Sunda (more questions)
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (3, 'Siapa tokoh jahat di Lutung Kasarung?', 'Purbararang', 'Purbasari', 'Lutung', 'Guru Minda', 'a', 2);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (3, 'Lutung Kasarung aslinya adalah?', 'Hewan biasa', 'Dewa yang dikutuk', 'Manusia biasa', 'Jin', 'b', 3);

-- Exam 4: Kuis Aksara Jawa (more questions)
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (4, 'Jumlah aksara dasar Hanacaraka?', '10', '15', '20', '25', 'c', 2);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (4, 'Urutan aksara ke-5?', 'Ka', 'Da', 'Ta', 'Sa', 'a', 3);

-- Exam 5: Kuis Wayang Jawa (more questions)
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (5, 'Senjata Arjuna namanya?', 'Kunta', 'Pasopati', 'Gada', 'Cakra', 'b', 2);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (5, 'Istri Rama dalam pewayangan?', 'Sinta', 'Drupadi', 'Kunti', 'Banowati', 'a', 3);

-- Exam 7: Sapaan Bali (more questions)
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (7, '"Matur suksma" artinya?', 'Selamat pagi', 'Terima kasih', 'Permisi', 'Maaf', 'b', 2);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (7, '"Kenken kabare" artinya?', 'Siapa kamu', 'Apa kabar', 'Mau kemana', 'Terima kasih', 'b', 3);

-- Exam 8: Budaya Minang (more questions)
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (8, '"Tarimo kasih" artinya?', 'Selamat datang', 'Terima kasih', 'Permisi', 'Maaf', 'b', 2);
INSERT INTO soal_ujian (ujian_id, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban_benar, urutan) VALUES (8, 'Rumah adat Minangkabau disebut?', 'Joglo', 'Rumah Gadang', 'Honai', 'Baileo', 'b', 3);

-- =====================================================
-- DATA: MORE UMPAN BALIK WITH SELESAI STATUS (for testimonials)
-- =====================================================
INSERT INTO umpan_balik (user_id, kategori, rating, komentar, status, balasan) VALUES (8, 'website', 5, 'Platform ini sangat membantu saya belajar bahasa Jawa dari nol. Materinya runtut dan mudah dipahami.', 'selesai', 'Terima kasih atas apresiasi Anda!');
INSERT INTO umpan_balik (user_id, kategori, rating, komentar, status, balasan) VALUES (9, 'materi', 5, 'Flashcard kosakatanya sangat efektif untuk menghafal. Saya jadi lebih cepat ingat kosakata baru.', 'selesai', 'Senang mendengarnya, terus semangat belajar!');
INSERT INTO umpan_balik (user_id, kategori, rating, komentar, status, balasan) VALUES (10, 'website', 4, 'Ujiannya menantang tapi tidak terlalu sulit. Cocok untuk mengukur pemahaman secara bertahap.', 'selesai', 'Terima kasih masukannya.');
INSERT INTO umpan_balik (user_id, kategori, rating, komentar, status, balasan) VALUES (11, 'materi', 5, 'Cerita rakyat Malin Kundang di sini diceritakan dengan sangat menarik. Saya jadi lebih paham budayanya.', 'selesai', 'Kami senang Anda menikmatinya!');
INSERT INTO umpan_balik (user_id, kategori, rating, komentar, status, balasan) VALUES (12, 'website', 5, 'Desainnya bersih dan nyaman dipakai. Tidak membingungkan sama sekali untuk pengguna baru.', 'selesai', 'Terima kasih, kami berusaha memberikan pengalaman terbaik.');
INSERT INTO umpan_balik (user_id, kategori, rating, komentar, status, balasan) VALUES (13, 'materi', 4, 'Forum komunitasnya aktif dan saling membantu. Belajar jadi tidak terasa sendirian.', 'selesai', 'Komunitas memang kekuatan kami.');

-- =====================================================
-- DATA: MORE PROGRESS & HASIL UJIAN (ROUND 7)
-- =====================================================
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (3, 2, 1, 'selesai', 100, 18);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (3, 3, 1, 'sedang_belajar', 60, 12);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (6, 2, 1, 'selesai', 100, 22);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (8, 7, 2, 'selesai', 100, 20);
INSERT INTO progress_belajar (user_id, materi_id, bahasa_id, status, persentase, waktu_belajar) VALUES (9, 12, 3, 'selesai', 100, 18);

INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (6, 1, 85, 4, 5, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (8, 5, 90, 9, 10, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (10, 1, 70, 7, 10, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (11, 8, 80, 4, 5, 'lulus');
INSERT INTO hasil_ujian (user_id, ujian_id, nilai, jumlah_benar, jumlah_soal, status) VALUES (13, 7, 100, 3, 3, 'lulus');

-- =====================================================
-- DATA: MORE DISCUSSIONS (ROUND 7)
-- =====================================================
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (1, 10, 'Belajar Bahasa Sunda Lewat Lagu', 'Ada yang punya rekomendasi lagu Sunda yang enak didengar untuk pemula?');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (2, 11, 'Perbedaan Ngoko dan Krama', 'Kadang saya bingung kapan harus pakai ngoko dan kapan krama. Ada tips?');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (3, 9, 'Upacara Melasti', 'Siapa yang pernah ikut upacara Melasti? Ceritakan pengalamannya dong.');
INSERT INTO diskusi (komunitas_id, user_id, judul, konten) VALUES (4, 5, 'Perantau Minang di Jakarta', 'Dimana biasanya kumpul-kumpul anak Minang di Jakarta?');

INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (13, 6, 'Coba dengerin lagu Darso, enak dan liriknya mudah dipahami.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (13, 2, 'Pop Sunda jaman sekarang juga banyak yang bagus lho.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (14, 8, 'Kalau sama yang lebih tua selalu pakai krama, kalau sesama teman pakai ngoko.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (14, 3, 'Betul, intinya sopan santun. Kalau ragu pakai krama aja.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (15, 4, 'Melasti sangat sakral, biasanya ke pantai untuk membersihkan simbol-simbol suci.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (15, 13, 'Iya betul, di Kuta biasanya sangat ramai.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (16, 11, 'Di Tanah Abang banyak perantau Minang, bisa kumpul di rumah makan Padang.');
INSERT INTO komentar_diskusi (diskusi_id, user_id, konten) VALUES (16, 5, 'Terima kasih infonya, saya baru pindah soalnya.');

-- =====================================================
-- INDEXING
-- =====================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_materi_bahasa ON materi(bahasa_id);
CREATE INDEX idx_ujian_bahasa ON ujian(bahasa_id);
CREATE INDEX idx_progress_user ON progress_belajar(user_id);
CREATE INDEX idx_diskusi_komunitas ON diskusi(komunitas_id);
CREATE INDEX idx_umpan_balik_status ON umpan_balik(status);
CREATE INDEX idx_laporan_status ON laporan_pelanggaran(status);
CREATE INDEX idx_flashcard_bahasa ON flashcard(bahasa_id);
CREATE INDEX idx_kamus_bahasa ON kamus(bahasa_id);
CREATE INDEX idx_kamus_kata ON kamus(kata_daerah);
