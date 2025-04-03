
-- Function to check if a column exists in a table
CREATE OR REPLACE FUNCTION public.column_exists(table_name text, column_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = column_exists.table_name
    AND column_name = column_exists.column_name
  );
END;
$$;

-- Function to create the column_exists function if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_column_exists_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function is a fallback if the column_exists function doesn't exist
  -- It creates the column_exists function
  -- The function is already defined above, so this is just a helper
  RETURN;
END;
$$;

-- Function to add avatar_url column to profiles table
CREATE OR REPLACE FUNCTION public.add_avatar_url_column()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Add avatar_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
  END IF;
END;
$$;

-- Helper functions for safely getting and updating avatar_url
CREATE OR REPLACE FUNCTION public.create_avatar_url_helper_functions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create function to get avatar_url safely
  DROP FUNCTION IF EXISTS public.get_profile_avatar_url(uuid);
  CREATE OR REPLACE FUNCTION public.get_profile_avatar_url(user_id uuid)
  RETURNS text
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
  DECLARE
    avatar_url_value text;
  BEGIN
    -- Check if avatar_url column exists
    IF (SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'avatar_url'
    )) THEN
      -- If it exists, get the value
      SELECT profiles.avatar_url INTO avatar_url_value
      FROM profiles
      WHERE profiles.id = user_id;
    ELSE
      -- If it doesn't exist, return null
      avatar_url_value := null;
    END IF;
    
    RETURN avatar_url_value;
  END;
  $$;
  
  -- Create function to update avatar_url safely
  DROP FUNCTION IF EXISTS public.update_profile_avatar_url(uuid, text);
  CREATE OR REPLACE FUNCTION public.update_profile_avatar_url(user_id uuid, avatar_url_value text)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
  BEGIN
    -- Check if avatar_url column exists
    IF (SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'avatar_url'
    )) THEN
      -- If it exists, update the value
      UPDATE profiles
      SET avatar_url = avatar_url_value
      WHERE id = user_id;
    ELSE
      -- If it doesn't exist, add the column and update
      ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
      
      UPDATE profiles
      SET avatar_url = avatar_url_value
      WHERE id = user_id;
    END IF;
  END;
  $$;
END;
$$;
