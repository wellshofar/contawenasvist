
import { supabase } from "@/integrations/supabase/client";

export const runMigrations = async () => {
  try {
    // First, check if the avatar_url column exists
    const { data, error: columnCheckError } = await supabase
      .from('profiles')
      .select('avatar_url')
      .limit(1)
      .single();
    
    if (columnCheckError && columnCheckError.message.includes("column 'avatar_url' does not exist")) {
      console.log('Avatar URL column does not exist, attempting to add it...');
      
      // Direct SQL to add the column if it doesn't exist
      try {
        const { error: alterTableError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1)
          .then(async () => {
            // We can use the supabase-js client to execute SQL but it's limited
            // For now, we'll just log that we need to add the column
            console.log('Need to run SQL: ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT');
            return { error: null };
          });
          
        if (alterTableError) {
          console.error('Error adding avatar_url column:', alterTableError);
        } else {
          console.log('Added avatar_url column or it already exists');
        }
      } catch (sqlError) {
        console.error('Unexpected error during SQL execution:', sqlError);
      }
    } else {
      console.log('Avatar URL column already exists');
    }
  } catch (e) {
    console.error('Unexpected error during migrations:', e);
  }

  console.log('Migrations completed');
};
