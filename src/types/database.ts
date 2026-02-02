// Types untuk database bahasa daerah

export type UserRole = 'pengguna' | 'admin';
export type UserStatus = 'aktif' | 'nonaktif' | 'diblokir';
export type MateriTipe = 'membaca' | 'latihan' | 'tugas' | 'video';
export type ProgressStatus = 'belum_mulai' | 'sedang_belajar' | 'selesai';
export type UjianHasilStatus = 'lulus' | 'tidak_lulus';
export type DiskusiStatus = 'aktif' | 'ditutup' | 'dihapus';
export type LaporanStatus = 'menunggu' | 'diproses' | 'selesai' | 'ditolak';
export type UmpanBalikKategori = 'materi' | 'ujian' | 'website' | 'lainnya';
export type UmpanBalikStatus = 'menunggu' | 'diproses' | 'selesai';

export interface User {
  id: number;
  nama: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface BahasaDaerah {
  id: number;
  nama_bahasa: string;
  deskripsi?: string;
  icon?: string;
  status: 'aktif' | 'nonaktif';
  created_at: string;
  updated_at: string;
}

export interface Materi {
  id: number;
  bahasa_id: number;
  judul: string;
  deskripsi?: string;
  konten?: string;
  tipe: MateriTipe;
  urutan: number;
  durasi_menit: number;
  status: 'aktif' | 'nonaktif';
  created_at: string;
  updated_at: string;
}

export interface Ujian {
  id: number;
  bahasa_id: number;
  judul: string;
  deskripsi?: string;
  durasi_menit: number;
  passing_grade: number;
  status: 'aktif' | 'nonaktif';
  created_at: string;
  updated_at: string;
}

export interface SoalUjian {
  id: number;
  ujian_id: number;
  pertanyaan: string;
  pilihan_a: string;
  pilihan_b: string;
  pilihan_c: string;
  pilihan_d: string;
  jawaban_benar: 'a' | 'b' | 'c' | 'd';
  urutan: number;
  created_at: string;
}

export interface HasilUjian {
  id: number;
  user_id: number;
  ujian_id: number;
  nilai: number;
  jumlah_benar: number;
  jumlah_soal: number;
  status: UjianHasilStatus;
  waktu_selesai: number;
  created_at: string;
}

export interface ProgressBelajar {
  id: number;
  user_id: number;
  materi_id: number;
  bahasa_id: number;
  status: ProgressStatus;
  persentase: number;
  waktu_belajar: number;
  created_at: string;
  updated_at: string;
}

export interface Komunitas {
  id: number;
  bahasa_id: number;
  nama: string;
  deskripsi?: string;
  aturan?: string;
  status: 'aktif' | 'nonaktif';
  created_at: string;
  updated_at: string;
}

export interface Diskusi {
  id: number;
  komunitas_id: number;
  user_id: number;
  judul: string;
  konten: string;
  status: DiskusiStatus;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface KomentarDiskusi {
  id: number;
  diskusi_id: number;
  user_id: number;
  konten: string;
  status: 'aktif' | 'dihapus';
  created_at: string;
  user?: User;
}

export interface LaporanPelanggaran {
  id: number;
  pelapor_id: number;
  terlapor_id: number;
  diskusi_id?: number;
  komentar_id?: number;
  alasan: string;
  status: LaporanStatus;
  tindakan?: string;
  created_at: string;
  updated_at: string;
  pelapor?: User;
  terlapor?: User;
}

export interface UmpanBalik {
  id: number;
  user_id: number;
  materi_id?: number;
  kategori: UmpanBalikKategori;
  rating: number;
  komentar: string;
  status: UmpanBalikStatus;
  balasan?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

// Session/Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nama: string;
  email: string;
  password: string;
}
