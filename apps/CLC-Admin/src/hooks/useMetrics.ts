import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  subMonths, format, eachHourOfInterval, eachDayOfInterval,
  eachMonthOfInterval, isAfter, isBefore, differenceInMonths, endOfHour,
} from 'date-fns';

export interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: any;
  created_at: string;
}

export interface RevenuePoint {
  label: string;
  startDate: string;
  endDate: string;
  revenue: number | null;
  orders: number | null;
  successfulCheckouts: number | null;
  averageOrderValue: number | null;
  isFuture?: boolean;
}

export interface SalesMetrics {
  totalRevenue: number;
  orderCount: number;
  paidOrders: number;
  pendingOrders: number;
  failedOrders: number;
  avgOrderValue: number;
  topServices: { name: string; count: number; revenue: number }[];
  chartData: RevenuePoint[];
  recentOrders: any[];
}

export type DateFilter = 'today' | 'week' | 'month' | 'lastMonth' | 'allTime' | 'custom';

export function useMetrics() {
  const [counts, setCounts] = useState({ orders: 0, projects: 0, services: 0, team: 0 });
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [salesMetrics, setSalesMetrics] = useState<SalesMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [customRange, setCustomRange] = useState<{ start: Date; end: Date } | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const [
        { count: receiptsCount },
        { count: projectsCount },
        { count: servicesCount },
        { count: teamCount },
        { data: auditLogs },
      ] = await Promise.all([
        supabase.from('receipts').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('team_members').select('*', { count: 'exact', head: true }),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20),
      ]);

      setCounts({ orders: receiptsCount || 0, projects: projectsCount || 0, services: servicesCount || 0, team: teamCount || 0 });
      setLogs(auditLogs || []);

      const now = new Date();
      let filterStart: Date | null = null;
      let filterEnd: Date | null = now;

      switch (dateFilter) {
        case 'today':
          filterStart = startOfDay(now);
          filterEnd = endOfDay(now);
          break;
        case 'week':
          filterStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
          filterEnd = endOfWeek(now, { weekStartsOn: 1 });
          break;
        case 'month':
          filterStart = startOfMonth(now);
          filterEnd = endOfMonth(now);
          break;
        case 'lastMonth':
          const lm = subMonths(now, 1);
          filterStart = startOfMonth(lm);
          filterEnd = endOfMonth(lm);
          break;
        case 'allTime':
          filterStart = null;
          filterEnd = null;
          break;
        case 'custom':
          filterStart = customRange?.start || startOfMonth(now);
          filterEnd = customRange?.end || now;
          break;
        default:
          filterStart = startOfMonth(now);
      }

      let query = supabase
        .from('orders')
        .select(`*, payments (*), order_items (*)`)
        .order('created_at', { ascending: true });

      if (filterStart) query = query.gte('created_at', filterStart.toISOString());
      if (filterEnd)   query = query.lte('created_at', filterEnd.toISOString());

      const { data: orders, error: ordersErr } = await query;
      if (ordersErr) throw ordersErr;

      let totalRevenue = 0, paidCount = 0, pendingCount = 0, failedCount = 0;
      const serviceMap = new Map<string, { count: number; revenue: number }>();

      // Global totals
      orders?.forEach(order => {
        const payment = order.payments?.[0];
        const status = payment?.status || 'PENDING';
        const amt = Number(order.total_amount || 0);

        if (status === 'PAID') {
          paidCount++;
          totalRevenue += amt;
          order.order_items?.forEach((item: any) => {
            const ex = serviceMap.get(item.description) || { count: 0, revenue: 0 };
            serviceMap.set(item.description, {
              count: ex.count + (item.qty || 1),
              revenue: ex.revenue + Number(item.unit_price || 0) * (item.qty || 1)
            });
          });
        } else if (status === 'FAILED') {
          failedCount++;
        } else {
          pendingCount++;
        }
      });

      const topServices = Array.from(serviceMap.entries())
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // ── Timeline Generation ──────────────────────────────────────────────────
      let timeline: RevenuePoint[] = [];

      const processBucket = (s: Date, e: Date, labelFmt: string): RevenuePoint => {
        const isFuture = isAfter(s, now);
        if (isFuture) {
          return {
            label: format(s, labelFmt),
            startDate: s.toISOString(),
            endDate: e.toISOString(),
            revenue: null,
            orders: null,
            successfulCheckouts: null,
            averageOrderValue: null,
            isFuture
          };
        }

        const bucketOrders = orders?.filter(o => {
          const d = new Date(o.created_at);
          return (d >= s && d <= e);
        }) || [];

        const paid = bucketOrders.filter(o => o.payments?.[0]?.status === 'PAID');
        const rev = paid.reduce((acc, o) => acc + Number(o.total_amount || 0), 0);

        return {
          label: format(s, labelFmt),
          startDate: s.toISOString(),
          endDate: e.toISOString(),
          revenue: rev,
          orders: bucketOrders.length,
          successfulCheckouts: paid.length,
          averageOrderValue: (paid.length > 0 ? rev / paid.length : 0),
          isFuture
        };
      };

      if (dateFilter === 'today') {
        const hours = eachHourOfInterval({ start: startOfDay(now), end: endOfDay(now) });
        timeline = hours.map(h => processBucket(h, endOfHour(h), 'HH:00'));
      } else if (dateFilter === 'week' || dateFilter === 'month' || dateFilter === 'lastMonth' || dateFilter === 'custom') {
        const start = filterStart || startOfMonth(now);
        const end = filterEnd || endOfMonth(now);
        const days = eachDayOfInterval({ start, end });
        timeline = days.map(day => processBucket(startOfDay(day), endOfDay(day), 'MMM d'));
      } else if (dateFilter === 'allTime') {
        let firstOrderDate = orders && orders.length > 0 ? new Date(orders[0].created_at) : now;
        const start = startOfMonth(firstOrderDate);
        const end = endOfMonth(now);
        const monthsDiff = differenceInMonths(end, start);

        if (monthsDiff < 3) {
          const days = eachDayOfInterval({ start, end });
          timeline = days.map(day => processBucket(startOfDay(day), endOfDay(day), 'MMM d'));
        } else {
          const months = eachMonthOfInterval({ start, end });
          timeline = months.map(m => processBucket(startOfMonth(m), endOfMonth(m), 'MMM yyyy'));
        }
      }

      setSalesMetrics({
        totalRevenue,
        orderCount: orders?.length || 0,
        paidOrders: paidCount,
        pendingOrders: pendingCount,
        failedOrders: failedCount,
        avgOrderValue: paidCount > 0 ? totalRevenue / paidCount : 0,
        topServices,
        chartData: timeline,
        recentOrders: [...(orders || [])].reverse().slice(0, 10),
      });
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, customRange]);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  return { counts, logs, salesMetrics, loading, dateFilter, setDateFilter, setCustomRange, refresh: fetchMetrics };
}
