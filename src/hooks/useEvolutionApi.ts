
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
      console.log(`Using Evolution API: ${apiBaseUrl}/v1/instance/${instanceName}/message/text`);
      
      // Tentar com o endpoint correto da Evolution API (v1/instance/{instance_name}/message/text)
      try {
        const response = await fetch(`${apiBaseUrl}/v1/instance/${instanceName}/message/text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": apiToken
          },
          body: JSON.stringify({
            number: phoneNumber,
            options: {
              delay: 1200
            },
            textMessage: {
              text: "Teste de integração da Evolution API com o sistema HOKEN. Se você recebeu esta mensagem, a integração está funcionando corretamente!"
            }
          })
        });
        
        if (!response.ok) {
          const errorResult = await response.text();
          console.error("WhatsApp API error response:", errorResult);
          
          // Tentar endpoint alternativo se o primeiro falhar
          throw new Error(`WhatsApp API error: ${errorResult}`);
        }
        
        const result = await response.json();
        console.log("WhatsApp API response:", result);
        
        toast({
          title: "Mensagem enviada",
          description: `Uma mensagem de teste foi enviada para o número ${testNumber}.`,
        });
        
        return;
      } catch (directError) {
        console.error("Erro ao enviar mensagem diretamente:", directError);
        
        // Tentar endpoint alternativo
        try {
          console.log("Tentando endpoint alternativo...");
          const altResponse = await fetch(`${apiBaseUrl}/message/sendText/${instanceName}`, {
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
          
          if (!altResponse.ok) {
            const altErrorResult = await altResponse.text();
            console.error("WhatsApp API alt endpoint error:", altErrorResult);
            throw new Error(`WhatsApp API error (alt endpoint): ${altErrorResult}`);
          }
          
          const altResult = await altResponse.json();
          console.log("WhatsApp alt endpoint response:", altResult);
          
          toast({
            title: "Mensagem enviada",
            description: `Uma mensagem de teste foi enviada para o número ${testNumber} (endpoint alternativo).`,
          });
          
          return;
        } catch (altError) {
          console.error("Erro ao enviar via endpoint alternativo:", altError);
          // Fall through to fallback method
        }
      }
      
      // Fallback to using the Supabase function
      console.log("Tentando enviar via função do Supabase...");
      
      // Use the Supabase client directly instead of local API
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: {
          type: "whatsapp",
          to: phoneNumber,
          message: "Teste de integração da Evolution API com o sistema HOKEN. Se você recebeu esta mensagem, a integração está funcionando corretamente!",
        }
      });
      
      if (error) {
        console.error("Erro ao invocar função do Supabase:", error);
        throw error;
      }
      
      console.log("Supabase function response:", data);
      
      toast({
        title: "Mensagem enviada",
        description: `Uma mensagem de teste foi enviada para o número ${testNumber} via função do Supabase.`,
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
