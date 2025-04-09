
import { SystemSettings, UserSettings } from '@/types/settings';

export const defaultUserSettings: UserSettings = {
  notificationsEnabled: true,
  emailNotifications: true,
  darkMode: false,
  language: 'pt-BR',
};

export const defaultSystemSettings: SystemSettings = {
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
