import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { BookOpen, Users, MessageSquare, GraduationCap, FileText, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const { bahasaDaerah, materi, ujian, komunitas, umpanBalik, users, laporanPelanggaran } = useData();

  const stats = [
    { label: 'Bahasa', value: bahasaDaerah.length, icon: BookOpen, color: 'text-primary' },
    { label: 'Materi', value: materi.length, icon: FileText, color: 'text-info' },
    { label: 'Ujian', value: ujian.length, icon: GraduationCap, color: 'text-warning' },
    { label: 'Komunitas', value: komunitas.length, icon: Users, color: 'text-success' },
    { label: 'Umpan Balik', value: umpanBalik.filter(u => u.status === 'menunggu').length, icon: MessageSquare, color: 'text-secondary' },
    { label: 'Pengguna', value: users.filter(u => u.role === 'pengguna').length, icon: Users, color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <Card key={s.label}>
                <CardContent className="p-4 text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${s.color}`} />
                  <div className="text-2xl font-bold">{s.value}</div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Umpan Balik Terbaru</CardTitle></CardHeader>
            <CardContent>
              {umpanBalik.slice(0, 5).map(u => (
                <div key={u.id} className="py-2 border-b last:border-0">
                  <p className="text-sm font-medium">{u.komentar.slice(0, 50)}...</p>
                  <p className="text-xs text-muted-foreground">{u.kategori} • {u.status}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" />Laporan Pelanggaran</CardTitle></CardHeader>
            <CardContent>
              {laporanPelanggaran.length > 0 ? laporanPelanggaran.slice(0, 5).map(l => (
                <div key={l.id} className="py-2 border-b last:border-0">
                  <p className="text-sm">{l.alasan.slice(0, 50)}...</p>
                  <p className="text-xs text-muted-foreground">{l.status}</p>
                </div>
              )) : <p className="text-muted-foreground">Tidak ada laporan</p>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
