/**
 * API Service untuk koneksi ke backend PHP
 * Gunakan ini untuk menghubungkan frontend ke database MySQL
 * 
 * Cara penggunaan:
 * 1. Jalankan XAMPP dan pastikan Apache & MySQL aktif
 * 2. Import file belajar_bahasa_daerah.sql ke phpMyAdmin
 * 3. Copy folder 'api' ke folder htdocs XAMPP
 * 4. Sesuaikan API_BASE_URL dengan alamat server Anda
 */

// Ubah ini sesuai dengan alamat server PHP Anda
const API_BASE_URL = 'http://localhost/api';

// Helper untuk fetch dengan error handling
async function apiFetch(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API Error');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============ AUTH API ============
export const authApi = {
  login: (email: string, password: string) => 
    apiFetch('/users.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
    
  register: (nama: string, email: string, password: string) =>
    apiFetch('/users.php?action=register', {
      method: 'POST',
      body: JSON.stringify({ nama, email, password })
    }),
    
  listUsers: () => apiFetch('/users.php?action=list'),
  
  updateUserStatus: (id: number, status: string) =>
    apiFetch('/users.php?action=update-status', {
      method: 'PUT',
      body: JSON.stringify({ id, status })
    }),
};

// ============ BAHASA API ============
export const bahasaApi = {
  list: () => apiFetch('/bahasa.php?action=list'),
  
  get: (id: number) => apiFetch(`/bahasa.php?action=get&id=${id}`),
  
  create: (data: any) =>
    apiFetch('/bahasa.php?action=create', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  update: (data: any) =>
    apiFetch('/bahasa.php?action=update', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  delete: (id: number) =>
    apiFetch(`/bahasa.php?action=delete&id=${id}`, { method: 'DELETE' }),
};

// ============ MATERI API ============
export const materiApi = {
  list: (bahasaId?: number) => 
    apiFetch(`/materi.php?action=list${bahasaId ? `&bahasa_id=${bahasaId}` : ''}`),
  
  get: (id: number) => apiFetch(`/materi.php?action=get&id=${id}`),
  
  create: (data: any) =>
    apiFetch('/materi.php?action=create', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  update: (data: any) =>
    apiFetch('/materi.php?action=update', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  delete: (id: number) =>
    apiFetch(`/materi.php?action=delete&id=${id}`, { method: 'DELETE' }),
};

// ============ UJIAN API ============
export const ujianApi = {
  list: (bahasaId?: number) => 
    apiFetch(`/ujian.php?action=list${bahasaId ? `&bahasa_id=${bahasaId}` : ''}`),
  
  get: (id: number) => apiFetch(`/ujian.php?action=get&id=${id}`),
  
  create: (data: any) =>
    apiFetch('/ujian.php?action=create', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  update: (data: any) =>
    apiFetch('/ujian.php?action=update', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  delete: (id: number) =>
    apiFetch(`/ujian.php?action=delete&id=${id}`, { method: 'DELETE' }),
    
  // Soal
  listSoal: (ujianId: number) => 
    apiFetch(`/ujian.php?action=soal-list&ujian_id=${ujianId}`),
    
  createSoal: (data: any) =>
    apiFetch('/ujian.php?action=soal-create', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  updateSoal: (data: any) =>
    apiFetch('/ujian.php?action=soal-update', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  deleteSoal: (id: number) =>
    apiFetch(`/ujian.php?action=soal-delete&id=${id}`, { method: 'DELETE' }),
    
  // Hasil
  submitHasil: (data: any) =>
    apiFetch('/ujian.php?action=submit-hasil', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  getHasilUser: (userId: number) =>
    apiFetch(`/ujian.php?action=hasil-user&user_id=${userId}`),
};

// ============ KOMUNITAS API ============
export const komunitasApi = {
  list: () => apiFetch('/komunitas.php?action=list'),
  
  create: (data: any) =>
    apiFetch('/komunitas.php?action=create', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  update: (data: any) =>
    apiFetch('/komunitas.php?action=update', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  delete: (id: number) =>
    apiFetch(`/komunitas.php?action=delete&id=${id}`, { method: 'DELETE' }),
    
  // Diskusi
  listDiskusi: (komunitasId?: number) =>
    apiFetch(`/komunitas.php?action=diskusi-list${komunitasId ? `&komunitas_id=${komunitasId}` : ''}`),
    
  createDiskusi: (data: any) =>
    apiFetch('/komunitas.php?action=diskusi-create', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  deleteDiskusi: (id: number) =>
    apiFetch(`/komunitas.php?action=diskusi-delete&id=${id}`, { method: 'DELETE' }),
    
  // Komentar
  listKomentar: (diskusiId: number) =>
    apiFetch(`/komunitas.php?action=komentar-list&diskusi_id=${diskusiId}`),
    
  createKomentar: (data: any) =>
    apiFetch('/komunitas.php?action=komentar-create', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  deleteKomentar: (id: number) =>
    apiFetch(`/komunitas.php?action=komentar-delete&id=${id}`, { method: 'DELETE' }),
    
  // Laporan
  listLaporan: () => apiFetch('/komunitas.php?action=laporan-list'),
  
  createLaporan: (data: any) =>
    apiFetch('/komunitas.php?action=laporan-create', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  updateLaporan: (data: any) =>
    apiFetch('/komunitas.php?action=laporan-update', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
};

// ============ UMPAN BALIK API ============
export const umpanBalikApi = {
  list: (status?: string) =>
    apiFetch(`/umpan-balik.php?action=list${status ? `&status=${status}` : ''}`),
    
  create: (data: any) =>
    apiFetch('/umpan-balik.php?action=create', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  update: (data: any) =>
    apiFetch('/umpan-balik.php?action=update', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  delete: (id: number) =>
    apiFetch(`/umpan-balik.php?action=delete&id=${id}`, { method: 'DELETE' }),
};

// ============ PROGRESS API ============
export const progressApi = {
  list: (userId: number) =>
    apiFetch(`/progress.php?action=list&user_id=${userId}`),
    
  update: (data: any) =>
    apiFetch('/progress.php?action=update', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  getStats: (userId: number) =>
    apiFetch(`/progress.php?action=stats&user_id=${userId}`),
};
