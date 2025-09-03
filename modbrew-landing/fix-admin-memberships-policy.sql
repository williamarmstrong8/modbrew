-- Fix Admin Memberships Policy
-- Run this SQL in your Supabase SQL editor to allow admins to view all memberships

-- First, let's check the current user's role
-- You may need to manually set your user as admin first if you haven't already
-- UPDATE memberships SET role = 'admin' WHERE user_id = auth.uid();

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view own memberships" ON memberships;

-- Create a new policy that allows admins to view all memberships
CREATE POLICY "Users can view own memberships or all if admin" ON memberships
  FOR SELECT USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM memberships 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Also update the other policies to be more flexible for admins
DROP POLICY IF EXISTS "Users can insert own memberships" ON memberships;
CREATE POLICY "Users can insert own memberships or admin can insert any" ON memberships
  FOR INSERT WITH CHECK (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM memberships 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can update own memberships" ON memberships;
CREATE POLICY "Users can update own memberships or admin can update any" ON memberships
  FOR UPDATE USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM memberships 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Verify the policies are created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'memberships';
