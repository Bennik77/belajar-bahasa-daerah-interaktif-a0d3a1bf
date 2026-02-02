import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { GraduationCap, Clock, Trophy, Target, PlayCircle } from 'lucide-react';

export default function UjianPage() {
  const { user } = useAuth();
  const { bahasaDaerah, ujian, soalUjian, hasilUjian } = useData();
  const navigate = useNavigate();
  const [selectedBahasa, setSelectedBahasa] = useState<number | null>(null);

  const activeBahasa = bahasaDaerah.filter(b => b.status === 'aktif');
  const selectedLanguage = activeBahasa.find(b => b.id === selectedBahasa);
  const ujianForBahasa = ujian.filter(u => u.bahasa_id === selectedBahasa && u.status === 'aktif');

  const getHasilUjian = (ujianId: number) => {
    return hasilUjian
      .filter(h => h.user_id === user?.id && h.ujian_id === ujianId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const getSoalCount = (ujianId: number) => {
    return soalUjian.filter(s => s.ujian_id === ujianId).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        {!selectedBahasa ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Ujian</h1>
              <p className="text-muted-foreground">
                Uji pemahaman Anda dengan mengerjakan ujian
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeBahasa.map((bahasa) => {
                const ujianCount = ujian.filter(u => u.bahasa_id === bahasa.id && u.status === 'aktif').length;
                
                return (
                  <Card 
                    key={bahasa.id} 
                    className="card-hover cursor-pointer border-2 hover:border-primary/30"
                    onClick={() => setSelectedBahasa(bahasa.id)}
                  >
                    <CardContent className="p-6">
                      <div className="text-4xl mb-4">{bahasa.icon}</div>
                      <h3 className="font-semibold text-lg mb-2">{bahasa.nama_bahasa}</h3>
                      <p className="text-sm text-muted-foreground">
                        {ujianCount} ujian tersedia
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedBahasa(null)}
                className="mb-4"
              >
                ← Kembali ke Pilihan Bahasa
              </Button>
              
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedLanguage?.icon}</span>
                <div>
                  <h1 className="text-3xl font-bold">Ujian {selectedLanguage?.nama_bahasa}</h1>
                  <p className="text-muted-foreground">Pilih ujian yang ingin dikerjakan</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {ujianForBahasa.length > 0 ? (
                ujianForBahasa.map((item) => {
                  const hasil = getHasilUjian(item.id);
                  const bestResult = hasil.length > 0 
                    ? Math.max(...hasil.map(h => h.nilai)) 
                    : null;
                  const soalCount = getSoalCount(item.id);
                  
                  return (
                    <Card key={item.id} className="card-hover">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{item.judul}</CardTitle>
                            <CardDescription className="mt-1">{item.deskripsi}</CardDescription>
                          </div>
                          {bestResult !== null && bestResult >= item.passing_grade && (
                            <Trophy className="h-6 w-6 text-warning" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{item.durasi_menit} menit</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Target className="h-4 w-4" />
                            <span>Passing: {item.passing_grade}%</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GraduationCap className="h-4 w-4" />
                            <span>{soalCount} soal</span>
                          </div>
                        </div>

                        {bestResult !== null && (
                          <div className="mb-4 p-3 bg-muted rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Nilai Terbaik</span>
                              <Badge variant={bestResult >= item.passing_grade ? 'default' : 'destructive'}>
                                {bestResult}%
                              </Badge>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button 
                            className="flex-1"
                            onClick={() => navigate(`/ujian/kerjakan/${item.id}`)}
                          >
                            <PlayCircle className="h-4 w-4 mr-2" />
                            {hasil.length > 0 ? 'Kerjakan Lagi' : 'Mulai Ujian'}
                          </Button>
                          {hasil.length > 0 && (
                            <Button 
                              variant="outline"
                              onClick={() => navigate(`/ujian/hasil/${item.id}`)}
                            >
                              Lihat Hasil
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card className="col-span-2">
                  <CardContent className="p-12 text-center">
                    <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Belum Ada Ujian</h3>
                    <p className="text-muted-foreground">
                      Ujian untuk bahasa ini sedang dalam pengembangan
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
