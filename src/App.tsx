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
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPembelajaran from "./pages/admin/AdminPembelajaran";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
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
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/pembelajaran" element={<ProtectedRoute adminOnly><AdminPembelajaran /></ProtectedRoute>} />
      <Route path="/admin/ujian" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/komunitas" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/umpan-balik" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/pengguna" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      
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
