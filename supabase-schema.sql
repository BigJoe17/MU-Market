-- MU Market Database Schema
-- Run these commands in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('product', 'service', 'skill')),
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  contact_method TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for listings table
CREATE POLICY "Anyone can view listings" ON public.listings
  FOR SELECT USING (true);

CREATE POLICY "Users can create listings" ON public.listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings" ON public.listings
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Storage policy for listing images
CREATE POLICY "Users can upload listing images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view listing images" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-images');

CREATE POLICY "Users can update own listing images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own listing images" ON storage.objects
  FOR DELETE USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Index for better performance
CREATE INDEX IF NOT EXISTS listings_user_id_idx ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS listings_category_idx ON public.listings(category);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON public.listings(created_at DESC);
