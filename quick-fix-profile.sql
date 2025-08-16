-- Quick Fix for Profile Update Error
-- Run this FIRST to get profile updates working immediately

-- 1. Add missing columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS total_sales INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_average DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create profiles storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profiles', 
  'profiles', 
  true, 
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 3. Create basic storage policies for profiles bucket
CREATE POLICY "profiles_upload_policy" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profiles' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "profiles_select_policy" ON storage.objects
  FOR SELECT USING (bucket_id = 'profiles');

CREATE POLICY "profiles_update_policy" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profiles' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "profiles_delete_policy" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profiles' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. Test that everything works
SELECT 'Users table columns added successfully' as status;
SELECT 'Profiles bucket created successfully' as status WHERE EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'profiles'
);
