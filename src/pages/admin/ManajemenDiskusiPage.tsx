import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Diskusi, KomentarDiskusi } from '@/types/database';

// Interface tambahan untuk menangani data join dari API
interface DiskusiWithUser extends Diskusi {
  user_nama?: string;
}

interface KomentarWithUser extends KomentarDiskusi {
  user_nama?: string;
}

export default function ManajemenDiskusiPage() {
  const { diskusi, komentarDiskusi, deleteDiskusi, deleteKomentar } = useData();
  // State untuk menyimpan ID diskusi yang sedang dibuka komentarnya
  const [selectedDiskusiId, setSelectedDiskusiId] = useState<number | null>(null);

  const handleDeleteDiskusi = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus diskusi ini beserta seluruh komentarnya?')) {
      await deleteDiskusi(id);
    }
  };

  const handleDeleteKomentar = async (id: number) => {
    if (confirm('Hapus komentar ini secara permanen?')) {
      await deleteKomentar(id);
    }
  };

  const getKomentarByDiskusi = (diskusiId: number) => {
    return komentarDiskusi.filter(k => k.diskusi_id === diskusiId) as KomentarWithUser[];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Manajemen Diskusi</h2>

      <div className="grid gap-4">
        {(diskusi as DiskusiWithUser[]).map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-medium">
                  {item.judul}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Oleh: {item.user_nama || 'User'} • {format(new Date(item.created_at), 'dd MMMM yyyy', { locale: idLocale })}
                </div>
              </div>
              <Badge variant={item.status === 'aktif' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {item.konten}
              </p>
              
              <div className="flex items-center gap-2">
                {/* TOMBOL LIHAT KOMENTAR */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedDiskusiId(item.id)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Lihat Komentar ({getKomentarByDiskusi(item.id).length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Komentar pada: {item.judul}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      {getKomentarByDiskusi(item.id).length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">Belum ada komentar.</p>
                      ) : (
                        getKomentarByDiskusi(item.id).map((komentar) => (
                          <div key={komentar.id} className="flex items-start justify-between p-4 rounded-lg border bg-card">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{komentar.user_nama || 'User'}</span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(komentar.created_at), 'dd MMM HH:mm', { locale: idLocale })}
                                </span>
                              </div>
                              <p className="text-sm">{komentar.konten}</p>
                            </div>
                            {/* TOMBOL HAPUS KOMENTAR */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              onClick={() => handleDeleteKomentar(komentar.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteDiskusi(item.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus Diskusi
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}