import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Trophy, Clock, Target, ArrowLeft, PlayCircle } from 'lucide-react';

export default function HasilUjianPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { ujian, hasilUjian, bahasaDaerah } = useData();
  const navigate = useNavigate();

  const ujianItem = ujian.find(u => u.id === Number(id));
  const bahasa = bahasaDaerah.find(b => b.id === ujianItem?.bahasa_id);
  const hasilList = hasilUjian
    .filter(h => h.user_id === user?.id && h.ujian_id === Number(id))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (!ujianItem) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="font-semibold text-lg mb-2">Ujian Tidak Ditemukan</h3>
              <Button onClick={() => navigate('/ujian')}>
                Kembali ke Daftar Ujian
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const bestResult = hasilList.length > 0 
    ? Math.max(...hasilList.map(h => h.nilai))
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/ujian')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Ujian
        </Button>

        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{bahasa?.icon}</span>
              <span className="text-muted-foreground">{bahasa?.nama_bahasa}</span>
            </div>
            <CardTitle className="text-2xl flex items-center gap-3">
              {ujianItem.judul}
              {bestResult >= ujianItem.passing_grade && (
                <Trophy className="h-6 w-6 text-warning" />
              )}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                Passing Grade: {ujianItem.passing_grade}%
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {ujianItem.durasi_menit} menit
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Best Score - flat color */}
        <Card className="mb-6 bg-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1">Nilai Terbaik Anda</p>
                <div className="text-4xl font-bold">{bestResult}%</div>
              </div>
              <Badge 
                variant={bestResult >= ujianItem.passing_grade ? 'default' : 'destructive'}
                className="text-lg px-4 py-2"
              >
                {bestResult >= ujianItem.passing_grade ? 'LULUS' : 'BELUM LULUS'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <h2 className="text-xl font-semibold mb-4">Riwayat Pengerjaan</h2>
        
        <div className="space-y-4">
          {hasilList.length > 0 ? (
            hasilList.map((hasil, index) => (
              <Card key={hasil.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        hasil.status === 'lulus' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {hasil.nilai}%
                      </div>
                      <div>
                        <p className="font-medium">
                          Pengerjaan #{hasilList.length - index}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(hasil.created_at), 'd MMMM yyyy, HH:mm', { locale: localeId })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={hasil.status === 'lulus' ? 'default' : 'secondary'}>
                        {hasil.status === 'lulus' ? 'Lulus' : 'Tidak Lulus'}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {hasil.jumlah_benar}/{hasil.jumlah_soal} benar
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Anda belum pernah mengerjakan ujian ini
                </p>
                <Button onClick={() => navigate(`/ujian/kerjakan/${id}`)}>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Mulai Ujian
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {hasilList.length > 0 && (
          <div className="mt-6 text-center">
            <Button onClick={() => navigate(`/ujian/kerjakan/${id}`)}>
              <PlayCircle className="h-4 w-4 mr-2" />
              Kerjakan Lagi
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
