-- Fix the handle_new_user function to properly extract name from user metadata
-- Run this SQL in your Supabase SQL editor

-- Update the trigger function to handle new user signup with proper name extraction
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

-- Ensure the trigger exists and is working
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify the function was updated
SELECT 
  'Function updated successfully' as status,
  proname as function_name,
  prosrc as function_source
FROM pg_proc 
WHERE proname = 'handle_new_user';
