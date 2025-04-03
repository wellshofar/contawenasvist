
import { supabase } from "@/integrations/supabase/client";

export type NotificationType = "email" | "whatsapp" | "webhook";

interface SendNotificationProps {
  type: NotificationType;
  to: string;
  subject?: string;
  message: string;
  serviceOrderId?: string;
  additionalData?: Record<string, any>;
}

/**
 * Send a notification via the Supabase Edge Function
 */
export const sendNotification = async ({
  type,
  to,
  subject,
  message,
  serviceOrderId,
  additionalData
}: SendNotificationProps) => {
  try {
    console.log(`Sending ${type} notification to ${to} via Supabase function`);
    
    const { data, error } = await supabase.functions.invoke("send-notification", {
      body: {
        type,
        to,
        subject,
        message,
        serviceOrderId,
        additionalData
      }
    });

    if (error) {
      console.error("Error sending notification:", error);
      throw error;
    }

    console.log("Notification sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw error;
  }
};

/**
 * Send a WhatsApp notification
 */
export const sendWhatsAppNotification = async ({
  to,
  message,
  serviceOrderId,
  additionalData
}: Omit<SendNotificationProps, "type" | "subject"> & { to: string }) => {
  // First try direct API call if settings are available in localStorage
  const evolutionInstance = localStorage.getItem('evolutionInstance');
  const evolutionToken = localStorage.getItem('evolutionToken');
  const evolutionUrl = localStorage.getItem('evolutionUrl');
  
  if (evolutionInstance && evolutionToken && evolutionUrl) {
    try {
      // Format phone number
      let phoneNumber = to.replace(/\D/g, '');
      if (!phoneNumber.startsWith('55')) {
        phoneNumber = `55${phoneNumber}`;
      }
      
      console.log(`Trying direct WhatsApp API call to ${phoneNumber} via ${evolutionUrl}/${evolutionInstance}`);
      
      const response = await fetch(`${evolutionUrl}/message/text/${evolutionInstance}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": evolutionToken
        },
        body: JSON.stringify({
          number: phoneNumber,
          text: message
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${result.error || JSON.stringify(result)}`);
      }
      
      console.log("Direct WhatsApp message sent successfully:", result);
      return { success: true, data: result };
    } catch (error) {
      console.warn("Direct WhatsApp API call failed, falling back to Supabase function:", error);
      // Fall through to the Supabase function method
    }
  }
  
  // Fallback to Supabase function
  return sendNotification({
    type: "whatsapp",
    to,
    message,
    serviceOrderId,
    additionalData
  });
};

/**
 * Send an email notification
 */
export const sendEmailNotification = async ({
  to,
  subject,
  message,
  serviceOrderId,
  additionalData
}: Omit<SendNotificationProps, "type"> & { subject: string }) => {
  return sendNotification({
    type: "email",
    to,
    subject,
    message,
    serviceOrderId,
    additionalData
  });
};

/**
 * Send a notification to Make (Integromat) webhook
 */
export const sendToMakeWebhook = async (data: Record<string, any>) => {
  // First, try to use the webhook stored in localStorage
  const localWebhookUrl = localStorage.getItem('webhookUrl');
  
  if (localWebhookUrl) {
    try {
      console.log("Trying direct webhook call to:", localWebhookUrl);
      
      // Try sending directly to the configured webhook
      const response = await fetch(localWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        console.log("Webhook sent successfully to:", localWebhookUrl);
        return { success: true };
      } else {
        console.warn("Direct webhook call failed with status:", response.status);
        throw new Error(`Webhook request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending to local webhook:", error);
      // Fall through to the backup method
    }
  }
  
  // If not able to use the local webhook, use the standard method via Supabase function
  console.log("Falling back to Supabase function for webhook");
  return sendNotification({
    type: "webhook",
    to: "make",
    message: "Integration data",
    additionalData: data
  });
};
