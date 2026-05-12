import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface ServiceCategory {
  id: string;
  title: string;
  summary: string;
  icon_name: string;
  created_at?: string;
}

export interface Service {
  id: string;
  category_id: string;
  title: string;
  summary: string;
  details: string[];
  price: number | null;
  icon_name: string;
  created_at?: string;
}

export function useServices() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, servRes] = await Promise.all([
        supabase.from('service_categories').select('*').order('created_at', { ascending: true }),
        supabase.from('services').select('*').order('created_at', { ascending: true })
      ]);

      if (catRes.error) throw catRes.error;
      if (servRes.error) throw servRes.error;

      setCategories(catRes.data as ServiceCategory[]);
      setServices(servRes.data as Service[]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Categories CRUD
  const addCategory = async (cat: Omit<ServiceCategory, 'id' | 'created_at'>) => {
    const newId = crypto.randomUUID();
    const { error } = await supabase.from('service_categories').insert([{ id: newId, ...cat }]);
    if (error) throw error;
    await fetchData();
  };

  const updateCategory = async (id: string, updates: Partial<Omit<ServiceCategory, 'id' | 'created_at'>>) => {
    const { error } = await supabase.from('service_categories').update(updates).eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('service_categories').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  // Services CRUD
  const addService = async (service: Omit<Service, 'id' | 'created_at'>) => {
    const newId = crypto.randomUUID();
    const { error } = await supabase.from('services').insert([{ id: newId, ...service }]);
    if (error) throw error;
    await fetchData();
  };

  const updateService = async (id: string, updates: Partial<Omit<Service, 'id' | 'created_at'>>) => {
    const { error } = await supabase.from('services').update(updates).eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
    await fetchData();
  };

  return {
    categories,
    services,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addService,
    updateService,
    deleteService,
    refresh: fetchData,
  };
}
