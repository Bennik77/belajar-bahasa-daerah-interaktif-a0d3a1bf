import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  BahasaDaerah, Materi, Ujian, SoalUjian, Komunitas, 
  Diskusi, KomentarDiskusi, UmpanBalik, HasilUjian, 
  ProgressBelajar, LaporanPelanggaran, User 
} from '@/types/database';
import { 
  mockBahasaDaerah, mockMateri, mockUjian, mockSoalUjian,
  mockKomunitas, mockDiskusi, mockKomentarDiskusi, 
  mockUmpanBalik, mockHasilUjian, mockProgressBelajar,
  mockLaporanPelanggaran, mockUsers
} from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

interface DataContextType {
  // Data
  bahasaDaerah: BahasaDaerah[];
  materi: Materi[];
  ujian: Ujian[];
  soalUjian: SoalUjian[];
  komunitas: Komunitas[];
  diskusi: Diskusi[];
  komentarDiskusi: KomentarDiskusi[];
  umpanBalik: UmpanBalik[];
  hasilUjian: HasilUjian[];
  progressBelajar: ProgressBelajar[];
  laporanPelanggaran: LaporanPelanggaran[];
  users: User[];
  
  // CRUD Operations
  addMateri: (materi: Omit<Materi, 'id' | 'created_at' | 'updated_at'>) => void;
  updateMateri: (id: number, materi: Partial<Materi>) => void;
  deleteMateri: (id: number) => void;
  
  addUjian: (ujian: Omit<Ujian, 'id' | 'created_at' | 'updated_at'>) => void;
  updateUjian: (id: number, ujian: Partial<Ujian>) => void;
  deleteUjian: (id: number) => void;
  
  addSoalUjian: (soal: Omit<SoalUjian, 'id' | 'created_at'>) => void;
  updateSoalUjian: (id: number, soal: Partial<SoalUjian>) => void;
  deleteSoalUjian: (id: number) => void;
  
  addDiskusi: (diskusi: Omit<Diskusi, 'id' | 'created_at' | 'updated_at'>) => void;
  updateDiskusi: (id: number, diskusi: Partial<Diskusi>) => void;
  deleteDiskusi: (id: number) => void;
  
  addKomentar: (komentar: Omit<KomentarDiskusi, 'id' | 'created_at'>) => void;
  deleteKomentar: (id: number) => void;
  
  addUmpanBalik: (feedback: Omit<UmpanBalik, 'id' | 'created_at' | 'updated_at'>) => void;
  updateUmpanBalik: (id: number, feedback: Partial<UmpanBalik>) => void;
  deleteUmpanBalik: (id: number) => void;
  
  submitHasilUjian: (hasil: Omit<HasilUjian, 'id' | 'created_at'>) => void;
  
  updateProgress: (userId: number, materiId: number, bahasaId: number, data: Partial<ProgressBelajar>) => void;
  
  addLaporan: (laporan: Omit<LaporanPelanggaran, 'id' | 'created_at' | 'updated_at'>) => void;
  updateLaporan: (id: number, laporan: Partial<LaporanPelanggaran>) => void;
  
  addBahasa: (bahasa: Omit<BahasaDaerah, 'id' | 'created_at' | 'updated_at'>) => void;
  updateBahasa: (id: number, bahasa: Partial<BahasaDaerah>) => void;
  deleteBahasa: (id: number) => void;
  
  addKomunitas: (komunitas: Omit<Komunitas, 'id' | 'created_at' | 'updated_at'>) => void;
  updateKomunitas: (id: number, komunitas: Partial<Komunitas>) => void;
  deleteKomunitas: (id: number) => void;
  
  updateUserStatus: (id: number, status: User['status']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [bahasaDaerah, setBahasaDaerah] = useState<BahasaDaerah[]>(mockBahasaDaerah);
  const [materi, setMateri] = useState<Materi[]>(mockMateri);
  const [ujian, setUjian] = useState<Ujian[]>(mockUjian);
  const [soalUjian, setSoalUjian] = useState<SoalUjian[]>(mockSoalUjian);
  const [komunitas, setKomunitas] = useState<Komunitas[]>(mockKomunitas);
  const [diskusi, setDiskusi] = useState<Diskusi[]>(mockDiskusi);
  const [komentarDiskusi, setKomentarDiskusi] = useState<KomentarDiskusi[]>(mockKomentarDiskusi);
  const [umpanBalik, setUmpanBalik] = useState<UmpanBalik[]>(mockUmpanBalik);
  const [hasilUjian, setHasilUjian] = useState<HasilUjian[]>(mockHasilUjian);
  const [progressBelajar, setProgressBelajar] = useState<ProgressBelajar[]>(mockProgressBelajar);
  const [laporanPelanggaran, setLaporanPelanggaran] = useState<LaporanPelanggaran[]>(mockLaporanPelanggaran);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Materi CRUD
  const addMateri = (newMateri: Omit<Materi, 'id' | 'created_at' | 'updated_at'>) => {
    const id = Math.max(...materi.map(m => m.id), 0) + 1;
    const now = new Date().toISOString();
    setMateri([...materi, { ...newMateri, id, created_at: now, updated_at: now }]);
    toast({ title: "Berhasil", description: "Materi berhasil ditambahkan" });
  };

  const updateMateri = (id: number, updates: Partial<Materi>) => {
    setMateri(materi.map(m => m.id === id ? { ...m, ...updates, updated_at: new Date().toISOString() } : m));
    toast({ title: "Berhasil", description: "Materi berhasil diperbarui" });
  };

  const deleteMateri = (id: number) => {
    setMateri(materi.filter(m => m.id !== id));
    toast({ title: "Berhasil", description: "Materi berhasil dihapus" });
  };

  // Ujian CRUD
  const addUjian = (newUjian: Omit<Ujian, 'id' | 'created_at' | 'updated_at'>) => {
    const id = Math.max(...ujian.map(u => u.id), 0) + 1;
    const now = new Date().toISOString();
    setUjian([...ujian, { ...newUjian, id, created_at: now, updated_at: now }]);
    toast({ title: "Berhasil", description: "Ujian berhasil ditambahkan" });
  };

  const updateUjian = (id: number, updates: Partial<Ujian>) => {
    setUjian(ujian.map(u => u.id === id ? { ...u, ...updates, updated_at: new Date().toISOString() } : u));
    toast({ title: "Berhasil", description: "Ujian berhasil diperbarui" });
  };

  const deleteUjian = (id: number) => {
    setUjian(ujian.filter(u => u.id !== id));
    setSoalUjian(soalUjian.filter(s => s.ujian_id !== id));
    toast({ title: "Berhasil", description: "Ujian berhasil dihapus" });
  };

  // Soal Ujian CRUD
  const addSoalUjian = (newSoal: Omit<SoalUjian, 'id' | 'created_at'>) => {
    const id = Math.max(...soalUjian.map(s => s.id), 0) + 1;
    setSoalUjian([...soalUjian, { ...newSoal, id, created_at: new Date().toISOString() }]);
    toast({ title: "Berhasil", description: "Soal berhasil ditambahkan" });
  };

  const updateSoalUjian = (id: number, updates: Partial<SoalUjian>) => {
    setSoalUjian(soalUjian.map(s => s.id === id ? { ...s, ...updates } : s));
    toast({ title: "Berhasil", description: "Soal berhasil diperbarui" });
  };

  const deleteSoalUjian = (id: number) => {
    setSoalUjian(soalUjian.filter(s => s.id !== id));
    toast({ title: "Berhasil", description: "Soal berhasil dihapus" });
  };

  // Diskusi CRUD
  const addDiskusi = (newDiskusi: Omit<Diskusi, 'id' | 'created_at' | 'updated_at'>) => {
    const id = Math.max(...diskusi.map(d => d.id), 0) + 1;
    const now = new Date().toISOString();
    setDiskusi([...diskusi, { ...newDiskusi, id, created_at: now, updated_at: now }]);
    toast({ title: "Berhasil", description: "Diskusi berhasil dibuat" });
  };

  const updateDiskusi = (id: number, updates: Partial<Diskusi>) => {
    setDiskusi(diskusi.map(d => d.id === id ? { ...d, ...updates, updated_at: new Date().toISOString() } : d));
  };

  const deleteDiskusi = (id: number) => {
    setDiskusi(diskusi.filter(d => d.id !== id));
    setKomentarDiskusi(komentarDiskusi.filter(k => k.diskusi_id !== id));
    toast({ title: "Berhasil", description: "Diskusi berhasil dihapus" });
  };

  // Komentar CRUD
  const addKomentar = (newKomentar: Omit<KomentarDiskusi, 'id' | 'created_at'>) => {
    const id = Math.max(...komentarDiskusi.map(k => k.id), 0) + 1;
    setKomentarDiskusi([...komentarDiskusi, { ...newKomentar, id, created_at: new Date().toISOString() }]);
    toast({ title: "Berhasil", description: "Komentar berhasil ditambahkan" });
  };

  const deleteKomentar = (id: number) => {
    setKomentarDiskusi(komentarDiskusi.filter(k => k.id !== id));
    toast({ title: "Berhasil", description: "Komentar berhasil dihapus" });
  };

  // Umpan Balik CRUD
  const addUmpanBalik = (newFeedback: Omit<UmpanBalik, 'id' | 'created_at' | 'updated_at'>) => {
    const id = Math.max(...umpanBalik.map(u => u.id), 0) + 1;
    const now = new Date().toISOString();
    setUmpanBalik([...umpanBalik, { ...newFeedback, id, created_at: now, updated_at: now }]);
    toast({ title: "Berhasil", description: "Umpan balik berhasil dikirim" });
  };

  const updateUmpanBalik = (id: number, updates: Partial<UmpanBalik>) => {
    setUmpanBalik(umpanBalik.map(u => u.id === id ? { ...u, ...updates, updated_at: new Date().toISOString() } : u));
    toast({ title: "Berhasil", description: "Umpan balik berhasil diperbarui" });
  };

  const deleteUmpanBalik = (id: number) => {
    setUmpanBalik(umpanBalik.filter(u => u.id !== id));
    toast({ title: "Berhasil", description: "Umpan balik berhasil dihapus" });
  };

  // Hasil Ujian
  const submitHasilUjian = (hasil: Omit<HasilUjian, 'id' | 'created_at'>) => {
    const id = Math.max(...hasilUjian.map(h => h.id), 0) + 1;
    setHasilUjian([...hasilUjian, { ...hasil, id, created_at: new Date().toISOString() }]);
  };

  // Progress Belajar
  const updateProgress = (userId: number, materiId: number, bahasaId: number, data: Partial<ProgressBelajar>) => {
    const existing = progressBelajar.find(p => p.user_id === userId && p.materi_id === materiId);
    
    if (existing) {
      setProgressBelajar(progressBelajar.map(p => 
        p.user_id === userId && p.materi_id === materiId 
          ? { ...p, ...data, updated_at: new Date().toISOString() } 
          : p
      ));
    } else {
      const id = Math.max(...progressBelajar.map(p => p.id), 0) + 1;
      const now = new Date().toISOString();
      setProgressBelajar([...progressBelajar, {
        id,
        user_id: userId,
        materi_id: materiId,
        bahasa_id: bahasaId,
        status: 'belum_mulai',
        persentase: 0,
        waktu_belajar: 0,
        created_at: now,
        updated_at: now,
        ...data
      }]);
    }
  };

  // Laporan Pelanggaran
  const addLaporan = (newLaporan: Omit<LaporanPelanggaran, 'id' | 'created_at' | 'updated_at'>) => {
    const id = Math.max(...laporanPelanggaran.map(l => l.id), 0) + 1;
    const now = new Date().toISOString();
    setLaporanPelanggaran([...laporanPelanggaran, { ...newLaporan, id, created_at: now, updated_at: now }]);
    toast({ title: "Berhasil", description: "Laporan berhasil dikirim" });
  };

  const updateLaporan = (id: number, updates: Partial<LaporanPelanggaran>) => {
    setLaporanPelanggaran(laporanPelanggaran.map(l => l.id === id ? { ...l, ...updates, updated_at: new Date().toISOString() } : l));
    toast({ title: "Berhasil", description: "Laporan berhasil diperbarui" });
  };

  // Bahasa CRUD
  const addBahasa = (newBahasa: Omit<BahasaDaerah, 'id' | 'created_at' | 'updated_at'>) => {
    const id = Math.max(...bahasaDaerah.map(b => b.id), 0) + 1;
    const now = new Date().toISOString();
    setBahasaDaerah([...bahasaDaerah, { ...newBahasa, id, created_at: now, updated_at: now }]);
    toast({ title: "Berhasil", description: "Bahasa berhasil ditambahkan" });
  };

  const updateBahasa = (id: number, updates: Partial<BahasaDaerah>) => {
    setBahasaDaerah(bahasaDaerah.map(b => b.id === id ? { ...b, ...updates, updated_at: new Date().toISOString() } : b));
    toast({ title: "Berhasil", description: "Bahasa berhasil diperbarui" });
  };

  const deleteBahasa = (id: number) => {
    setBahasaDaerah(bahasaDaerah.filter(b => b.id !== id));
    toast({ title: "Berhasil", description: "Bahasa berhasil dihapus" });
  };

  // Komunitas CRUD
  const addKomunitas = (newKomunitas: Omit<Komunitas, 'id' | 'created_at' | 'updated_at'>) => {
    const id = Math.max(...komunitas.map(k => k.id), 0) + 1;
    const now = new Date().toISOString();
    setKomunitas([...komunitas, { ...newKomunitas, id, created_at: now, updated_at: now }]);
    toast({ title: "Berhasil", description: "Komunitas berhasil ditambahkan" });
  };

  const updateKomunitas = (id: number, updates: Partial<Komunitas>) => {
    setKomunitas(komunitas.map(k => k.id === id ? { ...k, ...updates, updated_at: new Date().toISOString() } : k));
    toast({ title: "Berhasil", description: "Komunitas berhasil diperbarui" });
  };

  const deleteKomunitas = (id: number) => {
    setKomunitas(komunitas.filter(k => k.id !== id));
    toast({ title: "Berhasil", description: "Komunitas berhasil dihapus" });
  };

  // User Status
  const updateUserStatus = (id: number, status: User['status']) => {
    setUsers(users.map(u => u.id === id ? { ...u, status, updated_at: new Date().toISOString() } : u));
    toast({ title: "Berhasil", description: "Status pengguna berhasil diperbarui" });
  };

  return (
    <DataContext.Provider value={{
      bahasaDaerah, materi, ujian, soalUjian, komunitas,
      diskusi, komentarDiskusi, umpanBalik, hasilUjian,
      progressBelajar, laporanPelanggaran, users,
      addMateri, updateMateri, deleteMateri,
      addUjian, updateUjian, deleteUjian,
      addSoalUjian, updateSoalUjian, deleteSoalUjian,
      addDiskusi, updateDiskusi, deleteDiskusi,
      addKomentar, deleteKomentar,
      addUmpanBalik, updateUmpanBalik, deleteUmpanBalik,
      submitHasilUjian, updateProgress,
      addLaporan, updateLaporan,
      addBahasa, updateBahasa, deleteBahasa,
      addKomunitas, updateKomunitas, deleteKomunitas,
      updateUserStatus
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
