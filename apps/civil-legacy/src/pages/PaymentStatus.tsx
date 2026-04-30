import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, XCircle, Clock, AlertCircle, ArrowRight, Download, Home } from 'lucide-react';
import { getPaymentStatusByOrderId } from '@/services/orderService';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReceiptPdf from '@/components/pdf/ReceiptPdf';
import type { ReceiptData } from '@/lib/receiptUtils';
import { generateQrDataUrl, getVerificationUrl } from '@/lib/receiptUtils';
import { QRCodeCanvas } from 'qrcode.react';

const BLUE = '#0077B6';

const PaymentStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loadingReceipt, setLoadingReceipt] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    async function loadStatus() {
      if (!orderId) return;
      try {
        if (!data) setLoading(true);
        const statusData = await getPaymentStatusByOrderId(orderId);
        setData(statusData);
        
        // If it's already PAID and we have a receipt ID, format full receipt details for the PDF
        if (statusData.latestPayment?.status === 'PAID' && statusData.receipt?.receipt_number) {
          try {
            setLoadingReceipt(true);
            const r = statusData.receipt;
            const o = statusData.order;
            const p = statusData.latestPayment;
            const items = o.order_items || [];

            const fullReceipt: ReceiptData = {
              receiptNo: r.receipt_number,
              dateIssued: new Date(r.created_at).toLocaleDateString('en-GB'),
              paymentMethod: o.is_test ? 'Online Payment (Test)' : 'Online Payment (Paynow)',
              client: {
                name: o.customer_name,
                email: o.customer_email,
                phone: o.customer_phone || '',
              },
              services: items.map((item: any) => ({
                description: item.description,
                qty: item.qty,
                unitPrice: Number(item.unit_price),
              })),
              transaction: {
                id: p.id,
                gateway: p.gateway,
                currency: 'USD',
                status: p.status,
              },
              verification_code: r.verification_code,
              verification_status: r.verification_status,
              job_status: r.job_status,
            };

            // Generate QR Code for the PDF
            if (fullReceipt.verification_code) {
              const verifyUrl = getVerificationUrl(fullReceipt.verification_code);
              const qrDataUrl = await generateQrDataUrl(verifyUrl);
              fullReceipt.qrCodeImage = qrDataUrl;
              fullReceipt.qr_url = verifyUrl;
            }
            
            setReceiptData(fullReceipt);
          } catch (rErr) {
            console.error("Failed to map full receipt data:", rErr);
          } finally {
            setLoadingReceipt(false);
          }
        } else if (statusData.latestPayment?.status === 'PENDING') {
          // Poll every 5 seconds if pending
          timeoutId = setTimeout(loadStatus, 5000);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load payment status");
      } finally {
        setLoading(false);
      }
    }
    
    loadStatus();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="max-w-md w-full p-12 text-center rounded-[3rem]">
           <AlertCircle size={48} className="mx-auto mb-6 text-red-500" />
           <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Error</h2>
           <p className="text-gray-500 mb-8">{error || "Could not find your order."}</p>
           <Button onClick={() => navigate('/Services')} className="w-full h-14 rounded-2xl bg-black">Return to Services</Button>
        </Card>
      </div>
    );
  }

  const { order, latestPayment, receipt } = data;
  const status = latestPayment?.status || 'PENDING';

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f4f6] p-6 pt-32 pb-20">
      <Helmet>
        <title>Payment Status | Civil Legacy</title>
      </Helmet>
      
      <Card className="max-w-2xl w-full p-8 md:p-12 bg-white shadow-2xl rounded-[3rem] text-center border-none overflow-hidden relative">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600" />

        <div className="mb-10">
          {status === 'PAID' && (
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
          )}
          {status === 'FAILED' && (
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={40} />
            </div>
          )}
          {status === 'PENDING' && (
            <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="animate-pulse" />
            </div>
          )}
          {status === 'EXPIRED' && (
            <div className="w-20 h-20 bg-gray-500/10 text-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
            <span className="text-black">Payment</span> {status === 'PENDING' ? <span style={{ color: BLUE }}>Processing</span> : <span style={{ color: BLUE }}>{status.toLowerCase()}</span>}
          </h1>
          <p className="text-gray-500 font-medium">Order Reference: {order.order_number}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount Paid</p>
             <p className="text-2xl font-black text-black">${Number(order.total_amount).toLocaleString()}</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
             <p className="text-lg font-black text-black">{latestPayment?.gateway || 'Online Payment'}</p>
          </div>
        </div>

        <div className="space-y-6">
          {status === 'PENDING' && (
            <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 text-orange-800 text-sm font-medium">
              <p className="mb-2">Your payment is still being confirmed by the gateway.</p>
              <p>Please do not pay again yet. You can bookmark this page or return later to check the status.</p>
            </div>
          )}

          {status === 'PAID' && (
            <div className="space-y-6">
              {receiptData && receiptData.verification_code && (
                <div className="p-6 bg-blue-50 dark:bg-white/5 rounded-[2rem] border border-blue-100 dark:border-white/10 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                    <QRCodeCanvas 
                      value={getVerificationUrl(receiptData.verification_code)}
                      size={140}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Receipt Verification</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Scan to verify this document</p>
                </div>
              )}

              {receiptData ? (
                <PDFDownloadLink
                  document={<ReceiptPdf data={receiptData} />}
                  fileName={`${receiptData.receiptNo}.pdf`}
                  style={{ textDecoration: 'none' }}
                >
                  {({ loading: pdfLoading }) => (
                    <Button 
                      disabled={pdfLoading}
                      className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-600/20 gap-3"
                    >
                      <Download size={18} />
                      {pdfLoading ? 'Preparing PDF...' : 'Download Official Receipt'}
                    </Button>
                  )}
                </PDFDownloadLink>
              ) : (
                <Button 
                  disabled
                  className="w-full h-16 bg-gray-400 text-white font-black uppercase tracking-widest rounded-2xl gap-3"
                >
                  <Download size={18} className="animate-pulse" />
                  {loadingReceipt ? 'Fetching Receipt Data...' : 'Download Official Receipt'}
                </Button>
              )}
            </div>
          )}

          {status === 'FAILED' && (
            <div className="p-6 bg-red-50 rounded-3xl border border-red-100 text-red-800 text-sm font-medium">
              <p>The transaction was unsuccessful. Please try again or contact our support team if the problem persists.</p>
            </div>
          )}

          {status === 'EXPIRED' && (
            <div className="p-6 bg-gray-100 rounded-3xl border border-gray-200 text-gray-600 text-sm font-medium">
              <p>This payment request has expired. Please return to the services page to start a new order.</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <Button 
                onClick={() => navigate('/Home')}
                className="flex-1 h-14 bg-gray-100 text-black border border-black/10 font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all"
             >
                <Home size={16} className="mr-2" />
                Home
             </Button>
             <Button 
                onClick={() => navigate('/Services')}
                className="flex-1 h-14 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all"
             >
                Services
                <ArrowRight size={16} className="ml-2" />
             </Button>
          </div>
        </div>

        <p className="mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
          Civil Legacy Consultancy &copy; {new Date().getFullYear()}
        </p>
      </Card>
    </div>
  );
};

export default PaymentStatus;
