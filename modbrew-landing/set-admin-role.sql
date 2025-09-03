-- Set Current User as Admin
-- Run this SQL in your Supabase SQL editor to make your current user an admin

-- First, let's see who you are currently authenticated as
SELECT 
  auth.uid() as current_user_id,
  auth.email() as current_user_email;

-- Set your current user as admin
UPDATE memberships 
SET role = 'admin' 
WHERE user_id = auth.uid();

-- Verify the change
SELECT 
  id,
  user_id,
  name,
  email,
  role,
  membership_type,
  status,
  created_at
FROM memberships 
WHERE user_id = auth.uid();

-- Now you should be able to see all memberships in the admin dashboard
-- Run the fix-admin-memberships-policy.sql script after this
