import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { MessageSquare, Star, Trash2, Reply, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UmpanBalik } from '@/types/database';

export default function AdminUmpanBalik() {
  const { umpanBalik, materi, users, updateUmpanBalik, deleteUmpanBalik } = useData();
  
  const [showReplyDialog, setShowReplyDialog] = useState<UmpanBalik | null>(null);
  const [balasan, setBalasan] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('semua');

  const handleReply = () => {
    if (showReplyDialog && balasan.trim()) {
      updateUmpanBalik(showReplyDialog.id, { 
        balasan, 
        status: 'selesai' 
      });
      setShowReplyDialog(null);
      setBalasan('');
    }
  };

  const handleMarkProcessed = (id: number) => {
    updateUmpanBalik(id, { status: 'diproses' });
  };

  const getUserName = (userId: number) => {
    return users.find(u => u.id === userId)?.nama || 'Unknown';
  };

  const getMateriTitle = (materiId?: number) => {
    if (!materiId) return null;
    return materi.find(m => m.id === materiId)?.judul || null;
  };

  const filteredFeedback = filterStatus === 'semua' 
    ? umpanBalik 
    : umpanBalik.filter(u => u.status === filterStatus);

  const pendingCount = umpanBalik.filter(u => u.status === 'menunggu').length;
  const processedCount = umpanBalik.filter(u => u.status === 'diproses').length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'fill-warning text-warning' : 'text-muted'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kelola Umpan Balik</h1>
          <div className="flex gap-4">
            {pendingCount > 0 && (
              <Badge variant="default" className="text-sm py-1 px-3">
                {pendingCount} menunggu
              </Badge>
            )}
            {processedCount > 0 && (
              <Badge variant="secondary" className="text-sm py-1 px-3">
                {processedCount} diproses
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-6">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Status</SelectItem>
              <SelectItem value="menunggu">Menunggu</SelectItem>
              <SelectItem value="diproses">Diproses</SelectItem>
              <SelectItem value="selesai">Selesai</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredFeedback.length > 0 ? filteredFeedback.map(feedback => {
            const materiTitle = getMateriTitle(feedback.materi_id);
            
            return (
              <Card key={feedback.id} className={feedback.status === 'menunggu' ? 'border-warning' : ''}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex">{renderStars(feedback.rating)}</div>
                        <Badge variant="outline">{feedback.kategori}</Badge>
                        <Badge variant={
                          feedback.status === 'menunggu' ? 'default' : 
                          feedback.status === 'diproses' ? 'secondary' : 'outline'
                        }>{feedback.status}</Badge>
                      </div>
                      
                      <p className="text-sm mb-2">{feedback.komentar}</p>
                      
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>Oleh: {getUserName(feedback.user_id)}</span>
                        {materiTitle && <span>• Materi: {materiTitle}</span>}
                        <span>• {new Date(feedback.created_at).toLocaleDateString('id-ID')}</span>
                      </div>

                      {feedback.balasan && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Balasan Admin:</p>
                          <p className="text-sm">{feedback.balasan}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {feedback.status === 'menunggu' && (
                        <Button variant="outline" size="sm" onClick={() => handleMarkProcessed(feedback.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {feedback.status !== 'selesai' && (
                        <Button variant="outline" size="sm" onClick={() => {
                          setShowReplyDialog(feedback);
                          setBalasan(feedback.balasan || '');
                        }}>
                          <Reply className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="destructive" size="sm" onClick={() => deleteUmpanBalik(feedback.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Tidak ada umpan balik</p>
            </div>
          )}
        </div>

        {/* Dialog Reply */}
        <Dialog open={!!showReplyDialog} onOpenChange={() => setShowReplyDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Balas Umpan Balik</DialogTitle>
            </DialogHeader>
            {showReplyDialog && (
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex mb-2">{renderStars(showReplyDialog.rating)}</div>
                  <p className="text-sm">{showReplyDialog.komentar}</p>
                  <p className="text-xs text-muted-foreground mt-2">- {getUserName(showReplyDialog.user_id)}</p>
                </div>
                <Textarea 
                  placeholder="Tulis balasan..." 
                  rows={4}
                  value={balasan} 
                  onChange={e => setBalasan(e.target.value)} 
                />
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReplyDialog(null)}>Batal</Button>
              <Button onClick={handleReply} disabled={!balasan.trim()}>Kirim Balasan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
