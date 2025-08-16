-- Fix for foreign key constraint issues
-- Run this AFTER the enhanced-schema.sql and rls-policies.sql

-- 1. First, let's create a function to ensure user exists before creating listings
CREATE OR REPLACE FUNCTION ensure_user_exists(user_uuid UUID, user_email TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  -- Insert user if doesn't exist
  INSERT INTO public.users (id, email, created_at)
  VALUES (user_uuid, COALESCE(user_email, user_uuid::text || '@marwadiuniversity.ac.in'), NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, users.email),
    last_active = NOW();
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error ensuring user exists: %', SQLERRM;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Enhanced user creation trigger with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users table
  INSERT INTO public.users (
    id, 
    email, 
    created_at,
    is_premium,
    total_sales,
    rating_average,
    rating_count,
    last_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    FALSE,
    0,
    0.00,
    0,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    last_active = NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't fail the authentication
  RAISE WARNING 'Failed to create user profile for %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Function to check and create missing users from auth.users
CREATE OR REPLACE FUNCTION sync_missing_users()
RETURNS INTEGER AS $$
DECLARE
  missing_count INTEGER := 0;
  auth_user RECORD;
BEGIN
  -- Find auth users that don't exist in public.users
  FOR auth_user IN 
    SELECT au.id, au.email
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE pu.id IS NULL
  LOOP
    -- Create missing user
    INSERT INTO public.users (
      id, 
      email, 
      created_at,
      is_premium,
      total_sales,
      rating_average,
      rating_count,
      last_active
    )
    VALUES (
      auth_user.id,
      auth_user.email,
      NOW(),
      FALSE,
      0,
      0.00,
      0,
      NOW()
    );
    
    missing_count := missing_count + 1;
  END LOOP;

  RAISE NOTICE 'Synced % missing users', missing_count;
  RETURN missing_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger to ensure user exists before creating listings
CREATE OR REPLACE FUNCTION check_user_before_listing()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure the user exists in public.users
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = NEW.user_id) THEN
    -- Try to get user info from auth.users
    PERFORM ensure_user_exists(
      NEW.user_id,
      (SELECT email FROM auth.users WHERE id = NEW.user_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Re-create the auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 6. Create trigger for listings to check user exists
DROP TRIGGER IF EXISTS check_user_before_listing_insert ON public.listings;
CREATE TRIGGER check_user_before_listing_insert
  BEFORE INSERT ON public.listings
  FOR EACH ROW EXECUTE FUNCTION check_user_before_listing();

-- 7. Sync any missing users right now
SELECT sync_missing_users();

-- 8. Update any listings that might have invalid user_ids
-- First, let's see if there are any orphaned listings
DO $$
DECLARE
  orphaned_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO orphaned_count
  FROM public.listings l
  LEFT JOIN public.users u ON l.user_id = u.id
  WHERE u.id IS NULL;
  
  IF orphaned_count > 0 THEN
    RAISE NOTICE 'Found % orphaned listings', orphaned_count;
    
    -- Try to fix them by creating users from auth.users
    INSERT INTO public.users (id, email, created_at, is_premium, total_sales, rating_average, rating_count, last_active)
    SELECT DISTINCT 
      l.user_id,
      COALESCE(au.email, l.user_id::text || '@marwadiuniversity.ac.in'),
      NOW(),
      FALSE,
      0,
      0.00,
      0,
      NOW()
    FROM public.listings l
    LEFT JOIN public.users u ON l.user_id = u.id
    LEFT JOIN auth.users au ON l.user_id = au.id
    WHERE u.id IS NULL
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Fixed orphaned listings by creating missing users';
  ELSE
    RAISE NOTICE 'No orphaned listings found';
  END IF;
END $$;
