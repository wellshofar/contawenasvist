
import { supabase } from "@/integrations/supabase/client";

export const setupDatabase = async () => {
  try {
    // First, check if the avatar_url column exists in profiles
    const { data: columnCheck, error: columnError } = await supabase
      .from('profiles')
      .select('avatar_url')
      .limit(1)
      .single();
    
    // If we get a specific error about the column not existing, we need to create it
    if (columnError && columnError.message.includes("column 'avatar_url' does not exist")) {
      console.log('Avatar URL column does not exist. Attempting to create it...');
      
      // Try to execute the SQL function that adds the column
      try {
        const { error: funcError } = await supabase.functions.invoke('add-avatar-url-column', {
          method: 'POST',
        });
        
        if (funcError) {
          console.error('Error invoking function to add avatar_url column:', funcError);
        }
      } catch (err) {
        console.error('Failed to add avatar_url column:', err);
      }
    }

    // Ensure the avatars bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');

    if (!avatarBucketExists) {
      await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
      });
      console.log('Created avatars bucket');
    }
  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

// This function is no longer needed as we handle avatar_url column existence differently
export const createDatabaseFunctions = async () => {
  // This is left intentionally empty as we're handling this more directly now
  console.log('Database setup complete');
};
