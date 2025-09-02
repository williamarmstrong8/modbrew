-- Create Weekly Challenge Status Function
-- This function will be called via RPC to avoid query builder issues

-- Step 1: Create the function to get user challenge status
CREATE OR REPLACE FUNCTION get_user_challenge_status(user_uuid UUID)
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
  FROM weekly_challenges wc
  WHERE wc.user_id = user_uuid
  ORDER BY wc.created_at DESC
  LIMIT 1;
END;
$$;

-- Step 2: Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_challenge_status(UUID) TO authenticated;

-- Step 3: Test the function
SELECT 
  'Function created successfully!' as info,
  proname,
  prosrc
FROM pg_proc 
WHERE proname = 'get_user_challenge_status';

-- Step 4: Verify permissions
SELECT 
  'Function permissions:' as info,
  grantee,
  privilege_type
FROM information_schema.routine_privileges 
WHERE routine_name = 'get_user_challenge_status';
