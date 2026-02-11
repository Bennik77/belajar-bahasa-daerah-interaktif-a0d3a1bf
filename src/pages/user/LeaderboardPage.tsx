import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const { users, hasilUjian, progressBelajar } = useData();

  // Calculate scores for each user
  const leaderboard = users
    .filter(u => u.role === 'pengguna' && u.status === 'aktif')
    .map(u => {
      const userHasil = hasilUjian.filter(h => h.user_id === u.id);
      const userProgress = progressBelajar.filter(p => p.user_id === u.id);
      const completedMateri = userProgress.filter(p => p.status === 'selesai').length;
      const passedExams = userHasil.filter(h => h.status === 'lulus').length;
      const avgScore = userHasil.length > 0 ? Math.round(userHasil.reduce((a, h) => a + h.nilai, 0) / userHasil.length) : 0;
      const totalScore = completedMateri * 10 + passedExams * 25 + avgScore;
      
      return {
        ...u,
        completedMateri,
        passedExams,
        avgScore,
        totalScore,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-warning" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-muted-foreground" />;
    if (rank === 3) return <Award className="h-6 w-6 text-secondary-foreground" />;
    return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-warning/10 border-warning/30';
    if (rank === 2) return 'bg-muted border-muted-foreground/20';
    if (rank === 3) return 'bg-secondary/10 border-secondary/30';
    return '';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Papan Peringkat</h1>
          <p className="text-muted-foreground">Lihat siapa yang paling rajin belajar!</p>
        </div>

        {/* Score Explanation */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span>Materi selesai = 10 poin</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-warning" />
                <span>Ujian lulus = 25 poin</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-info" />
                <span>+ Rata-rata nilai ujian</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <div className="space-y-3">
          {leaderboard.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.id === user?.id;
            
            return (
              <Card key={entry.id} className={`${getRankBg(rank)} ${isCurrentUser ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center">
                      {getRankIcon(rank)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">{entry.nama}</span>
                        {isCurrentUser && <Badge variant="default" className="text-xs">Anda</Badge>}
                      </div>
                      <div className="flex gap-3 text-sm text-muted-foreground">
                        <span>{entry.completedMateri} materi</span>
                        <span>{entry.passedExams} ujian lulus</span>
                        {entry.avgScore > 0 && <span>rata-rata {entry.avgScore}%</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{entry.totalScore}</div>
                      <div className="text-xs text-muted-foreground">poin</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {leaderboard.length === 0 && (
            <Card><CardContent className="p-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada data peringkat</p>
            </CardContent></Card>
          )}
        </div>
      </main>
    </div>
  );
}
