import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Plus, Edit, Trash2, AlertTriangle, Eye, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Komunitas, LaporanPelanggaran } from '@/types/database';

export default function AdminKomunitas() {
  const { 
    bahasaDaerah, komunitas, diskusi, laporanPelanggaran, users,
    addKomunitas, updateKomunitas, deleteKomunitas,
    deleteDiskusi, updateLaporan
  } = useData();
  
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Komunitas | null>(null);
  const [showLaporanDetail, setShowLaporanDetail] = useState<LaporanPelanggaran | null>(null);
  
  const [form, setForm] = useState({
    bahasa_id: 1,
    nama: '',
    deskripsi: '',
    aturan: '',
    status: 'aktif' as 'aktif' | 'nonaktif'
  });

  const handleSubmit = () => {
    if (editItem) {
      updateKomunitas(editItem.id, form);
    } else {
      addKomunitas(form);
    }
    setShowForm(false);
    setEditItem(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({ bahasa_id: 1, nama: '', deskripsi: '', aturan: '', status: 'aktif' });
  };

  const openEdit = (item: Komunitas) => {
    setEditItem(item);
    setForm({
      bahasa_id: item.bahasa_id,
      nama: item.nama,
      deskripsi: item.deskripsi || '',
      aturan: item.aturan || '',
      status: item.status
    });
    setShowForm(true);
  };

  const handleLaporanAction = (laporan: LaporanPelanggaran, status: 'selesai' | 'ditolak', tindakan?: string) => {
    updateLaporan(laporan.id, { status, tindakan });
    setShowLaporanDetail(null);
  };

  const getUserName = (userId: number) => {
    return users.find(u => u.id === userId)?.nama || 'Unknown';
  };

  const pendingLaporan = laporanPelanggaran.filter(l => l.status === 'menunggu' || l.status === 'diproses');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Kelola Komunitas</h1>

        <Tabs defaultValue="komunitas">
          <TabsList className="mb-6">
            <TabsTrigger value="komunitas">Komunitas</TabsTrigger>
            <TabsTrigger value="diskusi">Diskusi</TabsTrigger>
            <TabsTrigger value="laporan" className="flex items-center gap-2">
              Laporan Pelanggaran
              {pendingLaporan.length > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingLaporan.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="komunitas">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />Tambah Komunitas
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {komunitas.map(k => {
                const diskusiCount = diskusi.filter(d => d.komunitas_id === k.id).length;
                return (
                  <Card key={k.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{k.nama}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{k.deskripsi}</p>
                          <div className="flex gap-2 mt-3">
                            <Badge variant="secondary">{bahasaDaerah.find(b => b.id === k.bahasa_id)?.nama_bahasa}</Badge>
                            <Badge variant="outline"><MessageSquare className="h-3 w-3 mr-1" />{diskusiCount} diskusi</Badge>
                            <Badge variant={k.status === 'aktif' ? 'default' : 'destructive'}>{k.status}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(k)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteKomunitas(k.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="diskusi">
            <div className="space-y-4">
              {diskusi.length > 0 ? diskusi.map(d => {
                const komunName = komunitas.find(k => k.id === d.komunitas_id)?.nama;
                return (
                  <Card key={d.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{d.judul}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{d.konten}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{komunName}</Badge>
                            <Badge variant="outline">Oleh: {getUserName(d.user_id)}</Badge>
                            <Badge variant={d.status === 'aktif' ? 'default' : 'destructive'}>{d.status}</Badge>
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => deleteDiskusi(d.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              }) : (
                <p className="text-center text-muted-foreground py-8">Belum ada diskusi</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="laporan">
            <div className="space-y-4">
              {laporanPelanggaran.length > 0 ? laporanPelanggaran.map(l => (
                <Card key={l.id} className={l.status === 'menunggu' ? 'border-warning' : ''}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${l.status === 'menunggu' ? 'text-warning' : 'text-muted-foreground'}`} />
                          <span className="font-medium">Laporan #{l.id}</span>
                        </div>
                        <p className="text-sm mt-2">{l.alasan}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">Pelapor: {getUserName(l.pelapor_id)}</Badge>
                          <Badge variant="outline">Terlapor: {getUserName(l.terlapor_id)}</Badge>
                          <Badge variant={
                            l.status === 'menunggu' ? 'default' : 
                            l.status === 'selesai' ? 'secondary' : 
                            l.status === 'ditolak' ? 'destructive' : 'outline'
                          }>{l.status}</Badge>
                        </div>
                        {l.tindakan && <p className="text-sm text-muted-foreground mt-2">Tindakan: {l.tindakan}</p>}
                      </div>
                      {(l.status === 'menunggu' || l.status === 'diproses') && (
                        <Button variant="outline" size="sm" onClick={() => setShowLaporanDetail(l)}>
                          <Eye className="h-4 w-4 mr-1" />Proses
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <p className="text-center text-muted-foreground py-8">Tidak ada laporan pelanggaran</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog Komunitas */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit' : 'Tambah'} Komunitas</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={String(form.bahasa_id)} onValueChange={v => setForm({...form, bahasa_id: Number(v)})}>
                <SelectTrigger><SelectValue placeholder="Pilih Bahasa" /></SelectTrigger>
                <SelectContent>
                  {bahasaDaerah.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.nama_bahasa}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input placeholder="Nama Komunitas" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} />
              <Textarea placeholder="Deskripsi" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} />
              <Textarea placeholder="Aturan Komunitas" rows={4} value={form.aturan} onChange={e => setForm({...form, aturan: e.target.value})} />
              <Select value={form.status} onValueChange={(v: 'aktif' | 'nonaktif') => setForm({...form, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditItem(null); resetForm(); }}>Batal</Button>
              <Button onClick={handleSubmit}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Proses Laporan */}
        <Dialog open={!!showLaporanDetail} onOpenChange={() => setShowLaporanDetail(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Proses Laporan Pelanggaran</DialogTitle>
            </DialogHeader>
            {showLaporanDetail && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Pelapor</label>
                  <p>{getUserName(showLaporanDetail.pelapor_id)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Terlapor</label>
                  <p>{getUserName(showLaporanDetail.terlapor_id)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Alasan Laporan</label>
                  <p>{showLaporanDetail.alasan}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleLaporanAction(showLaporanDetail, 'selesai', 'Pengguna diberi peringatan')}
                  >
                    Beri Peringatan
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleLaporanAction(showLaporanDetail, 'ditolak', 'Laporan tidak valid')}
                  >
                    Tolak Laporan
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
