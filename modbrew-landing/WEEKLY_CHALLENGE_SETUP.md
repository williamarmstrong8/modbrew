# Weekly Challenge Setup Guide

## ⚠️ IMPORTANT: Database Structure Update Required

**Before setting up weekly challenges, you must run the database structure update first:**

1. Run `update-database-structure.sql` to migrate from profiles table to memberships table
2. Then run `fix-weekly-challenges-table.sql` to fix the weekly_challenges table foreign key

## 1. Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Create weekly_challenges table
CREATE TABLE IF NOT EXISTS weekly_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES memberships(user_id) ON DELETE CASCADE,
  challenge_name TEXT DEFAULT 'Weekly Photo Challenge',
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'submitted')),
  photo_urls TEXT[] DEFAULT '{}',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own challenges" ON weekly_challenges;
DROP POLICY IF EXISTS "Users can insert own challenges" ON weekly_challenges;
DROP POLICY IF EXISTS "Users can update own challenges" ON weekly_challenges;
DROP POLICY IF EXISTS "Users can delete own challenges" ON weekly_challenges;

-- Create policies for weekly_challenges
CREATE POLICY "Users can view own challenges" ON weekly_challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges" ON weekly_challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges" ON weekly_challenges
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges" ON weekly_challenges
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_weekly_challenges_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at on weekly_challenges
DROP TRIGGER IF EXISTS update_weekly_challenges_updated_at ON weekly_challenges;
CREATE TRIGGER update_weekly_challenges_updated_at
  BEFORE UPDATE ON weekly_challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_weekly_challenges_updated_at();
```

## 2. Storage Bucket Setup

In your Supabase dashboard:

1. Go to **Storage** section
2. Click **Create a new bucket**
3. Set bucket name: `modbrew-5`
4. Set bucket as **Public** (so photos can be viewed)
5. Click **Create bucket**

## 3. Storage Policies (FIXED VERSION)

After creating the bucket, add these policies in the SQL editor:

```sql
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for modbrew-5 bucket if they exist
DROP POLICY IF EXISTS "Users can upload own photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to modbrew-5 bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow viewing from modbrew-5 bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates to modbrew-5 bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes from modbrew-5 bucket" ON storage.objects;

-- Create policies that match ClubKit's approach
-- Allow authenticated users to upload to any folder in modbrew-5 bucket
CREATE POLICY "Allow uploads to modbrew-5 bucket" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'modbrew-5' AND 
    auth.role() = 'authenticated'
  );

-- Allow anyone to view photos from the bucket
CREATE POLICY "Allow viewing from modbrew-5 bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'modbrew-5');

-- Allow authenticated users to update files in the bucket
CREATE POLICY "Allow updates to modbrew-5 bucket" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'modbrew-5' AND 
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete files from the bucket
CREATE POLICY "Allow deletes from modbrew-5 bucket" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'modbrew-5' AND 
    auth.role() = 'authenticated'
  );
```

## 4. Features

The weekly challenge system includes:

- **Photo Upload**: Users can select and upload up to 5 photos
- **File Management**: Drag & drop interface with preview
- **Storage**: Photos stored in `modbrew-5` bucket organized by user ID
- **Database Tracking**: Challenge completion status and photo URLs stored
- **User Experience**: Modern UI with progress indicators and success states
- **Security**: Row-level security ensures users can only access their own challenges

## 5. Usage

1. Users click "Participate" in Member Hub
2. They're taken to `/weekly-challenge` route
3. Upload exactly 5 photos
4. Submit challenge to create database record
5. Photos stored in Supabase storage bucket
6. Challenge marked as completed

## 6. File Structure

```
modbrew-5/
├── user-id-1/
│   ├── timestamp-random1.jpg
│   ├── timestamp-random2.jpg
│   └── ...
└── user-id-2/
    ├── timestamp-random1.jpg
    └── ...
```

## 7. Database Schema

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References profiles(id) |
| challenge_name | TEXT | Challenge identifier |
| status | TEXT | in_progress, completed, submitted |
| photo_urls | TEXT[] | Array of uploaded photo URLs |
| submitted_at | TIMESTAMP | When challenge was submitted |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

## 8. Key Changes Made

- **Fixed Storage Policies**: Updated to allow authenticated users to upload to the bucket
- **Improved Upload Flow**: Photos are now uploaded only when submitting the challenge (like ClubKit)
- **Better Error Handling**: Added console logging and improved error messages
- **Upload Options**: Added cache control and upsert settings for better file management
