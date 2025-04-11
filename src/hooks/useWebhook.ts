
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { sendToMakeWebhook } from "@/utils/notifications";
import { getStoredWebhookUrl, saveWebhookUrl, testWebhook } from "@/utils/webhookUtils";
import { WebhookFormValues } from "@/components/settings/webhook/WebhookSchema";

export const useWebhook = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveWebhook = (data: WebhookFormValues) => {
    saveWebhookUrl(data.webhookUrl || '');
  };

  const handleTestWebhook = async (webhookUrl: string) => {
    if (!webhookUrl) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL de webhook válida.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create test webhook payload
      const testPayload = {
        event: "test",
        source: "webhook_test",
        timestamp: new Date().toISOString(),
        data: {
          message: "Este é um teste de integração do sistema HOKEN"
        }
      };
      
      // Try direct webhook call
      const success = await testWebhook(webhookUrl, testPayload);
      
      if (success) {
        toast({
          title: "Teste enviado",
          description: "O teste foi enviado com sucesso para o webhook.",
        });
        return;
      }
      
      // Fallback to using the notifications utility
      try {
        await sendToMakeWebhook(testPayload);
        
        toast({
          title: "Teste enviado",
          description: "O teste foi enviado para o webhook via função do Supabase.",
        });
      } catch (secondError) {
        console.error("Erro ao enviar webhook via função:", secondError);
        toast({
          title: "Erro no teste",
          description: "Não foi possível enviar o teste para o webhook.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSaveWebhook,
    handleTestWebhook,
    defaultUrl: getStoredWebhookUrl()
  };
};
