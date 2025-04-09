
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMTPConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  smtpFromEmail: string;
  smtpFromName: string;
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

    // Get request body or system settings
    let smtpConfig: SMTPConfig;
    
    if (req.method === "POST") {
      // Use the settings from the request body
      smtpConfig = await req.json() as SMTPConfig;
      console.log("Using provided SMTP config:", smtpConfig);
    } else {
      // Fetch from system settings
      const { data: systemSettings, error } = await supabase
        .from('system_settings')
        .select('settings')
        .single();
      
      if (error) {
        console.error("Error fetching system settings:", error);
        throw error;
      }
      
      console.log("Retrieved system settings:", systemSettings);
      
      const settings = systemSettings?.settings || {};
      smtpConfig = {
        smtpHost: settings.smtpHost,
        smtpPort: settings.smtpPort,
        smtpUser: settings.smtpUser,
        smtpPassword: settings.smtpPassword,
        smtpSecure: settings.smtpSecure,
        smtpFromEmail: settings.smtpFromEmail,
        smtpFromName: settings.smtpFromName,
      };
    }
    
    // Validate SMTP settings
    if (!smtpConfig.smtpHost || !smtpConfig.smtpUser || !smtpConfig.smtpPassword) {
      throw new Error("Configurações SMTP incompletas");
    }

    console.log("Testing SMTP connection to:", smtpConfig.smtpHost);
    
    // Create SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: smtpConfig.smtpHost,
        port: smtpConfig.smtpPort || 587,
        tls: smtpConfig.smtpSecure !== false, // Default to true if not explicitly false
        auth: {
          username: smtpConfig.smtpUser,
          password: smtpConfig.smtpPassword,
        },
      },
    });

    // Send test email
    await client.send({
      from: `"${smtpConfig.smtpFromName || "Hoken Service"}" <${smtpConfig.smtpFromEmail || smtpConfig.smtpUser}>`,
      to: smtpConfig.smtpUser,
      subject: "Teste de Conexão SMTP - Hoken Service",
      content: "Este é um email de teste para verificar a conexão SMTP.",
      html: `
        <h1>Teste de Conexão SMTP</h1>
        <p>Este é um email de teste para verificar que a conexão SMTP está funcionando corretamente.</p>
        <p>Se você está recebendo este email, a configuração SMTP está funcionando!</p>
        <p>Detalhes da configuração:</p>
        <ul>
          <li>Servidor: ${smtpConfig.smtpHost}</li>
          <li>Porta: ${smtpConfig.smtpPort}</li>
          <li>Usuário: ${smtpConfig.smtpUser}</li>
          <li>Segurança: ${smtpConfig.smtpSecure ? "TLS/SSL" : "Nenhuma"}</li>
        </ul>
        <p>Obrigado por usar o Hoken Service!</p>
      `,
    });

    // Close the connection
    await client.close();
    
    console.log("SMTP test email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Email de teste enviado com sucesso" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in test-smtp function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
