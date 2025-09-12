-- Create trips table to store all trip data
CREATE TABLE public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  region TEXT,
  difficulty TEXT,
  base_price INTEGER NOT NULL,
  duration TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  image TEXT,
  features TEXT[],
  highlights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Allow public read access for all trips
CREATE POLICY "Anyone can view trips" ON public.trips
  FOR SELECT USING (true);

-- Only authenticated users can insert trips
CREATE POLICY "Authenticated users can insert trips" ON public.trips
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only trip creators can update their trips
CREATE POLICY "Users can update their own trips" ON public.trips
  FOR UPDATE USING (auth.uid() = created_by);

-- Only trip creators can delete their trips
CREATE POLICY "Users can delete their own trips" ON public.trips
  FOR DELETE USING (auth.uid() = created_by);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own role
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 AND role = 'admin'
  );
$$;

-- Admin policy for trips - admins can do everything
CREATE POLICY "Admins can manage all trips" ON public.trips
  FOR ALL USING (public.is_admin(auth.uid()));

-- Create storage bucket for trip images
INSERT INTO storage.buckets (id, name, public) VALUES ('trip-images', 'trip-images', true);

-- Storage policies for trip images
CREATE POLICY "Anyone can view trip images" ON storage.objects
  FOR SELECT USING (bucket_id = 'trip-images');

CREATE POLICY "Authenticated users can upload trip images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'trip-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update trip images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'trip-images' AND auth.role() = 'authenticated');

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();