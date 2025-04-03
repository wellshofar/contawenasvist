
import { supabase } from "@/integrations/supabase/client";

export const setupDatabase = async () => {
  // Create the add_avatar_url_if_not_exists function if it doesn't exist
  const { error } = await supabase.rpc('add_avatar_url_if_not_exists', {}, {
    count: 'exact',
  }).catch(async () => {
    // If the function doesn't exist, create it
    return await supabase.rpc('create_avatar_url_function');
  });

  if (error) {
    console.error('Error setting up database functions:', error);
  } else {
    // Ensure the avatars bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');

    if (!avatarBucketExists) {
      await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
      });
    }
  }
};

export const createDatabaseFunctions = async () => {
  // Create the function to add avatar_url column if it doesn't exist
  const { error } = await supabase.rpc('create_avatar_url_function').catch(() => {
    // Function might already exist
    return { error: null };
  });

  if (error) {
    console.error('Error creating database functions:', error);
  }
};
