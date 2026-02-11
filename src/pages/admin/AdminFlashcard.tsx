import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Plus, Edit, Trash2, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { flashcardApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface FlashcardItem {
  id: number;
  bahasa_id: number;
  kata_daerah: string;
  kata_indonesia: string;
  kategori: string;
}

export default function AdminFlashcard() {
  const { bahasaDaerah } = useData();
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<FlashcardItem | null>(null);
  const [form, setForm] = useState({ bahasa_id: 1, kata_daerah: '', kata_indonesia: '', kategori: 'Umum' });

  const fetchCards = async () => {
    try {
      const res = await flashcardApi.list();
      setCards(res.data || []);
    } catch { setCards([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCards(); }, []);

  const handleSubmit = async () => {
    try {
      if (editItem) {
        await flashcardApi.update({ id: editItem.id, ...form });
        toast({ title: "Berhasil", description: "Flashcard diperbarui" });
      } else {
        await flashcardApi.create(form);
        toast({ title: "Berhasil", description: "Flashcard ditambahkan" });
      }
      await fetchCards();
      setShowForm(false);
      setEditItem(null);
      setForm({ bahasa_id: 1, kata_daerah: '', kata_indonesia: '', kategori: 'Umum' });
    } catch {
      toast({ title: "Gagal", description: "Operasi gagal", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await flashcardApi.delete(id);
      toast({ title: "Berhasil", description: "Flashcard dihapus" });
      await fetchCards();
    } catch {
      toast({ title: "Gagal", description: "Gagal menghapus", variant: "destructive" });
    }
  };

  const openEdit = (item: FlashcardItem) => {
    setEditItem(item);
    setForm({ bahasa_id: item.bahasa_id, kata_daerah: item.kata_daerah, kata_indonesia: item.kata_indonesia, kategori: item.kategori });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kelola Flashcard</h1>
          <Button onClick={() => { setEditItem(null); setForm({ bahasa_id: 1, kata_daerah: '', kata_indonesia: '', kategori: 'Umum' }); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />Tambah Flashcard
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Memuat...</div>
        ) : cards.length > 0 ? (
          <div className="space-y-3">
            {cards.map(card => (
              <Card key={card.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{card.kata_daerah}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-semibold">{card.kata_indonesia}</span>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{bahasaDaerah.find(b => b.id === card.bahasa_id)?.nama_bahasa}</Badge>
                      <Badge variant="outline">{card.kategori}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(card)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(card.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card><CardContent className="p-12 text-center">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Belum ada flashcard. Tambahkan dari tombol di atas.</p>
          </CardContent></Card>
        )}

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editItem ? 'Edit' : 'Tambah'} Flashcard</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Select value={String(form.bahasa_id)} onValueChange={v => setForm({...form, bahasa_id: Number(v)})}>
                <SelectTrigger><SelectValue placeholder="Pilih Bahasa" /></SelectTrigger>
                <SelectContent>{bahasaDaerah.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.nama_bahasa}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Kata Daerah" value={form.kata_daerah} onChange={e => setForm({...form, kata_daerah: e.target.value})} />
              <Input placeholder="Arti (Indonesia)" value={form.kata_indonesia} onChange={e => setForm({...form, kata_indonesia: e.target.value})} />
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
