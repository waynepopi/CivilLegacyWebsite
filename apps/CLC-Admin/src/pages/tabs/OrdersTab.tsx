import React, { useState } from 'react';
import { useOrders, Receipt } from '../../hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader2, AlertCircle, ShoppingCart, Search, Receipt as ReceiptIcon, DollarSign, CheckCircle2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '../../components/ui/dialog';

const STATUS_COLORS: Record<string, string> = {
  'PENDING': 'bg-yellow-900/30 text-yellow-400 border-yellow-800/50',
  'COMPLETED': 'bg-green-900/30 text-green-400 border-green-800/50',
  'CANCELLED': 'bg-red-900/30 text-red-400 border-red-800/50',
};

const badge = (status: string) =>
  `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[status] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`;

export default function OrdersTab() {
  const { receipts, loading, error, updateJobStatus } = useOrders();
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const filtered = receipts.filter(r => {
    const order = Array.isArray(r.order) ? r.order[0] : r.order;
    const searchLower = search.toLowerCase();
    return (
      r.receipt_number.toLowerCase().includes(searchLower) ||
      (order?.customer_name && order.customer_name.toLowerCase().includes(searchLower)) ||
      (order?.customer_email && order.customer_email.toLowerCase().includes(searchLower))
    );
  });

  const openDetails = (r: Receipt) => {
    setSelectedReceipt(r);
    setNewStatus(r.job_status || 'PENDING');
  };

  const handleUpdateStatus = async () => {
    if (!selectedReceipt) return;
    setStatusSaving(true);
    try {
      await updateJobStatus(selectedReceipt.id, newStatus);
      setSelectedReceipt({ ...selectedReceipt, job_status: newStatus });
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setStatusSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-[#0077B6]" /> Orders & Receipts
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Manage customer orders, view payments, and update job fulfillment statuses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search by name, email, or receipt #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-72 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#0077B6]"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-400 text-sm p-4 bg-red-950/20 rounded-lg border border-red-900/30">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <ReceiptIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>{search ? 'No orders match your search.' : 'No orders have been placed yet.'}</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/80 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Receipt / Date</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 font-medium">Job Status</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map(r => {
                  const order = Array.isArray(r.order) ? r.order[0] : r.order;
                  const payment = Array.isArray(r.payment) ? r.payment[0] : r.payment;
                  const date = new Date(r.created_at).toLocaleDateString('en-GB');

                  return (
                    <tr key={r.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-100">{r.receipt_number}</div>
                        <div className="text-zinc-500 text-xs mt-0.5">{date}</div>
                        {r.is_test && <span className="text-[10px] text-orange-400 font-bold uppercase mt-1 block">Test Order</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-200">{order?.customer_name || 'N/A'}</div>
                        <div className="text-zinc-500 text-xs mt-0.5">{order?.customer_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-emerald-400 flex items-center">
                          <DollarSign className="h-3.5 w-3.5 mr-0.5" />
                          {order?.total_amount ? Number(order.total_amount).toFixed(2) : '0.00'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${payment?.status === 'PAID' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                          {payment?.status || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={badge(r.job_status || 'PENDING')}>{r.job_status || 'PENDING'}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openDetails(r)} className="text-[#0077B6] hover:text-[#005f8e] hover:bg-[#0077B6]/10">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={!!selectedReceipt} onOpenChange={(o) => !o && setSelectedReceipt(null)}>
        {selectedReceipt && (() => {
          const r = selectedReceipt;
          const order = Array.isArray(r.order) ? r.order[0] : r.order;
          const payment = Array.isArray(r.payment) ? r.payment[0] : r.payment;
          const items = order?.order_items || [];

          return (
            <DialogContent className="bg-zinc-900 border-zinc-700 text-zinc-100 max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  Receipt {r.receipt_number}
                  {r.is_test && <span className="text-xs bg-orange-900/40 text-orange-400 px-2 py-0.5 rounded border border-orange-800">TEST</span>}
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Placed on {new Date(r.created_at).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-6 py-4 border-b border-zinc-800">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Customer Details</h4>
                  <p className="text-sm font-medium text-white">{order?.customer_name}</p>
                  <p className="text-sm text-zinc-400">{order?.customer_email}</p>
                  <p className="text-sm text-zinc-400">{order?.customer_phone}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Payment Info</h4>
                  <p className="text-sm text-zinc-300">Gateway: <span className="font-medium text-white">{payment?.gateway || 'N/A'}</span></p>
                  <p className="text-sm text-zinc-300">Status: <span className={`font-bold ${payment?.status === 'PAID' ? 'text-emerald-400' : 'text-zinc-400'}`}>{payment?.status}</span></p>
                  <p className="text-sm text-zinc-300">Verification: <span className="font-mono text-xs bg-zinc-800 px-1 rounded">{r.verification_code}</span></p>
                </div>
              </div>

              <div className="py-4 border-b border-zinc-800">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Order Items</h4>
                <div className="space-y-3">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex gap-3">
                        <span className="text-zinc-500">{item.qty}x</span>
                        <span className="text-zinc-200">{item.description}</span>
                      </div>
                      <span className="font-medium text-white">${Number(item.unit_price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-bold pt-3 border-t border-zinc-800/50 mt-2">
                    <span className="text-zinc-400">Total Amount</span>
                    <span className="text-emerald-400">${Number(order?.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="py-4">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Fulfillment Status</h4>
                <div className="flex items-center gap-3">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-[#0077B6] focus:outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <Button 
                    onClick={handleUpdateStatus} 
                    disabled={statusSaving || newStatus === r.job_status}
                    className="bg-[#0077B6] hover:bg-[#005f8e] text-white whitespace-nowrap"
                  >
                    {statusSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="h-4 w-4 mr-2" /> Update Status</>}
                  </Button>
                </div>
              </div>

            </DialogContent>
          );
        })()}
      </Dialog>
    </div>
  );
}
