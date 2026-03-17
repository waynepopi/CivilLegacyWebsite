import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CONFIG } from '../lib/config';

export const Hero = ({ title, subtitle, bgImage, cta1, onCta1 }: { title: string; subtitle: string; bgImage: string; cta1: string; onCta1: () => void }) => {
  const words = title.split(' ');
  const firstPart = words.slice(0, 2).join(' ');
  const secondPart = words.slice(2).join(' ');

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center bg-black overflow-hidden px-6 lg:px-12 border-b border-white/10 text-left">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Hero background"
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(1) brightness(0.3) contrast(1.25)', transform: 'scale(1.05)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <h1 className="text-6xl md:text-[10rem] font-black text-white leading-[0.85] tracking-tighter uppercase mb-12">
            {firstPart} <br /> <span style={{ color: '#0077B6' }}>{secondPart}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-xl mb-12 tracking-tight">
            {subtitle}
          </p>
          <button
            onClick={onCta1}
            className="group px-12 py-6 text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-white hover:text-black transition-all duration-500 shadow-2xl flex items-center gap-2"
            style={{ backgroundColor: '#0077B6' }}
          >
            {cta1} <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export const ScrollingBanner = () => {
  const displayImages = useMemo(() => [...CONFIG.SCROLL_IMAGES, ...CONFIG.SCROLL_IMAGES], []);
  const totalOffset = CONFIG.SCROLL_IMAGES.length * 548;

  return (
    <div className="py-20 bg-black overflow-hidden border-y border-white/5">
      <motion.div
        className="flex gap-12 px-6"
        animate={{ x: [0, -totalOffset] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {displayImages.map((src, i) => (
          <div key={i} className="min-w-[500px] h-[350px] overflow-hidden flex-shrink-0 rounded-2xl border border-white/10 transition-all duration-700" style={{ filter: 'grayscale(1) brightness(0.75)' }}>
            <img src={src} alt="Structural Detail" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const AccordionItem = ({ title, content, isOpen, onClick, image }: { title: string; content: string; isOpen: boolean; onClick: () => void; image: string }) => (
  <div className={`border-b border-white/10 transition-all duration-500 ${isOpen ? 'bg-white/5' : ''}`}>
    <button
      className="w-full py-10 flex items-center justify-between text-left focus:outline-none px-8"
      onClick={onClick}
    >
      <span className={`text-2xl font-black uppercase tracking-tighter transition-all ${isOpen ? 'scale-105 origin-left' : 'text-white'}`} style={isOpen ? { color: '#0077B6' } : undefined}>
        {title}
      </span>
      <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : 'text-gray-600'}`} style={isOpen ? { color: '#0077B6' } : undefined}>
        <ChevronDown size={32} strokeWidth={3} />
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="px-8 pb-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
            <div className="text-gray-400 text-lg font-light leading-relaxed">
              {content}
            </div>
            <div className="h-64 border border-white/10 rounded-xl overflow-hidden shadow-2xl" style={{ filter: 'grayscale(1) brightness(0.5) contrast(1.25)' }}>
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);