-- IMMEDIATE FIX for Foreign Key Constraint Error
-- Run this in your Supabase SQL Editor RIGHT NOW

-- 1. First, let's see what users exist in auth.users but not in public.users
SELECT 'Missing users count:' as status, COUNT(*) as count
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- 2. Create any missing users
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
SELECT 
  au.id,
  au.email,
  COALESCE(au.created_at, NOW()),
  FALSE,
  0,
  0.00,
  0,
  NOW()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  last_active = NOW();

-- 3. Add missing columns to users table if they don't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS total_sales INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_average DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Add missing columns to listings table if they don't exist
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_sold BOOLEAN DEFAULT FALSE;

-- 5. Update existing records with defaults
UPDATE public.users 
SET 
  is_premium = COALESCE(is_premium, FALSE),
  total_sales = COALESCE(total_sales, 0),
  rating_average = COALESCE(rating_average, 0.00),
  rating_count = COALESCE(rating_count, 0),
  last_active = COALESCE(last_active, created_at, NOW());

UPDATE public.listings 
SET 
  view_count = COALESCE(view_count, 0),
  favorites_count = COALESCE(favorites_count, 0),
  is_featured = COALESCE(is_featured, FALSE),
  is_sold = COALESCE(is_sold, FALSE);

-- 6. Create a trigger to automatically create users when they sign up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. Final verification
SELECT 'Status check:' as status;
SELECT 'Auth users:' as type, COUNT(*) as count FROM auth.users;
SELECT 'Public users:' as type, COUNT(*) as count FROM public.users;
SELECT 'Listings:' as type, COUNT(*) as count FROM public.listings;

-- Check for any remaining orphaned listings
SELECT 'Orphaned listings:' as type, COUNT(*) as count
FROM public.listings l
LEFT JOIN public.users u ON l.user_id = u.id
WHERE u.id IS NULL;

-- Show a success message
SELECT 'Foreign key constraint issues should now be fixed!' as message;
