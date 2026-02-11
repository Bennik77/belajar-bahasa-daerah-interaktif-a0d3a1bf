import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { RotateCcw, ArrowLeft, ArrowRight, Zap, CheckCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { flashcardApi } from '@/lib/api';

interface Flashcard {
  id: number;
  bahasa_id: number;
  kata_daerah: string;
  kata_indonesia: string;
  kategori: string;
}

// Static fallback data
const staticFlashcards: Record<number, Flashcard[]> = {
  1: [
    { id: 1, bahasa_id: 1, kata_daerah: 'Wilujeng énjing', kata_indonesia: 'Selamat pagi', kategori: 'Sapaan' },
    { id: 2, bahasa_id: 1, kata_daerah: 'Hatur nuhun', kata_indonesia: 'Terima kasih', kategori: 'Sapaan' },
    { id: 3, bahasa_id: 1, kata_daerah: 'Kumaha damang?', kata_indonesia: 'Apa kabar?', kategori: 'Sapaan' },
    { id: 4, bahasa_id: 1, kata_daerah: 'Punten', kata_indonesia: 'Permisi / Maaf', kategori: 'Sapaan' },
    { id: 5, bahasa_id: 1, kata_daerah: 'Hiji', kata_indonesia: 'Satu', kategori: 'Angka' },
    { id: 6, bahasa_id: 1, kata_daerah: 'Dua', kata_indonesia: 'Dua', kategori: 'Angka' },
    { id: 7, bahasa_id: 1, kata_daerah: 'Tilu', kata_indonesia: 'Tiga', kategori: 'Angka' },
    { id: 8, bahasa_id: 1, kata_daerah: 'Bapa', kata_indonesia: 'Ayah', kategori: 'Keluarga' },
    { id: 9, bahasa_id: 1, kata_daerah: 'Ema / Ibu', kata_indonesia: 'Ibu', kategori: 'Keluarga' },
    { id: 10, bahasa_id: 1, kata_daerah: 'Lanceuk', kata_indonesia: 'Kakak', kategori: 'Keluarga' },
  ],
  2: [
    { id: 11, bahasa_id: 2, kata_daerah: 'Sugeng enjing', kata_indonesia: 'Selamat pagi', kategori: 'Sapaan' },
    { id: 12, bahasa_id: 2, kata_daerah: 'Matur nuwun', kata_indonesia: 'Terima kasih', kategori: 'Sapaan' },
    { id: 13, bahasa_id: 2, kata_daerah: 'Piye kabare?', kata_indonesia: 'Apa kabar?', kategori: 'Sapaan' },
    { id: 14, bahasa_id: 2, kata_daerah: 'Nuwun sewu', kata_indonesia: 'Permisi', kategori: 'Sapaan' },
    { id: 15, bahasa_id: 2, kata_daerah: 'Siji', kata_indonesia: 'Satu', kategori: 'Angka' },
    { id: 16, bahasa_id: 2, kata_daerah: 'Loro', kata_indonesia: 'Dua', kategori: 'Angka' },
    { id: 17, bahasa_id: 2, kata_daerah: 'Telu', kata_indonesia: 'Tiga', kategori: 'Angka' },
  ],
  3: [
    { id: 18, bahasa_id: 3, kata_daerah: 'Rahajeng semeng', kata_indonesia: 'Selamat pagi', kategori: 'Sapaan' },
    { id: 19, bahasa_id: 3, kata_daerah: 'Matur suksma', kata_indonesia: 'Terima kasih', kategori: 'Sapaan' },
    { id: 20, bahasa_id: 3, kata_daerah: 'Kenken kabare?', kata_indonesia: 'Apa kabar?', kategori: 'Sapaan' },
  ],
  4: [
    { id: 21, bahasa_id: 4, kata_daerah: 'Salamaik pagi', kata_indonesia: 'Selamat pagi', kategori: 'Sapaan' },
    { id: 22, bahasa_id: 4, kata_daerah: 'Tarimo kasih', kata_indonesia: 'Terima kasih', kategori: 'Sapaan' },
    { id: 23, bahasa_id: 4, kata_daerah: 'Baa kaba?', kata_indonesia: 'Apa kabar?', kategori: 'Sapaan' },
  ],
};

export default function FlashcardPage() {
  const { bahasaDaerah } = useData();
  const [selectedBahasa, setSelectedBahasa] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [unknown, setUnknown] = useState<number[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbCounts, setDbCounts] = useState<Record<number, number>>({});

  const activeBahasa = bahasaDaerah.filter(b => b.status === 'aktif');

  useEffect(() => {
    // Fetch all flashcards to get dynamic counts for the selection screen
    flashcardApi.list()
      .then(res => {
        const allData = res.data || [];
        const counts: Record<number, number> = {};
        allData.forEach((c: any) => {
          counts[c.bahasa_id] = (counts[c.bahasa_id] || 0) + 1;
        });
        setDbCounts(counts);
      })
      .catch(err => console.error("Error fetching flashcard counts:", err));
  }, []);

  useEffect(() => {
    if (selectedBahasa) {
      setLoading(true);
      flashcardApi.list(selectedBahasa)
        .then(res => {
          const data = res.data || [];
          setCards(data.length > 0 ? data : (staticFlashcards[selectedBahasa] || []));
        })
        .catch(() => {
          setCards(staticFlashcards[selectedBahasa] || []);
        })
        .finally(() => setLoading(false));
    }
  }, [selectedBahasa]);

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < totalCards - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleKnown = () => {
    if (currentCard && !known.includes(currentCard.id)) {
      setKnown([...known, currentCard.id]);
      setUnknown(unknown.filter(id => id !== currentCard.id));
    }
    handleNext();
  };

  const handleUnknown = () => {
    if (currentCard && !unknown.includes(currentCard.id)) {
      setUnknown([...unknown, currentCard.id]);
      setKnown(known.filter(id => id !== currentCard.id));
    }
    handleNext();
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnown([]);
    setUnknown([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        {!selectedBahasa ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Flashcard Kosakata</h1>
              <p className="text-muted-foreground">Pilih bahasa untuk mulai belajar kosakata dengan flashcard</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeBahasa.map((bahasa) => (
                <Card key={bahasa.id} className="card-hover cursor-pointer border-2 hover:border-primary/30" onClick={() => { setSelectedBahasa(bahasa.id); handleReset(); }}>
                  <CardContent className="p-6 text-left">
                    <div className="text-4xl mb-4">{bahasa.icon}</div>
                    <h3 className="font-semibold text-lg mb-1">{bahasa.nama_bahasa}</h3>
                    <p className="text-sm text-muted-foreground">
                      {dbCounts[bahasa.id] !== undefined
                        ? `${dbCounts[bahasa.id]} kartu`
                        : `${staticFlashcards[bahasa.id]?.length || 0} kartu`}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => { setSelectedBahasa(null); handleReset(); }} className="mb-4">← Kembali</Button>

            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                Flashcard {activeBahasa.find(b => b.id === selectedBahasa)?.nama_bahasa}
              </h1>
              <div className="flex gap-2">
                <Badge variant="default">{known.length} Hafal</Badge>
                <Badge variant="destructive">{unknown.length} Belum</Badge>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Memuat flashcard...</div>
            ) : totalCards > 0 ? (
              <div className="max-w-lg mx-auto">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Kartu {currentIndex + 1} dari {totalCards}
                </p>

                <div
                  className="relative cursor-pointer mb-6"
                  onClick={() => setIsFlipped(!isFlipped)}
                  style={{ perspective: '1000px' }}
                >
                  <div
                    className="relative w-full transition-transform duration-500"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    <Card className="border-2 border-primary/20">
                      <CardContent className="p-12 text-center min-h-[200px] flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                        <Zap className="h-8 w-8 text-primary mb-4" />
                        <p className="text-2xl font-bold">{currentCard?.kata_daerah}</p>
                        {currentCard?.kategori && <Badge variant="secondary" className="mt-3">{currentCard.kategori}</Badge>}
                        <p className="text-sm text-muted-foreground mt-4">Klik untuk membalik</p>
                      </CardContent>
                    </Card>
                    <Card
                      className="border-2 border-secondary/40 absolute inset-0"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <CardContent className="p-12 text-center min-h-[200px] flex flex-col items-center justify-center bg-secondary/5 rounded-xl">
                        <p className="text-2xl font-bold text-secondary-foreground">{currentCard?.kata_indonesia}</p>
                        <p className="text-sm text-muted-foreground mt-4">Klik untuk membalik</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-center gap-3 mb-4">
                  <Button variant="destructive" onClick={handleUnknown} className="flex-1">
                    <X className="h-4 w-4 mr-2" /> Belum Hafal
                  </Button>
                  <Button onClick={handleKnown} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" /> Sudah Hafal
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Sebelumnya
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-1" /> Reset
                  </Button>
                  <Button variant="outline" onClick={handleNext} disabled={currentIndex === totalCards - 1}>
                    Selanjutnya <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {known.length === totalCards && (
                  <Card className="mt-6 border-2 border-primary">
                    <CardContent className="p-6 text-center">
                      <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
                      <h3 className="text-xl font-bold mb-1">Selamat! 🎉</h3>
                      <p className="text-muted-foreground">Anda sudah menghafal semua kosakata!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card><CardContent className="p-12 text-center">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Belum ada flashcard untuk bahasa ini</p>
              </CardContent></Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
