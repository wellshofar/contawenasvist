
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US';
  notificationsEnabled: boolean;
  emailNotifications?: boolean;
  darkMode?: boolean;
}

export interface SystemSettings {
  companyName: string;
  companyDocument: string; // CNPJ
  responsibleName: string;
  companyCode: string;
  phone: string;
  email: string;
  address: string;
  addressNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  businessHours: string;
  supportChannels: string;
  
  // SMTP Settings
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  smtpFromEmail?: string;
  smtpFromName?: string;
  
  // Evolution API Settings
  evolutionInstance?: string;
  evolutionToken?: string;
  evolutionUrl?: string;
}
