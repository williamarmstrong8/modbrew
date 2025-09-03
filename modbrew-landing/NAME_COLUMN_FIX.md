# Fix for Name Column in Memberships Table

## Problem
When users sign up through the auth form, their name was not being properly stored in the `name` column of the `memberships` table. The database trigger was trying to extract the name from `raw_user_meta_data` but the name wasn't being passed correctly during signup.

## Solution

### 1. Updated AuthForm.tsx
Modified the signup function to pass the name in the `options.data` parameter:

```typescript
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name: name.trim()
    }
  }
})
```

### 2. Updated Database Trigger
Modified the `handle_new_user()` function to properly extract the name and provide a fallback:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
```

## Files Modified
- `src/components/auth/AuthForm.tsx` - Added name to signup options
- `supabase-setup.sql` - Updated trigger function
- `update-database-structure.sql` - Updated trigger function
- `fix-name-in-memberships-trigger.sql` - New file with the fix

## What to Do
1. **Run the SQL fix** in your Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of fix-name-in-memberships-trigger.sql
   ```

2. **Test the signup flow** - New users should now have their names properly stored in the memberships table.

## How It Works
1. User fills out signup form with name, email, and password
2. AuthForm calls `supabase.auth.signUp()` with the name in `options.data`
3. Supabase stores the name in `raw_user_meta_data`
4. Database trigger `handle_new_user()` fires and extracts the name using `raw_user_meta_data->>'name'`
5. If no name is provided, it falls back to 'User'
6. Membership record is created with the proper name

## Verification
After applying the fix, you can verify it's working by:
1. Creating a new user account
2. Checking the `memberships` table to see if the `name` column is populated
3. The name should match what was entered during signup
