import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import {
  BahasaDaerah, Materi, Ujian, SoalUjian, Komunitas,
  Diskusi, KomentarDiskusi, UmpanBalik, HasilUjian,
  ProgressBelajar, LaporanPelanggaran, User
} from '@/types/database';
import {
  authApi, bahasaApi, komunitasApi, materiApi,
  progressApi, ujianApi, umpanBalikApi
} from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface DataContextType {
  isLoading: boolean;
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
  addMateri: (materi: Omit<Materi, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateMateri: (id: number, materi: Partial<Materi>) => Promise<void>;
  deleteMateri: (id: number) => Promise<void>;

  addUjian: (ujian: Omit<Ujian, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateUjian: (id: number, ujian: Partial<Ujian>) => Promise<void>;
  deleteUjian: (id: number) => Promise<void>;

  addSoalUjian: (soal: Omit<SoalUjian, 'id' | 'created_at'>) => Promise<void>;
  updateSoalUjian: (id: number, soal: Partial<SoalUjian>) => Promise<void>;
  deleteSoalUjian: (id: number) => Promise<void>;

  addDiskusi: (diskusi: Omit<Diskusi, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateDiskusi: (id: number, diskusi: Partial<Diskusi>) => Promise<void>;
  deleteDiskusi: (id: number) => Promise<void>;

  addKomentar: (komentar: Omit<KomentarDiskusi, 'id' | 'created_at'>) => Promise<void>;
  updateKomentar: (id: number, konten: string) => Promise<void>;
  deleteKomentar: (id: number) => Promise<void>;

  addUmpanBalik: (feedback: Omit<UmpanBalik, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateUmpanBalik: (id: number, feedback: Partial<UmpanBalik>) => Promise<void>;
  deleteUmpanBalik: (id: number) => Promise<void>;

  submitHasilUjian: (hasil: Omit<HasilUjian, 'id' | 'created_at'>) => Promise<void>;

  updateProgress: (userId: number, materiId: number, bahasaId: number, data: Partial<ProgressBelajar>) => Promise<void>;

  addLaporan: (laporan: Omit<LaporanPelanggaran, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateLaporan: (id: number, laporan: Partial<LaporanPelanggaran>) => Promise<void>;
  deleteLaporan: (id: number) => Promise<void>;

  addBahasa: (bahasa: Omit<BahasaDaerah, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateBahasa: (id: number, bahasa: Partial<BahasaDaerah>) => Promise<void>;
  deleteBahasa: (id: number) => Promise<void>;

  addKomunitas: (komunitas: Omit<Komunitas, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateKomunitas: (id: number, komunitas: Partial<Komunitas>) => Promise<void>;
  deleteKomunitas: (id: number) => Promise<void>;

  updateUserStatus: (id: number, status: User['status']) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [bahasaDaerah, setBahasaDaerah] = useState<BahasaDaerah[]>([]);
  const [materi, setMateri] = useState<Materi[]>([]);
  const [ujian, setUjian] = useState<Ujian[]>([]);
  const [soalUjian, setSoalUjian] = useState<SoalUjian[]>([]);
  const [komunitas, setKomunitas] = useState<Komunitas[]>([]);
  const [diskusi, setDiskusi] = useState<Diskusi[]>([]);
  const [komentarDiskusi, setKomentarDiskusi] = useState<KomentarDiskusi[]>([]);
  const [umpanBalik, setUmpanBalik] = useState<UmpanBalik[]>([]);
  const [hasilUjian, setHasilUjian] = useState<HasilUjian[]>([]);
  const [progressBelajar, setProgressBelajar] = useState<ProgressBelajar[]>([]);
  const [laporanPelanggaran, setLaporanPelanggaran] = useState<LaporanPelanggaran[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        bahasaRes, materiRes, ujianRes, komunitasRes,
        diskusiRes, umpanBalikRes, laporanRes, usersRes,
        progressRes, hasilRes
      ] = await Promise.all([
        bahasaApi.list(),
        materiApi.list(),
        ujianApi.list(),
        komunitasApi.list(),
        komunitasApi.listDiskusi(),
        umpanBalikApi.list(),
        komunitasApi.listLaporan(),
        authApi.listUsers(),
        user ? progressApi.list(user.id) : Promise.resolve({ data: [] }),
        user ? ujianApi.getHasilUser(user.id) : Promise.resolve({ data: [] })
      ]);

      const ujianData = ujianRes.data || [];
      const diskusiData = diskusiRes.data || [];

      const soalPromises = ujianData.map(u => ujianApi.listSoal(u.id));
      const komentarPromises = diskusiData.map(d => komunitasApi.listKomentar(d.id));

      const [soalRes, komentarRes] = await Promise.all([
        Promise.all(soalPromises),
        Promise.all(komentarPromises)
      ]);

      setBahasaDaerah(bahasaRes.data || []);
      setMateri(materiRes.data || []);
      setUjian(ujianData);
      setKomunitas(komunitasRes.data || []);
      setDiskusi(diskusiData);
      setUmpanBalik(umpanBalikRes.data || []);
      setLaporanPelanggaran(laporanRes.data || []);
      setUsers(usersRes.data || []);
      setSoalUjian(soalRes.flatMap(r => r.data || []));
      setKomentarDiskusi(komentarRes.flatMap(r => r.data || []));
      setProgressBelajar(progressRes.data || []);
      setHasilUjian(hasilRes.data || []);

    } catch (error: any) {
      console.error("Failed to fetch data from API, falling back to mock data.", error);
      toast({
        title: "Gagal Terhubung ke Server",
        description: `Error: ${error.message}. Menggunakan data offline.`,
        variant: "destructive",
      });
      const mock = await import('@/lib/mockData');
      setBahasaDaerah(mock.mockBahasaDaerah);
      setMateri(mock.mockMateri);
      setUjian(mock.mockUjian);
      setSoalUjian(mock.mockSoalUjian);
      setKomunitas(mock.mockKomunitas);
      setDiskusi(mock.mockDiskusi);
      setKomentarDiskusi(mock.mockKomentarDiskusi);
      setUmpanBalik(mock.mockUmpanBalik);
      setHasilUjian(mock.mockHasilUjian);
      setProgressBelajar(mock.mockProgressBelajar);
      setLaporanPelanggaran(mock.mockLaporanPelanggaran);
      setUsers(mock.mockUsers);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Materi CRUD
  const addMateri = useCallback(async (newMateri: Omit<Materi, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await materiApi.create(newMateri);
      await fetchData();
      toast({ title: "Berhasil", description: "Materi berhasil ditambahkan" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menambahkan materi", variant: "destructive" });
    }
  }, [fetchData]);

  const updateMateri = useCallback(async (id: number, updates: Partial<Materi>) => {
    try {
      await materiApi.update({ id, ...updates });
      await fetchData();
      toast({ title: "Berhasil", description: "Materi berhasil diperbarui" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal memperbarui materi", variant: "destructive" });
    }
  }, [fetchData]);

  const deleteMateri = useCallback(async (id: number) => {
    try {
      await materiApi.delete(id);
      await fetchData();
      toast({ title: "Berhasil", description: "Materi berhasil dihapus" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus materi", variant: "destructive" });
    }
  }, [fetchData]);

  // Ujian CRUD
  const addUjian = useCallback(async (newUjian: Omit<Ujian, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await ujianApi.create(newUjian);
      await fetchData();
      toast({ title: "Berhasil", description: "Ujian berhasil ditambahkan" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menambahkan ujian", variant: "destructive" });
    }
  }, [fetchData]);

  const updateUjian = useCallback(async (id: number, updates: Partial<Ujian>) => {
    try {
      await ujianApi.update({ id, ...updates });
      await fetchData();
      toast({ title: "Berhasil", description: "Ujian berhasil diperbarui" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal memperbarui ujian", variant: "destructive" });
    }
  }, [fetchData]);

  const deleteUjian = useCallback(async (id: number) => {
    try {
      await ujianApi.delete(id);
      await fetchData();
      toast({ title: "Berhasil", description: "Ujian berhasil dihapus" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus ujian", variant: "destructive" });
    }
  }, [fetchData]);

  // Soal Ujian CRUD
  const addSoalUjian = useCallback(async (newSoal: Omit<SoalUjian, 'id' | 'created_at'>) => {
    try {
      await ujianApi.createSoal(newSoal);
      await fetchData();
      toast({ title: "Berhasil", description: "Soal berhasil ditambahkan" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menambahkan soal", variant: "destructive" });
    }
  }, [fetchData]);

  const updateSoalUjian = useCallback(async (id: number, updates: Partial<SoalUjian>) => {
    try {
      await ujianApi.updateSoal({ id, ...updates });
      await fetchData();
      toast({ title: "Berhasil", description: "Soal berhasil diperbarui" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal memperbarui soal", variant: "destructive" });
    }
  }, [fetchData]);

  const deleteSoalUjian = useCallback(async (id: number) => {
    try {
      await ujianApi.deleteSoal(id);
      await fetchData();
      toast({ title: "Berhasil", description: "Soal berhasil dihapus" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus soal", variant: "destructive" });
    }
  }, [fetchData]);

  // Diskusi CRUD
  const addDiskusi = useCallback(async (newDiskusi: Omit<Diskusi, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await komunitasApi.createDiskusi(newDiskusi);
      await fetchData();
      toast({ title: "Berhasil", description: "Diskusi berhasil dibuat" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal membuat diskusi", variant: "destructive" });
    }
  }, [fetchData]);

  const updateDiskusi = useCallback(async (id: number, updates: Partial<Diskusi>) => {
    try {
      await komunitasApi.updateDiskusi({ id, ...updates });
      await fetchData();
      toast({ title: "Berhasil", description: "Diskusi berhasil diperbarui" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal memperbarui diskusi", variant: "destructive" });
    }
  }, [fetchData]);

  const deleteDiskusi = useCallback(async (id: number) => {
    try {
      await komunitasApi.deleteDiskusi(id);
      await fetchData();
      toast({ title: "Berhasil", description: "Diskusi berhasil dihapus" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus diskusi", variant: "destructive" });
    }
  }, [fetchData]);

  // Komentar CRUD
  const addKomentar = useCallback(async (newKomentar: Omit<KomentarDiskusi, 'id' | 'created_at'>) => {
    try {
      await komunitasApi.createKomentar(newKomentar);
      await fetchData();
      toast({ title: "Berhasil", description: "Komentar berhasil ditambahkan" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menambahkan komentar", variant: "destructive" });
    }
  }, [fetchData]);

  const updateKomentar = useCallback(async (id: number, konten: string) => {
    try {
      await komunitasApi.updateKomentar({ id, konten });
      await fetchData();
      toast({ title: "Berhasil", description: "Komentar berhasil diperbarui" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal memperbarui komentar", variant: "destructive" });
    }
  }, [fetchData]);

  const deleteKomentar = useCallback(async (id: number) => {
    try {
      await komunitasApi.deleteKomentar(id);
      await fetchData();
      toast({ title: "Berhasil", description: "Komentar berhasil dihapus" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus komentar", variant: "destructive" });
    }
  }, [fetchData]);

  // Umpan Balik CRUD
  const addUmpanBalik = useCallback(async (newFeedback: Omit<UmpanBalik, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await umpanBalikApi.create(newFeedback);
      await fetchData();
      toast({ title: "Berhasil", description: "Umpan balik berhasil dikirim" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal mengirim umpan balik", variant: "destructive" });
    }
  }, [fetchData]);

  const updateUmpanBalik = useCallback(async (id: number, updates: Partial<UmpanBalik>) => {
    try {
      await umpanBalikApi.update({ id, ...updates });
      await fetchData();
      toast({ title: "Berhasil", description: "Umpan balik berhasil diperbarui" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal memperbarui umpan balik", variant: "destructive" });
    }
  }, [fetchData]);

  const deleteUmpanBalik = useCallback(async (id: number) => {
    try {
      await umpanBalikApi.delete(id);
      await fetchData();
      toast({ title: "Berhasil", description: "Umpan balik berhasil dihapus" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus umpan balik", variant: "destructive" });
    }
  }, [fetchData]);

  // Hasil Ujian
  const submitHasilUjian = useCallback(async (hasil: Omit<HasilUjian, 'id' | 'created_at'>) => {
    try {
      await ujianApi.submitHasil(hasil);
      // Data hasil ujian bersifat per-user, komponen yang menampilkan harus me-refresh datanya sendiri
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal mengirimkan hasil ujian.", variant: "destructive" });
    }
  }, []);

  // Progress Belajar
  const updateProgress = useCallback(async (userId: number, materiId: number, bahasaId: number, data: Partial<ProgressBelajar>) => {
    try {
      await progressApi.update({ user_id: userId, materi_id: materiId, bahasa_id: bahasaId, ...data });
      // Refresh data agar UI terupdate
      await fetchData();
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal memperbarui progress belajar.", variant: "destructive" });
    }
  }, [fetchData]);

  // Laporan Pelanggaran
  const addLaporan = useCallback(async (newLaporan: Omit<LaporanPelanggaran, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await komunitasApi.createLaporan(newLaporan);
      await fetchData();
      toast({ title: "Berhasil", description: "Laporan berhasil dikirim" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal mengirim laporan", variant: "destructive" });
    }
  }, [fetchData]);

  const updateLaporan = useCallback(async (id: number, updates: Partial<LaporanPelanggaran>) => {
    try {
      await komunitasApi.updateLaporan({ id, ...updates });
      await fetchData();
      toast({ title: "Berhasil", description: "Laporan berhasil diperbarui" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal memperbarui laporan", variant: "destructive" });
    }
  }, [fetchData]);

  const deleteLaporan = useCallback(async (id: number) => {
    try {
      await komunitasApi.deleteLaporan(id);
      await fetchData();
      toast({ title: "Berhasil", description: "Laporan berhasil dihapus" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus laporan", variant: "destructive" });
    }
  }, [fetchData]);

  // Bahasa CRUD
  const addBahasa = useCallback(async (newBahasa: Omit<BahasaDaerah, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await bahasaApi.create(newBahasa);
      await fetchData();
      toast({ title: "Berhasil", description: "Bahasa berhasil ditambahkan" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menambahkan bahasa", variant: "destructive" });
    }
  }, [fetchData]);

  const updateBahasa = useCallback(async (id: number, updates: Partial<BahasaDaerah>) => {
    try {
      await bahasaApi.update({ id, ...updates });
      await fetchData();
      toast({ title: "Berhasil", description: "Bahasa berhasil diperbarui" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal memperbarui bahasa", variant: "destructive" });
    }
  }, [fetchData]);

  const deleteBahasa = useCallback(async (id: number) => {
    try {
      await bahasaApi.delete(id);
      await fetchData();
      toast({ title: "Berhasil", description: "Bahasa berhasil dihapus" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus bahasa", variant: "destructive" });
    }
  }, [fetchData]);

  // Komunitas CRUD
  const addKomunitas = useCallback(async (newKomunitas: Omit<Komunitas, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await komunitasApi.create(newKomunitas);
      await fetchData();
      toast({ title: "Berhasil", description: "Komunitas berhasil ditambahkan" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menambahkan komunitas", variant: "destructive" });
    }
  }, [fetchData]);

  const updateKomunitas = useCallback(async (id: number, updates: Partial<Komunitas>) => {
    try {
      await komunitasApi.update({ id, ...updates });
      await fetchData();
      toast({ title: "Berhasil", description: "Komunitas berhasil diperbarui" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal memperbarui komunitas", variant: "destructive" });
    }
  }, [fetchData]);

  const deleteKomunitas = useCallback(async (id: number) => {
    try {
      await komunitasApi.delete(id);
      await fetchData();
      toast({ title: "Berhasil", description: "Komunitas berhasil dihapus" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal menghapus komunitas", variant: "destructive" });
    }
  }, [fetchData]);

  // User Status
  const updateUserStatus = useCallback(async (id: number, status: User['status']) => {
    try {
      await authApi.updateUserStatus(id, status);
      await fetchData();
      toast({ title: "Berhasil", description: "Status pengguna berhasil diperbarui" });
    } catch (error) {
      toast({ title: "Gagal", description: "Gagal memperbarui status pengguna", variant: "destructive" });
    }
  }, [fetchData]);

  return (
    <DataContext.Provider value={{
      isLoading,
      bahasaDaerah, materi, ujian, soalUjian, komunitas,
      diskusi, komentarDiskusi, umpanBalik, hasilUjian,
      progressBelajar, laporanPelanggaran, users,
      addMateri, updateMateri, deleteMateri,
      addUjian, updateUjian, deleteUjian,
      addSoalUjian, updateSoalUjian, deleteSoalUjian,
      addDiskusi, updateDiskusi, deleteDiskusi,
      addKomentar, updateKomentar, deleteKomentar,
      addUmpanBalik, updateUmpanBalik, deleteUmpanBalik,
      submitHasilUjian, updateProgress,
      addLaporan, updateLaporan, deleteLaporan,
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
