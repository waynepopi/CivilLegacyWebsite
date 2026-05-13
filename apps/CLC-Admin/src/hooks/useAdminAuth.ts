import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../App';

export function useAdminAuth() {
  const { session } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminError, setAdminError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      if (!session?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Admin check error:", error);
          setAdminError(error.message);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
          if (!data) setAdminError("User ID not found in admin_users table");
        }
      } catch (err: any) {
        console.error("Admin check failed:", err);
        setAdminError(err.message || String(err));
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [session]);

  return { isAdmin, loading, adminError };
}
