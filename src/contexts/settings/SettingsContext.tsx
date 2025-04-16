
import React from 'react';
import { createContext } from 'react';
import { SystemSettings, UserSettings } from '@/types/settings';
import { defaultSystemSettings, defaultUserSettings } from './defaults';
import { SettingsContextType } from './SettingsContext';

// Set up the context with defaults
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
