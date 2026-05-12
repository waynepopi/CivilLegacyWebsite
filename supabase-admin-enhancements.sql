-- ==========================================
-- 1. Admin Users
-- ==========================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role text DEFAULT 'Admin',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure columns exist if table was already created
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS role text DEFAULT 'Admin';

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users" ON public.admin_users FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow user to view their own admin record" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage admin_users" ON public.admin_users;

DROP POLICY IF EXISTS "Admins can insert admin_users" ON public.admin_users;
CREATE POLICY "Admins can insert admin_users" ON public.admin_users FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can update admin_users" ON public.admin_users;
CREATE POLICY "Admins can update admin_users" ON public.admin_users FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can delete admin_users" ON public.admin_users;
CREATE POLICY "Admins can delete admin_users" ON public.admin_users FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);


-- ==========================================
-- 2. Audit Logs
-- ==========================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit_logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit_logs" ON public.audit_logs FOR SELECT USING (
  auth.uid() IN (SELECT id FROM public.admin_users)
);

DROP POLICY IF EXISTS "Admins can insert audit_logs" ON public.audit_logs;
CREATE POLICY "Admins can insert audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM public.admin_users)
);


-- ==========================================
-- 3. Footer Branches
-- ==========================================
CREATE TABLE IF NOT EXISTS public.footer_branches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  display_order int DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.footer_branches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view footer_branches" ON public.footer_branches;
CREATE POLICY "Public can view footer_branches" ON public.footer_branches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage footer_branches" ON public.footer_branches;
CREATE POLICY "Admins can manage footer_branches" ON public.footer_branches FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.admin_users)
);


-- ==========================================
-- 4. Site Settings
-- ==========================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site_settings" ON public.site_settings;
CREATE POLICY "Public can view site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage site_settings" ON public.site_settings;
CREATE POLICY "Admins can manage site_settings" ON public.site_settings FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.admin_users)
);

-- ==========================================
-- 5. Seed Initial Admin Access
-- ==========================================
-- This ensures that whoever is currently registered gets admin access automatically.
-- For production, you might want to remove this or only insert specific emails.
INSERT INTO public.admin_users (id, email, role)
SELECT id, email, 'Admin' FROM auth.users
ON CONFLICT (id) DO NOTHING;
