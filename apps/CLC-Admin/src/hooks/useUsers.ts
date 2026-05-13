import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { logAdminAction } from '../lib/auditLogger';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export function useUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getEmail = async () => (await supabase.auth.getSession()).data.session?.user.email || 'unknown';

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false });
      if (err) throw err;
      setUsers(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Fetch users error:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const removeUser = async (id: string) => {
    try {
      const { error: err } = await supabase.from('admin_users').delete().eq('id', id);
      if (err) throw err;
      await logAdminAction(await getEmail(), 'DELETE', 'admin_users', id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      console.error('Delete user error:', err);
      throw err;
    }
  };

  return { users, loading, error, removeUser, refresh: fetchUsers };
}
