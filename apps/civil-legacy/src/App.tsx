import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { RecentOrdersBanner } from '@/components/RecentOrdersBanner';

// Synchronous import for Home to ensure fastest possible LCP
import Home from '@/pages/Home';

// Lazy loaded pages to reduce initial bundle size (especially react-pdf in ReceiptPage)
const About = lazy(() => import('@/pages/About'));
const Team = lazy(() => import('@/pages/Team'));
const Storefront = lazy(() => import('@/pages/Storefront'));
const Projects = lazy(() => import('@/pages/Projects'));
const Contact = lazy(() => import('@/pages/Contact'));
const TrainingHub = lazy(() => import('@/pages/TrainingHub'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const MockGateway = lazy(() => import('@/pages/MockGateway'));
const ReceiptPage = lazy(() => import('@/pages/PaymentSuccess'));
const PaymentError = lazy(() => import('@/pages/PaymentError'));
const PaymentStatus = lazy(() => import('@/pages/PaymentStatus'));
const VerifyReceipt = lazy(() => import('@/pages/VerifyReceipt'));
const NotFound = lazy(() => import('@/pages/not-found'));

// Premium loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-[#0077B6] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Skip scroll-to-top when a hash is present (let hash-based navigation handle it)
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  return (
    <div
      className="antialiased text-foreground bg-gray-50 dark:bg-[#0a0a0a] min-h-screen overflow-x-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <Navbar />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Suspense fallback={<PageLoader />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Navigate to="/Home" replace />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/About" element={<About />} />
                <Route path="/Team" element={<Team />} />
                <Route path="/Services" element={<Storefront />} />
                <Route path="/Projects" element={<Projects />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/Training" element={<TrainingHub />} />
                <Route path="/Checkout" element={<Checkout />} />
                <Route path="/mock-payment/:orderId/:paymentId" element={<MockGateway />} />
                <Route path="/payment/status/:orderId" element={<PaymentStatus />} />
                <Route path="/receipt/:receiptId" element={<ReceiptPage />} />
                <Route path="/verify-receipt/:code" element={<VerifyReceipt />} />
                <Route path="/Payment/Error" element={<PaymentError />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <RecentOrdersBanner />
      <Toaster />

      {/* WhatsApp Floating Widget */}
      <a
        href="https://wa.me/263714406037"
        aria-label="Chat with us on WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] hover:scale-110 transition-all duration-300 flex items-center justify-center group whatsapp-widget"
      >
        <FaWhatsapp size={32} />
        <span className="absolute right-16 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Chat with us
        </span>
      </a>
    </div>
  );
}
