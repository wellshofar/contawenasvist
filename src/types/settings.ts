export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US';
  notificationsEnabled: boolean;
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
}
