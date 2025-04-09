
export interface UserSettings {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  darkMode: boolean;
  language: 'pt-BR' | 'en-US';
}

export interface SystemSettings {
  companyName: string;
  companyLogo?: string;
  address?: string;
  phone?: string;
  email?: string;
  evolutionInstance?: string;
  evolutionToken?: string;
  evolutionUrl?: string;
  webhookUrl?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  smtpFromEmail?: string;
  smtpFromName?: string;
}
