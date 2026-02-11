/**
 * API Service untuk koneksi ke backend PHP
 */

// Sesuaikan ini dengan URL PHP Anda (XAMPP). 
// Jika foldernya di htdocs/api, gunakan http://localhost/api
// Jika foldernya di htdocs/belajar-bahasa-daerah-interaktif-a0d3a1bf/public/api, sesuaikan di bawah:
const API_BASE_URL = 'http://localhost/api';

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

    if (data.status === 'error' || data.success === false) {
      throw new Error(data.message || data.error || 'Terjadi kesalahan pada server');
    }

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
    apiFetch('/bahasa.php?action=create', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) =>
    apiFetch('/bahasa.php?action=update', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/bahasa.php?action=delete&id=${id}`, { method: 'DELETE' }),
};

// ============ MATERI API ============
export const materiApi = {
  list: (bahasaId?: number) =>
    apiFetch(`/materi.php?action=list${bahasaId ? `&bahasa_id=${bahasaId}` : ''}`),
  get: (id: number) => apiFetch(`/materi.php?action=get&id=${id}`),
  create: (data: any) =>
    apiFetch('/materi.php?action=create', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) =>
    apiFetch('/materi.php?action=update', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/materi.php?action=delete&id=${id}`, { method: 'DELETE' }),
};

// ============ UJIAN API ============
export const ujianApi = {
  list: (bahasaId?: number) =>
    apiFetch(`/ujian.php?action=list${bahasaId ? `&bahasa_id=${bahasaId}` : ''}`),
  get: (id: number) => apiFetch(`/ujian.php?action=get&id=${id}`),
  create: (data: any) =>
    apiFetch('/ujian.php?action=create', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) =>
    apiFetch('/ujian.php?action=update', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/ujian.php?action=delete&id=${id}`, { method: 'DELETE' }),
  listSoal: (ujianId: number) =>
    apiFetch(`/ujian.php?action=soal-list&ujian_id=${ujianId}`),
  createSoal: (data: any) =>
    apiFetch('/ujian.php?action=soal-create', { method: 'POST', body: JSON.stringify(data) }),
  updateSoal: (data: any) =>
    apiFetch('/ujian.php?action=soal-update', { method: 'PUT', body: JSON.stringify(data) }),
  deleteSoal: (id: number) =>
    apiFetch(`/ujian.php?action=soal-delete&id=${id}`, { method: 'DELETE' }),
  submitHasil: (data: any) =>
    apiFetch('/ujian.php?action=submit-hasil', { method: 'POST', body: JSON.stringify(data) }),
  getHasilUser: (userId: number) =>
    apiFetch(`/ujian.php?action=hasil-user&user_id=${userId}`),
};

// ============ KOMUNITAS API ============
export const komunitasApi = {
  list: () => apiFetch('/komunitas.php?action=list'),
  create: (data: any) =>
    apiFetch('/komunitas.php?action=create', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) =>
    apiFetch('/komunitas.php?action=update', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/komunitas.php?action=delete&id=${id}`, { method: 'DELETE' }),
  listDiskusi: (komunitasId?: number) =>
    apiFetch(`/komunitas.php?action=diskusi-list${komunitasId ? `&komunitas_id=${komunitasId}` : ''}`),
  createDiskusi: (data: any) =>
    apiFetch('/komunitas.php?action=diskusi-create', { method: 'POST', body: JSON.stringify(data) }),
  updateDiskusi: (data: any) =>
    apiFetch('/komunitas.php?action=diskusi-update', { method: 'PUT', body: JSON.stringify(data) }),
  deleteDiskusi: (id: number) =>
    apiFetch(`/komunitas.php?action=diskusi-delete&id=${id}`, { method: 'DELETE' }),
  listKomentar: (diskusiId: number) =>
    apiFetch(`/komunitas.php?action=komentar-list&diskusi_id=${diskusiId}`),
  createKomentar: (data: any) =>
    apiFetch('/komunitas.php?action=komentar-create', { method: 'POST', body: JSON.stringify(data) }),
  updateKomentar: (data: any) =>
    apiFetch('/komunitas.php?action=komentar-update', { method: 'PUT', body: JSON.stringify(data) }),
  deleteKomentar: (id: number) =>
    apiFetch(`/komunitas.php?action=komentar-delete&id=${id}`, { method: 'DELETE' }),
  listLaporan: () => apiFetch('/komunitas.php?action=laporan-list'),
  createLaporan: (data: any) =>
    apiFetch('/komunitas.php?action=laporan-create', { method: 'POST', body: JSON.stringify(data) }),
  updateLaporan: (data: any) =>
    apiFetch('/komunitas.php?action=laporan-update', { method: 'PUT', body: JSON.stringify(data) }),
  deleteLaporan: (id: number) =>
    apiFetch(`/komunitas.php?action=laporan-delete&id=${id}`, { method: 'DELETE' }),
};

// ============ UMPAN BALIK API ============
export const umpanBalikApi = {
  list: (status?: string) =>
    apiFetch(`/umpan-balik.php?action=list${status ? `&status=${status}` : ''}`),
  create: (data: any) =>
    apiFetch('/umpan-balik.php?action=create', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) =>
    apiFetch('/umpan-balik.php?action=update', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/umpan-balik.php?action=delete&id=${id}`, { method: 'DELETE' }),
};

// ============ PROGRESS API ============
export const progressApi = {
  list: (userId: number) =>
    apiFetch(`/progress.php?action=list&user_id=${userId}`),
  update: (data: any) =>
    apiFetch('/progress.php?action=update', { method: 'POST', body: JSON.stringify(data) }),
  getStats: (userId: number) =>
    apiFetch(`/progress.php?action=stats&user_id=${userId}`),
};

// ============ FLASHCARD API ============
export const flashcardApi = {
  list: (bahasaId?: number) =>
    apiFetch(`/flashcard.php?action=list${bahasaId ? `&bahasa_id=${bahasaId}` : ''}`),
  create: (data: any) =>
    apiFetch('/flashcard.php?action=create', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) =>
    apiFetch('/flashcard.php?action=update', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/flashcard.php?action=delete&id=${id}`, { method: 'DELETE' }),
};

// ============ KAMUS API ============
export const kamusApi = {
  search: (query: string, bahasaId?: number) =>
    apiFetch(`/kamus.php?action=search&q=${encodeURIComponent(query)}${bahasaId ? `&bahasa_id=${bahasaId}` : ''}`),
  list: (bahasaId?: number) =>
    apiFetch(`/kamus.php?action=list${bahasaId ? `&bahasa_id=${bahasaId}` : ''}`),
  create: (data: any) =>
    apiFetch('/kamus.php?action=create', { method: 'POST', body: JSON.stringify(data) }),
  update: (data: any) =>
    apiFetch('/kamus.php?action=update', { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    apiFetch(`/kamus.php?action=delete&id=${id}`, { method: 'DELETE' }),
};
