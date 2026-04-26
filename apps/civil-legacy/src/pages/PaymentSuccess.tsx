import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from"@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-48 pb-32  min-h-screen text-center px-6">
      <Helmet>
        <title>Payment Success | Civil Legacy Consultancy</title>
      </Helmet>
      <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-12">
        <ChevronRight size={48} className="rotate-270" />
      </div>
      <h2 className="text-5xl font-black  uppercase tracking-tighter mb-6">Payment Successful</h2>
      <p className="text-gray-600 dark:text-gray-400 text-xl font-light max-w-xl mx-auto mb-12">
        Your transaction has been processed successfully. Our team will contact you shortly to begin the service delivery.
      </p>
      <Button
         onClick={() => navigate('/Home')}
         className="bg-white text-black px-12 h-16 font-black uppercase tracking-widest rounded-2xl hover:bg-[#0077B6] hover: transition-all"
      >
        Return Home
      </Button>
    </div>
  );
};

export default PaymentSuccess;
