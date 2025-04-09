
import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "@/hooks/use-toast";
import { EvolutionApiFormValues } from "@/components/settings/evolution/EvolutionApiSchema";

export const useEvolutionApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { systemSettings, updateSystemSettings } = useSettings();
  
  const saveSettings = async (data: EvolutionApiFormValues) => {
    await updateSystemSettings({
      evolutionInstance: data.instanceName,
      evolutionToken: data.apiToken,
      evolutionUrl: data.apiBaseUrl
    });
    
    toast({
      title: "Configurações salvas",
      description: "As configurações do Evolution API foram salvas com sucesso."
    });
  };

  const sendTestMessage = async (formValues: EvolutionApiFormValues) => {
    const { instanceName, apiToken, apiBaseUrl, testNumber } = formValues;
    
    if (!testNumber) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de teste válido.",
        variant: "destructive",
      });
      return;
    }

    if (!instanceName || !apiToken) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da instância e o token API.",
        variant: "destructive",
      });
      return;
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
        
        const result = await response.json();
        console.log("WhatsApp direct API response:", result);
        
        if (!response.ok) {
          throw new Error(`WhatsApp API error: ${result.error || JSON.stringify(result)}`);
        }
        
        toast({
          title: "Mensagem enviada",
          description: `Uma mensagem de teste foi enviada para o número ${testNumber}.`,
        });
        
        return;
      } catch (directError) {
        console.error("Erro ao enviar mensagem diretamente:", directError);
      }
      
      // Fallback to using the Supabase function
      const response = await fetch(`${window.location.origin}/api/send-notification`, {
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
