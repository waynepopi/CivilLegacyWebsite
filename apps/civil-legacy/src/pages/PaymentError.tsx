import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PaymentError = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-48 pb-32 bg-black min-h-screen text-center px-6">
      <Helmet>
        <title>Payment Failed | Civil Legacy Consultancy</title>
      </Helmet>
      <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-12">
        <X size={48} />
      </div>
      <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">Payment Failed</h2>
      <p className="text-gray-400 text-xl font-light max-w-xl mx-auto mb-12">
        We couldn't process your payment. Please check your credentials and try again, or contact support if the issue persists.
      </p>
      <Button
         onClick={() => navigate('/Services')}
         className="bg-[#0077B6] text-white px-12 h-16 font-black uppercase tracking-widest rounded-2xl"
      >
        Return to Store
      </Button>
    </div>
  );
};

export default PaymentError;
