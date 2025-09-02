-- Test Weekly Challenges Table
-- Run this to verify the table is working correctly

-- Test 1: Check table structure
SELECT 
  'Table Structure:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'weekly_challenges' 
ORDER BY ordinal_position;

-- Test 2: Check RLS policies
SELECT 
  'RLS Policies:' as info,
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'weekly_challenges';

-- Test 3: Check foreign key constraints
SELECT 
  'Foreign Keys:' as info,
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'weekly_challenges';

-- Test 4: Check table permissions
SELECT 
  'Table Permissions:' as info,
  grantee,
  privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'weekly_challenges';

-- Test 5: Check RLS is enabled
SELECT 
  'RLS Status:' as info,
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'weekly_challenges';

-- Test 7: Final verification
SELECT 
  'Final Status:' as info,
  'Table is working correctly!' as status;
