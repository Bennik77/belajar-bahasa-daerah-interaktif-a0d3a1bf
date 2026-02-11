import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { BookOpen, GraduationCap, Trophy, Clock } from 'lucide-react';

export default function ProgressPage() {
  const { user } = useAuth();
  const { bahasaDaerah, materi, progressBelajar, hasilUjian, ujian } = useData();

  const userProgress = progressBelajar.filter(p => p.user_id === user?.id);
  const userHasil = hasilUjian.filter(h => h.user_id === user?.id);

  const getProgressByBahasa = (bahasaId: number) => {
    const materiForBahasa = materi.filter(m => m.bahasa_id === bahasaId);
    const completed = userProgress.filter(p => p.bahasa_id === bahasaId && p.status === 'selesai').length;
    return { completed, total: materiForBahasa.length, percent: materiForBahasa.length ? Math.round((completed / materiForBahasa.length) * 100) : 0 };
  };

  const totalWaktu = userProgress.reduce((acc, p) => acc + p.waktu_belajar, 0);
  const totalMateriSelesai = userProgress.filter(p => p.status === 'selesai').length;
  const totalUjianLulus = userHasil.filter(h => h.status === 'lulus').length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Progress Belajar</h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card><CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalMateriSelesai}</div>
            <p className="text-sm text-muted-foreground">Materi Selesai</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalUjianLulus}</div>
            <p className="text-sm text-muted-foreground">Ujian Lulus</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-info mx-auto mb-2" />
            <div className="text-2xl font-bold">{Math.round(totalWaktu / 60)}</div>
            <p className="text-sm text-muted-foreground">Menit Belajar</p>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <GraduationCap className="h-8 w-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">{userHasil.length > 0 ? Math.round(userHasil.reduce((a, h) => a + h.nilai, 0) / userHasil.length) : 0}%</div>
            <p className="text-sm text-muted-foreground">Rata-rata Nilai</p>
          </CardContent></Card>
        </div>

        {/* Progress per Language */}
        <h2 className="text-xl font-semibold mb-4">Progress per Bahasa</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {bahasaDaerah.filter(b => b.status === 'aktif').map(bahasa => {
            const prog = getProgressByBahasa(bahasa.id);
            return (
              <Card key={bahasa.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{bahasa.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{bahasa.nama_bahasa}</h3>
                      <p className="text-sm text-muted-foreground">{prog.completed}/{prog.total} materi</p>
                    </div>
                    <Badge variant={prog.percent === 100 ? 'default' : 'secondary'}>{prog.percent}%</Badge>
                  </div>
                  <Progress value={prog.percent} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
