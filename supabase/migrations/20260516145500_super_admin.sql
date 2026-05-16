-- ============================================================================
-- Add Super Admin capabilities
-- ============================================================================

-- 1. Add is_super_admin column
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS is_super_admin boolean NOT NULL DEFAULT false;

-- 2. Make the oldest admin a super admin by default so there is at least one
UPDATE public.admin_users
SET is_super_admin = true
WHERE id = (
  SELECT id FROM public.admin_users
  ORDER BY created_at ASC
  LIMIT 1
);

-- 3. Ensure admins can delete other admins (but not super admins)
-- Currently, there was no DELETE policy for admin_users, so deletions from the frontend would fail due to RLS.
CREATE POLICY "Admins can delete non-super admins"
ON public.admin_users FOR DELETE
USING (
  -- The user doing the deleting must be an admin
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  -- The user being deleted must NOT be a super admin
  AND is_super_admin = false
);
