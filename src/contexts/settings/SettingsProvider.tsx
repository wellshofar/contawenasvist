
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SystemSettings, UserSettings } from '@/types/settings';
import { SettingsContext, SettingsContextType } from './SettingsContext';
import { defaultSystemSettings, defaultUserSettings } from './defaults';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(defaultSystemSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch settings when the component mounts or user changes
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // Fetch user settings
        const { data: userData, error: userError } = await supabase
          .from('user_settings')
          .select('settings')
          .eq('user_id', user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching user settings:', userError);
          toast({
            title: 'Erro ao carregar configurações',
            description: 'Não foi possível carregar suas configurações pessoais.',
            variant: 'destructive',
          });
        } else if (userData) {
          setUserSettings((prevSettings) => ({
            ...prevSettings,
            ...userData.settings,
          }));
        }

        // Fetch system settings (assuming user has permission)
        const { data: systemData, error: systemError } = await supabase
          .from('system_settings')
          .select('settings')
          .eq('id', 1) // Assuming a single system settings record
          .single();

        if (systemError && systemError.code !== 'PGRST116') {
          console.error('Error fetching system settings:', systemError);
          toast({
            title: 'Erro ao carregar configurações do sistema',
            description: 'Não foi possível carregar as configurações do sistema.',
            variant: 'destructive',
          });
        } else if (systemData) {
          setSystemSettings((prevSettings) => ({
            ...prevSettings,
            ...systemData.settings,
          }));
        }
      } catch (error) {
        console.error('Unexpected error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user, toast]);

  // Update user settings
  const updateUserSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    try {
      const mergedSettings = {
        ...userSettings,
        ...newSettings,
      };
      
      setUserSettings(mergedSettings);

      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          id: user.id,
          user_id: user.id,
          settings: mergedSettings,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error('Error updating user settings:', error);
        toast({
          title: 'Erro ao salvar configurações',
          description: 'Não foi possível salvar suas configurações pessoais.',
          variant: 'destructive',
        });
        // Rollback optimistic update
        setUserSettings(userSettings);
      } else {
        toast({
          title: 'Configurações atualizadas',
          description: 'Suas configurações foram salvas com sucesso.',
        });
      }
    } catch (error) {
      console.error('Unexpected error updating user settings:', error);
      // Rollback optimistic update
      setUserSettings(userSettings);
    }
  };

  // Update system settings
  const updateSystemSettings = async (newSettings: Partial<SystemSettings>) => {
    if (!user) return;

    try {
      const mergedSettings = {
        ...systemSettings,
        ...newSettings,
      };
      
      setSystemSettings(mergedSettings);

      const { data, error } = await supabase
        .from('system_settings')
        .upsert({
          id: 1, // Assuming a single system settings record
          settings: mergedSettings,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error('Error updating system settings:', error);
        toast({
          title: 'Erro ao salvar configurações do sistema',
          description: 'Não foi possível salvar as configurações do sistema.',
          variant: 'destructive',
        });
        // Rollback optimistic update
        setSystemSettings(systemSettings);
      } else {
        toast({
          title: 'Configurações do sistema atualizadas',
          description: 'As configurações do sistema foram salvas com sucesso.',
        });
      }
    } catch (error) {
      console.error('Unexpected error updating system settings:', error);
      // Rollback optimistic update
      setSystemSettings(systemSettings);
    }
  };

  const value: SettingsContextType = {
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
