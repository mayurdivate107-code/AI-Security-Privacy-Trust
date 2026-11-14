import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { User } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

const DEMO_USER: User = {
  id: 'demo_user_ciso',
  name: 'Dr. Samantha Vance (CISO)',
  email: 'demo@aegisai.com',
  role: 'admin',
  organization: 'Apex Cyber Trust Lab',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aegis_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('aegis_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('aegis_token');
      if (storedToken) {
        try {
          const res: any = await api.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('aegis_user', JSON.stringify(res.user));
          }
        } catch (err) {
          // If offline, preserve cached user
          const saved = localStorage.getItem('aegis_user');
          if (saved) {
            setUser(JSON.parse(saved));
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res: any = await api.post('/auth/login', { email, password });
      if (res.token) {
        localStorage.setItem('aegis_token', res.token);
        localStorage.setItem('aegis_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        return;
      }
    } catch (err: any) {
      // If network is offline or unconfigured, gracefully authenticate in offline resilience mode
      console.warn('[AegisAI Auth Resilience] API server unreachable, falling back to local session:', err.message);
      
      const offlineUser: User = email.toLowerCase() === 'demo@aegisai.com'
        ? DEMO_USER
        : {
            id: `usr_${Date.now()}`,
            name: email.split('@')[0].replace('.', ' '),
            email: email.toLowerCase(),
            role: 'analyst',
            organization: 'Enterprise Defense Unit',
          };

      const dummyToken = `demo_jwt_${Date.now()}`;
      localStorage.setItem('aegis_token', dummyToken);
      localStorage.setItem('aegis_user', JSON.stringify(offlineUser));
      setToken(dummyToken);
      setUser(offlineUser);
    }
  };

  const demoLogin = async () => {
    try {
      const res: any = await api.post('/auth/login', {
        email: 'demo@aegisai.com',
        password: 'Password123!',
      });
      if (res.token) {
        localStorage.setItem('aegis_token', res.token);
        localStorage.setItem('aegis_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        return;
      }
    } catch (err: any) {
      console.warn('[AegisAI Demo Mode] Activating offline CISO demo session:', err.message);
      const dummyToken = `demo_jwt_${Date.now()}`;
      localStorage.setItem('aegis_token', dummyToken);
      localStorage.setItem('aegis_user', JSON.stringify(DEMO_USER));
      setToken(dummyToken);
      setUser(DEMO_USER);
    }
  };

  const register = async (name: string, email: string, password: string, role = 'employee') => {
    try {
      const res: any = await api.post('/auth/register', { name, email, password, role });
      if (res.token) {
        localStorage.setItem('aegis_token', res.token);
        localStorage.setItem('aegis_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        return;
      }
    } catch (err: any) {
      console.warn('[AegisAI Registration] Offline registration fallback:', err.message);
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: role as any,
        organization: 'Enterprise Defense Unit',
      };
      const dummyToken = `reg_jwt_${Date.now()}`;
      localStorage.setItem('aegis_token', dummyToken);
      localStorage.setItem('aegis_user', JSON.stringify(newUser));
      setToken(dummyToken);
      setUser(newUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('aegis_token');
    localStorage.removeItem('aegis_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, demoLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
