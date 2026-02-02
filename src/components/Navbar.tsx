import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, GraduationCap, Users, MessageSquare, 
  LogOut, Menu, X, Home, BarChart3, Settings 
} from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userNavItems = [
    { href: '/belajar', label: 'Belajar', icon: BookOpen },
    { href: '/ujian', label: 'Ujian', icon: GraduationCap },
    { href: '/komunitas', label: 'Komunitas', icon: Users },
    { href: '/umpan-balik', label: 'Umpan Balik', icon: MessageSquare },
    { href: '/progress', label: 'Progress', icon: BarChart3 },
  ];

  const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/pembelajaran', label: 'Pembelajaran', icon: BookOpen },
    { href: '/admin/ujian', label: 'Ujian', icon: GraduationCap },
    { href: '/admin/komunitas', label: 'Komunitas', icon: Users },
    { href: '/admin/umpan-balik', label: 'Umpan Balik', icon: MessageSquare },
    { href: '/admin/pengguna', label: 'Pengguna', icon: Settings },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to={user?.role === 'admin' ? '/admin' : '/'} className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="font-bold text-lg text-primary hidden sm:inline">Belajar Bahasa Daerah</span>
          <span className="font-bold text-lg text-primary sm:hidden">BBD</span>
        </Link>

        {/* Desktop Navigation */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || 
                (item.href !== '/admin' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Auth Buttons / User Menu */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">
                Halo, <span className="font-medium text-foreground">{user?.nama}</span>
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="hidden md:flex gap-2"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Masuk</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Daftar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && isAuthenticated && (
        <div className="md:hidden border-t bg-card p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || 
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 px-4 py-3 text-destructive hover:text-destructive"
            onClick={() => {
              logout();
              setMobileMenuOpen(false);
            }}
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </Button>
        </div>
      )}
    </nav>
  );
}
