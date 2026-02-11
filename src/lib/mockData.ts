// Mock Data - Simulasi data dari database
// Untuk implementasi nyata, ganti dengan API calls ke backend PHP

import { User, BahasaDaerah, Materi, Ujian, SoalUjian, Komunitas, Diskusi, KomentarDiskusi, UmpanBalik, HasilUjian, ProgressBelajar, LaporanPelanggaran } from '@/types/database';

// Users
export const mockUsers: User[] = [
  {
    id: 1,
    nama: 'Administrator',
    email: 'admin@bahasadaerah.id',
    password: 'admin123',
    role: 'admin',
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 2,
    nama: 'Pengguna Demo',
    email: 'demo@bahasadaerah.id',
    password: 'demo123',
    role: 'pengguna',
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 3,
    nama: 'Budi Santoso',
    email: 'budi@email.com',
    password: 'budi123',
    role: 'pengguna',
    status: 'aktif',
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  }
];

// Bahasa Daerah
export const mockBahasaDaerah: BahasaDaerah[] = [
  {
    id: 1,
    nama_bahasa: 'Bahasa Sunda',
    deskripsi: 'Bahasa daerah yang digunakan di wilayah Jawa Barat dan Banten. Bahasa Sunda memiliki tingkatan bahasa seperti Sunda halus, sedang, dan kasar.',
    icon: '🎻',
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 2,
    nama_bahasa: 'Bahasa Jawa',
    deskripsi: 'Bahasa daerah yang digunakan di wilayah Jawa Tengah, Jawa Timur, dan DIY. Memiliki aksara Jawa yang khas.',
    icon: '🎭',
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 3,
    nama_bahasa: 'Bahasa Bali',
    deskripsi: 'Bahasa daerah masyarakat Bali yang memiliki aksara dan sastra yang kaya.',
    icon: '⛩️',
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 4,
    nama_bahasa: 'Bahasa Minang',
    deskripsi: 'Bahasa daerah masyarakat Minangkabau di Sumatera Barat.',
    icon: '🏠',
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
];

// Materi
export const mockMateri: Materi[] = [
  {
    id: 1,
    bahasa_id: 1,
    judul: 'Pengenalan Bahasa Sunda',
    deskripsi: 'Mengenal dasar-dasar bahasa Sunda dan sejarahnya',
    konten: `<h2>Selamat Datang di Pembelajaran Bahasa Sunda!</h2>
<p>Bahasa Sunda adalah bahasa yang digunakan oleh suku Sunda di Jawa Barat dan Banten. Bahasa ini memiliki beberapa tingkatan:</p>
<ul>
<li><strong>Basa Lemes (Bahasa Halus)</strong> - Digunakan untuk berbicara dengan orang yang lebih tua atau dihormati</li>
<li><strong>Basa Sedeng (Bahasa Sedang)</strong> - Digunakan dalam percakapan sehari-hari</li>
<li><strong>Basa Kasar (Bahasa Kasar)</strong> - Digunakan di antara teman sebaya dalam suasana informal</li>
</ul>
<h3>Sapaan Dasar</h3>
<ul>
<li>Wilujeng énjing - Selamat pagi</li>
<li>Wilujeng siang - Selamat siang</li>
<li>Wilujeng sonten - Selamat sore</li>
<li>Wilujeng wengi - Selamat malam</li>
<li>Kumaha damang? - Apa kabar?</li>
<li>Hatur nuhun - Terima kasih</li>
</ul>`,
    tipe: 'membaca',
    urutan: 1,
    durasi_menit: 15,
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 2,
    bahasa_id: 1,
    judul: 'Kosakata Dasar Bahasa Sunda',
    deskripsi: 'Mempelajari kosakata sehari-hari dalam bahasa Sunda',
    konten: `<h2>Kosakata Dasar Bahasa Sunda</h2>
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
</ul>`,
    tipe: 'membaca',
    urutan: 2,
    durasi_menit: 20,
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 3,
    bahasa_id: 1,
    judul: 'Latihan Percakapan Sunda',
    deskripsi: 'Berlatih percakapan sederhana dalam bahasa Sunda',
    konten: `<h2>Latihan Percakapan</h2>
<h3>Percakapan 1: Perkenalan</h3>
<p><strong>A:</strong> Wilujeng énjing, nami abdi Siti. Nami anjeun saha?</p>
<p><em>(Selamat pagi, nama saya Siti. Nama kamu siapa?)</em></p>
<p><strong>B:</strong> Wilujeng énjing, nami abdi Budi.</p>
<p><em>(Selamat pagi, nama saya Budi.)</em></p>

<h3>Percakapan 2: Di Pasar</h3>
<p><strong>Pembeli:</strong> Ieu téh sabaraha hargana?</p>
<p><em>(Ini berapa harganya?)</em></p>
<p><strong>Penjual:</strong> Dua puluh rébu rupiah.</p>`,
    tipe: 'latihan',
    urutan: 3,
    durasi_menit: 25,
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 4,
    bahasa_id: 1,
    judul: 'Tugas: Menulis Kalimat Sunda',
    deskripsi: 'Membuat kalimat sederhana dalam bahasa Sunda',
    konten: `<h2>Tugas Pembelajaran</h2>
<p>Setelah mempelajari materi-materi sebelumnya, sekarang waktunya kamu berlatih!</p>
<h3>Instruksi:</h3>
<ol>
<li>Buatlah 5 kalimat perkenalan diri dalam bahasa Sunda</li>
<li>Tuliskan percakapan singkat antara 2 orang dalam bahasa Sunda</li>
<li>Terjemahkan kalimat berikut ke bahasa Sunda</li>
</ol>`,
    tipe: 'tugas',
    urutan: 4,
    durasi_menit: 30,
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
];

// Ujian
export const mockUjian: Ujian[] = [
  {
    id: 1,
    bahasa_id: 1,
    judul: 'Ujian Dasar Bahasa Sunda',
    deskripsi: 'Menguji pemahaman dasar bahasa Sunda',
    durasi_menit: 30,
    passing_grade: 60,
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 2,
    bahasa_id: 1,
    judul: 'Ujian Kosakata Sunda',
    deskripsi: 'Menguji penguasaan kosakata bahasa Sunda',
    durasi_menit: 20,
    passing_grade: 70,
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
];

// Soal Ujian
export const mockSoalUjian: SoalUjian[] = [
  {
    id: 1,
    ujian_id: 1,
    pertanyaan: 'Apa arti "Wilujeng énjing" dalam bahasa Indonesia?',
    pilihan_a: 'Selamat siang',
    pilihan_b: 'Selamat pagi',
    pilihan_c: 'Selamat sore',
    pilihan_d: 'Selamat malam',
    jawaban_benar: 'b',
    urutan: 1,
    created_at: '2024-01-01'
  },
  {
    id: 2,
    ujian_id: 1,
    pertanyaan: 'Bagaimana cara mengatakan "Terima kasih" dalam bahasa Sunda?',
    pilihan_a: 'Punten',
    pilihan_b: 'Hatur nuhun',
    pilihan_c: 'Hampura',
    pilihan_d: 'Wilujeng',
    jawaban_benar: 'b',
    urutan: 2,
    created_at: '2024-01-01'
  },
  {
    id: 3,
    ujian_id: 1,
    pertanyaan: 'Angka 5 dalam bahasa Sunda adalah...',
    pilihan_a: 'Hiji',
    pilihan_b: 'Dua',
    pilihan_c: 'Lima',
    pilihan_d: 'Opat',
    jawaban_benar: 'c',
    urutan: 3,
    created_at: '2024-01-01'
  },
  {
    id: 4,
    ujian_id: 1,
    pertanyaan: 'Apa arti kata "Bapa" dalam bahasa Sunda?',
    pilihan_a: 'Ibu',
    pilihan_b: 'Kakak',
    pilihan_c: 'Ayah',
    pilihan_d: 'Adik',
    jawaban_benar: 'c',
    urutan: 4,
    created_at: '2024-01-01'
  },
  {
    id: 5,
    ujian_id: 1,
    pertanyaan: '"Kumaha damang?" artinya adalah...',
    pilihan_a: 'Mau ke mana?',
    pilihan_b: 'Apa kabar?',
    pilihan_c: 'Siapa namamu?',
    pilihan_d: 'Dari mana?',
    jawaban_benar: 'b',
    urutan: 5,
    created_at: '2024-01-01'
  },
  {
    id: 6,
    ujian_id: 2,
    pertanyaan: 'Angka 7 dalam bahasa Sunda adalah...',
    pilihan_a: 'Tujuh',
    pilihan_b: 'Genep',
    pilihan_c: 'Dalapan',
    pilihan_d: 'Salapan',
    jawaban_benar: 'a',
    urutan: 1,
    created_at: '2024-01-01'
  },
  {
    id: 7,
    ujian_id: 2,
    pertanyaan: 'Apa bahasa Sunda dari "Kakek"?',
    pilihan_a: 'Nini',
    pilihan_b: 'Aki',
    pilihan_c: 'Bapa',
    pilihan_d: 'Ema',
    jawaban_benar: 'b',
    urutan: 2,
    created_at: '2024-01-01'
  },
  {
    id: 8,
    ujian_id: 2,
    pertanyaan: '"Lanceuk" artinya adalah...',
    pilihan_a: 'Adik',
    pilihan_b: 'Kakak',
    pilihan_c: 'Paman',
    pilihan_d: 'Bibi',
    jawaban_benar: 'b',
    urutan: 3,
    created_at: '2024-01-01'
  }
];

// Komunitas
export const mockKomunitas: Komunitas[] = [
  {
    id: 1,
    bahasa_id: 1,
    nama: 'Komunitas Belajar Sunda',
    deskripsi: 'Tempat diskusi dan berbagi pengalaman belajar bahasa Sunda',
    aturan: '1. Gunakan bahasa yang sopan\n2. Jangan melakukan spam\n3. Saling membantu sesama pelajar\n4. Dilarang promosi produk\n5. Hormati perbedaan pendapat',
    status: 'aktif',
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
];

// Diskusi
export const mockDiskusi: Diskusi[] = [
  {
    id: 1,
    komunitas_id: 1,
    user_id: 2,
    judul: 'Bagaimana cara mengucapkan huruf "eu" dalam bahasa Sunda?',
    konten: 'Saya kesulitan mengucapkan huruf "eu" seperti dalam kata "beurang". Ada yang bisa bantu?',
    status: 'aktif',
    created_at: '2024-01-10',
    updated_at: '2024-01-10'
  },
  {
    id: 2,
    komunitas_id: 1,
    user_id: 3,
    judul: 'Tips belajar bahasa Sunda untuk pemula',
    konten: 'Hai semua! Saya mau berbagi tips belajar bahasa Sunda untuk pemula. Pertama, mulai dari sapaan dasar...',
    status: 'aktif',
    created_at: '2024-01-12',
    updated_at: '2024-01-12'
  }
];

// Komentar Diskusi
export const mockKomentarDiskusi: KomentarDiskusi[] = [
  {
    id: 1,
    diskusi_id: 1,
    user_id: 3,
    konten: 'Huruf "eu" diucapkan dengan bibir yang sedikit dimajukan, seperti huruf "e" tapi dengan mulut lebih bulat.',
    status: 'aktif',
    created_at: '2024-01-10'
  },
  {
    id: 2,
    diskusi_id: 1,
    user_id: 2,
    konten: 'Terima kasih penjelasannya! Sangat membantu.',
    status: 'aktif',
    created_at: '2024-01-11'
  }
];

// Umpan Balik
export const mockUmpanBalik: UmpanBalik[] = [
  {
    id: 1,
    user_id: 2,
    materi_id: 1,
    kategori: 'materi',
    rating: 5,
    komentar: 'Materi sangat mudah dipahami dan contoh-contohnya relevan!',
    status: 'selesai',
    balasan: 'Terima kasih atas feedback positifnya! Kami akan terus meningkatkan kualitas materi.',
    created_at: '2024-01-15',
    updated_at: '2024-01-16'
  },
  {
    id: 2,
    user_id: 3,
    kategori: 'website',
    rating: 4,
    komentar: 'Website mudah digunakan, tapi akan lebih baik jika ada fitur audio untuk pengucapan.',
    status: 'menunggu',
    created_at: '2024-01-20',
    updated_at: '2024-01-20'
  },
  {
    id: 3,
    user_id: 2,
    kategori: 'website',
    rating: 5,
    komentar: 'Platform ini sangat membantu saya belajar bahasa daerah dari nol. Materinya runtut dan mudah dipahami.',
    status: 'selesai',
    balasan: 'Terima kasih atas apresiasi Anda!',
    created_at: '2024-02-01',
    updated_at: '2024-02-02'
  },
  {
    id: 4,
    user_id: 3,
    kategori: 'materi',
    rating: 5,
    komentar: 'Flashcard kosakatanya sangat efektif untuk menghafal. Saya jadi lebih cepat ingat kosakata baru.',
    status: 'selesai',
    balasan: 'Senang mendengarnya, terus semangat belajar!',
    created_at: '2024-02-10',
    updated_at: '2024-02-11'
  },
  {
    id: 5,
    user_id: 2,
    kategori: 'ujian',
    rating: 4,
    komentar: 'Ujiannya menantang tapi tidak terlalu sulit. Cocok untuk mengukur pemahaman secara bertahap.',
    status: 'selesai',
    balasan: 'Terima kasih masukannya.',
    created_at: '2024-02-15',
    updated_at: '2024-02-16'
  }
];

// Hasil Ujian
export const mockHasilUjian: HasilUjian[] = [
  {
    id: 1,
    user_id: 2,
    ujian_id: 1,
    nilai: 80,
    jumlah_benar: 4,
    jumlah_soal: 5,
    status: 'lulus',
    waktu_selesai: 1200,
    created_at: '2024-01-18'
  }
];

// Progress Belajar
export const mockProgressBelajar: ProgressBelajar[] = [
  {
    id: 1,
    user_id: 2,
    materi_id: 1,
    bahasa_id: 1,
    status: 'selesai',
    persentase: 100,
    waktu_belajar: 900,
    created_at: '2024-01-10',
    updated_at: '2024-01-10'
  },
  {
    id: 2,
    user_id: 2,
    materi_id: 2,
    bahasa_id: 1,
    status: 'selesai',
    persentase: 100,
    waktu_belajar: 1200,
    created_at: '2024-01-12',
    updated_at: '2024-01-12'
  },
  {
    id: 3,
    user_id: 2,
    materi_id: 3,
    bahasa_id: 1,
    status: 'sedang_belajar',
    persentase: 50,
    waktu_belajar: 600,
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  }
];

// Laporan Pelanggaran
export const mockLaporanPelanggaran: LaporanPelanggaran[] = [];
