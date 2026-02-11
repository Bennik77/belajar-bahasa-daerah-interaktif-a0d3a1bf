import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Materi } from '@/types/database';

export default function AdminPembelajaran() {
  const { bahasaDaerah, materi, addMateri, updateMateri, deleteMateri } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Materi | null>(null);
  const [form, setForm] = useState<{ bahasa_id: number; judul: string; deskripsi: string; konten: string; tipe: 'membaca' | 'latihan' | 'tugas' | 'video'; urutan: number; durasi_menit: number; status: 'aktif' | 'nonaktif' }>({ bahasa_id: 1, judul: '', deskripsi: '', konten: '', tipe: 'membaca', urutan: 0, durasi_menit: 15, status: 'aktif' });

  const handleSubmit = () => {
    if (editItem) {
      updateMateri(editItem.id, form);
    } else {
      addMateri(form);
    }
    setShowForm(false);
    setEditItem(null);
    setForm({ bahasa_id: 1, judul: '', deskripsi: '', konten: '', tipe: 'membaca' as const, urutan: 0, durasi_menit: 15, status: 'aktif' as const });
  };

  const openEdit = (item: Materi) => {
    setEditItem(item);
    setForm({ bahasa_id: item.bahasa_id, judul: item.judul, deskripsi: item.deskripsi || '', konten: item.konten || '', tipe: item.tipe, urutan: item.urutan, durasi_menit: item.durasi_menit, status: item.status });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kelola Pembelajaran</h1>
          <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-2" />Tambah Materi</Button>
        </div>

        <div className="space-y-4">
          {materi.map(m => (
            <Card key={m.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{m.judul}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">{bahasaDaerah.find(b => b.id === m.bahasa_id)?.nama_bahasa}</Badge>
                    <Badge variant="outline">{m.tipe}</Badge>
                    <Badge variant={m.status === 'aktif' ? 'default' : 'destructive'}>{m.status}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(m)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteMateri(m.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editItem ? 'Edit' : 'Tambah'} Materi</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Select value={String(form.bahasa_id)} onValueChange={v => setForm({...form, bahasa_id: Number(v)})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{bahasaDaerah.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.nama_bahasa}</SelectItem>)}</SelectContent></Select>
              <Input placeholder="Judul" value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} />
              <Textarea placeholder="Deskripsi" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} />
              <Textarea placeholder="Konten (HTML)" rows={6} value={form.konten} onChange={e => setForm({...form, konten: e.target.value})} />
              <div className="grid grid-cols-3 gap-4">
                <Select value={form.tipe} onValueChange={(v: any) => setForm({...form, tipe: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="membaca">Membaca</SelectItem><SelectItem value="latihan">Latihan</SelectItem><SelectItem value="tugas">Tugas</SelectItem><SelectItem value="video">Video</SelectItem></SelectContent></Select>
                <Input type="number" placeholder="Urutan" value={form.urutan} onChange={e => setForm({...form, urutan: Number(e.target.value)})} />
                <Input type="number" placeholder="Durasi (menit)" value={form.durasi_menit} onChange={e => setForm({...form, durasi_menit: Number(e.target.value)})} />
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setShowForm(false)}>Batal</Button><Button onClick={handleSubmit}>Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
