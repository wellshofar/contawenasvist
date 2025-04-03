
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged-in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Check if avatar_url column exists in profiles table
    const { data: columns, error: columnsError } = await supabaseClient
      .from("profiles")
      .select("avatar_url")
      .limit(1);

    // If column doesn't exist (we get an error indicating it doesn't exist)
    if (columnsError && columnsError.message.includes("column profiles.avatar_url does not exist")) {
      // Execute SQL function to add the column
      const sql = `
        ALTER TABLE public.profiles 
        ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      `;
      
      // Using RPC is safer than executing direct SQL
      try {
        // Execute the SQL query directly (required for ALTER TABLE)
        const { error: alterTableError } = await supabaseClient.rpc(
          "execute_sql",
          { sql_query: sql }
        );
        
        if (alterTableError) {
          console.error("Error executing SQL:", alterTableError);
          return new Response(
            JSON.stringify({ 
              error: "Failed to add avatar_url column", 
              details: alterTableError 
            }),
            { 
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500 
            }
          );
        }
        
        return new Response(
          JSON.stringify({ message: "Avatar URL column added successfully" }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200 
          }
        );
      } catch (execError) {
        console.error("Error in execute_sql function:", execError);
        return new Response(
          JSON.stringify({ 
            error: "Failed to execute SQL", 
            details: execError 
          }),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500 
          }
        );
      }
    }

    // Column exists, return success
    return new Response(
      JSON.stringify({ message: "Avatar URL column already exists" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
