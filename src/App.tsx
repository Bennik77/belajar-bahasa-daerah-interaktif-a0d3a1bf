import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import BelajarPage from "./pages/user/BelajarPage";
import MateriDetailPage from "./pages/user/MateriDetailPage";
import UjianPage from "./pages/user/UjianPage";
import KerjakanUjianPage from "./pages/user/KerjakanUjianPage";
import HasilUjianPage from "./pages/user/HasilUjianPage";
import KomunitasPage from "./pages/user/KomunitasPage";
import UmpanBalikPage from "./pages/user/UmpanBalikPage";
import ProgressPage from "./pages/user/ProgressPage";
import FlashcardPage from "./pages/user/FlashcardPage";
import LeaderboardPage from "./pages/user/LeaderboardPage";
import KamusPage from "./pages/user/KamusPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPembelajaran from "./pages/admin/AdminPembelajaran";
import AdminUjian from "./pages/admin/AdminUjian";
import AdminKomunitas from "./pages/admin/AdminKomunitas";
import AdminUmpanBalik from "./pages/admin/AdminUmpanBalik";
import AdminPengguna from "./pages/admin/AdminPengguna";
import AdminFlashcard from "./pages/admin/AdminFlashcard";
import AdminKamus from "./pages/admin/AdminKamus";
import AdminBahasa from "./pages/admin/AdminBahasa";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-4xl">⏳</div></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/belajar" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User Routes */}
      <Route path="/belajar" element={<ProtectedRoute><BelajarPage /></ProtectedRoute>} />
      <Route path="/belajar/materi/:id" element={<ProtectedRoute><MateriDetailPage /></ProtectedRoute>} />
      <Route path="/ujian" element={<ProtectedRoute><UjianPage /></ProtectedRoute>} />
      <Route path="/ujian/kerjakan/:id" element={<ProtectedRoute><KerjakanUjianPage /></ProtectedRoute>} />
      <Route path="/ujian/hasil/:id" element={<ProtectedRoute><HasilUjianPage /></ProtectedRoute>} />
      <Route path="/komunitas" element={<ProtectedRoute><KomunitasPage /></ProtectedRoute>} />
      <Route path="/umpan-balik" element={<ProtectedRoute><UmpanBalikPage /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
      <Route path="/flashcard" element={<ProtectedRoute><FlashcardPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/kamus" element={<ProtectedRoute><KamusPage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/pembelajaran" element={<ProtectedRoute adminOnly><AdminPembelajaran /></ProtectedRoute>} />
      <Route path="/admin/ujian" element={<ProtectedRoute adminOnly><AdminUjian /></ProtectedRoute>} />
      <Route path="/admin/komunitas" element={<ProtectedRoute adminOnly><AdminKomunitas /></ProtectedRoute>} />
      <Route path="/admin/umpan-balik" element={<ProtectedRoute adminOnly><AdminUmpanBalik /></ProtectedRoute>} />
      <Route path="/admin/pengguna" element={<ProtectedRoute adminOnly><AdminPengguna /></ProtectedRoute>} />
      <Route path="/admin/flashcard" element={<ProtectedRoute adminOnly><AdminFlashcard /></ProtectedRoute>} />
      <Route path="/admin/kamus" element={<ProtectedRoute adminOnly><AdminKamus /></ProtectedRoute>} />
      <Route path="/admin/bahasa" element={<ProtectedRoute adminOnly><AdminBahasa /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
