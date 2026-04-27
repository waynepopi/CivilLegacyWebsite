import React, { useMemo, useRef } from 'react';
import { CheckCircle2, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReceiptPdf from '@/components/pdf/ReceiptPdf';
import { useCart } from '@/context/CartContext';
import { buildReceiptData } from '@/lib/receiptUtils';
import type { ReceiptData } from '@/lib/receiptUtils';

const BLUE = '#0077B6';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart, checkoutInfo, clearOrder } = useCart();

  // Capture the ref and amount from the URL (forwarded by MockGateway / Paynow)
  const ref = searchParams.get('ref');
  const amount = searchParams.get('amount');

  // Build the receipt data once and memoise so re-renders don't regenerate the receipt number
  const receiptData: ReceiptData | null = useMemo(() => {
    if (!checkoutInfo || cart.length === 0) {
      // Try to recover from sessionStorage directly (in case context was lost)
      try {
        const savedCheckout = sessionStorage.getItem('clc_checkout');
        const savedCart = sessionStorage.getItem('clc_cart');
        if (savedCheckout && savedCart) {
          const ci = JSON.parse(savedCheckout);
          const items = JSON.parse(savedCart);
          if (ci && items && items.length > 0) {
            return buildReceiptData({
              checkoutInfo: ci,
              cartItems: items,
              transactionRef: ref || undefined,
              amount: amount ? parseFloat(amount) : undefined,
            });
          }
        }
      } catch {
        // ignore parse errors
      }
      return null;
    }

    return buildReceiptData({
      checkoutInfo,
      cartItems: cart,
      transactionRef: ref || undefined,
      amount: amount ? parseFloat(amount) : undefined,
    });
  }, []); // Empty deps: compute once on mount

  // Clear the order after we've captured the receipt data
  const hasClearedRef = useRef(false);
  if (receiptData && !hasClearedRef.current) {
    hasClearedRef.current = true;
    // Use a microtask so we don't clear during render
    queueMicrotask(() => clearOrder());
  }

  return (
    <div className="pt-40 pb-32 min-h-screen text-center px-6">
      <Helmet>
        <title>Payment Success | Civil Legacy Consultancy</title>
      </Helmet>

      {/* Success icon */}
      <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10">
        <CheckCircle2 size={48} />
      </div>

      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
        Payment <span style={{ color: BLUE }}>Successful</span>
      </h2>

      <p className="text-gray-600 dark:text-gray-400 text-lg font-light max-w-xl mx-auto mb-12">
        Your transaction has been processed successfully. Download your official receipt below.
        Our team will contact you shortly to begin the service delivery.
      </p>

      {/* ── Receipt download ──────────────────────────────────────────────── */}
      {receiptData ? (
        <div className="max-w-md mx-auto mb-10">
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-8 mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">
              Receipt Details
            </p>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Receipt No.</span>
                <span className="text-sm font-bold">{receiptData.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-sm font-bold">{receiptData.dateIssued}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Paid</span>
                <span className="text-sm font-bold" style={{ color: BLUE }}>
                  ${receiptData.services
                    .reduce((sum, svc) => sum + svc.qty * svc.unitPrice, 0)
                    .toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {ref && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Transaction Ref</span>
                  <span className="text-sm font-bold">{ref}</span>
                </div>
              )}
            </div>
          </div>

          <PDFDownloadLink
            document={<ReceiptPdf data={receiptData} />}
            fileName={`${receiptData.receiptNo}.pdf`}
          >
            {({ loading }) => (
              <Button
                disabled={loading}
                className="w-full h-16 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3"
                style={{
                  background: loading
                    ? '#888'
                    : `linear-gradient(135deg, ${BLUE} 0%, #005f8f 100%)`,
                }}
              >
                <Download size={18} />
                {loading ? 'Generating PDF…' : 'Download Receipt (PDF)'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      ) : (
        <div className="max-w-md mx-auto mb-10 p-8 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl">
          <p className="text-sm text-gray-500">
            Receipt details are not available. If you just completed a payment, the page may have been refreshed.
            Please contact us at <strong>info@civillegacy.co.zw</strong> for a copy of your receipt.
          </p>
        </div>
      )}

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={() => navigate('/Home')}
          className="bg-white text-black px-10 h-14 font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all flex items-center gap-2 border border-black/10"
        >
          <ArrowLeft size={16} />
          Return Home
        </Button>
        <Button
          onClick={() => navigate('/Services')}
          variant="outline"
          className="px-10 h-14 font-black uppercase tracking-widest rounded-2xl transition-all"
        >
          Browse Services
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
