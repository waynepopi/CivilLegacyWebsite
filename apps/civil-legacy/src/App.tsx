import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Team from '@/pages/Team';
import Storefront from '@/pages/Storefront';
import Projects from '@/pages/Projects';
import Contact from '@/pages/Contact';
import TrainingHub from '@/pages/TrainingHub';
import Checkout from '@/pages/Checkout';
import MockGateway from '@/pages/MockGateway';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentError from '@/pages/PaymentError';
import NotFound from '@/pages/not-found';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div
      className="antialiased text-black bg-black min-h-screen overflow-x-hidden"
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
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/services" element={<Storefront />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/training" element={<TrainingHub />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/mock-payment-gateway" element={<MockGateway />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/error" element={<PaymentError />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <Toaster />

      {/* WhatsApp Floating Widget */}
      <a
        href="https://wa.me/263714406037"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      >
        <FaWhatsapp size={32} />
        <span className="absolute right-16 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Chat with us
        </span>
      </a>
    </div>
  );
}
