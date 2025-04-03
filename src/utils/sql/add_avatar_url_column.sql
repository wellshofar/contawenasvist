
-- SQL to add the avatar_url column to the profiles table if it doesn't exist
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
