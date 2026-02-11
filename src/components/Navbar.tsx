import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  GraduationCap,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Home,
  BarChart3,
  Settings,
  Zap,
  Trophy,
  Search,
  Languages,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

interface NavItem {
  href?: string;
  label: string;
  icon: any;
  children?: { href: string; label: string; icon: any }[];
}

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userNavItems: NavItem[] = [
    { href: '/belajar', label: 'Belajar', icon: BookOpen },
    { href: '/ujian', label: 'Ujian', icon: GraduationCap },
    { href: '/flashcard', label: 'Flashcard', icon: Zap },
    { href: '/kamus', label: 'Kamus', icon: Search },
    { href: '/komunitas', label: 'Komunitas', icon: Users },
    { href: '/leaderboard', label: 'Peringkat', icon: Trophy },
  ];

  const adminNavItems: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    {
      label: 'Manajemen Konten',
      icon: BookOpen,
      children: [
        { href: '/admin/bahasa', label: 'Bahasa', icon: Languages },
        { href: '/admin/pembelajaran', label: 'Materi', icon: BookOpen },
        { href: '/admin/ujian', label: 'Ujian', icon: GraduationCap },
        { href: '/admin/flashcard', label: 'Flashcard', icon: Zap },
        { href: '/admin/kamus', label: 'Kamus', icon: Search },
      ]
    },
    {
      label: 'Interaksi',
      icon: MessageSquare,
      children: [
        { href: '/admin/komunitas', label: 'Komunitas', icon: Users },
        { href: '/admin/umpan-balik', label: 'Umpan Balik', icon: MessageSquare },
      ]
    },
    {
      label: 'Sistem',
      icon: Settings,
      children: [
        { href: '/admin/pengguna', label: 'Pengguna', icon: Settings },
      ]
    },
    { href: '/leaderboard', label: 'Peringkat', icon: Trophy },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to={user?.role === 'admin' ? '/admin' : '/'} className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg transition-transform group-hover:scale-110">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-bold text-lg text-primary tracking-tight hidden sm:inline">Belajar Bahasa Daerah</span>
          <span className="font-bold text-lg text-primary tracking-tight sm:hidden">BBD</span>
        </Link>

        {isAuthenticated && (
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              if (item.children) {
                const isGroupActive = item.children.some(child =>
                  location.pathname === child.href || location.pathname.startsWith(child.href)
                );

                return (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-2 h-9 rounded-lg text-sm font-medium transition-colors",
                          isGroupActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link
                            to={child.href}
                            className={cn(
                              "flex items-center gap-2 cursor-pointer w-full",
                              location.pathname === child.href ? "text-primary font-bold" : ""
                            )}
                          >
                            <child.icon className="h-4 w-4" />
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              const isActive = location.pathname === item.href ||
                (item.href !== '/admin' && item.href !== '/' && location.pathname.startsWith(item.href!));

              return (
                <Link
                  key={item.href}
                  to={item.href!}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors h-9",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
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

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Selamat Datang</span>
                <span className="text-sm font-bold">{user?.nama}</span>
              </div>

              <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-full border">
                {user?.role !== 'admin' && (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
                      <Link to="/umpan-balik" title="Umpan Balik">
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
                      <Link to="/progress" title="Progress Saya">
                        <BarChart3 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={logout}
                  title="Keluar"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
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

      {mobileMenuOpen && isAuthenticated && (
        <div className="lg:hidden border-t bg-card p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              return (
                <div key={item.label} className="space-y-1">
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Icon className="h-3 w-3" />
                    {item.label}
                  </div>
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const isChildActive = location.pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        to={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-8 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          isChildActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <ChildIcon className="h-4 w-4" />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              );
            }

            const isActive = location.pathname === item.href ||
              (item.href !== '/admin' && item.href !== '/' && location.pathname.startsWith(item.href!));

            return (
              <Link
                key={item.href}
                to={item.href!}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-2 mt-2 border-t">
            <Link
              to={user?.role === 'admin' ? '/admin/umpan-balik' : '/umpan-balik'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <MessageSquare className="h-5 w-5" />
              Umpan Balik
            </Link>
            {user?.role !== 'admin' && (
              <Link
                to="/progress"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <BarChart3 className="h-5 w-5" />
                Progress Saya
              </Link>
            )}
          </div>
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
