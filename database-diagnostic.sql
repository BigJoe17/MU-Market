-- Database Diagnostic Queries
-- Run these in Supabase SQL Editor to check what's missing

-- 1. Check current users table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check if profiles storage bucket exists  
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets 
WHERE id = 'profiles';

-- 3. Check storage policies for profiles bucket
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
AND policyname LIKE '%profiles%' OR qual LIKE '%profiles%';

-- 4. Test if you can select from users table with new columns
-- (This will fail if columns don't exist)
SELECT id, name, email, department, bio, profile_image_url, is_premium
FROM users 
LIMIT 1;

-- 5. Check RLS policies on users table
SELECT policyname, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users';
