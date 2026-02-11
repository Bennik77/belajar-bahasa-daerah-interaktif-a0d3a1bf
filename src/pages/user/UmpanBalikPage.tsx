import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { MessageSquare, Star, Send } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function UmpanBalikPage() {
  const { user } = useAuth();
  const { umpanBalik, addUmpanBalik } = useData();
  const [kategori, setKategori] = useState<'materi' | 'ujian' | 'website' | 'lainnya'>('website');
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState('');

  const userFeedback = umpanBalik.filter(u => u.user_id === user?.id);

  const handleSubmit = () => {
    if (!user || !komentar.trim()) return;
    addUmpanBalik({ user_id: user.id, kategori, rating, komentar, status: 'menunggu' });
    setKomentar('');
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Umpan Balik</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader><CardTitle>Kirim Umpan Balik</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Kategori</Label>
                <Select value={kategori} onValueChange={(v: any) => setKategori(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="materi">Materi</SelectItem>
                    <SelectItem value="ujian">Ujian</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rating</Label>
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setRating(n)}>
                      <Star className={`h-6 w-6 ${n <= rating ? 'fill-warning text-warning' : 'text-muted'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Komentar</Label>
                <Textarea placeholder="Tulis umpan balik Anda..." value={komentar} onChange={e => setKomentar(e.target.value)} />
              </div>
              <Button onClick={handleSubmit} className="w-full"><Send className="h-4 w-4 mr-2" />Kirim</Button>
            </CardContent>
          </Card>

          <div>
            <h2 className="font-semibold mb-4">Riwayat Umpan Balik</h2>
            <div className="space-y-3">
              {userFeedback.length > 0 ? userFeedback.map(f => (
                <Card key={f.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <Badge variant="secondary">{f.kategori}</Badge>
                      <Badge variant={f.status === 'selesai' ? 'default' : 'outline'}>{f.status}</Badge>
                    </div>
                    <div className="flex gap-1 mb-2">{[1,2,3,4,5].map(n => <Star key={n} className={`h-4 w-4 ${n <= f.rating ? 'fill-warning text-warning' : 'text-muted'}`} />)}</div>
                    <p className="text-sm">{f.komentar}</p>
                    {f.balasan && <div className="mt-2 p-2 bg-muted rounded text-sm"><strong>Balasan:</strong> {f.balasan}</div>}
                    <p className="text-xs text-muted-foreground mt-2">{format(new Date(f.created_at), 'd MMM yyyy', { locale: localeId })}</p>
                  </CardContent>
                </Card>
              )) : <p className="text-muted-foreground">Belum ada umpan balik</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
