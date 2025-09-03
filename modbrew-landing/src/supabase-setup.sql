-- Enable RLS on weekly_challenges table
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read weekly challenges
CREATE POLICY "Allow authenticated users to read weekly challenges" ON weekly_challenges
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy to allow users to insert their own challenges
CREATE POLICY "Allow users to insert their own challenges" ON weekly_challenges
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own challenges
CREATE POLICY "Allow users to update their own challenges" ON weekly_challenges
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own challenges
CREATE POLICY "Allow users to delete their own challenges" ON weekly_challenges
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
