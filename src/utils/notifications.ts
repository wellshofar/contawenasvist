
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
  return sendNotification({
    type: "webhook",
    to: "make",
    message: "Integration data",
    additionalData: data
  });
};
