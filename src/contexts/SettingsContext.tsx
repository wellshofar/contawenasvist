
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
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: '',
  smtpSecure: true,
  smtpFromEmail: '',
  smtpFromName: '',
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
      try {
        setIsLoading(true);
        
        // Fetch user settings if logged in
        if (user) {
          const { data: userData, error: userError } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (userError && userError.code !== 'PGRST116') {
            console.error('Erro ao buscar configurações do usuário:', userError);
          }

          if (userData) {
            // Safely handle the settings conversion with proper type checks
            const storedSettings = userData.settings as Record<string, any>;
            setUserSettings({
              ...defaultUserSettings,
              ...(storedSettings as Partial<UserSettings>)
            });
          }
        }

        // Fetch system settings (regardless of login status)
        const { data: sysData, error: sysError } = await supabase
          .from('system_settings')
          .select('*')
          .single();

        if (sysError && sysError.code !== 'PGRST116') {
          console.error('Erro ao buscar configurações do sistema:', sysError);
        }

        if (sysData) {
          // Safely handle the settings conversion with proper type checks
          const storedSettings = sysData.settings as Record<string, any>;
          setSystemSettings({
            ...defaultSystemSettings,
            ...(storedSettings as Partial<SystemSettings>)
          });
          console.log("Loaded system settings:", {
            ...defaultSystemSettings,
            ...(storedSettings as Partial<SystemSettings>)
          });
        } else {
          // If no system settings found, create default ones
          await supabase
            .from('system_settings')
            .upsert({ 
              id: 1, 
              settings: defaultSystemSettings,
              updated_at: new Date().toISOString()
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
      throw error;
    }
  };

  const updateSystemSettings = async (settings: Partial<SystemSettings>) => {
    try {
      const newSettings = { ...systemSettings, ...settings };
      setSystemSettings(newSettings);
      
      console.log("Saving system settings:", newSettings);
      
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          id: 1, 
          settings: newSettings,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Erro Supabase ao atualizar configurações do sistema:', error);
        throw error;
      }
      
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
      throw error;
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
