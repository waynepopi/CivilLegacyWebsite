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
  const [customerPhone, setCustomerPhone] = useState<string | null>(null);
  const [scenario, setScenario] = useState<{ name: string; type: 'SUCCESS' | 'FAILED' | 'DELAYED_SUCCESS' | 'INSUFFICIENT' } | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [token, setToken] = useState("");
  
  useEffect(() => {
    async function loadPayment() {
      if (!paymentId) return;
      const { data, error } = await supabase
        .from('payments')
        .select('status, amount, order:orders(customer_phone)')
        .eq('id', paymentId)
        .single();
        
      if (!error && data) {
        setStatus(data.status);
        setAmount(data.amount);
        const phone = (data.order as any)?.customer_phone;
        setCustomerPhone(phone);
        
        // Detect scenarios based on phone
        if (phone === '0771111111') {
          setScenario({ name: 'Mobile Money Success', type: 'SUCCESS' });
          setCountdown(5);
        } else if (phone === '0772222222') {
          setScenario({ name: 'Mobile Money Delayed Success', type: 'DELAYED_SUCCESS' });
          setCountdown(30);
        } else if (phone === '0773333333') {
          setScenario({ name: 'Mobile Money User Cancelled', type: 'FAILED' });
          setCountdown(30);
        } else if (phone === '0774444444') {
          setScenario({ name: 'Mobile Money Insufficient Balance', type: 'INSUFFICIENT' });
          setError("Insufficient balance");
        }
      }
    }
    loadPayment();
  }, [paymentId]);

  // Handle countdown and auto-simulation
  useEffect(() => {
    if (countdown === null || countdown < 0 || !scenario) return;
    
    if (countdown === 0) {
      if (scenario.type === 'SUCCESS' || scenario.type === 'DELAYED_SUCCESS') {
        handleSuccess();
      } else if (scenario.type === 'FAILED') {
        handleFailure();
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, scenario]);

  // Handle Token simulation
  const handleTokenSimulation = (val: string) => {
    setToken(val);
    const inputVal = val.trim();
    
    const vmcSuccess = '{11111111-1111-1111-1111-111111111111}';
    const zimSuccess = '11111111111111111111111111111111';
    const vmcDelayed = '{22222222-2222-2222-2222-222222222222}';
    const zimDelayed = '22222222222222222222222222222222';
    const vmcCancelled = '{33333333-3333-3333-3333-333333333333}';
    const zimCancelled = '33333333333333333333333333333333';
    const vmcInsufficient = '{44444444-4444-4444-4444-444444444444}';
    const zimInsufficient = '44444444444444444444444444444444';

    console.log("Checking token:", inputVal);

    if (inputVal === vmcSuccess || inputVal === zimSuccess) {
      setScenario({ name: 'Token Success', type: 'SUCCESS' });
      setCountdown(5);
    } else if (inputVal === vmcDelayed || inputVal === zimDelayed) {
      setScenario({ name: 'Token Delayed Success', type: 'DELAYED_SUCCESS' });
      setCountdown(30);
    } else if (inputVal === vmcCancelled || inputVal === zimCancelled) {
      setScenario({ name: 'Token Cancelled', type: 'FAILED' });
      setCountdown(30);
    } else if (inputVal === vmcInsufficient || inputVal === zimInsufficient) {
      setScenario({ name: 'Token Insufficient Balance', type: 'INSUFFICIENT' });
      setError("Insufficient balance");
    } else {
      setScenario(null);
      setCountdown(null);
      if (error === "Insufficient balance") setError(null);
    }
  };

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

        {scenario && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl animate-pulse">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Test Scenario Detected</p>
            <p className="text-sm font-black text-blue-900">{scenario.name}</p>
            {countdown !== null && countdown > 0 && (
              <p className="text-xs font-bold text-blue-500 mt-2">Processing in {countdown}s...</p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div className="mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-left px-2">Simulate Token (VMC/Zimswitch)</p>
            <input 
              type="text" 
              placeholder="Paste test token here..." 
              value={token}
              onChange={(e) => handleTokenSimulation(e.target.value)}
              className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-xs font-medium text-black placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <Button
            onClick={handleSuccess}
            disabled={loading || !paymentId || scenario?.type === 'INSUFFICIENT'}
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
