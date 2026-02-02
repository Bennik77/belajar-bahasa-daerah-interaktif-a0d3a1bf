import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { 
  BookOpen, GraduationCap, Users, MessageSquare, 
  ArrowRight, CheckCircle, Star, Globe 
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const { bahasaDaerah } = useData();

  const features = [
    {
      icon: BookOpen,
      title: 'Materi Lengkap',
      description: 'Pelajari bahasa daerah dengan materi yang terstruktur dan mudah dipahami'
    },
    {
      icon: GraduationCap,
      title: 'Ujian & Latihan',
      description: 'Uji pemahaman Anda dengan berbagai soal latihan dan ujian'
    },
    {
      icon: Users,
      title: 'Komunitas Belajar',
      description: 'Bergabung dengan komunitas dan belajar bersama sesama pelajar'
    },
    {
      icon: MessageSquare,
      title: 'Umpan Balik',
      description: 'Berikan masukan untuk meningkatkan kualitas pembelajaran'
    }
  ];

  const benefits = [
    'Belajar kapan saja dan di mana saja',
    'Materi disusun oleh ahli bahasa daerah',
    'Gratis untuk semua pengguna',
    'Progress belajar tersimpan otomatis'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur mb-6">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">Platform Belajar Bahasa Daerah #1</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Lestarikan Budaya,{' '}
              <span className="text-secondary">Kuasai Bahasa Daerah</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Pelajari bahasa daerah Indonesia dengan metode yang menyenangkan dan interaktif. 
              Mulai dari Bahasa Sunda, Jawa, Bali, dan banyak lagi!
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
                    <Link to="/register">
                      Daftar Gratis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg px-8 border-white/30 hover:bg-white/10">
                    <Link to="/login">Sudah Punya Akun?</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Available Languages */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bahasa yang Tersedia</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pilih bahasa daerah yang ingin Anda pelajari
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bahasaDaerah.filter(b => b.status === 'aktif').map((bahasa, index) => (
              <Card 
                key={bahasa.id} 
                className="card-hover cursor-pointer border-2 hover:border-primary/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{bahasa.icon}</div>
                  <h3 className="font-semibold text-lg">{bahasa.nama_bahasa}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {bahasa.deskripsi}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk belajar bahasa daerah dengan efektif
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Mengapa Belajar di{' '}
                <span className="text-primary">Platform Kami?</span>
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
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
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-soft">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">1000+ Pengguna</div>
                      <div className="text-sm text-muted-foreground">Sudah bergabung</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-soft">
                    <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <div className="font-semibold">50+ Materi</div>
                      <div className="text-sm text-muted-foreground">Pembelajaran lengkap</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-soft">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold">100+ Ujian</div>
                      <div className="text-sm text-muted-foreground">Latihan soal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Mulai Belajar?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Daftar sekarang dan mulai perjalanan Anda mempelajari bahasa daerah Indonesia
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
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌸</span>
              <span className="font-semibold">Belajar Bahasa Daerah</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Belajar Bahasa Daerah. Lestarikan Budaya Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
