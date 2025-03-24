
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "email" | "whatsapp" | "webhook";
  to: string;
  subject?: string;
  message: string;
  serviceOrderId?: string;
  additionalData?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body
    const { type, to, subject, message, serviceOrderId, additionalData } = await req.json() as NotificationRequest;

    console.log(`Sending ${type} notification to ${to}`);

    // Placeholder for actual email sending implementation
    if (type === "email") {
      // Implement email sending here
      // For now, we'll just log it
      console.log(`Email would be sent to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
    }
    
    // Evolution API WhatsApp integration
    if (type === "whatsapp") {
      const evolutionApiUrl = "https://api.chatzapbot.com.br";
      const instanceName = "juniorhoken";
      const instanceToken = "2269A7D64EF2-4E62-8AD8-78CE9292C0B9";
      
      try {
        // Format phone number (remove non-numeric characters and ensure it has country code)
        let phoneNumber = to.replace(/\D/g, '');
        if (!phoneNumber.startsWith('55')) {
          phoneNumber = `55${phoneNumber}`;
        }
        
        console.log(`Sending WhatsApp to formatted number: ${phoneNumber}`);
        
        const whatsappResponse = await fetch(`${evolutionApiUrl}/message/text/${instanceName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": instanceToken
          },
          body: JSON.stringify({
            number: phoneNumber,
            text: message
          })
        });
        
        const whatsappResult = await whatsappResponse.json();
        console.log("WhatsApp API response:", whatsappResult);
        
        if (!whatsappResponse.ok) {
          throw new Error(`WhatsApp API error: ${whatsappResult.error || JSON.stringify(whatsappResult)}`);
        }
      } catch (whatsappError) {
        console.error("Error sending WhatsApp:", whatsappError);
        // We don't throw here to still allow other notifications to work
      }
    }

    // Make webhook integration
    if (type === "webhook") {
      const makeWebhookUrl = "https://hook.eu2.make.com/78m55le7q8q7vvq476r8mpa6u6ikr0fv";
      
      try {
        console.log(`Sending data to Make webhook`);
        
        const webhookData = {
          notificationType: type,
          recipient: to,
          subject: subject,
          message: message,
          serviceOrderId: serviceOrderId,
          timestamp: new Date().toISOString(),
          ...additionalData
        };
        
        const webhookResponse = await fetch(makeWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(webhookData)
        });
        
        if (!webhookResponse.ok) {
          const webhookError = await webhookResponse.text();
          throw new Error(`Make webhook error: ${webhookError}`);
        }
        
        console.log("Make webhook response status:", webhookResponse.status);
      } catch (webhookError) {
        console.error("Error sending to Make webhook:", webhookError);
        // We don't throw here to still allow other notifications to work
      }
    }

    // In a real scenario, log the notification to the database
    if (serviceOrderId) {
      console.log(`Notification logged for service order: ${serviceOrderId}`);
      // You would implement database logging here
    }

    return new Response(
      JSON.stringify({ success: true, message: `${type} notification sent to ${to}` }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-notification function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
