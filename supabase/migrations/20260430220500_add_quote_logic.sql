-- Add is_quote_only column to services
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS is_quote_only BOOLEAN DEFAULT false;

-- Update existing project-management services to be quote only
UPDATE public.services 
SET is_quote_only = true 
WHERE category_id = 'project-management';
