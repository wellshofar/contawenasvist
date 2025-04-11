
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettingsForm from "@/components/settings/ProfileSettingsForm";
import SecuritySettingsForm from "@/components/settings/SecuritySettingsForm";
import UserSettingsForm from "@/components/settings/UserSettingsForm";
import { useLocation, useNavigate } from "react-router-dom";
import { User, KeyRound, Settings } from "lucide-react";

const Configuracoes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["profile", "security", "preferences"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/configuracoes?tab=${value}`);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie suas configurações de perfil e preferências.</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            <span className="hidden md:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Preferências</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-0">
          <ProfileSettingsForm />
        </TabsContent>
        
        <TabsContent value="security" className="mt-0">
          <SecuritySettingsForm />
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-0">
          <UserSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
