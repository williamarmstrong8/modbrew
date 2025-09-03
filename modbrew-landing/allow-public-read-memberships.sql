-- Allow Public Read Access to Memberships
-- Run this SQL in your Supabase SQL editor to allow anyone to read memberships

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view own memberships" ON memberships;

-- Create a simple policy that allows anyone to read memberships
CREATE POLICY "Anyone can read memberships" ON memberships
  FOR SELECT USING (true);

-- Verify the policy is created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'memberships';
