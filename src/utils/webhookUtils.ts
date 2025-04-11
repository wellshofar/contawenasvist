
import { toast } from "@/hooks/use-toast";

export type WebhookTestPayload = {
  event: string;
  source: string;
  timestamp: string;
  data: Record<string, any>;
};

export const testWebhook = async (webhookUrl: string, testPayload: WebhookTestPayload): Promise<boolean> => {
  try {
    // Direct webhook call to test without going through supabase function
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log("Webhook test response:", response);
    return response.ok;
  } catch (error) {
    console.error("Erro ao testar webhook:", error);
    return false;
  }
};

export const getStoredWebhookUrl = (): string => {
  return localStorage.getItem('webhookUrl') || '';
};

export const saveWebhookUrl = (url: string): void => {
  localStorage.setItem('webhookUrl', url);
  toast({
    title: "Webhook salvo",
    description: "A URL do webhook foi salva com sucesso."
  });
};
