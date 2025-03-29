
import React from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const UserSettingsForm: React.FC = () => {
  const { userSettings, updateUserSettings } = useSettings();

  const handleSwitchChange = (field: keyof typeof userSettings) => {
    return () => {
      updateUserSettings({ [field]: !userSettings[field] });
    };
  };

  const handleLanguageChange = (value: 'pt-BR' | 'en-US') => {
    updateUserSettings({ language: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências do Usuário</CardTitle>
        <CardDescription>
          Configure suas preferências pessoais para o sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="flex flex-col">
              <span>Notificações</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receba alertas sobre manutenções e tarefas pendentes
              </span>
            </Label>
            <Switch
              id="notifications"
              checked={userSettings.notificationsEnabled}
              onCheckedChange={handleSwitchChange('notificationsEnabled')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex flex-col">
              <span>Notificações por E-mail</span>
              <span className="font-normal text-sm text-muted-foreground">
                Receba notificações importantes por e-mail
              </span>
            </Label>
            <Switch
              id="email-notifications"
              checked={userSettings.emailNotifications}
              onCheckedChange={handleSwitchChange('emailNotifications')}
              disabled={!userSettings.notificationsEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex flex-col">
              <span>Modo Escuro</span>
              <span className="font-normal text-sm text-muted-foreground">
                Altere o tema visual da aplicação
              </span>
            </Label>
            <Switch
              id="dark-mode"
              checked={userSettings.darkMode}
              onCheckedChange={handleSwitchChange('darkMode')}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Idioma</Label>
          <RadioGroup 
            value={userSettings.language}
            onValueChange={(value) => handleLanguageChange(value as 'pt-BR' | 'en-US')}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pt-BR" id="pt-BR" />
              <Label htmlFor="pt-BR">Português (Brasil)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en-US" id="en-US" />
              <Label htmlFor="en-US">English (US)</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSettingsForm;
