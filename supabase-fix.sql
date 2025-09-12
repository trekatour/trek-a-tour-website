-- Run this in your Supabase SQL Editor to fix the RLS issue

-- Option 1: Disable RLS completely (simplest for development)
ALTER TABLE trips DISABLE ROW LEVEL SECURITY;

-- Option 2: Or create a policy that allows all operations (if you want to keep RLS enabled)
-- CREATE POLICY "Allow all operations on trips" ON trips FOR ALL USING (true) WITH CHECK (true);

-- Check if the table exists and show its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'trips' 
ORDER BY ordinal_position;
