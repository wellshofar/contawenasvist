
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "email" | "whatsapp";
  to: string;
  subject?: string;
  message: string;
  serviceOrderId?: string;
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
    const { type, to, subject, message, serviceOrderId } = await req.json() as NotificationRequest;

    console.log(`Sending ${type} notification to ${to}`);

    // Placeholder for actual email sending implementation
    // In a real scenario, you would integrate with a service like Resend, SendGrid, etc.
    if (type === "email") {
      // Implement email sending here
      // For now, we'll just log it
      console.log(`Email would be sent to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
    }
    
    // Placeholder for WhatsApp integration through Evolution API
    if (type === "whatsapp") {
      // Implement WhatsApp sending here using Evolution API
      // For now, we'll just log it
      console.log(`WhatsApp would be sent to: ${to}`);
      console.log(`Message: ${message}`);
      
      // You would implement the actual WhatsApp API call here
      // const evolutionApiUrl = Deno.env.get("EVOLUTION_API_URL");
      // const evolutionApiKey = Deno.env.get("EVOLUTION_API_KEY");
      // ... implementation details
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
