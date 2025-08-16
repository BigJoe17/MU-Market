-- Additional fixes for enhanced schema
-- Run this if you're still having issues after the fix-foreign-key-constraints.sql

-- 1. Make sure users table has all required columns with proper defaults
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS total_sales INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_average DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Make sure listings table has all new columns with proper defaults
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_sold BOOLEAN DEFAULT FALSE;

-- 3. Update any existing users that might be missing the new columns
UPDATE public.users 
SET 
  is_premium = COALESCE(is_premium, FALSE),
  total_sales = COALESCE(total_sales, 0),
  rating_average = COALESCE(rating_average, 0.00),
  rating_count = COALESCE(rating_count, 0),
  last_active = COALESCE(last_active, created_at, NOW())
WHERE is_premium IS NULL 
   OR total_sales IS NULL 
   OR rating_average IS NULL 
   OR rating_count IS NULL 
   OR last_active IS NULL;

-- 4. Update any existing listings that might be missing the new columns
UPDATE public.listings 
SET 
  view_count = COALESCE(view_count, 0),
  favorites_count = COALESCE(favorites_count, 0),
  is_featured = COALESCE(is_featured, FALSE),
  is_sold = COALESCE(is_sold, FALSE)
WHERE view_count IS NULL 
   OR favorites_count IS NULL 
   OR is_featured IS NULL 
   OR is_sold IS NULL;

-- 5. Create a simple function to create a user if they don't exist (for immediate use)
CREATE OR REPLACE FUNCTION create_user_if_not_exists(
  user_id UUID,
  user_email TEXT
)
RETURNS VOID AS $$
BEGIN
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
    user_id,
    user_email,
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 7. Refresh the RLS policies to make sure they're working
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Make sure basic policies exist
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can view listings" ON public.listings;
CREATE POLICY "Anyone can view listings" ON public.listings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create listings" ON public.listings;
CREATE POLICY "Users can create listings" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own listings" ON public.listings;
CREATE POLICY "Users can update own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own listings" ON public.listings;
CREATE POLICY "Users can delete own listings" ON public.listings
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Final check and notification
DO $$
DECLARE
  user_count INTEGER;
  listing_count INTEGER;
  orphaned_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.users;
  SELECT COUNT(*) INTO listing_count FROM public.listings;
  
  SELECT COUNT(*) INTO orphaned_count
  FROM public.listings l
  LEFT JOIN public.users u ON l.user_id = u.id
  WHERE u.id IS NULL;
  
  RAISE NOTICE 'Database status:';
  RAISE NOTICE '- Users: %', user_count;
  RAISE NOTICE '- Listings: %', listing_count;
  RAISE NOTICE '- Orphaned listings: %', orphaned_count;
  
  IF orphaned_count = 0 THEN
    RAISE NOTICE 'All foreign key constraints are satisfied!';
  ELSE
    RAISE WARNING 'Still have % orphaned listings that need manual fixing', orphaned_count;
  END IF;
END $$;
