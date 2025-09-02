-- ModBrew Database Structure Update
-- Run this SQL in your Supabase SQL editor to migrate to consolidated memberships structure

-- Step 1: Check if profiles table exists and handle accordingly
DO $$
BEGIN
    -- Check if profiles table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        -- Profiles table exists, migrate data
        RAISE NOTICE 'Profiles table found, migrating data...';
        
        -- Add new columns to memberships table if they don't exist
        ALTER TABLE memberships 
        ADD COLUMN IF NOT EXISTS name TEXT,
        ADD COLUMN IF NOT EXISTS email TEXT,
        ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

        -- Update existing memberships with profile data
        UPDATE memberships 
        SET 
          name = profiles.name,
          email = profiles.email,
          role = profiles.role
        FROM profiles 
        WHERE memberships.user_id = profiles.id;

        -- Make email column NOT NULL after data migration
        ALTER TABLE memberships ALTER COLUMN email SET NOT NULL;

        -- Drop the profiles table after migration
        DROP TABLE profiles CASCADE;
        
        RAISE NOTICE 'Data migration completed, profiles table dropped.';
    ELSE
        -- Profiles table doesn't exist, just add columns
        RAISE NOTICE 'Profiles table not found, adding columns to memberships...';
        
        -- Add new columns to memberships table
        ALTER TABLE memberships 
        ADD COLUMN IF NOT EXISTS name TEXT,
        ADD COLUMN IF NOT EXISTS email TEXT,
        ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));
        
        RAISE NOTICE 'Columns added to memberships table.';
    END IF;
END $$;

-- Step 2: Update the foreign key reference in memberships
-- First, drop the existing foreign key constraint if it exists
ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_user_id_fkey;

-- Add new foreign key constraint to reference auth.users directly
ALTER TABLE memberships 
ADD CONSTRAINT memberships_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 3: Update the trigger function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create membership with user profile data
  INSERT INTO public.memberships (user_id, name, email, role, membership_type, status)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email, 'customer', 'basic', 'active');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Update RLS policies
-- Note: No profiles table policies to drop since it doesn't exist

-- Ensure memberships policies are correct
DROP POLICY IF EXISTS "Users can view own memberships" ON memberships;
DROP POLICY IF EXISTS "Users can insert own memberships" ON memberships;
DROP POLICY IF EXISTS "Users can update own memberships" ON memberships;

-- Create updated policies for memberships
CREATE POLICY "Users can view own memberships" ON memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memberships" ON memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own memberships" ON memberships
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 6: Update existing memberships that might not have name/email data
-- This handles cases where memberships were created before the profile data was added
UPDATE memberships 
SET 
  email = COALESCE(email, (SELECT email FROM auth.users WHERE id = user_id)),
  name = COALESCE(name, 'User'),
  role = COALESCE(role, 'customer')
WHERE email IS NULL OR name IS NULL OR role IS NULL;

-- Step 7: Verify the new structure
-- Check the current state of memberships table
SELECT 
  'Current memberships structure:' as info,
  COUNT(*) as total_memberships,
  COUNT(CASE WHEN name IS NOT NULL THEN 1 END) as with_names,
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as with_emails
FROM memberships;

-- Check auth users count for comparison
SELECT 
  'Auth users count:' as info,
  COUNT(*) as total_auth_users
FROM auth.users;

-- Step 8: Clean up any remaining references
-- If you have any other tables that reference profiles.id, update them to reference memberships.user_id
-- For example, if you have a weekly_challenges table:
-- ALTER TABLE weekly_challenges DROP CONSTRAINT IF EXISTS weekly_challenges_user_id_fkey;
-- ALTER TABLE weekly_challenges ADD CONSTRAINT weekly_challenges_user_id_fkey 
--   FOREIGN KEY (user_id) REFERENCES memberships(user_id) ON DELETE CASCADE;

-- Final verification - this should show the structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'memberships' 
ORDER BY ordinal_position;
