import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Plus, Edit, Trash2, BookOpen, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { kamusApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface KamusItem {
  id: number;
  bahasa_id: number;
  kata_daerah: string;
  kata_indonesia: string;
  contoh_kalimat?: string;
  kategori: string;
  nama_bahasa?: string;
}

export default function AdminKamus() {
  const { bahasaDaerah } = useData();
  const [entries, setEntries] = useState<KamusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<KamusItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ bahasa_id: 1, kata_daerah: '', kata_indonesia: '', contoh_kalimat: '', kategori: 'Umum' });

  const fetchEntries = async () => {
    try {
      const res = await kamusApi.list();
      setEntries(res.data || []);
    } catch { setEntries([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleSubmit = async () => {
    try {
      if (editItem) {
        await kamusApi.update({ id: editItem.id, ...form });
        toast({ title: "Berhasil", description: "Kamus diperbarui" });
      } else {
        await kamusApi.create(form);
        toast({ title: "Berhasil", description: "Kata ditambahkan ke kamus" });
      }
      await fetchEntries();
      setShowForm(false);
      setEditItem(null);
      setForm({ bahasa_id: 1, kata_daerah: '', kata_indonesia: '', contoh_kalimat: '', kategori: 'Umum' });
    } catch {
      toast({ title: "Gagal", description: "Operasi gagal", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await kamusApi.delete(id);
      toast({ title: "Berhasil", description: "Kata dihapus dari kamus" });
      await fetchEntries();
    } catch {
      toast({ title: "Gagal", description: "Gagal menghapus", variant: "destructive" });
    }
  };

  const openEdit = (item: KamusItem) => {
    setEditItem(item);
    setForm({ bahasa_id: item.bahasa_id, kata_daerah: item.kata_daerah, kata_indonesia: item.kata_indonesia, contoh_kalimat: item.contoh_kalimat || '', kategori: item.kategori });
    setShowForm(true);
  };

  const filtered = entries.filter(e =>
    !searchQuery || e.kata_daerah.toLowerCase().includes(searchQuery.toLowerCase()) || e.kata_indonesia.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kelola Kamus</h1>
          <Button onClick={() => { setEditItem(null); setForm({ bahasa_id: 1, kata_daerah: '', kata_indonesia: '', contoh_kalimat: '', kategori: 'Umum' }); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />Tambah Kata
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari kata..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Memuat...</div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map(entry => (
              <Card key={entry.id}>
                <CardContent className="p-4 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{entry.kata_daerah}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-semibold">{entry.kata_indonesia}</span>
                    </div>
                    {entry.contoh_kalimat && <p className="text-sm text-muted-foreground italic mt-1">"{entry.contoh_kalimat}"</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{entry.nama_bahasa || bahasaDaerah.find(b => b.id === entry.bahasa_id)?.nama_bahasa}</Badge>
                      <Badge variant="outline">{entry.kategori}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(entry)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(entry.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card><CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Belum ada data kamus.</p>
          </CardContent></Card>
        )}

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editItem ? 'Edit' : 'Tambah'} Kata Kamus</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Select value={String(form.bahasa_id)} onValueChange={v => setForm({...form, bahasa_id: Number(v)})}>
                <SelectTrigger><SelectValue placeholder="Pilih Bahasa" /></SelectTrigger>
                <SelectContent>{bahasaDaerah.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.nama_bahasa}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Kata Daerah" value={form.kata_daerah} onChange={e => setForm({...form, kata_daerah: e.target.value})} />
              <Input placeholder="Arti (Indonesia)" value={form.kata_indonesia} onChange={e => setForm({...form, kata_indonesia: e.target.value})} />
              <Textarea placeholder="Contoh kalimat (opsional)" value={form.contoh_kalimat} onChange={e => setForm({...form, contoh_kalimat: e.target.value})} />
              <Input placeholder="Kategori (misal: Sapaan, Angka)" value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
              <Button onClick={handleSubmit} disabled={!form.kata_daerah.trim() || !form.kata_indonesia.trim()}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
