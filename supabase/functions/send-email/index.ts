
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
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

    // Get email request
    const emailRequest: EmailRequest = await req.json();
    
    // Validate email request
    if (!emailRequest.to || !emailRequest.subject) {
      throw new Error("Destinatário e assunto são obrigatórios");
    }
    
    if (!emailRequest.text && !emailRequest.html) {
      throw new Error("É necessário fornecer o conteúdo do email (texto ou HTML)");
    }

    // Fetch SMTP settings from system settings
    const { data: systemSettings, error } = await supabase
      .from('system_settings')
      .select('settings')
      .single();
    
    if (error) {
      throw error;
    }
    
    const settings = systemSettings?.settings || {};
    
    // Validate SMTP settings
    if (!settings.smtpHost || !settings.smtpUser || !settings.smtpPassword) {
      throw new Error("Configurações SMTP não encontradas ou incompletas");
    }

    console.log("Sending email via SMTP:", settings.smtpHost);
    
    // Create SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: settings.smtpHost,
        port: settings.smtpPort || 587,
        tls: settings.smtpSecure || true,
        auth: {
          username: settings.smtpUser,
          password: settings.smtpPassword,
        },
      },
    });

    // Prepare email
    const email: any = {
      from: `"${settings.smtpFromName || "Hoken Service"}" <${settings.smtpFromEmail || settings.smtpUser}>`,
      to: emailRequest.to,
      subject: emailRequest.subject,
    };
    
    if (emailRequest.text) {
      email.content = emailRequest.text;
    }
    
    if (emailRequest.html) {
      email.html = emailRequest.html;
    }
    
    if (emailRequest.cc) {
      email.cc = emailRequest.cc;
    }
    
    if (emailRequest.bcc) {
      email.bcc = emailRequest.bcc;
    }
    
    if (emailRequest.attachments && emailRequest.attachments.length > 0) {
      email.attachments = emailRequest.attachments.map(attachment => ({
        filename: attachment.filename,
        content: Uint8Array.from(atob(attachment.content), c => c.charCodeAt(0)),
        contentType: attachment.contentType,
      }));
    }

    // Send email
    await client.send(email);

    // Close the connection
    await client.close();
    
    console.log("Email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Email enviado com sucesso" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-email function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
