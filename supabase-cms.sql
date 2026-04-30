-- ==========================================
-- 1. CMS Tables Setup
-- ==========================================

-- Table for Home Page Scrolling Images
CREATE TABLE IF NOT EXISTS public.scrolling_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  order_index int DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for Team Members
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  registration_id text, -- e.g. ZIE | ECZ
  credentials text,     -- e.g. BSc (Hons), MBA
  image_url text,
  display_order int DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Update Projects Table to include image_url
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='projects' AND column_name='image_url'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN image_url text;
  END IF;
END $$;

-- Enable RLS on all
ALTER TABLE public.scrolling_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. Database RLS Policies
-- ==========================================

-- Public Read Policies
DROP POLICY IF EXISTS "Allow public read access to scrolling_images" ON public.scrolling_images;
CREATE POLICY "Allow public read access to scrolling_images" ON public.scrolling_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to team_members" ON public.team_members;
CREATE POLICY "Allow public read access to team_members" ON public.team_members FOR SELECT USING (true);

-- Admin Write Policies (Requires Authenticated User)
DROP POLICY IF EXISTS "Allow admin full access to scrolling_images" ON public.scrolling_images;
CREATE POLICY "Allow admin full access to scrolling_images" ON public.scrolling_images FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin full access to team_members" ON public.team_members;
CREATE POLICY "Allow admin full access to team_members" ON public.team_members FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin full access to projects" ON public.projects;
CREATE POLICY "Allow admin full access to projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- 3. Storage Buckets & Policies Setup
-- ==========================================

-- Create Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true) ON CONFLICT (id) DO NOTHING;

-- Public Read Policies for Storage
DROP POLICY IF EXISTS "Public Access to site-assets" ON storage.objects;
CREATE POLICY "Public Access to site-assets" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Public Access to project-images" ON storage.objects;
CREATE POLICY "Public Access to project-images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');

-- Admin Write Policies for Storage (Requires Authenticated User)
DROP POLICY IF EXISTS "Admin Uploads to site-assets" ON storage.objects;
CREATE POLICY "Admin Uploads to site-assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Admin Updates to site-assets" ON storage.objects;
CREATE POLICY "Admin Updates to site-assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Admin Deletes from site-assets" ON storage.objects;
CREATE POLICY "Admin Deletes from site-assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Admin Uploads to project-images" ON storage.objects;
CREATE POLICY "Admin Uploads to project-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Admin Updates to project-images" ON storage.objects;
CREATE POLICY "Admin Updates to project-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Admin Deletes from project-images" ON storage.objects;
CREATE POLICY "Admin Deletes from project-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images');

-- ==========================================
-- 4. Initial Data Migration
-- ==========================================

-- Initial Data Migration (Scrolling Images)
INSERT INTO public.scrolling_images (image_url, order_index) VALUES
  ('/scroll/scroll-1.jpg', 0),
  ('/scroll/scroll-2.jpg', 1),
  ('/scroll/scroll-3.jpg', 2),
  ('/scroll/scroll-4.jpg', 3),
  ('/scroll/scroll-5.jpg', 4)
ON CONFLICT DO NOTHING;

-- Initial Data Migration (Team Members)
INSERT INTO public.team_members (name, role, registration_id, credentials, image_url, display_order) VALUES
  ('Eng. Rumbidzai Kombora', 'Company Director', 'ZIE | ECZ', 'BSc (Hons), MBA, Pr Eng', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600', 0),
  ('Simbarashe Musakwembewa', 'Structural Expert', 'ZIE 084408 | ECZ 150285', 'BSc (Hons), Pr. Eng, MECZ', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', 1),
  ('Eng. Byron Muzovaka', 'GeoTech Expert', 'ZIE 144395 | ECZ 100645', 'BSc (Hons), ECZ, Pr. Eng', '/team/byron-muzovaka.png', 2),
  ('Panashe R. Gora', 'Contracts Manager', '', 'BSc (Hons), ECZ, Pr. Eng, Machine Learning, Artificial Intelligence', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600', 3),
  ('Tinashe Mutero', 'Engineering Manager', '', '', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600', 4),
  ('Pamela Nyoni', 'Civil Engineering Technician', '', '', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600', 5),
  ('Farai Likalawe', 'Planner', '', '', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=600', 6),
  ('Tanyaradzwa Mwapenya', 'Quantity Surveying Technician', '', '', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=600', 7),
  ('Bridget Makonese', 'Water Resources Technician', '', '', 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&q=80&w=600', 8),
  ('Wayne M. Popi', 'Software Engineer', '', '', '/team/wayne-m-popi.jpg', 9)
ON CONFLICT DO NOTHING;
