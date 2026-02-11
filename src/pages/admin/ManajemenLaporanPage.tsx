import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { LaporanPelanggaran } from '@/types/database';

interface LaporanWithUser extends LaporanPelanggaran {
  pelapor_nama?: string;
  terlapor_nama?: string;
}

export default function ManajemenLaporanPage() {
  const { laporanPelanggaran, deleteLaporan, updateLaporan } = useData();

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus laporan ini secara permanen?')) {
      await deleteLaporan(id);
    }
  };

  const handleStatusUpdate = async (id: number, status: 'selesai' | 'ditolak') => {
    await updateLaporan(id, { status });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Laporan Pelanggaran</h2>

      <div className="grid gap-4">
        {laporanPelanggaran.length === 0 ? (
          <p className="text-muted-foreground">Tidak ada laporan masuk.</p>
        ) : (
          (laporanPelanggaran as LaporanWithUser[]).map((laporan) => (
            <Card key={laporan.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-medium">
                    Pelapor: {laporan.pelapor_nama || 'User'}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Terlapor: <span className="font-medium text-foreground">{laporan.terlapor_nama || 'User'}</span> • {format(new Date(laporan.created_at), 'dd MMMM yyyy', { locale: idLocale })}
                  </div>
                </div>
                <Badge variant={
                  laporan.status === 'menunggu' ? 'destructive' : 
                  laporan.status === 'selesai' ? 'default' : 'secondary'
                }>
                  {laporan.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-3 rounded-md mb-4">
                  <p className="text-sm font-medium mb-1">Alasan Pelaporan:</p>
                  <p className="text-sm text-muted-foreground">{laporan.alasan}</p>
                </div>
                
                <div className="flex items-center gap-2 justify-end">
                  {laporan.status === 'menunggu' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleStatusUpdate(laporan.id, 'selesai')}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Selesai
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusUpdate(laporan.id, 'ditolak')}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Tolak
                      </Button>
                    </>
                  )}
                  
                  {/* TOMBOL HAPUS LAPORAN */}
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(laporan.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus Laporan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}