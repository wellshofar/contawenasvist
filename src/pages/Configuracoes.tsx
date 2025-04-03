
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Shield, Building, Webhook } from "lucide-react";
import UserSettingsForm from "@/components/settings/UserSettingsForm";
import SystemSettingsForm from "@/components/settings/SystemSettingsForm";
import ProfileSettingsForm from "@/components/settings/ProfileSettingsForm";
import SecuritySettingsForm from "@/components/settings/SecuritySettingsForm";
import IntegrationsSettingsForm from "@/components/settings/IntegrationsSettingsForm";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";

const Configuracoes: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <SettingsProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas preferências e configurações do sistema
          </p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Segurança</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Preferências</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden md:inline">Empresa</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Webhook className="h-4 w-4" />
              <span className="hidden md:inline">Integrações</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="profile" className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Perfil</h2>
              <ProfileSettingsForm />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Segurança</h2>
              <SecuritySettingsForm />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Preferências</h2>
              <UserSettingsForm />
            </TabsContent>

            <TabsContent value="company" className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Dados da Empresa</h2>
              <SystemSettingsForm />
            </TabsContent>
            
            <TabsContent value="integrations" className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Integrações Externas</h2>
              <IntegrationsSettingsForm />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </SettingsProvider>
  );
};

export default Configuracoes;
