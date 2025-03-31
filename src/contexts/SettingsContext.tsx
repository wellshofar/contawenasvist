
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSettings, SystemSettings } from '@/types/settings';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface SettingsContextType {
  userSettings: UserSettings;
  systemSettings: SystemSettings;
  isLoading: boolean;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateSystemSettings: (settings: Partial<SystemSettings>) => Promise<void>;
}

const defaultUserSettings: UserSettings = {
  notificationsEnabled: true,
  emailNotifications: true,
  darkMode: false,
  language: 'pt-BR',
};

const defaultSystemSettings: SystemSettings = {
  companyName: 'HOKEN',
  address: '',
  phone: '',
  email: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(defaultSystemSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Buscar configurações do usuário
        const { data: userData, error: userError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Erro ao buscar configurações do usuário:', userError);
        }

        if (userData) {
          setUserSettings({
            ...defaultUserSettings,
            ...(userData.settings as UserSettings || {})
          });
        }

        // Buscar configurações do sistema
        const { data: sysData, error: sysError } = await supabase
          .from('system_settings')
          .select('*')
          .single();

        if (sysError && sysError.code !== 'PGRST116') {
          console.error('Erro ao buscar configurações do sistema:', sysError);
        }

        if (sysData) {
          setSystemSettings({
            ...defaultSystemSettings,
            ...(sysData.settings as SystemSettings || {})
          });
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    if (!user) return;
    
    try {
      const newSettings = { ...userSettings, ...settings };
      setUserSettings(newSettings);
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({ 
          id: user.id,
          user_id: user.id, 
          settings: newSettings,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Configurações atualizadas",
        description: "Suas preferências foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações do usuário:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível atualizar suas preferências.",
        variant: "destructive",
      });
    }
  };

  const updateSystemSettings = async (settings: Partial<SystemSettings>) => {
    try {
      const newSettings = { ...systemSettings, ...settings };
      setSystemSettings(newSettings);
      
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          id: 1, 
          settings: newSettings,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Configurações do sistema atualizadas",
        description: "As configurações do sistema foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações do sistema:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível atualizar as configurações do sistema.",
        variant: "destructive",
      });
    }
  };

  const value = {
    userSettings,
    systemSettings,
    isLoading,
    updateUserSettings,
    updateSystemSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
