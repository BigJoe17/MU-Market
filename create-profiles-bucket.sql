-- Create Profiles Storage Bucket and Policies
-- Run this in Supabase SQL Editor to fix the "Bucket not found" error

-- 1. Create the profiles storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles', 
  'profiles', 
  true, 
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Create storage policies for the profiles bucket
-- Allow authenticated users to upload their own profile images
CREATE POLICY "Users can upload their own profile images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.role() = 'authenticated' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow everyone to view profile images (public bucket)
CREATE POLICY "Anyone can view profile images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profiles');

-- Allow users to update their own profile images
CREATE POLICY "Users can update their own profile images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own profile images
CREATE POLICY "Users can delete their own profile images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Verify the bucket was created
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets 
WHERE id = 'profiles';
