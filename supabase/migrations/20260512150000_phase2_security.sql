-- ============================================================================
-- Phase 2: Security Hardening & Storefront Permissions
-- ============================================================================

-- 1. Create admin allowlist table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the admin_users table (needed for auth check on frontend)
CREATE POLICY "Allow public read access to admin_users" 
ON public.admin_users FOR SELECT 
TO public 
USING (true);

-- 2. Update existing policies for Phase 1 tables

-- Drop the old overly-permissive "authenticated" policies
DROP POLICY IF EXISTS "Allow admin full access to projects" ON public.projects;
DROP POLICY IF EXISTS "Allow admin full access to scrolling_images" ON public.scrolling_images;
DROP POLICY IF EXISTS "Allow admin full access to team_members" ON public.team_members;

-- Create new policies using the admin_users allowlist
CREATE POLICY "Allow admin_users full access to projects" 
ON public.projects FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Allow admin_users full access to scrolling_images" 
ON public.scrolling_images FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Allow admin_users full access to team_members" 
ON public.team_members FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- 3. Update existing policies for Phase 2 tables (Storefront)

-- Drop any existing "authenticated" policies if they exist (just in case)
DROP POLICY IF EXISTS "Allow admin full access to service_categories" ON public.service_categories;
DROP POLICY IF EXISTS "Allow admin full access to services" ON public.services;

-- Create new policies using the admin_users allowlist
CREATE POLICY "Allow admin_users full access to service_categories" 
ON public.service_categories FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Allow admin_users full access to services" 
ON public.services FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- 4. Update policies for Orders related tables

-- Make sure RLS is enabled on order-related tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Admin read access
CREATE POLICY "Allow admin_users read access to orders" 
ON public.orders FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Allow admin_users read access to order_items" 
ON public.order_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Allow admin_users read access to payments" 
ON public.payments FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

-- Admin read/update access to receipts (so they can update job_status)
CREATE POLICY "Allow admin_users full access to receipts" 
ON public.receipts FOR ALL 
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));
