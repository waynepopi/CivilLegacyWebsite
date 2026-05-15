-- ============================================================================
-- Payment Provider Layer + Security Cleanup
-- ============================================================================
-- Adds simulation_token and payment_provider columns, creates a public-safe
-- status view, and removes all legacy over-permissive policies that were
-- introduced by supabase-cms.sql, temp-policy.sql, and
-- supabase-admin-enhancements.sql.
-- ============================================================================

-- 1. Add provider and environment columns to payments
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS simulation_token TEXT,
  ADD COLUMN IF NOT EXISTS payment_provider TEXT NOT NULL DEFAULT 'mock',
  ADD COLUMN IF NOT EXISTS environment TEXT NOT NULL DEFAULT 'test';

-- 2. Drop the legacy over-permissive "any authenticated user = admin" policies
--    (created by supabase-cms.sql lines 53-60)
DROP POLICY IF EXISTS "Allow admin full access to scrolling_images" ON public.scrolling_images;
DROP POLICY IF EXISTS "Allow admin full access to team_members" ON public.team_members;
DROP POLICY IF EXISTS "Allow admin full access to projects" ON public.projects;

-- 3. Re-create those policies scoped to the admin_users allowlist
--    (idempotent with the phase2_security migration; safe to run again)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'scrolling_images'
      AND policyname = 'Allow admin_users full access to scrolling_images'
  ) THEN
    CREATE POLICY "Allow admin_users full access to scrolling_images"
    ON public.scrolling_images FOR ALL
    USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'team_members'
      AND policyname = 'Allow admin_users full access to team_members'
  ) THEN
    CREATE POLICY "Allow admin_users full access to team_members"
    ON public.team_members FOR ALL
    USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'projects'
      AND policyname = 'Allow admin_users full access to projects'
  ) THEN
    CREATE POLICY "Allow admin_users full access to projects"
    ON public.projects FOR ALL
    USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));
  END IF;
END $$;

-- 4. Drop legacy anon storage policies (created by temp-policy.sql)
DROP POLICY IF EXISTS "Temp Anon Uploads to site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Temp Anon Update to site-assets" ON storage.objects;

-- 5. Create a public-safe payment status view (no customer PII)
--    This replaces direct frontend queries to orders/payments tables.
CREATE OR REPLACE VIEW public.public_payment_status AS
SELECT
  p.id           AS payment_id,
  p.status       AS payment_status,
  p.amount,
  p.currency,
  p.gateway,
  p.is_test,
  p.payment_provider,
  o.id           AS order_id,
  o.status       AS order_status,
  o.order_number
FROM public.payments p
JOIN public.orders o ON p.order_id = o.id;

-- Grant public read on the safe view (no sensitive fields exposed)
GRANT SELECT ON public.public_payment_status TO anon, authenticated;

-- 6. Fix the admin_users SELECT policy
--    The original policy allowed ANY authenticated user to read admin_users.
--    The phase2_security migration introduced "Allow public read access to admin_users"
--    (USING true, TO public) which is needed for the frontend auth check.
--    We keep that one and just ensure no broader write access exists.
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
