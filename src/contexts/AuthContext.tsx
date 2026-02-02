import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '@/types/database';
import { mockUsers } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user in mock data
    const foundUser = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (foundUser) {
      if (foundUser.status === 'nonaktif' || foundUser.status === 'diblokir') {
        toast({
          title: "Login Gagal",
          description: "Akun Anda tidak aktif atau diblokir.",
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }
      
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${foundUser.nama}!`,
      });
      setIsLoading(false);
      return true;
    }
    
    toast({
      title: "Login Gagal",
      description: "Email atau password salah.",
      variant: "destructive"
    });
    setIsLoading(false);
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      toast({
        title: "Registrasi Gagal",
        description: "Email sudah terdaftar.",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: mockUsers.length + 1,
      nama: data.nama,
      email: data.email,
      password: data.password,
      role: 'pengguna',
      status: 'aktif',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    toast({
      title: "Registrasi Berhasil",
      description: "Akun berhasil dibuat. Silakan login.",
    });
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem.",
    });
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        register, 
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
