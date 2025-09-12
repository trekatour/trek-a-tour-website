-- Add available_dates and is_active columns to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS available_dates TEXT[];
ALTER TABLE trips ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing trips to be active by default
UPDATE trips SET is_active = true WHERE is_active IS NULL;

-- Create index for better performance on active trips queries
CREATE INDEX IF NOT EXISTS idx_trips_is_active ON trips(is_active);

-- Example of adding available dates (you can run this after creating trips)
-- UPDATE trips SET available_dates = ARRAY['Dec 15, 2024', 'Jan 10, 2025', 'Feb 5, 2025'] WHERE id = 'your-trip-id';
