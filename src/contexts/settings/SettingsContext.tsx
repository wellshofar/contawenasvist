
import { createContext } from 'react';
import { SystemSettings, UserSettings } from '@/types/settings';
import { defaultSystemSettings, defaultUserSettings } from './defaults';
import { SettingsContextType as BaseSettingsContextType } from './SettingsContext';

// Re-export the type from the .ts file to avoid duplication
export type SettingsContextType = BaseSettingsContextType;

// Set up the context with defaults matching the .ts version
export const SettingsContext = createContext<SettingsContextType>({
  userSettings: defaultUserSettings,
  systemSettings: defaultSystemSettings,
  isLoading: false,
  updateUserSettings: async () => {},
  updateSystemSettings: async () => {},
});

export const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
