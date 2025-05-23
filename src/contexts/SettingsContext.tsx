
// This file now exports the context and provider directly
import { SettingsContext, useSettings } from './settings/SettingsContext';
import type { SettingsContextType } from './settings/SettingsContext';
import { SettingsProvider } from './settings/SettingsProvider';

export { useSettings, SettingsProvider, SettingsContext };
export type { SettingsContextType };
