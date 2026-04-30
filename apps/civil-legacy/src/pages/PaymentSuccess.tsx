import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReceiptPdf from '@/components/pdf/ReceiptPdf';
import { useCart } from '@/context/CartContext';
import { getReceiptData } from '@/services/orderService';
import type { ReceiptData } from '@/lib/receiptUtils';
import { getVerificationUrl } from '@/lib/receiptUtils';
import { QRCodeCanvas } from 'qrcode.react';

const BLUE = '#0077B6';

const ReceiptPage = () => {
  const navigate = useNavigate();
  const { receiptId } = useParams();
  const { clearOrder } = useCart();
  
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!receiptId) return;
      try {
        setLoading(true);
        const data = await getReceiptData(receiptId);
        setReceiptData(data);
        // Small delay to ensure page settling before PDF generation starts
        setTimeout(() => setShowDownload(true), 1000);
      } catch (err: any) {
        setError(err.message || 'Failed to load receipt');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [receiptId]);

  // Clear the order after we've loaded the receipt data successfully
  const hasClearedRef = useRef(false);
  useEffect(() => {
    if (receiptData && !hasClearedRef.current) {
      hasClearedRef.current = true;
      queueMicrotask(() => clearOrder());
    }
  }, [receiptData, clearOrder]);

  if (loading) {
    return (
      <div className="pt-40 pb-32 min-h-screen text-center px-6">
        <h2 className="text-2xl font-bold">Loading Receipt...</h2>
      </div>
    );
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
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Transaction Ref</span>
                <span className="text-sm font-bold">{receiptData.transaction.id}</span>
              </div>
            </div>
          </div>

          {/* Visible QR Code */}
          {receiptData.verification_code && (
            <div className="mb-8 p-6 bg-blue-50 dark:bg-white/5 rounded-3xl border border-blue-100 dark:border-white/10 flex flex-col items-center">
              <div className="bg-white p-3 rounded-2xl shadow-sm mb-3">
                <QRCodeCanvas 
                  value={getVerificationUrl(receiptData.verification_code)}
                  size={120}
                  level="H"
                />
              </div>
              <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Scan to Verify Receipt</p>
            </div>
          )}

          {showDownload ? (
            <PDFDownloadLink
              document={<ReceiptPdf data={receiptData} />}
              fileName={`${receiptData.receiptNo}.pdf`}
              key={receiptData.receiptNo}
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
                  {loading ? 'Preparing PDF…' : 'Download Receipt (PDF)'}
                </Button>
              )}
            </PDFDownloadLink>
          ) : (
            <Button
              disabled
              className="w-full h-16 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 opacity-50"
              style={{ background: '#888' }}
            >
              <Download size={18} className="animate-pulse" />
              Initializing Download...
            </Button>
          )}
        </div>
      ) : (
        <div className="max-w-md mx-auto mb-10 p-8 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl">
          <p className="text-sm text-gray-500">
            {error || "Receipt details are not available. Please contact us at info@civillegacy.co.zw for a copy of your receipt."}
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

export default ReceiptPage;
