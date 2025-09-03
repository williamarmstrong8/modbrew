-- ModBrew Database Setup
-- Run this SQL in your Supabase SQL editor

-- Create memberships table with user profile data
CREATE TABLE IF NOT EXISTS memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  membership_type TEXT DEFAULT 'basic' CHECK (membership_type IN ('basic', 'premium', 'vip')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own memberships" ON memberships;
DROP POLICY IF EXISTS "Users can insert own memberships" ON memberships;
DROP POLICY IF EXISTS "Users can update own memberships" ON memberships;

-- Create policies for memberships
CREATE POLICY "Users can view own memberships" ON memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memberships" ON memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own memberships" ON memberships
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create membership with user profile data
  -- Extract name from raw_user_meta_data, fallback to 'User' if not provided
  INSERT INTO public.memberships (user_id, name, email, role, membership_type, status)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email, 
    'customer', 
    'basic', 
    'active'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at on memberships
DROP TRIGGER IF EXISTS update_memberships_updated_at ON memberships;
CREATE TRIGGER update_memberships_updated_at
  BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
