import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: any;
  created_at: string;
}

export function useMetrics() {
  const [counts, setCounts] = useState({
    orders: 0,
    projects: 0,
    services: 0,
    team: 0,
  });
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [
          { count: ordersCount },
          { count: projectsCount },
          { count: servicesCount },
          { count: teamCount },
          { data: auditLogs }
        ] = await Promise.all([
          supabase.from('receipts').select('*', { count: 'exact', head: true }),
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('services').select('*', { count: 'exact', head: true }),
          supabase.from('team_members').select('*', { count: 'exact', head: true }),
          supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50)
        ]);

        setCounts({
          orders: ordersCount || 0,
          projects: projectsCount || 0,
          services: servicesCount || 0,
          team: teamCount || 0,
        });
        
        setLogs(auditLogs || []);
      } catch (err) {
        console.error('Failed to fetch metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return { counts, logs, loading };
}
