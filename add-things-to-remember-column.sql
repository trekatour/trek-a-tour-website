-- Add things_to_remember column to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS things_to_remember TEXT;

-- Update existing trips with default content (optional)
UPDATE trips 
SET things_to_remember = 'Important things to remember for this trip will be updated soon.'
WHERE things_to_remember IS NULL;
