import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';

export interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: any;
  created_at: string;
}

export interface SalesMetrics {
  totalRevenue: number;
  orderCount: number;
  paidOrders: number;
  pendingOrders: number;
  failedOrders: number;
  avgOrderValue: number;
  topServices: { name: string; count: number; revenue: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  recentOrders: any[];
}

export type DateFilter = 'today' | 'week' | 'month' | 'lastMonth' | 'allTime' | 'custom';

export function useMetrics() {
  const [counts, setCounts] = useState({
    orders: 0,
    projects: 0,
    services: 0,
    team: 0,
  });
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [customRange, setCustomRange] = useState<{ start: Date; end: Date } | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch counts and logs (already existing)
      const [
        { count: receiptsCount },
        { count: projectsCount },
        { count: servicesCount },
        { count: teamCount },
        { data: auditLogs }
      ] = await Promise.all([
        supabase.from('receipts').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('team_members').select('*', { count: 'exact', head: true }),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20)
      ]);

      setCounts({
        orders: receiptsCount || 0,
        projects: projectsCount || 0,
        services: servicesCount || 0,
        team: teamCount || 0,
      });
      setLogs(auditLogs || []);

      // 2. Determine date range for sales data
      let start: Date | null = null;
      let end: Date | null = new Date();

      switch (dateFilter) {
        case 'today':
          start = startOfDay(new Date());
          end = endOfDay(new Date());
          break;
        case 'week':
          start = startOfWeek(new Date());
          break;
        case 'month':
          start = startOfMonth(new Date());
          break;
        case 'lastMonth':
          start = startOfMonth(subMonths(new Date(), 1));
          end = endOfMonth(subMonths(new Date(), 1));
          break;
        case 'allTime':
          start = null; // null means no lower bound
          end = null;   // null means no upper bound
          break;
        case 'custom':
          start = customRange?.start || startOfMonth(new Date());
          end = customRange?.end || new Date();
          break;
        default:
          start = startOfMonth(new Date());
      }

      // 3. Fetch orders, payments, and order_items for the range
      let query = supabase
        .from('orders')
        .select(`
          *,
          payments (*),
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (start) {
        query = query.gte('created_at', start.toISOString());
      }
      if (end) {
        query = query.lte('created_at', end.toISOString());
      }

      const { data: orders, error: ordersErr } = await query;

      if (ordersErr) throw ordersErr;

      // 4. Calculate Sales Metrics
      let totalRevenue = 0;
      let paidCount = 0;
      let pendingCount = 0;
      let failedCount = 0;
      const serviceMap = new Map<string, { count: number; revenue: number }>();
      const monthlyRevenueMap = new Map<string, number>();

      orders?.forEach(order => {
        const payment = order.payments?.[0]; // Assuming one main payment record per order
        const status = payment?.status || 'PENDING';

        if (status === 'PAID') {
          paidCount++;
          totalRevenue += Number(order.total_amount || 0);

          // Top services calculation
          order.order_items?.forEach((item: any) => {
            const existing = serviceMap.get(item.description) || { count: 0, revenue: 0 };
            serviceMap.set(item.description, {
              count: existing.count + (item.qty || 1),
              revenue: existing.revenue + Number(item.unit_price || 0) * (item.qty || 1)
            });
          });
        } else if (status === 'FAILED') {
          failedCount++;
        } else {
          pendingCount++;
        }

        // Monthly revenue breakdown
        const monthYear = new Date(order.created_at).toLocaleString('en-US', { month: 'short', year: 'numeric' });
        if (status === 'PAID') {
          monthlyRevenueMap.set(monthYear, (monthlyRevenueMap.get(monthYear) || 0) + Number(order.total_amount || 0));
        }
      });

      const topServices = Array.from(serviceMap.entries())
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const revenueByMonth = Array.from(monthlyRevenueMap.entries())
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      setSalesMetrics({
        totalRevenue,
        orderCount: orders?.length || 0,
        paidOrders: paidCount,
        pendingOrders: pendingCount,
        failedOrders: failedCount,
        avgOrderValue: paidCount > 0 ? totalRevenue / paidCount : 0,
        topServices,
        revenueByMonth,
        recentOrders: orders?.slice(0, 10) || []
      });

    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, customRange]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { 
    counts, 
    logs, 
    salesMetrics, 
    loading, 
    dateFilter, 
    setDateFilter, 
    setCustomRange,
    refresh: fetchMetrics 
  };
}
