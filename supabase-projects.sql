-- Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  loc text NOT NULL,
  sector text NOT NULL,
  scope text NOT NULL,
  stands text NOT NULL,
  date text NOT NULL,
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to projects
CREATE POLICY "Allow public read access to projects"
ON public.projects
FOR SELECT
USING (true);

-- Allow authenticated users to insert, update, and delete (will be useful later for the admin page)
CREATE POLICY "Allow authenticated users to modify projects"
ON public.projects
FOR ALL
USING (auth.role() = 'authenticated');

-- Insert the static projects data
INSERT INTO public.projects (title, loc, sector, scope, stands, date, status) VALUES
  ('Suncoast Project', 'Masvingo', 'Residential', 'Road Design, Water Reticulation, Sewer Reticulation, Stormwater Drainage', '3200 Stands', 'Oct 2022', 'Completed'),
  ('The Nest of Kenilworth', 'Chipinge', 'Residential', 'Water, Stormwater, Sewer, Road and Public Lighting Design', '3800 Stands', 'Nov 2025', 'Underway'),
  ('Victoria Range', 'Masvingo', 'Residential', 'Water & Sewer Reticulation Designs', '500 Stands', 'Dec 2023', 'Completed'),
  ('Boronia Farm Subdivision', 'Harare', 'Residential', 'Water Reticulation Design', '200 Stands', 'Mar 2025', 'Underway'),
  ('Flamboyant Project', 'Masvingo', 'Residential', 'Water Reticulation Design', '400 Stands', 'Jan 2023', 'Completed'),
  ('Mutare Recovery Facility', 'Mutare', 'Industrial', 'Full structural design & geotechnical guidance for Industrial Waste Processing Structure', 'Industrial', 'Completed', 'Completed'),
  ('Madziwa Structural Development', 'Gweru', 'Industrial', 'Full structural design, detailing and documentation for reinforced concrete multi-level building', 'Multi-Storey', 'Completed', 'Completed'),
  ('Popi Residence', 'Gweru', 'Residential', 'High-end modern residential structural design with reinforced concrete framing and cantilever elements', 'Randolph Phase 1', 'Underway', 'Underway'),
  ('Proposed Shops & Offices', 'Rusape', 'Commercial', 'Commercial double-storey structural design and reinforcement detailing under BS 8110 standards', 'Stand 2461', 'Approved', 'Approved'),
  ('Waste Stabilisation Ponds', 'Gweru', 'Infrastructure', 'Design of complete wastewater stabilisation pond system and abattoir effluent treatment', 'Connemara Farm', 'Completed', 'Completed'),
  ('Fuel Service Station', 'Muzarabani', 'Commercial', 'Commercial structural design of canopy, steel framing and composite infrastructure', 'Energy Park', 'Completed', 'Completed'),
  ('219m² Residential Unit', 'Chipinge', 'Residential', 'Structural design for modern medium-density residential development including boundary walls', 'Residential', 'Completed', 'Completed'),
  ('Residential Unit (St Kelvin)', 'Chipinge', 'Residential', 'Full structural design and construction documentation for high-end multi-bedroom dwelling', 'High-End', 'Completed', 'Completed'),
  ('Church Structure Foundation', 'Chipinge', 'Institutional', 'Structural foundation design and reinforcement detailing for institutional development', 'UCCZ Gaza', 'Completed', 'Completed'),
  ('Structural Building Development', 'Mt Selinda', 'Institutional', 'Comprehensive multi-storey reinforced concrete building structural design and certification', 'Multi-Storey', 'Completed', 'Completed');
