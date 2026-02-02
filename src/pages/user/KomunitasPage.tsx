import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Users, MessageSquare, Send, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function KomunitasPage() {
  const { user } = useAuth();
  const { komunitas, diskusi, komentarDiskusi, users, addDiskusi, addKomentar, addLaporan } = useData();
  const [selectedKomunitas, setSelectedKomunitas] = useState<number | null>(null);
  const [selectedDiskusi, setSelectedDiskusi] = useState<number | null>(null);
  const [newDiskusiJudul, setNewDiskusiJudul] = useState('');
  const [newDiskusiKonten, setNewDiskusiKonten] = useState('');
  const [newKomentar, setNewKomentar] = useState('');
  const [showNewDiskusi, setShowNewDiskusi] = useState(false);

  const activeKomunitas = komunitas.filter(k => k.status === 'aktif');
  const diskusiList = diskusi.filter(d => d.komunitas_id === selectedKomunitas && d.status === 'aktif');
  const selectedDiskusiData = diskusi.find(d => d.id === selectedDiskusi);
  const komentarList = komentarDiskusi.filter(k => k.diskusi_id === selectedDiskusi && k.status === 'aktif');

  const getUserName = (userId: number) => users.find(u => u.id === userId)?.nama || 'Pengguna';

  const handleAddDiskusi = () => {
    if (!user || !selectedKomunitas || !newDiskusiJudul.trim() || !newDiskusiKonten.trim()) return;
    addDiskusi({
      komunitas_id: selectedKomunitas,
      user_id: user.id,
      judul: newDiskusiJudul,
      konten: newDiskusiKonten,
      status: 'aktif'
    });
    setNewDiskusiJudul('');
    setNewDiskusiKonten('');
    setShowNewDiskusi(false);
  };

  const handleAddKomentar = () => {
    if (!user || !selectedDiskusi || !newKomentar.trim()) return;
    addKomentar({
      diskusi_id: selectedDiskusi,
      user_id: user.id,
      konten: newKomentar,
      status: 'aktif'
    });
    setNewKomentar('');
  };

  const handleLapor = (terlapor_id: number, diskusi_id?: number, komentar_id?: number) => {
    if (!user) return;
    const alasan = prompt('Masukkan alasan pelaporan:');
    if (!alasan) return;
    addLaporan({ pelapor_id: user.id, terlapor_id, diskusi_id, komentar_id, alasan, status: 'menunggu' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        {!selectedKomunitas ? (
          <>
            <h1 className="text-3xl font-bold mb-6">Komunitas Belajar</h1>
            <div className="grid md:grid-cols-2 gap-6">
              {activeKomunitas.map(k => (
                <Card key={k.id} className="card-hover cursor-pointer" onClick={() => setSelectedKomunitas(k.id)}>
                  <CardContent className="p-6">
                    <Users className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-lg">{k.nama}</h3>
                    <p className="text-muted-foreground text-sm">{k.deskripsi}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : !selectedDiskusi ? (
          <>
            <Button variant="ghost" onClick={() => setSelectedKomunitas(null)} className="mb-4">← Kembali</Button>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{komunitas.find(k => k.id === selectedKomunitas)?.nama}</h1>
              <Button onClick={() => setShowNewDiskusi(true)}><MessageSquare className="h-4 w-4 mr-2" />Buat Diskusi</Button>
            </div>
            {showNewDiskusi && (
              <Card className="mb-6">
                <CardContent className="p-4 space-y-3">
                  <input className="w-full p-2 border rounded" placeholder="Judul diskusi" value={newDiskusiJudul} onChange={e => setNewDiskusiJudul(e.target.value)} />
                  <Textarea placeholder="Isi diskusi" value={newDiskusiKonten} onChange={e => setNewDiskusiKonten(e.target.value)} />
                  <div className="flex gap-2">
                    <Button onClick={handleAddDiskusi}>Kirim</Button>
                    <Button variant="outline" onClick={() => setShowNewDiskusi(false)}>Batal</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="space-y-4">
              {diskusiList.map(d => (
                <Card key={d.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedDiskusi(d.id)}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{d.judul}</h3>
                    <p className="text-sm text-muted-foreground">{getUserName(d.user_id)} • {format(new Date(d.created_at), 'd MMM yyyy', { locale: localeId })}</p>
                  </CardContent>
                </Card>
              ))}
              {diskusiList.length === 0 && <p className="text-muted-foreground text-center py-8">Belum ada diskusi</p>}
            </div>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setSelectedDiskusi(null)} className="mb-4">← Kembali</Button>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{selectedDiskusiData?.judul}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{getUserName(selectedDiskusiData?.user_id || 0)}</Badge>
                  <span className="text-sm text-muted-foreground">{format(new Date(selectedDiskusiData?.created_at || ''), 'd MMM yyyy', { locale: localeId })}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleLapor(selectedDiskusiData?.user_id || 0, selectedDiskusiData?.id)}><Flag className="h-3 w-3" /></Button>
                </div>
              </CardHeader>
              <CardContent><p>{selectedDiskusiData?.konten}</p></CardContent>
            </Card>
            <h3 className="font-semibold mb-4">Komentar ({komentarList.length})</h3>
            <div className="space-y-3 mb-6">
              {komentarList.map(k => (
                <Card key={k.id}>
                  <CardContent className="p-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">{getUserName(k.user_id)}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleLapor(k.user_id, undefined, k.id)}><Flag className="h-3 w-3" /></Button>
                    </div>
                    <p className="text-sm">{k.konten}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea placeholder="Tulis komentar..." value={newKomentar} onChange={e => setNewKomentar(e.target.value)} className="flex-1" />
              <Button onClick={handleAddKomentar}><Send className="h-4 w-4" /></Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
