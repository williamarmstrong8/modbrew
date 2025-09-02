# ModBrew Authentication Setup

This document explains how to set up authentication for the ModBrew application using Supabase.

## Overview

The authentication system has been implemented using Supabase Auth with the following features:

- **Sign Up**: Users can create accounts with email, password, and name
- **Sign In**: Users can log in with email and password
- **Protected Routes**: Admin dashboard is protected and requires authentication
- **User Context**: Authentication state is managed throughout the app
- **Automatic Redirects**: Users are redirected appropriately based on auth status

## Components Created

### 1. Supabase Configuration (`src/lib/supabase.ts`)
- Supabase client setup with TypeScript types
- Database schema definitions for user profiles and orders
- Environment variable configuration

### 2. Authentication Components
- **AuthForm** (`src/components/auth/AuthForm.tsx`): Handles sign up and sign in forms
- **AuthPage** (`src/components/auth/AuthPage.tsx`): Main authentication page layout
- **ProtectedRoute** (`src/components/auth/ProtectedRoute.tsx`): Route protection wrapper

### 3. Authentication Context (`src/contexts/AuthContext.tsx`)
- Manages authentication state throughout the app
- Provides user session and loading states
- Handles sign out functionality

### 4. Updated Navigation (`src/components/layout/Navigation.tsx`)
- Shows different buttons based on authentication status
- Sign In/Sign Up buttons for unauthenticated users
- Dashboard and Sign Out buttons for authenticated users

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from the project settings

### 2. Set Up Database Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);
```

### 3. Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 4. Set Up Authentication in Supabase

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure the following:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add `http://localhost:5173/auth/callback`
   - **Email Templates**: Customize as needed

### 5. Test the Authentication

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173`
3. Click "Sign Up" to create a new account
4. Check your email for the confirmation link
5. After confirming, try signing in
6. Access the admin dashboard at `/admin`

## Features

### Sign Up Flow
- Users enter name, email, and password
- Password must be at least 6 characters
- Passwords must match
- User profile is created automatically
- Email confirmation is required

### Sign In Flow
- Users enter email and password
- Successful login redirects to admin dashboard
- Failed login shows error message

### Protected Routes
- `/admin` and all sub-routes require authentication
- Unauthenticated users are redirected to `/auth`
- Authenticated users accessing `/auth` are redirected to `/admin`

### Navigation
- Shows appropriate buttons based on authentication status
- Sign out functionality clears session and redirects to home

## Customization

### Styling
The authentication components use Tailwind CSS and can be customized by modifying:
- `AuthForm.tsx` - Form styling and layout
- `AuthPage.tsx` - Page layout and branding
- `Navigation.tsx` - Button styling and layout

### User Roles
The system supports user roles (`customer`, `admin`). You can extend this by:
1. Adding more role types to the database constraint
2. Implementing role-based access control in `ProtectedRoute`
3. Adding role checks in your admin components

### Database Schema
You can extend the database schema by:
1. Adding new tables in Supabase
2. Updating the TypeScript types in `supabase.ts`
3. Creating appropriate RLS policies

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure `.env.local` exists and contains the correct variables
   - Restart the development server after adding environment variables

2. **"Invalid login credentials"**
   - Check if email confirmation is required in Supabase settings
   - Verify the user has confirmed their email

3. **"Access denied" errors**
   - Check RLS policies in Supabase
   - Ensure user profiles are created correctly

4. **Redirect loops**
   - Verify authentication state is loading correctly
   - Check that protected routes are configured properly

### Debug Mode
To debug authentication issues, you can add console logs in:
- `AuthContext.tsx` - Monitor auth state changes
- `AuthForm.tsx` - Track form submissions and errors
- `ProtectedRoute.tsx` - Check route protection logic
