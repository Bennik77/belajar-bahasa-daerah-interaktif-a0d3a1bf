import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function KerjakanUjianPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { ujian, soalUjian, submitHasilUjian } = useData();
  const navigate = useNavigate();

  const ujianItem = ujian.find(u => u.id === Number(id));
  const soalList = soalUjian
    .filter(s => s.ujian_id === Number(id))
    .sort((a, b) => a.urutan - b.urutan);

  const [currentSoal, setCurrentSoal] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState((ujianItem?.durasi_menit || 30) * 60);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{ nilai: number; benar: number; total: number } | null>(null);

  useEffect(() => {
    if (timeLeft <= 0 && !isSubmitted) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (soalId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [soalId]: answer }));
  };

  const handleSubmit = () => {
    let benar = 0;
    soalList.forEach(soal => {
      if (answers[soal.id] === soal.jawaban_benar) {
        benar++;
      }
    });

    const nilai = Math.round((benar / soalList.length) * 100);
    const status = nilai >= (ujianItem?.passing_grade || 60) ? 'lulus' : 'tidak_lulus';

    if (user && ujianItem) {
      submitHasilUjian({
        user_id: user.id,
        ujian_id: ujianItem.id,
        nilai,
        jumlah_benar: benar,
        jumlah_soal: soalList.length,
        status,
        waktu_selesai: (ujianItem.durasi_menit * 60) - timeLeft
      });
    }

    setResult({ nilai, benar, total: soalList.length });
    setIsSubmitted(true);
    setShowSubmitDialog(false);

    toast({
      title: status === 'lulus' ? 'Selamat! 🎉' : 'Ujian Selesai',
      description: status === 'lulus' 
        ? `Anda lulus dengan nilai ${nilai}%` 
        : `Nilai Anda ${nilai}%. Coba lagi!`,
      variant: status === 'lulus' ? 'default' : 'destructive'
    });
  };

  if (!ujianItem || soalList.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="font-semibold text-lg mb-2">Ujian Tidak Ditemukan</h3>
              <p className="text-muted-foreground mb-4">
                Ujian yang Anda cari tidak ada atau tidak memiliki soal.
              </p>
              <Button onClick={() => navigate('/ujian')}>
                Kembali ke Daftar Ujian
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (isSubmitted && result) {
    const isPassed = result.nilai >= (ujianItem.passing_grade || 60);
    
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                isPassed ? 'bg-success/20' : 'bg-destructive/20'
              }`}>
                {isPassed ? (
                  <CheckCircle className="h-10 w-10 text-success" />
                ) : (
                  <XCircle className="h-10 w-10 text-destructive" />
                )}
              </div>
              <CardTitle className="text-2xl mt-4">
                {isPassed ? 'Selamat, Anda Lulus! 🎉' : 'Ujian Selesai'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold mb-4">
                {result.nilai}%
              </div>
              <p className="text-muted-foreground mb-6">
                {result.benar} dari {result.total} soal dijawab dengan benar
              </p>
              
              <Badge 
                variant={isPassed ? 'default' : 'destructive'}
                className="text-lg px-4 py-2"
              >
                {isPassed ? 'LULUS' : 'TIDAK LULUS'}
              </Badge>

              <div className="flex gap-4 justify-center mt-8">
                <Button variant="outline" onClick={() => navigate('/ujian')}>
                  Kembali ke Daftar Ujian
                </Button>
                {!isPassed && (
                  <Button onClick={() => window.location.reload()}>
                    Coba Lagi
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentQuestion = soalList[currentSoal];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / soalList.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 max-w-3xl">
        {/* Header with Timer */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{ujianItem.judul}</h1>
            <p className="text-muted-foreground">
              Soal {currentSoal + 1} dari {soalList.length}
            </p>
          </div>
          <div className={`flex items-center gap-2 text-lg font-mono ${
            timeLeft < 60 ? 'text-destructive animate-pulse' : ''
          }`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {answeredCount} dari {soalList.length} dijawab
            </span>
            <span className="font-medium">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-lg font-medium mb-6">{currentQuestion.pertanyaan}</p>
            
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            >
              {[
                { key: 'a', value: currentQuestion.pilihan_a },
                { key: 'b', value: currentQuestion.pilihan_b },
                { key: 'c', value: currentQuestion.pilihan_c },
                { key: 'd', value: currentQuestion.pilihan_d },
              ].map(option => (
                <div 
                  key={option.key}
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === option.key 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleAnswer(currentQuestion.id, option.key)}
                >
                  <RadioGroupItem value={option.key} id={option.key} />
                  <Label htmlFor={option.key} className="flex-1 cursor-pointer">
                    <span className="font-medium uppercase mr-2">{option.key}.</span>
                    {option.value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentSoal(prev => prev - 1)}
            disabled={currentSoal === 0}
          >
            Sebelumnya
          </Button>

          <div className="flex gap-2">
            {soalList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSoal(idx)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  idx === currentSoal
                    ? 'bg-primary text-primary-foreground'
                    : answers[soalList[idx].id]
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentSoal < soalList.length - 1 ? (
            <Button onClick={() => setCurrentSoal(prev => prev + 1)}>
              Berikutnya
            </Button>
          ) : (
            <Button onClick={() => setShowSubmitDialog(true)}>
              Selesai
            </Button>
          )}
        </div>

        {/* Submit Confirmation Dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Kirim Jawaban?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {answeredCount < soalList.length ? (
                  <span className="text-destructive">
                    Anda masih memiliki {soalList.length - answeredCount} soal yang belum dijawab.
                  </span>
                ) : (
                  'Pastikan semua jawaban sudah benar sebelum mengirim.'
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Kembali</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit}>
                Kirim Jawaban
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
