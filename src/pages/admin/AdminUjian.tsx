import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Plus, Edit, Trash2, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Ujian, SoalUjian } from '@/types/database';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function AdminUjian() {
  const { bahasaDaerah, ujian, soalUjian, addUjian, updateUjian, deleteUjian, addSoalUjian, updateSoalUjian, deleteSoalUjian } = useData();
  const [showForm, setShowForm] = useState(false);
  const [showSoalForm, setShowSoalForm] = useState(false);
  const [editItem, setEditItem] = useState<Ujian | null>(null);
  const [editSoal, setEditSoal] = useState<SoalUjian | null>(null);
  const [selectedUjianId, setSelectedUjianId] = useState<number | null>(null);
  const [expandedUjian, setExpandedUjian] = useState<number | null>(null);
  
  const [form, setForm] = useState({
    bahasa_id: 1,
    judul: '',
    deskripsi: '',
    durasi_menit: 30,
    passing_grade: 60,
    status: 'aktif' as 'aktif' | 'nonaktif'
  });

  const [soalForm, setSoalForm] = useState({
    ujian_id: 0,
    pertanyaan: '',
    pilihan_a: '',
    pilihan_b: '',
    pilihan_c: '',
    pilihan_d: '',
    jawaban_benar: 'a' as 'a' | 'b' | 'c' | 'd',
    urutan: 1
  });

  const handleSubmit = () => {
    if (editItem) {
      updateUjian(editItem.id, form);
    } else {
      addUjian(form);
    }
    setShowForm(false);
    setEditItem(null);
    resetForm();
  };

  const handleSoalSubmit = () => {
    if (editSoal) {
      updateSoalUjian(editSoal.id, soalForm);
    } else {
      addSoalUjian({ ...soalForm, ujian_id: selectedUjianId! });
    }
    setShowSoalForm(false);
    setEditSoal(null);
    resetSoalForm();
  };

  const resetForm = () => {
    setForm({ bahasa_id: 1, judul: '', deskripsi: '', durasi_menit: 30, passing_grade: 60, status: 'aktif' });
  };

  const resetSoalForm = () => {
    setSoalForm({ ujian_id: 0, pertanyaan: '', pilihan_a: '', pilihan_b: '', pilihan_c: '', pilihan_d: '', jawaban_benar: 'a', urutan: 1 });
  };

  const openEdit = (item: Ujian) => {
    setEditItem(item);
    setForm({
      bahasa_id: item.bahasa_id,
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      durasi_menit: item.durasi_menit,
      passing_grade: item.passing_grade,
      status: item.status
    });
    setShowForm(true);
  };

  const openSoalEdit = (soal: SoalUjian) => {
    setEditSoal(soal);
    setSoalForm({
      ujian_id: soal.ujian_id,
      pertanyaan: soal.pertanyaan,
      pilihan_a: soal.pilihan_a,
      pilihan_b: soal.pilihan_b,
      pilihan_c: soal.pilihan_c,
      pilihan_d: soal.pilihan_d,
      jawaban_benar: soal.jawaban_benar,
      urutan: soal.urutan
    });
    setShowSoalForm(true);
  };

  const openAddSoal = (ujianId: number) => {
    setSelectedUjianId(ujianId);
    const existingSoal = soalUjian.filter(s => s.ujian_id === ujianId);
    setSoalForm({
      ...soalForm,
      ujian_id: ujianId,
      urutan: existingSoal.length + 1
    });
    setShowSoalForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kelola Ujian</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />Tambah Ujian
          </Button>
        </div>

        <div className="space-y-4">
          {ujian.map(u => {
            const soalList = soalUjian.filter(s => s.ujian_id === u.id);
            const isExpanded = expandedUjian === u.id;
            
            return (
              <Collapsible key={u.id} open={isExpanded} onOpenChange={() => setExpandedUjian(isExpanded ? null : u.id)}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{u.judul}</h3>
                        <p className="text-sm text-muted-foreground">{u.deskripsi}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{bahasaDaerah.find(b => b.id === u.bahasa_id)?.nama_bahasa}</Badge>
                          <Badge variant="outline">{u.durasi_menit} menit</Badge>
                          <Badge variant="outline">Passing Grade: {u.passing_grade}%</Badge>
                          <Badge variant={u.status === 'aktif' ? 'default' : 'destructive'}>{u.status}</Badge>
                          <Badge variant="secondary">{soalList.length} soal</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Button variant="outline" size="sm" onClick={() => openEdit(u)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteUjian(u.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    
                    <CollapsibleContent className="mt-4 border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Daftar Soal</h4>
                        <Button size="sm" onClick={() => openAddSoal(u.id)}>
                          <Plus className="h-4 w-4 mr-1" />Tambah Soal
                        </Button>
                      </div>
                      
                      {soalList.length > 0 ? (
                        <div className="space-y-3">
                          {soalList.sort((a, b) => a.urutan - b.urutan).map((soal, idx) => (
                            <div key={soal.id} className="p-3 bg-muted rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-medium">{idx + 1}. {soal.pertanyaan}</p>
                                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                    <div className={soal.jawaban_benar === 'a' ? 'text-success font-medium' : ''}>A. {soal.pilihan_a}</div>
                                    <div className={soal.jawaban_benar === 'b' ? 'text-success font-medium' : ''}>B. {soal.pilihan_b}</div>
                                    <div className={soal.jawaban_benar === 'c' ? 'text-success font-medium' : ''}>C. {soal.pilihan_c}</div>
                                    <div className={soal.jawaban_benar === 'd' ? 'text-success font-medium' : ''}>D. {soal.pilihan_d}</div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => openSoalEdit(soal)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => deleteSoalUjian(soal.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">Belum ada soal</p>
                      )}
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>

        {/* Dialog Ujian */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit' : 'Tambah'} Ujian</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={String(form.bahasa_id)} onValueChange={v => setForm({...form, bahasa_id: Number(v)})}>
                <SelectTrigger><SelectValue placeholder="Pilih Bahasa" /></SelectTrigger>
                <SelectContent>
                  {bahasaDaerah.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.nama_bahasa}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input placeholder="Judul Ujian" value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} />
              <Textarea placeholder="Deskripsi" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Durasi (menit)</label>
                  <Input type="number" value={form.durasi_menit} onChange={e => setForm({...form, durasi_menit: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-sm font-medium">Passing Grade (%)</label>
                  <Input type="number" value={form.passing_grade} onChange={e => setForm({...form, passing_grade: Number(e.target.value)})} />
                </div>
              </div>
              <Select value={form.status} onValueChange={(v: 'aktif' | 'nonaktif') => setForm({...form, status: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditItem(null); resetForm(); }}>Batal</Button>
              <Button onClick={handleSubmit}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Soal */}
        <Dialog open={showSoalForm} onOpenChange={setShowSoalForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editSoal ? 'Edit' : 'Tambah'} Soal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea placeholder="Pertanyaan" value={soalForm.pertanyaan} onChange={e => setSoalForm({...soalForm, pertanyaan: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Pilihan A" value={soalForm.pilihan_a} onChange={e => setSoalForm({...soalForm, pilihan_a: e.target.value})} />
                <Input placeholder="Pilihan B" value={soalForm.pilihan_b} onChange={e => setSoalForm({...soalForm, pilihan_b: e.target.value})} />
                <Input placeholder="Pilihan C" value={soalForm.pilihan_c} onChange={e => setSoalForm({...soalForm, pilihan_c: e.target.value})} />
                <Input placeholder="Pilihan D" value={soalForm.pilihan_d} onChange={e => setSoalForm({...soalForm, pilihan_d: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Jawaban Benar</label>
                  <Select value={soalForm.jawaban_benar} onValueChange={(v: 'a' | 'b' | 'c' | 'd') => setSoalForm({...soalForm, jawaban_benar: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">A</SelectItem>
                      <SelectItem value="b">B</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                      <SelectItem value="d">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Urutan</label>
                  <Input type="number" value={soalForm.urutan} onChange={e => setSoalForm({...soalForm, urutan: Number(e.target.value)})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowSoalForm(false); setEditSoal(null); resetSoalForm(); }}>Batal</Button>
              <Button onClick={handleSoalSubmit}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
