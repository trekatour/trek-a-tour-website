-- Trek Booking System - Production Database Schema
-- Run this in Supabase SQL Editor: https://zkghowackqxtdvhtbilr.supabase.co

-- 1. Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2),
  duration TEXT,
  difficulty TEXT,
  max_participants INTEGER DEFAULT 20,
  start_date DATE,
  end_date DATE,
  location TEXT,
  region TEXT,
  image_url TEXT,
  itinerary JSONB DEFAULT '[]'::jsonb,
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  participants INTEGER DEFAULT 1 CHECK (participants > 0),
  booking_date DATE NOT NULL,
  special_requests TEXT,
  total_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  emergency_contact TEXT,
  dietary_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  inquiry_type TEXT DEFAULT 'general' CHECK (inquiry_type IN ('general', 'booking', 'support', 'complaint')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  assigned_to TEXT,
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title TEXT,
  review_text TEXT,
  verified BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Adventure',
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create trip_dates table for availability
CREATE TABLE IF NOT EXISTS trip_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  available_spots INTEGER NOT NULL DEFAULT 20,
  booked_spots INTEGER DEFAULT 0,
  price_override DECIMAL(10,2),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'full', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_dates ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read trips" ON trips 
  FOR SELECT USING (status = 'active');

CREATE POLICY "Allow public read reviews" ON reviews 
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow public read gallery" ON gallery_images 
  FOR SELECT USING (true);

CREATE POLICY "Allow public read trip_dates" ON trip_dates 
  FOR SELECT USING (status = 'available');

-- Public insert policies
CREATE POLICY "Allow public insert bookings" ON bookings 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert contacts" ON contacts 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert reviews" ON reviews 
  FOR INSERT WITH CHECK (true);

-- Admin policies (you'll need to set up authentication)
CREATE POLICY "Allow admin full access trips" ON trips 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access bookings" ON bookings 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access contacts" ON contacts 
  FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for trip images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'trip-images', 
  'trip-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Allow public view trip images" ON storage.objects
  FOR SELECT USING (bucket_id = 'trip-images');

CREATE POLICY "Allow authenticated upload trip images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'trip-images' AND auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trips_category ON trips(category);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_featured ON trips(featured);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_trip_id ON reviews(trip_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_trip_dates_trip_id ON trip_dates(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_dates_dates ON trip_dates(start_date, end_date);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO trips (title, description, category, price, duration, difficulty, location, region, highlights, featured) VALUES
('Everest Base Camp Trek', 'Journey to the base of the world''s highest mountain with experienced guides', 'Himalayan Treks', 1299.00, '14 days', 'Challenging', 'Nepal', 'Himalayas', ARRAY['Mount Everest views', 'Sherpa culture', 'High altitude trekking'], true),
('Weekend Camping at Rishikesh', 'Perfect weekend getaway with river rafting and adventure activities', 'Weekend Getaways', 199.00, '2 days', 'Easy', 'Rishikesh, India', 'Uttarakhand', ARRAY['River rafting', 'Camping', 'Bonfire nights'], true),
('Backpacking Himachal', 'Budget-friendly mountain adventure through scenic valleys', 'Backpacking Trips', 299.00, '5 days', 'Moderate', 'Himachal Pradesh', 'North India', ARRAY['Budget travel', 'Mountain views', 'Local culture'], false),
('Goa Beach Adventure', 'Sun, sand, and water sports in India''s beach paradise', 'Adventure', 399.00, '4 days', 'Easy', 'Goa', 'West India', ARRAY['Beach activities', 'Water sports', 'Nightlife'], true),
('Rajasthan Desert Safari', 'Experience the golden sands and royal heritage', 'Desert Safari', 599.00, '6 days', 'Moderate', 'Rajasthan', 'North India', ARRAY['Camel safari', 'Desert camping', 'Royal palaces'], false)
ON CONFLICT DO NOTHING;

-- Insert sample trip dates
INSERT INTO trip_dates (trip_id, start_date, end_date, available_spots) 
SELECT 
  id, 
  CURRENT_DATE + INTERVAL '30 days', 
  CURRENT_DATE + INTERVAL '44 days', 
  15
FROM trips 
WHERE title = 'Everest Base Camp Trek'
ON CONFLICT DO NOTHING;

INSERT INTO trip_dates (trip_id, start_date, end_date, available_spots) 
SELECT 
  id, 
  CURRENT_DATE + INTERVAL '7 days', 
  CURRENT_DATE + INTERVAL '9 days', 
  25
FROM trips 
WHERE title = 'Weekend Camping at Rishikesh'
ON CONFLICT DO NOTHING;
