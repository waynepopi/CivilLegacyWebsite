import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, XCircle, Clock, AlertCircle, Home, ShieldCheck, FileText, User, DollarSign, Calendar } from 'lucide-react';
import { getReceiptByVerificationCode } from '@/services/orderService';
import { format } from 'date-fns';

const BLUE = '#0077B6';

const VerifyReceipt = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function verify() {
      if (!code) return;
      try {
        setLoading(true);
        const receiptData = await getReceiptByVerificationCode(code);
        setData(receiptData);
      } catch (err: any) {
        setError(err.message || "Could not verify this receipt.");
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f3f4f6] dark:bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B6]"></div>
      </div>
    );
  }

  const isValid = data && data.verification_status === 'ACTIVE';
  const isCompleted = data && data.verification_status === 'COMPLETED';

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f4f6] dark:bg-[#0a0a0a] p-6 pt-32 pb-20">
      <Helmet>
        <title>Verify Receipt | Civil Legacy</title>
      </Helmet>
      
      <Card className="max-w-2xl w-full p-8 md:p-12 bg-white dark:bg-[#111] shadow-2xl rounded-[3rem] text-center border-none overflow-hidden relative">
        {/* Background Accent */}
        <div className={`absolute top-0 left-0 w-full h-2 ${isValid ? 'bg-green-500' : isCompleted ? 'bg-[#0077B6]' : 'bg-red-500'}`} />

        <div className="mb-10">
          {isValid && (
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} />
            </div>
          )}
          {isCompleted && (
            <div className="w-20 h-20 bg-[#0077B6]/10 text-[#0077B6] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
          )}
          {(!data || error) && (
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={40} />
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
            {isValid ? (
              <span className="text-green-500">Valid Receipt</span>
            ) : isCompleted ? (
              <span className="text-[#0077B6]">Already Used</span>
            ) : (
              <span className="text-red-500">Invalid Receipt</span>
            )}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest text-xs">
            Verification System v1.0
          </p>
        </div>

        {data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <FileText size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Receipt No.</p>
                </div>
                <p className="text-lg font-black text-black dark:text-white">{data.receipt_number}</p>
              </div>

              <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <DollarSign size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Total Amount</p>
                </div>
                <p className="text-lg font-black text-black dark:text-white">${Number(data.amount).toLocaleString()}</p>
              </div>

              <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <Calendar size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Date Issued</p>
                </div>
                <p className="text-lg font-black text-black dark:text-white">
                  {format(new Date(data.created_at), 'dd MMM yyyy, HH:mm')}
                </p>
              </div>
            </div>

            {data.items && data.items.length > 0 && (
              <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Purchased Services</p>
                <div className="space-y-4">
                  {data.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-200 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="font-medium text-black dark:text-white">
                        <span className="text-[#0077B6] mr-2">{item.qty}x</span>
                        {item.description}
                      </div>
                      <div className="font-black text-gray-800 dark:text-gray-200">
                        ${Number(item.unit_price * item.qty).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 text-left">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Status</p>
                <div className="flex gap-2">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${data.payment_status === 'PAID' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                     Payment: {data.payment_status}
                   </span>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${data.job_status === 'COMPLETED' ? 'bg-[#0077B6]/20 text-[#0077B6]' : 'bg-gray-500/20 text-gray-500'}`}>
                     Job: {data.job_status}
                   </span>
                </div>
              </div>
              {data.payment_gateway && (
                <p className="text-[10px] text-gray-400 mb-2">Method: {data.payment_gateway}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic">
                {isValid 
                  ? "This receipt is active and currently eligible for service delivery. Please ensure all details match the official document."
                  : isCompleted
                  ? "This receipt has already been processed and the job marked as completed. It cannot be used for new service requests."
                  : "This receipt is no longer active."}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-10 bg-red-50 dark:bg-red-500/5 rounded-3xl border border-red-100 dark:border-red-500/10 mb-8">
            <p className="text-red-800 dark:text-red-400 font-medium mb-2">No receipt found with this code.</p>
            <p className="text-red-600/60 dark:text-red-400/60 text-sm italic">Please check the URL or scan the QR code again.</p>
          </div>
        )}

        <div className="pt-6">
           <Button 
              onClick={() => navigate('/Home')}
              className="w-full h-16 bg-black dark:bg-white dark:text-black text-white font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all"
           >
              <Home size={18} className="mr-3" />
              Return to Website
           </Button>
        </div>

        <p className="mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
          Civil Legacy Consultancy &copy; {new Date().getFullYear()} • Secure Verification
        </p>
      </Card>
    </div>
  );
};

export default VerifyReceipt;
