-- Fix for missing user profiles
-- Run this in your Supabase SQL Editor

-- 1. Check for users in auth.users who don't have a corresponding row in public.users
SELECT 
    au.id,
    au.email,
    au.created_at as auth_created_at,
    pu.id as public_user_id
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- 2. Insert missing users into public.users table with all required fields
INSERT INTO public.users (
    id, 
    name, 
    email, 
    created_at, 
    department, 
    bio, 
    profile_image_url, 
    is_premium, 
    premium_expires_at, 
    total_sales, 
    rating_average, 
    rating_count, 
    last_active
)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
    au.email,
    au.created_at,
    NULL as department,
    NULL as bio,
    NULL as profile_image_url,
    FALSE as is_premium,
    NULL as premium_expires_at,
    0 as total_sales,
    0.00 as rating_average,
    0 as rating_count,
    au.created_at as last_active
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 3. Verify all users now have profiles
SELECT 
    COUNT(*) as auth_users_count,
    (SELECT COUNT(*) FROM public.users) as public_users_count
FROM auth.users;

-- 4. Check if the trigger exists and recreate it if needed
DO $$
BEGIN
    -- Drop existing trigger if it exists
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    
    -- Recreate the trigger
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
END $$;

-- 5. Verify the trigger was created successfully
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';