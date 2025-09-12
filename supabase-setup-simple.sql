-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Adventure',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone full access (simplified for testing)
CREATE POLICY "Allow all access" ON gallery_images
  FOR ALL USING (true);

-- Create storage bucket for gallery images (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public access to everything (simplified)
CREATE POLICY "Allow all storage access" ON storage.objects
  FOR ALL USING (bucket_id = 'gallery-images');
