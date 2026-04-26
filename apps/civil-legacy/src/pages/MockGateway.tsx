import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Helmet } from 'react-helmet-async';

const MockGateway = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const ref = searchParams.get('ref');
  const amount = searchParams.get('amount');

  const simulate = (type: 'success' | 'error') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(type === 'success' ? '/payment/success' : '/payment/error');
    }, 1500);
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
        
        {ref && (
          <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">Transaction Ref</p>
            <p className="text-lg font-black text-black">{ref}</p>
            {amount && (
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                <p className="text-2xl font-black text-blue-600">${parseFloat(amount).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={() => simulate('success')}
            disabled={loading}
            className="w-full h-16 bg-green-600 hover:bg-green-700  font-black uppercase tracking-widest rounded-2xl"
          >
            {loading ? 'Processing...' : 'Simulate Successful Payment'}
          </Button>
          <Button
            onClick={() => simulate('error')}
            disabled={loading}
            className="w-full h-16 bg-red-600 hover:bg-red-700  font-black uppercase tracking-widest rounded-2xl"
          >
            {loading ? 'Processing...' : 'Simulate Failure'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MockGateway;
