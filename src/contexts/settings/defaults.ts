import { SystemSettings, UserSettings } from "@/types/settings";

export const defaultUserSettings: UserSettings = {
  theme: "system",
  language: "pt-BR",
  notificationsEnabled: true,
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
  supportChannels: ""
};
