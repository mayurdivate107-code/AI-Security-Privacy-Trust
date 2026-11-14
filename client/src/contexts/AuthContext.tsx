import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, isBackendAlive } from '../lib/api.js';
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
        const online = await isBackendAlive();
        if (online) {
          try {
            const res: any = await api.get('/auth/me');
            if (res.success && res.user) {
              setUser(res.user);
              localStorage.setItem('aegis_user', JSON.stringify(res.user));
            }
          } catch {
            // keep cached user
          }
        }
        // Always hydrate from cache if present
        const saved = localStorage.getItem('aegis_user');
        if (saved && !user) {
          setUser(JSON.parse(saved));
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const provisionOfflineSession = (email: string, name?: string) => {
    const offlineUser: User = email.toLowerCase() === 'demo@aegisai.com'
      ? DEMO_USER
      : {
          id: `usr_${Date.now()}`,
          name: name || email.split('@')[0].replace('.', ' '),
          email: email.toLowerCase(),
          role: 'analyst',
          organization: 'Enterprise Defense Unit',
        };

    const dummyToken = `demo_jwt_${Date.now()}`;
    localStorage.setItem('aegis_token', dummyToken);
    localStorage.setItem('aegis_user', JSON.stringify(offlineUser));
    setToken(dummyToken);
    setUser(offlineUser);
  };

  const login = async (email: string, password: string) => {
    const online = await isBackendAlive();
    if (!online) {
      provisionOfflineSession(email);
      return;
    }
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
      console.warn('[AegisAI Auth Resilience] API error, falling back to local session:', err.message);
      provisionOfflineSession(email);
    }
  };

  const demoLogin = async () => {
    const online = await isBackendAlive();
    if (!online) {
      provisionOfflineSession('demo@aegisai.com');
      return;
    }
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
      provisionOfflineSession('demo@aegisai.com');
    }
  };

  const register = async (name: string, email: string, password: string, role = 'employee') => {
    const online = await isBackendAlive();
    if (!online) {
      provisionOfflineSession(email, name);
      return;
    }
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
      provisionOfflineSession(email, name);
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
