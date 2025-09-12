-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  region TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Moderate', 'Hard')) NOT NULL,
  base_price INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  duration TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  long_desc TEXT,
  image_url TEXT,
  features TEXT[], -- Array of features
  highlights TEXT[], -- Array of highlights
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user
INSERT INTO admin_users (email) VALUES ('saythu000@gmail.com') ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for trips (public read, admin write)
CREATE POLICY "Anyone can view active trips" ON trips
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can do everything on trips" ON trips
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- Create policies for admin_users (admin only)
CREATE POLICY "Only admins can view admin_users" ON admin_users
  FOR SELECT USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
