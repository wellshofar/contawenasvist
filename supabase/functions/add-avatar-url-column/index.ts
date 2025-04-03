
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

interface WebhookPayload {
  type: string;
  table: string;
  record: {
    [key: string]: any;
  };
  schema: string;
  old_record: null | {
    [key: string]: any;
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // SQL to add the avatar_url column if it doesn't exist
    const { error } = await supabaseClient.rpc(
      'execute_sql',
      {
        sql: `
        DO $$
        BEGIN
          -- Check if avatar_url column exists in profiles table
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'profiles'
            AND column_name = 'avatar_url'
          ) THEN
            -- Add the avatar_url column if it doesn't exist
            ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
            RAISE NOTICE 'Added avatar_url column to profiles table';
          ELSE
            RAISE NOTICE 'avatar_url column already exists in profiles table';
          END IF;
        END $$;
        `
      }
    );

    if (error) {
      console.error('Error adding avatar_url column:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Avatar URL column check completed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Unexpected error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
