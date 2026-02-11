import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Search, BookOpen } from 'lucide-react';
import { kamusApi } from '@/lib/api';

interface KamusEntry {
  id: number;
  bahasa_id: number;
  kata_daerah: string;
  kata_indonesia: string;
  contoh_kalimat?: string;
  kategori: string;
  nama_bahasa?: string;
}

// Static fallback data
const staticKamus: KamusEntry[] = [
  { id: 1, bahasa_id: 1, kata_daerah: 'Wilujeng', kata_indonesia: 'Selamat', kategori: 'Sapaan', nama_bahasa: 'Bahasa Sunda' },
  { id: 2, bahasa_id: 1, kata_daerah: 'Hatur nuhun', kata_indonesia: 'Terima kasih', kategori: 'Sapaan', nama_bahasa: 'Bahasa Sunda' },
  { id: 3, bahasa_id: 1, kata_daerah: 'Punten', kata_indonesia: 'Permisi / Maaf', kategori: 'Sapaan', nama_bahasa: 'Bahasa Sunda' },
  { id: 4, bahasa_id: 1, kata_daerah: 'Hiji', kata_indonesia: 'Satu', kategori: 'Angka', nama_bahasa: 'Bahasa Sunda' },
  { id: 5, bahasa_id: 1, kata_daerah: 'Dua', kata_indonesia: 'Dua', kategori: 'Angka', nama_bahasa: 'Bahasa Sunda' },
  { id: 6, bahasa_id: 1, kata_daerah: 'Tilu', kata_indonesia: 'Tiga', kategori: 'Angka', nama_bahasa: 'Bahasa Sunda' },
  { id: 7, bahasa_id: 1, kata_daerah: 'Bapa', kata_indonesia: 'Ayah', kategori: 'Keluarga', nama_bahasa: 'Bahasa Sunda' },
  { id: 8, bahasa_id: 2, kata_daerah: 'Sugeng', kata_indonesia: 'Selamat', kategori: 'Sapaan', nama_bahasa: 'Bahasa Jawa' },
  { id: 9, bahasa_id: 2, kata_daerah: 'Matur nuwun', kata_indonesia: 'Terima kasih', kategori: 'Sapaan', nama_bahasa: 'Bahasa Jawa' },
  { id: 10, bahasa_id: 2, kata_daerah: 'Siji', kata_indonesia: 'Satu', kategori: 'Angka', nama_bahasa: 'Bahasa Jawa' },
  { id: 11, bahasa_id: 3, kata_daerah: 'Rahajeng', kata_indonesia: 'Selamat', kategori: 'Sapaan', nama_bahasa: 'Bahasa Bali' },
  { id: 12, bahasa_id: 3, kata_daerah: 'Matur suksma', kata_indonesia: 'Terima kasih', kategori: 'Sapaan', nama_bahasa: 'Bahasa Bali' },
  { id: 13, bahasa_id: 4, kata_daerah: 'Tarimo kasih', kata_indonesia: 'Terima kasih', kategori: 'Sapaan', nama_bahasa: 'Bahasa Minang' },
];

export default function KamusPage() {
  const { bahasaDaerah } = useData();
  const [query, setQuery] = useState('');
  const [selectedBahasa, setSelectedBahasa] = useState<string>('semua');
  const [results, setResults] = useState<KamusEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const activeBahasa = bahasaDaerah.filter(b => b.status === 'aktif');

  const doSearch = async () => {
    if (!query.trim() && selectedBahasa === 'semua') return;
    setLoading(true);
    setHasSearched(true);
    try {
      const bahasaId = selectedBahasa !== 'semua' ? Number(selectedBahasa) : undefined;
      const res = query.trim()
        ? await kamusApi.search(query, bahasaId)
        : await kamusApi.list(bahasaId);
      setResults(res.data || []);
    } catch {
      // Fallback to static
      const filtered = staticKamus.filter(k => {
        const matchQuery = !query.trim() || 
          k.kata_daerah.toLowerCase().includes(query.toLowerCase()) ||
          k.kata_indonesia.toLowerCase().includes(query.toLowerCase());
        const matchBahasa = selectedBahasa === 'semua' || k.bahasa_id === Number(selectedBahasa);
        return matchQuery && matchBahasa;
      });
      setResults(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') doSearch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Kamus Digital</h1>
          <p className="text-muted-foreground">Cari kata dalam bahasa daerah atau bahasa Indonesia</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Ketik kata yang dicari..." 
                  className="pl-10"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Select value={selectedBahasa} onValueChange={setSelectedBahasa}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Semua Bahasa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Bahasa</SelectItem>
                  {activeBahasa.map(b => (
                    <SelectItem key={b.id} value={String(b.id)}>{b.nama_bahasa}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={doSearch}>
                <Search className="h-4 w-4 mr-2" />Cari
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Mencari...</div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">{results.length} hasil ditemukan</p>
            {results.map(entry => (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-primary">{entry.kata_daerah}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-semibold text-lg">{entry.kata_indonesia}</span>
                      </div>
                      {entry.contoh_kalimat && (
                        <p className="text-sm text-muted-foreground italic mt-1">"{entry.contoh_kalimat}"</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{entry.nama_bahasa || `Bahasa #${entry.bahasa_id}`}</Badge>
                      <Badge variant="outline">{entry.kategori}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : hasSearched ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Kata tidak ditemukan. Coba kata lain.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Ketik kata dan klik "Cari" untuk mulai mencari</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
