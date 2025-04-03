
import { supabase } from "@/integrations/supabase/client";

export const runMigrations = async () => {
  // Create the function to add avatar_url if it doesn't exist
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION add_avatar_url_if_not_exists() 
    RETURNS VOID
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
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
      END IF;
    END;
    $$;

    CREATE OR REPLACE FUNCTION create_avatar_url_function() 
    RETURNS VOID
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      -- Create the function to add avatar_url column
      CREATE OR REPLACE FUNCTION add_avatar_url_if_not_exists() 
      RETURNS VOID
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $func$
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
        END IF;
      END;
      $func$;
    END;
    $$;
  `;

  try {
    // Run the SQL to create the functions
    const { error } = await supabase.rpc('create_avatar_url_function').catch(() => {
      // Function might already exist, try to execute it directly
      return supabase.rpc('add_avatar_url_if_not_exists');
    });

    if (error) {
      console.error('Error running migrations:', error);
      
      // As a fallback, try to use a direct SQL query
      try {
        // Try to directly execute SQL if RPC fails
        await supabase.auth.getUser().then(async ({ data }) => {
          if (data.user && data.user.email?.includes('@admin')) {
            // Only allow administrative users to run direct SQL
            const { error } = await supabase.rpc('execute_sql', { 
              sql: createFunctionSQL 
            });
            
            if (error) {
              console.error('Error running SQL migration:', error);
            }
          }
        });
      } catch (sqlError) {
        console.error('Error running direct SQL migration:', sqlError);
      }
    }
  } catch (e) {
    console.error('Unexpected error during migrations:', e);
  }
};
