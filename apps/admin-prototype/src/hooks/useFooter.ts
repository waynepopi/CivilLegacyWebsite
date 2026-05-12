import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  display_order: number;
}

export function useFooter() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchBranches() {
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('footer_branches').select('*').order('display_order', { ascending: true });
      if (err) throw err;
      setBranches(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Fetch branches error:', err);
      setError(err.message || 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBranches();
  }, []);

  const addBranch = async (branch: Omit<Branch, 'id'>) => {
    try {
      const { data, error: err } = await supabase.from('footer_branches').insert([branch]).select().single();
      if (err) throw err;
      setBranches(prev => [...prev, data].sort((a, b) => a.display_order - b.display_order));
      return data;
    } catch (err: any) {
      console.error('Add branch error:', err);
      throw err;
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      const { error: err } = await supabase.from('footer_branches').delete().eq('id', id);
      if (err) throw err;
      setBranches(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      console.error('Delete branch error:', err);
      throw err;
    }
  };
  const updateBranch = async (id: string, updates: Partial<Omit<Branch, 'id'>>) => {
    try {
      const { data, error: err } = await supabase.from('footer_branches').update(updates).eq('id', id).select().single();
      if (err) throw err;
      setBranches(prev => prev.map(b => b.id === id ? data : b));
      return data;
    } catch (err: any) {
      console.error('Update branch error:', err);
      throw err;
    }
  };

  return { branches, loading, error, addBranch, updateBranch, deleteBranch, refresh: fetchBranches };
}
