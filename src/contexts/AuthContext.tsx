
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  userRole: UserRole | null;
  isAdmin: boolean;
  isTecnico: boolean;
  isAtendente: boolean;
  adminExists: boolean | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to clean up auth state
const cleanupAuthState = () => {
  try {
    // Remove all Supabase-related tokens from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Also clear from sessionStorage if used
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing auth state:', error);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Defer profile fetch to prevent deadlocks
          setTimeout(() => {
            fetchProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      console.log('Initial session:', initialSession ? 'Present' : 'Absent');
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        await fetchProfile(initialSession.user.id);
      }
      
      setLoading(false);
    });

    // Check if admin user exists
    checkIfAdminExists();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkIfAdminExists = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);
      
      if (error) {
        console.error('Erro ao verificar a existência de admin:', error);
        return;
      }
      
      setAdminExists(data && data.length > 0);
    } catch (error) {
      console.error('Erro em checkIfAdminExists:', error);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      // Usar maybeSingle em vez de single para evitar erros quando nenhum perfil é encontrado
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return;
      }

      console.log('Perfil obtido:', data);
      setProfile(data as Profile);
    } catch (error) {
      console.error('Erro em fetchProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log(`Attempting login with email: ${email}`);
      
      // Clean up auth state before trying login
      cleanupAuthState();
      
      // Try global logout first to avoid issues with existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (logoutError) {
        console.warn("Error in logout before login:", logoutError);
        // Continue even if logout fails
      }
      
      // Now try to log in
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error);
        return { error };
      }

      console.log('Login successful, user:', data.user);
      // No need to manually set user/session here, onAuthStateChange will handle it
      return { error: null };
    } catch (error) {
      console.error('Exception in signIn:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Limpar estado de autenticação antes de tentar cadastro
      cleanupAuthState();
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (!error) {
        toast({
          title: "Conta criada com sucesso",
          description: "Um administrador precisa aprovar sua conta antes que você possa fazer login.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Erro em signUp:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Try global logout
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      // Even with error, try to navigate to home page
      window.location.href = '/';
    }
  };

  // Role-based access control helpers
  const userRole = profile?.role || null;
  const isAdmin = userRole === 'admin';
  const isTecnico = userRole === 'tecnico';
  const isAtendente = userRole === 'atendente';

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        signIn,
        signUp,
        signOut,
        loading,
        userRole,
        isAdmin,
        isTecnico,
        isAtendente,
        adminExists
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
