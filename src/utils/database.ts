import { supabase } from "@/integrations/supabase/client";

export const setupDatabase = async () => {
  try {
    console.log('Starting database setup...');
    
    // Check if the avatar_url column exists
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .limit(1);
      
      if (error && error.message.includes("column 'avatar_url' does not exist")) {
        console.log('Avatar URL column does not exist, attempting to add it...');
        // Call the edge function to add the column
        const { data: funcData, error: funcError } = await supabase.functions
          .invoke('add-avatar-url-column');
          
        if (funcError) {
          console.error('Error invoking add-avatar-url-column function:', funcError);
        } else {
          console.log('Function response:', funcData);
        }
      } else {
        console.log('Avatar URL column exists');
      }
    } catch (error) {
      console.error('Error checking avatar_url column:', error);
    }

    // Ensure the avatars bucket exists
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');

      if (!avatarBucketExists) {
        await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
        });
        console.log('Created avatars bucket');
      } else {
        console.log('Avatars bucket already exists');
      }
    } catch (error) {
      console.error('Error checking or creating avatars bucket:', error);
    }
  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

// Keep for backwards compatibility
export const createDatabaseFunctions = async () => {
  console.log('Database setup complete');
};
