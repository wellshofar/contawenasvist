
import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "@/hooks/use-toast";
import { EvolutionApiFormValues } from "@/components/settings/evolution/EvolutionApiSchema";

export const useEvolutionApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { systemSettings, updateSystemSettings } = useSettings();
  
  const saveSettings = async (data: EvolutionApiFormValues) => {
    try {
      await updateSystemSettings({
        evolutionInstance: data.instanceName,
        evolutionToken: data.apiToken,
        evolutionUrl: data.apiBaseUrl
      });
      
      // Save to localStorage for direct access in notifications utility
      localStorage.setItem('evolutionInstance', data.instanceName);
      localStorage.setItem('evolutionToken', data.apiToken);
      localStorage.setItem('evolutionUrl', data.apiBaseUrl);
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do Evolution API foram salvas com sucesso."
      });
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  const sendTestMessage = async (formValues: EvolutionApiFormValues) => {
    const { instanceName, apiToken, apiBaseUrl, testNumber } = formValues;
    
    if (!testNumber) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de teste válido.",
        variant: "destructive",
      });
      throw new Error("Número de teste inválido");
    }

    if (!instanceName || !apiToken) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da instância e o token API.",
        variant: "destructive",
      });
      throw new Error("Dados de configuração incompletos");
    }

    setIsLoading(true);
    
    try {
      // Format phone number (remove non-numeric characters and ensure it has country code)
      let phoneNumber = testNumber.replace(/\D/g, '');
      if (!phoneNumber.startsWith('55')) {
        phoneNumber = `55${phoneNumber}`;
      }
      
      console.log(`Sending WhatsApp to formatted number: ${phoneNumber}`);
      console.log(`Using Evolution API: ${apiBaseUrl}/${instanceName}`);
      
      // Try direct API call first
      try {
        const response = await fetch(`${apiBaseUrl}/message/text/${instanceName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": apiToken
          },
          body: JSON.stringify({
            number: phoneNumber,
            text: "Teste de integração da Evolution API com o sistema HOKEN. Se você recebeu esta mensagem, a integração está funcionando corretamente!"
          })
        });
        
        if (!response.ok) {
          const errorResult = await response.text();
          console.error("WhatsApp API error response:", errorResult);
          throw new Error(`WhatsApp API error: ${errorResult}`);
        }
        
        const result = await response.json();
        console.log("WhatsApp direct API response:", result);
        
        toast({
          title: "Mensagem enviada",
          description: `Uma mensagem de teste foi enviada para o número ${testNumber}.`,
        });
        
        return;
      } catch (directError) {
        console.error("Erro ao enviar mensagem diretamente:", directError);
        // Fall through to fallback method
      }
      
      // Fallback to using the Supabase function
      console.log("Tentando enviar via API local...");
      const fallbackUrl = `${window.location.origin}/api/send-notification`;
      console.log("Fallback URL:", fallbackUrl);
      
      const response = await fetch(fallbackUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "whatsapp",
          to: phoneNumber,
          message: "Teste de integração da Evolution API com o sistema HOKEN. Se você recebeu esta mensagem, a integração está funcionando corretamente!",
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Send notification response:", result);
      
      toast({
        title: "Mensagem enviada",
        description: `Uma mensagem de teste foi enviada para o número ${testNumber}.`,
      });
      
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar a mensagem de teste. Verifique os logs no console para mais detalhes.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    saveSettings,
    sendTestMessage,
    defaultValues: {
      instanceName: systemSettings.evolutionInstance || "juniorhoken",
      apiToken: systemSettings.evolutionToken || "",
      apiBaseUrl: systemSettings.evolutionUrl || "https://api.chatzapbot.com.br",
      testNumber: ""
    }
  };
};
