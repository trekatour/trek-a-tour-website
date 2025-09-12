-- Add image_url column to trips table if it doesn't exist
ALTER TABLE trips ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update storage policy to be more permissive for testing
DROP POLICY IF EXISTS "Allow authenticated upload trip images" ON storage.objects;

CREATE POLICY "Allow all uploads to trip-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'trip-images');

-- Allow public access to trip images
DROP POLICY IF EXISTS "Allow public view trip images" ON storage.objects;

CREATE POLICY "Allow public access trip images" ON storage.objects
  FOR SELECT USING (bucket_id = 'trip-images');
