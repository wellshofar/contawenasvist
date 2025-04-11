
export interface UserSettings {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
}

export interface SystemSettings {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  smtpFromEmail: string;
  smtpFromName: string;
  evolutionInstance?: string;
  evolutionToken?: string;
  evolutionUrl?: string;
  webhookUrl?: string;
}

export type SMTPSettings = Pick<
  SystemSettings,
  | "smtpHost"
  | "smtpPort"
  | "smtpUser"
  | "smtpPassword"
  | "smtpSecure"
  | "smtpFromEmail"
  | "smtpFromName"
>;

export type EvolutionApiSettings = Pick<
  SystemSettings,
  | "evolutionInstance"
  | "evolutionToken"
  | "evolutionUrl"
>;

export type WebhookSettings = Pick<
  SystemSettings,
  | "webhookUrl"
>;
