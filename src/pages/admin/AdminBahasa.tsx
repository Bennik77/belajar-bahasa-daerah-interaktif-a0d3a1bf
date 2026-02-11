import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Plus, Edit, Trash2, Languages } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BahasaDaerah } from '@/types/database';

export default function AdminBahasa() {
    const { bahasaDaerah, addBahasa, updateBahasa, deleteBahasa } = useData();
    const [showForm, setShowForm] = useState<boolean>(false);
    const [editItem, setEditItem] = useState<BahasaDaerah | null>(null);
    const [form, setForm] = useState({
        nama_bahasa: '',
        deskripsi: '',
        icon: '',
        status: 'aktif' as 'aktif' | 'nonaktif'
    });

    const handleSubmit = async () => {
        try {
            if (editItem) {
                await updateBahasa(editItem.id, form);
            } else {
                await addBahasa(form);
            }
            setShowForm(false);
            setEditItem(null);
            setForm({ nama_bahasa: '', deskripsi: '', icon: '', status: 'aktif' });
        } catch (error) {
            console.error('Error submitting bahasa:', error);
        }
    };

    const openEdit = (item: BahasaDaerah) => {
        setEditItem(item);
        setForm({
            nama_bahasa: item.nama_bahasa,
            deskripsi: item.deskripsi || '',
            icon: item.icon || '',
            status: item.status
        });
        setShowForm(true);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Kelola Bahasa Daerah</h1>
                    <Button onClick={() => {
                        setEditItem(null);
                        setForm({ nama_bahasa: '', deskripsi: '', icon: '', status: 'aktif' });
                        setShowForm(true);
                    }}>
                        <Plus className="h-4 w-4 mr-2" />Tambah Bahasa
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bahasaDaerah.map((bahasa) => (
                        <Card key={bahasa.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-4xl">{bahasa.icon || '🇮🇩'}</div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon" onClick={() => openEdit(bahasa)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => deleteBahasa(bahasa.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{bahasa.nama_bahasa}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                        {bahasa.deskripsi || 'Tidak ada deskripsi.'}
                                    </p>
                                    <div className="flex gap-2">
                                        <Badge variant={bahasa.status === 'aktif' ? 'default' : 'destructive'}>
                                            {bahasa.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {bahasaDaerah.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <Languages className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Belum ada data bahasa daerah.</p>
                        </div>
                    )}
                </div>

                <Dialog open={showForm} onOpenChange={setShowForm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editItem ? 'Edit' : 'Tambah'} Bahasa Daerah</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nama Bahasa</label>
                                <Input
                                    placeholder="Misal: Bahasa Sunda"
                                    value={form.nama_bahasa}
                                    onChange={(e) => setForm({ ...form, nama_bahasa: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ikon (Emoji)</label>
                                <Input
                                    placeholder="Misal: 🎻"
                                    value={form.icon}
                                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Deskripsi</label>
                                <Textarea
                                    placeholder="Deskripsi singkat bahasa daerah..."
                                    value={form.deskripsi}
                                    onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <select
                                    className="w-full p-2 rounded-md border bg-background"
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value as 'aktif' | 'nonaktif' })}
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Nonaktif</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
                            <Button onClick={handleSubmit} disabled={!form.nama_bahasa.trim()}>Simpan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
