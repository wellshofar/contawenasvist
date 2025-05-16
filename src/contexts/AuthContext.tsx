
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

// Função utilitária para limpar o estado de autenticação
const cleanupAuthState = () => {
  try {
    // Remover todos os tokens relacionados ao Supabase do localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Também limpar do sessionStorage caso esteja em uso
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Erro ao limpar estado de autenticação:', error);
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
    // Configurar listener para mudanças no estado de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Estado de autenticação alterado:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Adiar busca de perfil para evitar deadlocks
          setTimeout(() => {
            fetchProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // DEPOIS checar por sessão existente
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      console.log('Sessão inicial:', initialSession ? 'Presente' : 'Ausente');
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        await fetchProfile(initialSession.user.id);
      }
      
      setLoading(false);
    });

    // Verificar se existe usuário administrador
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
      console.log(`Tentando fazer login com email: ${email}`);
      
      // Limpar estado de autenticação antes de tentar login
      cleanupAuthState();
      
      // Tente fazer logout global primeiro para evitar problemas com sessões existentes
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (logoutError) {
        console.warn("Erro no logout antes do login:", logoutError);
        // Continuar mesmo se o logout falhar
      }
      
      // Agora tente fazer login
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Erro de login:', error);
        return { error };
      }

      console.log('Login bem-sucedido, usuário:', data.user);
      // Não precisamos definir manualmente usuário/sessão aqui, onAuthStateChange cuidará disso
      return { error: null };
    } catch (error) {
      console.error('Exceção em signIn:', error);
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
      // Limpar estado de autenticação
      cleanupAuthState();
      
      // Tentar logout global
      await supabase.auth.signOut({ scope: 'global' });
      
      // Forçar recarregamento da página para garantir estado limpo
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, tentar navegar para a página inicial
      window.location.href = '/';
    }
  };

  // Helpers para controle de acesso baseado em função
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
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
