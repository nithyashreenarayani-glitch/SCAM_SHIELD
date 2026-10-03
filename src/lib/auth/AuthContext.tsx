import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { UserProfile } from '../../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'signup' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot') => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, pass: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isSupabaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'scamshield_mock_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');

  useEffect(() => {
    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || 'user@example.com',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
              createdAt: session.user.created_at,
            });
          }
          supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || 'user@example.com',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
                createdAt: session.user.created_at,
              });
            } else {
              setUser(null);
            }
          });
        } catch (e) {
          console.warn('Supabase auth session check failed', e);
        }
      } else {
        // Fallback local persistence
        const stored = localStorage.getItem(LOCAL_USER_KEY);
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            localStorage.removeItem(LOCAL_USER_KEY);
          }
        }
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) {
          if (error.message.includes('Invalid path') || error.message.includes('Failed to fetch')) {
            const u: UserProfile = {
              id: 'local-' + Math.random().toString(36).substring(2, 9),
              email,
              name: email.split('@')[0],
              createdAt: new Date().toISOString(),
            };
            setUser(u);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
            return { success: true };
          }
          return { success: false, error: error.message };
        }
        if (data.user) {
          const u: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || email.split('@')[0],
            createdAt: data.user.created_at,
          };
          setUser(u);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase signIn catch:', err);
      }
    }

    // Local authentication fallback for instant demo testing
    if (email && pass.length >= 6) {
      const u: UserProfile = {
        id: 'local-' + Math.random().toString(36).substring(2, 9),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      setUser(u);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
      return { success: true };
    }

    return { success: false, error: 'Password must be at least 6 characters.' };
  };

  const signup = async (email: string, pass: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: { data: { name } },
        });
        if (error) {
          if (error.message.includes('Invalid path') || error.message.includes('Failed to fetch')) {
            const u: UserProfile = {
              id: 'local-' + Math.random().toString(36).substring(2, 9),
              email,
              name: name || email.split('@')[0],
              createdAt: new Date().toISOString(),
            };
            setUser(u);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
            return { success: true };
          }
          return { success: false, error: error.message };
        }
        if (data.user) {
          const u: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            name: name || email.split('@')[0],
            createdAt: data.user.created_at,
          };
          setUser(u);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase signUp catch:', err);
      }
    }

    // Local fallback
    if (email && pass.length >= 6) {
      const u: UserProfile = {
        id: 'local-' + Math.random().toString(36).substring(2, 9),
        email,
        name: name || email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      setUser(u);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
      return { success: true };
    }

    return { success: false, error: 'Please enter a valid email and 6+ character password.' };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
        login,
        signup,
        logout,
        isSupabaseActive: isSupabaseConfigured,
      }}
    >
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
