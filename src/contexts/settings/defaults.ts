
import { SystemSettings, UserSettings } from "@/types/settings";

export const defaultUserSettings: UserSettings = {
  theme: "system",
  language: "pt-BR",
  notificationsEnabled: true,
  emailNotifications: false,
  darkMode: false,
};

export const defaultSystemSettings: SystemSettings = {
  companyName: "",
  companyDocument: "",
  responsibleName: "",
  companyCode: "",
  phone: "",
  email: "",
  address: "",
  addressNumber: "",
  neighborhood: "",
  city: "",
  state: "",
  postalCode: "",
  businessHours: "",
  supportChannels: "",
  
  // SMTP Settings
  smtpHost: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPassword: "",
  smtpSecure: true,
  smtpFromEmail: "",
  smtpFromName: "",
  
  // Evolution API Settings
  evolutionInstance: "",
  evolutionToken: "",
  evolutionUrl: "https://api.chatzapbot.com.br"
};
