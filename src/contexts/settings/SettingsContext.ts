
import { createContext, useContext } from 'react';
import { SystemSettings, UserSettings } from '@/types/settings';
import { defaultSystemSettings, defaultUserSettings } from './defaults';

export interface SettingsContextType {
  userSettings: UserSettings;
  systemSettings: SystemSettings;
  isLoading: boolean;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateSystemSettings: (settings: Partial<SystemSettings>) => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
