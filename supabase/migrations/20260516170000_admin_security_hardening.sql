-- ============================================================================
-- Admin security hardening
-- ============================================================================
-- Keep the existing admin dashboard flow, but stop exposing the admin allowlist
-- publicly and restrict administrator management to super admins.
-- ============================================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_user_is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.id = auth.uid()
      AND au.is_super_admin = true
  );
$$;

REVOKE ALL ON FUNCTION public.current_user_is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_user_is_super_admin() TO authenticated, service_role;

DROP POLICY IF EXISTS "Allow public read access to admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can delete non-super admins" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can read own admin row" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can delete non-super admins" ON public.admin_users;

REVOKE ALL ON public.admin_users FROM anon;
REVOKE ALL ON public.admin_users FROM PUBLIC;
GRANT SELECT, DELETE ON public.admin_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO service_role;

CREATE POLICY "Admin users can read own admin row"
ON public.admin_users
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Super admins can read admin_users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.current_user_is_super_admin());

CREATE POLICY "Super admins can delete non-super admins"
ON public.admin_users
FOR DELETE
TO authenticated
USING (
  public.current_user_is_super_admin()
  AND is_super_admin = false
);
