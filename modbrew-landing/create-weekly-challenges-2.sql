-- Create Weekly Challenges 2 Table for Story Screenshot Challenge
-- This table is for the new challenge: "Submit a screenshot of you posting ModBrew to your story for an entrance in raffle for free merch"

-- Create weekly_challenges_2 table
CREATE TABLE IF NOT EXISTS weekly_challenges_2 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_name TEXT DEFAULT 'Weekly Story Screenshot Challenge',
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'submitted')),
  photo_url TEXT, -- Single photo URL for screenshot
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint to auth.users
ALTER TABLE weekly_challenges_2 
ADD CONSTRAINT weekly_challenges_2_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE weekly_challenges_2 ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies and create fresh ones
DROP POLICY IF EXISTS "Users can view own challenges 2" ON weekly_challenges_2;
DROP POLICY IF EXISTS "Users can insert own challenges 2" ON weekly_challenges_2;
DROP POLICY IF EXISTS "Users can update own challenges 2" ON weekly_challenges_2;
DROP POLICY IF EXISTS "Users can delete own challenges 2" ON weekly_challenges_2;

-- Create fresh RLS policies
CREATE POLICY "Users can view own challenges 2" ON weekly_challenges_2
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges 2" ON weekly_challenges_2
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges 2" ON weekly_challenges_2
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges 2" ON weekly_challenges_2
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_weekly_challenges_2_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_weekly_challenges_2_updated_at ON weekly_challenges_2;
CREATE TRIGGER update_weekly_challenges_2_updated_at
  BEFORE UPDATE ON weekly_challenges_2
  FOR EACH ROW
  EXECUTE FUNCTION public.update_weekly_challenges_2_updated_at();

-- Create function to get user challenge 2 status
CREATE OR REPLACE FUNCTION get_user_challenge_2_status(user_uuid UUID)
RETURNS TABLE(
  status TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wc.status,
    wc.submitted_at
  FROM weekly_challenges_2 wc
  WHERE wc.user_id = user_uuid
  ORDER BY wc.created_at DESC
  LIMIT 1;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_challenge_2_status(UUID) TO authenticated;

-- Verify the table was created successfully
SELECT 
  'Weekly Challenges 2 table created successfully!' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'weekly_challenges_2' 
ORDER BY ordinal_position;
