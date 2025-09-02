-- Fix Weekly Challenges Table - Complete Fix for 406 Errors
-- Run this SQL in your Supabase SQL editor to completely fix the weekly_challenges table

-- Step 1: Drop the weekly_challenges table completely to start fresh
DROP TABLE IF EXISTS weekly_challenges CASCADE;

-- Step 2: Create weekly_challenges table with correct structure
CREATE TABLE weekly_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_name TEXT DEFAULT 'Weekly Photo Challenge',
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'submitted')),
  photo_urls TEXT[] DEFAULT '{}',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Add foreign key constraint to auth.users
ALTER TABLE weekly_challenges 
ADD CONSTRAINT weekly_challenges_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 4: Enable Row Level Security
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop any existing policies and create fresh ones
DROP POLICY IF EXISTS "Users can view own challenges" ON weekly_challenges;
DROP POLICY IF EXISTS "Users can insert own challenges" ON weekly_challenges;
DROP POLICY IF EXISTS "Users can update own challenges" ON weekly_challenges;
DROP POLICY IF EXISTS "Users can delete own challenges" ON weekly_challenges;

-- Step 6: Create fresh RLS policies
CREATE POLICY "Users can view own challenges" ON weekly_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges" ON weekly_challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges" ON weekly_challenges
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges" ON weekly_challenges
  FOR DELETE USING (auth.uid() = user_id);

-- Step 7: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_weekly_challenges_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger for updated_at
DROP TRIGGER IF EXISTS update_weekly_challenges_updated_at ON weekly_challenges;
CREATE TRIGGER update_weekly_challenges_updated_at
  BEFORE UPDATE ON weekly_challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_weekly_challenges_updated_at();

-- Step 9: Grant necessary permissions
GRANT ALL ON weekly_challenges TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 10: Verify everything is working
SELECT 
  'Weekly challenges table created successfully!' as info,
  COUNT(*) as total_records
FROM weekly_challenges;

-- Step 11: Test RLS policies
SELECT 
  'RLS Policies:' as info,
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'weekly_challenges';
