-- Alternative: Create a 'listings' bucket to match existing URLs
-- Run this in your Supabase SQL Editor

-- Create the storage bucket with the name that matches your URLs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listings', 
  'listings', 
  true, 
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for the listings bucket
DROP POLICY IF EXISTS "Users can upload to listings bucket" ON storage.objects;
DROP POLICY IF EXISTS "Users can view listings bucket images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own listings bucket images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own listings bucket images" ON storage.objects;

CREATE POLICY "Users can upload to listings bucket" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'listings' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view listings bucket images" ON storage.objects
  FOR SELECT USING (bucket_id = 'listings');

CREATE POLICY "Users can update own listings bucket images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'listings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own listings bucket images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'listings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
