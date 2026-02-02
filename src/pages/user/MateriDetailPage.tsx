import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/Navbar';
import { BookOpen, Clock, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function MateriDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { materi, bahasaDaerah, progressBelajar, updateProgress } = useData();
  const navigate = useNavigate();
  
  const [startTime] = useState(Date.now());
  const [progress, setProgress] = useState(0);

  const materiItem = materi.find(m => m.id === Number(id));
  const bahasa = bahasaDaerah.find(b => b.id === materiItem?.bahasa_id);
  const userProgress = progressBelajar.find(
    p => p.user_id === user?.id && p.materi_id === materiItem?.id
  );

  const allMateriBahasa = materi
    .filter(m => m.bahasa_id === materiItem?.bahasa_id && m.status === 'aktif')
    .sort((a, b) => a.urutan - b.urutan);
  
  const currentIndex = allMateriBahasa.findIndex(m => m.id === materiItem?.id);
  const prevMateri = currentIndex > 0 ? allMateriBahasa[currentIndex - 1] : null;
  const nextMateri = currentIndex < allMateriBahasa.length - 1 ? allMateriBahasa[currentIndex + 1] : null;

  useEffect(() => {
    if (materiItem && user) {
      // Mark as in progress when opening
      if (!userProgress || userProgress.status === 'belum_mulai') {
        updateProgress(user.id, materiItem.id, materiItem.bahasa_id, {
          status: 'sedang_belajar',
          persentase: 0
        });
      }

      // Simulate reading progress
      const timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 5, 100);
          return newProgress;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [materiItem?.id]);

  const handleComplete = () => {
    if (materiItem && user) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      updateProgress(user.id, materiItem.id, materiItem.bahasa_id, {
        status: 'selesai',
        persentase: 100,
        waktu_belajar: timeSpent
      });
      
      toast({
        title: "Materi Selesai! 🎉",
        description: "Selamat! Anda telah menyelesaikan materi ini.",
      });

      if (nextMateri) {
        navigate(`/belajar/materi/${nextMateri.id}`);
      } else {
        navigate('/belajar');
      }
    }
  };

  if (!materiItem) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="font-semibold text-lg mb-2">Materi Tidak Ditemukan</h3>
              <p className="text-muted-foreground mb-4">
                Materi yang Anda cari tidak ada atau sudah dihapus.
              </p>
              <Button onClick={() => navigate('/belajar')}>
                Kembali ke Halaman Belajar
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/belajar')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Materi
        </Button>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress Membaca</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{bahasa?.icon}</span>
              <span className="text-muted-foreground">{bahasa?.nama_bahasa}</span>
            </div>
            <CardTitle className="text-2xl">{materiItem.judul}</CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary" className="capitalize">
                <BookOpen className="h-3 w-3 mr-1" />
                {materiItem.tipe}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {materiItem.durasi_menit} menit
              </span>
              {userProgress?.status === 'selesai' && (
                <Badge variant="outline" className="text-success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Selesai
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Content */}
        <Card className="mb-6">
          <CardContent className="p-6 md:p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: materiItem.konten || '' }}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {prevMateri ? (
            <Button
              variant="outline"
              onClick={() => navigate(`/belajar/materi/${prevMateri.id}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Materi Sebelumnya
            </Button>
          ) : (
            <div />
          )}

          {userProgress?.status !== 'selesai' ? (
            <Button onClick={handleComplete}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Tandai Selesai
            </Button>
          ) : nextMateri ? (
            <Button onClick={() => navigate(`/belajar/materi/${nextMateri.id}`)}>
              Materi Berikutnya
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => navigate('/belajar')}>
              Kembali ke Daftar
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
