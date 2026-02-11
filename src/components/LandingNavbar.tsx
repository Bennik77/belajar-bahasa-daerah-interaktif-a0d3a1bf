import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Menu, X, ArrowRight } from 'lucide-react';

export function LandingNavbar() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Fitur', href: '#fitur' },
    { label: 'Ulasan', href: '#ulasan' },
    { label: 'Tentang Kami', href: '#tentang' },
  ];

  const handleAnchorClick = (href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-card/95 backdrop-blur border-b shadow-soft' : 'bg-transparent'
      }`}>
      <div className="container flex h-16 items-center justify-between">
        <button
          onClick={() => handleAnchorClick('#beranda')}
          className="flex items-center gap-2 group"
        >
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg transition-transform group-hover:scale-110">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className={`font-bold text-lg tracking-tight hidden sm:inline transition-colors ${scrolled ? 'text-primary' : 'text-white'
            }`}>
            Belajar Bahasa Daerah
          </span>
          <span className={`font-bold text-lg tracking-tight sm:hidden transition-colors ${scrolled ? 'text-primary' : 'text-white'
            }`}>
            BBD
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleAnchorClick(link.href)}
              className={`text-sm font-medium transition-colors hover:opacity-80 ${scrolled ? 'text-foreground' : 'text-white/90 hover:text-white'
                }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button size="sm" asChild>
              <Link to={user?.role === 'admin' ? '/admin' : '/belajar'}>
                {user?.role === 'admin' ? 'Dashboard' : 'Mulai Belajar'}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="outline" size="sm" asChild
                className={`font-bold transition-all ${!scrolled
                    ? 'bg-transparent border-white text-white hover:bg-white/10'
                    : 'border-primary text-primary hover:bg-primary/5'
                  }`}>
                <Link to="/login">Masuk</Link>
              </Button>
              <Button size="sm" variant={scrolled ? 'default' : 'secondary'} asChild>
                <Link to="/register">Daftar Gratis</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden ${!scrolled ? 'text-white hover:bg-white/10' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-2 shadow-medium">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleAnchorClick(link.href)}
              className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </button>
          ))}
          {!isAuthenticated && (
            <div className="pt-2 mt-2 border-t flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Masuk</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Daftar</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
