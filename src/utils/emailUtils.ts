
import { supabase } from "@/integrations/supabase/client";

interface SendEmailProps {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string; // Base64 encoded
    contentType: string;
  }>;
}

/**
 * Send an email using the configured SMTP settings
 */
export const sendEmail = async (options: SendEmailProps) => {
  try {
    console.log(`Sending email to ${options.to}`);
    
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: options
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
};

/**
 * Test SMTP configuration
 */
export const testSMTPConnection = async () => {
  try {
    console.log("Testing SMTP connection");
    
    const { data, error } = await supabase.functions.invoke("test-smtp");

    if (error) {
      console.error("Error testing SMTP connection:", error);
      return { success: false, error: error.message };
    }

    console.log("SMTP connection successful:", data);
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to test SMTP connection:", error);
    return { success: false, error: error.message };
  }
};
