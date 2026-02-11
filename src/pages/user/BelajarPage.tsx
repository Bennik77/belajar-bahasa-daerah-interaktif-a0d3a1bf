import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { BookOpen, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export default function BelajarPage() {
  const { user } = useAuth();
  const { bahasaDaerah, materi, progressBelajar } = useData();
  const navigate = useNavigate();
  const [selectedBahasa, setSelectedBahasa] = useState<number | null>(null);

  const activeBahasa = bahasaDaerah.filter(b => b.status === 'aktif');
  const selectedLanguage = activeBahasa.find(b => b.id === selectedBahasa);
  const materiForBahasa = materi.filter(m => m.bahasa_id === selectedBahasa && m.status === 'aktif')
    .sort((a, b) => a.urutan - b.urutan);

  const getProgressForMateri = (materiId: number) => {
    return progressBelajar.find(p => p.user_id === user?.id && p.materi_id === materiId);
  };

  const calculateOverallProgress = (bahasaId: number) => {
    const materiForLang = materi.filter(m => m.bahasa_id === bahasaId && m.status === 'aktif');
    if (materiForLang.length === 0) return 0;
    
    const completedCount = materiForLang.filter(m => {
      const progress = getProgressForMateri(m.id);
      return progress?.status === 'selesai';
    }).length;
    
    return Math.round((completedCount / materiForLang.length) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        {!selectedBahasa ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Pilih Bahasa</h1>
              <p className="text-muted-foreground">
                Pilih bahasa daerah yang ingin Anda pelajari
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeBahasa.map((bahasa) => {
                const progress = calculateOverallProgress(bahasa.id);
                const materiCount = materi.filter(m => m.bahasa_id === bahasa.id && m.status === 'aktif').length;
                
                return (
                  <Card 
                    key={bahasa.id} 
                    className="card-hover cursor-pointer border-2 hover:border-primary/30"
                    onClick={() => setSelectedBahasa(bahasa.id)}
                  >
                    <CardContent className="p-6">
                      <div className="text-4xl mb-4">{bahasa.icon}</div>
                      <h3 className="font-semibold text-lg mb-2">{bahasa.nama_bahasa}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {bahasa.deskripsi}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{materiCount} materi</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
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
                  <h1 className="text-3xl font-bold">{selectedLanguage?.nama_bahasa}</h1>
                  <p className="text-muted-foreground">{selectedLanguage?.deskripsi}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {materiForBahasa.length > 0 ? (
                materiForBahasa.map((item, index) => {
                  const progress = getProgressForMateri(item.id);
                  const isCompleted = progress?.status === 'selesai';
                  const isInProgress = progress?.status === 'sedang_belajar';
                  
                  return (
                    <Card 
                      key={item.id}
                      className="card-hover cursor-pointer"
                      onClick={() => navigate(`/belajar/materi/${item.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted 
                              ? 'bg-success text-success-foreground' 
                              : isInProgress 
                                ? 'bg-warning text-warning-foreground'
                                : 'bg-muted text-muted-foreground'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <span className="font-semibold">{index + 1}</span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-lg">{item.judul}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {item.deskripsi}
                                </p>
                              </div>
                              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            </div>
                            
                            <div className="flex items-center gap-4 mt-3">
                              <Badge variant="secondary" className="capitalize">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {item.tipe}
                              </Badge>
                              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {item.durasi_menit} menit
                              </span>
                              {isInProgress && (
                                <Badge variant="outline" className="text-warning">
                                  Sedang Dipelajari
                                </Badge>
                              )}
                              {isCompleted && (
                                <Badge variant="outline" className="text-success">
                                  Selesai
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Belum Ada Materi</h3>
                    <p className="text-muted-foreground">
                      Materi untuk bahasa ini sedang dalam pengembangan
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
