import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Users, Search, Shield, ShieldOff, UserCheck, UserX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/types/database';

export default function AdminPengguna() {
  const { users, hasilUjian, progressBelajar, updateUserStatus } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('semua');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ userId: number; status: User['status'] } | null>(null);

  const filteredUsers = users.filter(u => {
    const matchSearch = u.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'semua' || u.role === filterRole;
    const matchStatus = filterStatus === 'semua' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const getUserStats = (userId: number) => {
    const ujianCount = hasilUjian.filter(h => h.user_id === userId).length;
    const progressCount = progressBelajar.filter(p => p.user_id === userId && p.status === 'selesai').length;
    return { ujianCount, progressCount };
  };

  const handleStatusChange = (userId: number, newStatus: User['status']) => {
    setPendingAction({ userId, status: newStatus });
    setShowConfirmDialog(true);
  };

  const confirmStatusChange = () => {
    if (pendingAction) {
      updateUserStatus(pendingAction.userId, pendingAction.status);
      setShowConfirmDialog(false);
      setPendingAction(null);
    }
  };

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'aktif':
        return <Badge variant="default" className="bg-success">Aktif</Badge>;
      case 'nonaktif':
        return <Badge variant="secondary">Nonaktif</Badge>;
      case 'diblokir':
        return <Badge variant="destructive">Diblokir</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'pengguna').length;
  const activeCount = users.filter(u => u.status === 'aktif').length;
  const blockedCount = users.filter(u => u.status === 'diblokir').length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Kelola Pengguna</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{adminCount}</div>
              <p className="text-sm text-muted-foreground">Admin</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-info" />
              <div className="text-2xl font-bold">{userCount}</div>
              <p className="text-sm text-muted-foreground">Pengguna</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserCheck className="h-8 w-8 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-sm text-muted-foreground">Aktif</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserX className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <div className="text-2xl font-bold">{blockedCount}</div>
              <p className="text-sm text-muted-foreground">Diblokir</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Cari nama atau email..." 
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Role</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="pengguna">Pengguna</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Status</SelectItem>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="nonaktif">Nonaktif</SelectItem>
              <SelectItem value="diblokir">Diblokir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ujian</TableHead>
                  <TableHead>Materi</TableHead>
                  <TableHead>Terdaftar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => {
                  const stats = getUserStats(user.id);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell className="font-medium">{user.nama}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? <Shield className="h-3 w-3 mr-1" /> : null}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{stats.ujianCount}</TableCell>
                      <TableCell>{stats.progressCount}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell className="text-right">
                        {user.role !== 'admin' && (
                          <Select 
                            value={user.status} 
                            onValueChange={(v: User['status']) => handleStatusChange(user.id, v)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aktif">Aktif</SelectItem>
                              <SelectItem value="nonaktif">Nonaktif</SelectItem>
                              <SelectItem value="diblokir">Blokir</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tidak ada pengguna ditemukan</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirm Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Perubahan Status</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin mengubah status pengguna ini menjadi "{pendingAction?.status}"?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Batal</Button>
              <Button onClick={confirmStatusChange}>Ya, Ubah Status</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
