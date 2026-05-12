import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface OrderItem {
  id: string;
  order_id: string;
  service_id: string;
  description: string;
  qty: number;
  unit_price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  created_at: string;
  order_items: OrderItem[];
}

export interface Payment {
  id: string;
  gateway: string;
  status: string;
  created_at: string;
}

export interface Receipt {
  id: string;
  receipt_number: string;
  verification_code: string;
  verification_status: string;
  job_status: string;
  is_test: boolean;
  created_at: string;
  order: Order | Order[]; // Supabase joins can sometimes return arrays
  payment: Payment | Payment[];
}

export function useOrders() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch receipts with their associated order (and items) and payment
      const { data, error: err } = await supabase
        .from('receipts')
        .select(`
          *,
          order:orders(
            *,
            order_items(*)
          ),
          payment:payments(*)
        `)
        .order('created_at', { ascending: false });

      if (err) throw err;
      setReceipts(data as Receipt[]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateJobStatus = async (receiptId: string, newStatus: string) => {
    const { error } = await supabase
      .from('receipts')
      .update({ job_status: newStatus })
      .eq('id', receiptId);

    if (error) throw error;
    await fetchOrders();
  };

  return { receipts, loading, error, updateJobStatus, refresh: fetchOrders };
}
