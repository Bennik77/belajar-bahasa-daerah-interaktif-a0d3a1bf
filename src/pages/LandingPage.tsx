import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { LandingNavbar } from '@/components/LandingNavbar';
import {
  BookOpen, GraduationCap, Users, MessageSquare,
  ArrowRight, CheckCircle, Star, Zap, Award,
  MapPin, Mail
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const { bahasaDaerah, umpanBalik, users } = useData();

  const features = [
    { icon: BookOpen, title: 'Materi Bertahap', description: 'Pelajari bahasa daerah dari tingkat dasar hingga mahir, disusun secara sistematis.' },
    { icon: GraduationCap, title: 'Ujian & Evaluasi', description: 'Uji pemahaman Anda melalui soal latihan dan ujian berdurasi waktu.' },
    { icon: Users, title: 'Forum Komunitas', description: 'Berdiskusi dan saling membantu bersama sesama pembelajar.' },
    { icon: MessageSquare, title: 'Umpan Balik', description: 'Sampaikan masukan untuk meningkatkan kualitas materi dan layanan.' },
    { icon: Zap, title: 'Flashcard Kosakata', description: 'Hafal kosakata dengan metode kartu bolak-balik yang interaktif.' },
    { icon: Award, title: 'Papan Peringkat', description: 'Pantau pencapaian Anda dan bandingkan dengan pembelajar lain.' }
  ];

  const benefits = [
    'Akses materi kapan saja, dari mana saja',
    'Konten disusun oleh penutur asli bahasa daerah',
    'Seluruh fitur tersedia tanpa biaya',
    'Progres belajar tersimpan secara otomatis',
    'Flashcard untuk memperkuat hafalan kosakata',
    'Forum diskusi untuk saling berbagi pengetahuan'
  ];

  const steps = [
    { num: '1', title: 'Buat Akun', desc: 'Daftarkan diri Anda dalam hitungan detik, tanpa biaya.' },
    { num: '2', title: 'Pilih Bahasa', desc: 'Tentukan bahasa daerah yang ingin Anda pelajari.' },
    { num: '3', title: 'Mulai Belajar', desc: 'Ikuti materi, kerjakan ujian, dan raih pencapaian.' }
  ];

  const testimonials = umpanBalik
    .filter(u => u.rating >= 4 && u.status === 'selesai')
    .slice(0, 3)
    .map(u => ({
      ...u,
      userName: users.find(usr => usr.id === u.user_id)?.nama || 'Pengguna'
    }));

  return (
    <div className="min-h-screen">
      <LandingNavbar />

      {/* Hero */}
      <section id="beranda" className="relative overflow-hidden bg-primary pt-16">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
              Lestarikan Budaya,{' '}
              <span className="text-secondary">Kuasai Bahasa Daerah</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Pelajari bahasa daerah Indonesia dengan metode yang terstruktur dan menyenangkan. Tersedia untuk Bahasa Sunda, Jawa, Bali, dan Minang.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                  <Link to={user?.role === 'admin' ? '/admin' : '/belajar'}>
                    {user?.role === 'admin' ? 'Dashboard Admin' : 'Mulai Belajar'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                    <Link to="/register" className="flex items-center">
                      Daftar Gratis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild
                    className="text-lg px-8 bg-transparent border-white text-white hover:bg-white/10">
                    <Link to="/login">Sudah Punya Akun?</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Available Languages */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Bahasa yang Tersedia</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pilih bahasa daerah yang ingin Anda pelajari
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bahasaDaerah.filter(b => b.status === 'aktif').map((bahasa) => (
              <Card key={bahasa.id} className="card-hover cursor-pointer border-2 hover:border-primary/30">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{bahasa.icon}</div>
                  <h3 className="font-semibold text-lg">{bahasa.nama_bahasa}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{bahasa.deskripsi}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Cara Memulai</h2>
            <p className="text-muted-foreground text-lg">Tiga langkah mudah untuk mulai belajar</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Fitur Pembelajaran</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk menguasai bahasa daerah
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="card-hover">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Mengapa Belajar di Sini?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              {!isAuthenticated && (
                <Button size="lg" className="mt-8" asChild>
                  <Link to="/register">
                    Mulai Belajar Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
            <div>
              <div className="bg-card rounded-2xl p-8 border shadow-soft">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{users.filter(u => u.role === 'pengguna').length}+ Pengguna</div>
                      <div className="text-sm text-muted-foreground">Sudah bergabung</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{bahasaDaerah.filter(b => b.status === 'aktif').length} Bahasa</div>
                      <div className="text-sm text-muted-foreground">Tersedia untuk dipelajari</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Flashcard & Peringkat</div>
                      <div className="text-sm text-muted-foreground">Fitur belajar interaktif</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section id="ulasan" className="py-16 md:py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Kata Pengguna</h2>
              <p className="text-muted-foreground text-lg">Ulasan dari mereka yang sudah belajar di platform ini</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <Card key={t.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} className={`h-4 w-4 ${n <= t.rating ? 'fill-warning text-warning' : 'text-muted'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-foreground mb-4">"{t.komentar}"</p>
                    <p className="text-sm font-medium text-muted-foreground">— {t.userName}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Us */}
      <section id="tentang" className="py-16 md:py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Tentang Kami</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Platform ini dibuat untuk melestarikan bahasa daerah Indonesia melalui pembelajaran digital yang terstruktur. Kami percaya bahwa bahasa daerah adalah warisan budaya yang harus dijaga dan diturunkan ke generasi berikutnya.
            </p>
            <p className="text-muted-foreground mb-8">
              Dengan pendekatan belajar yang bertahap — mulai dari materi bacaan, latihan kosakata melalui flashcard, hingga evaluasi melalui ujian — kami membantu siapa saja untuk menguasai bahasa daerah pilihan mereka.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{bahasaDaerah.filter(b => b.status === 'aktif').length}</div>
                <div className="text-sm text-muted-foreground">Bahasa Daerah</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{users.filter(u => u.role === 'pengguna').length}</div>
                <div className="text-sm text-muted-foreground">Pengguna Terdaftar</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Gratis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-16 md:py-20 bg-primary">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Siap Memulai?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Daftarkan diri Anda sekarang dan mulai perjalanan mempelajari bahasa daerah Indonesia.
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link to="/register">
                Daftar Gratis Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-10 border-t bg-card">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-primary text-primary-foreground p-1 rounded-md">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg">Belajar Bahasa Daerah</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Platform pembelajaran bahasa daerah Indonesia untuk melestarikan warisan budaya bangsa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Navigasi</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><Link to="/register" className="hover:text-foreground transition-colors">Daftar</Link></div>
                <div><Link to="/login" className="hover:text-foreground transition-colors">Masuk</Link></div>
                <div><a href="#tentang" className="hover:text-foreground transition-colors">Tentang Kami</a></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Kontak</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@bahasadaerah.id</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Indonesia</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Belajar Bahasa Daerah. Lestarikan Budaya Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
