
import React, { useContext } from 'react';
import { SystemSettings, UserSettings } from '@/types/settings';
import { defaultSystemSettings, defaultUserSettings } from './defaults';

export interface SettingsContextType {
  userSettings: UserSettings;
  systemSettings: SystemSettings;
  isLoading: boolean;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateSystemSettings: (settings: Partial<SystemSettings>) => Promise<void>;
}

// Set up the context with defaults
export const SettingsContext = React.createContext<SettingsContextType>({
  userSettings: defaultUserSettings,
  systemSettings: defaultSystemSettings,
  isLoading: false,
  updateUserSettings: async () => {},
  updateSystemSettings: async () => {},
});

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
