import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet-async';
import { markMockPaymentPaid, markMockPaymentFailed } from '@/services/orderService';
import { supabase } from '@/lib/supabaseClient';

const MockGateway = () => {
  const { orderId, paymentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadPayment() {
      if (!paymentId) return;
      const { data, error } = await supabase
        .from('payments')
        .select('status, amount')
        .eq('id', paymentId)
        .single();
        
      if (!error && data) {
        setStatus(data.status);
        setAmount(data.amount);
      }
    }
    loadPayment();
  }, [paymentId]);

  const handleSuccess = async () => {
    if (!orderId || !paymentId) return;
    try {
      setLoading(true);
      console.log("Simulating success", { orderId, paymentId });
      
      const result = await markMockPaymentPaid(orderId, paymentId);
      console.log("Success result", result);
      
      // Navigate to status page instead of direct receipt
      navigate(`/payment/status/${orderId}`);
    } catch (err: any) {
      console.error("Mock payment success failed:", err);
      setError(err.message || "Failed to process successful payment");
    } finally {
      setLoading(false);
    }
  };

  const handleFailure = async () => {
    if (!orderId || !paymentId) return;
    try {
      setLoading(true);
      console.log("Simulating failure", { orderId, paymentId });
      
      await markMockPaymentFailed(orderId, paymentId);
      navigate(`/payment/status/${orderId}`);
    } catch (err: any) {
      console.error("Mock payment failure failed:", err);
      setError(err.message || "Failed to process failed payment");
    } finally {
      setLoading(false);
    }
  };

  const handlePending = () => {
    if (!orderId) return;
    console.log("Simulating pending/return later", { orderId });
    // Just navigate back to the status page without updating anything
    // This simulates a user closing the browser or a stalled transaction
    navigate(`/payment/status/${orderId}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f4f6] p-6">
      <Helmet>
        <title>Mock Payment Gateway | Civil Legacy</title>
      </Helmet>
      <Card className="max-w-md w-full p-12 bg-white shadow-2xl rounded-[3rem] text-center border-none">
        <img src="/logo-full.png" alt="Civil Legacy" className="h-12 mx-auto mb-12" />
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-black">Paynow <span className="text-blue-600">Mock</span> Gateway</h2>
        <p className="text-gray-500 text-sm mb-8 font-medium">This is a simulation for testing the Paynow integration flow.</p>
        
        {status === 'PENDING' && (
           <p className="text-orange-500 font-bold mb-4">Your payment is still being confirmed. Please do not pay again yet.</p>
        )}

        {error && (
          <p className="text-red-500 font-bold mb-4">{error}</p>
        )}

        {paymentId && (
          <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">Transaction Ref</p>
            <p className="text-xs font-black text-black break-all">{paymentId}</p>
            {amount !== null && (
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                <p className="text-2xl font-black text-blue-600">${Number(amount).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleSuccess}
            disabled={loading || !paymentId}
            className="w-full h-16 bg-green-600 hover:bg-green-700 font-black uppercase tracking-widest rounded-2xl"
          >
            {loading ? 'Processing...' : 'Simulate Successful Payment'}
          </Button>
          <Button
            onClick={handleFailure}
            disabled={loading || !paymentId}
            className="w-full h-16 bg-red-600 hover:bg-red-700 font-black uppercase tracking-widest rounded-2xl"
          >
            {loading ? 'Processing...' : 'Simulate Failure'}
          </Button>
          <Button
            onClick={handlePending}
            disabled={loading || !paymentId}
            className="w-full h-16 bg-black hover:bg-gray-900 text-white font-black uppercase tracking-widest rounded-2xl"
          >
            Simulate Pending / Return Later
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MockGateway;
