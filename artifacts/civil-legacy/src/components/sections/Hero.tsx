import React from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BLUE } from '@/lib/constants';

export const Hero = ({
  titleLine1,
  titleLine2,
  subtitle,
  bgImage,
  ctaLabel,
  onCta,
}: {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  bgImage: string;
  ctaLabel: string;
  onCta: () => void;
}) => (
  <section className="relative h-[90vh] min-h-[600px] flex items-center bg-black overflow-hidden px-6 lg:px-12 border-b border-white/10">
    {/* Background */}
    <div className="absolute inset-0 z-0">
      <img
        src={bgImage}
        alt="Hero"
        className="w-full h-full object-cover"
        style={{ filter: 'grayscale(1) brightness(0.3) contrast(1.25)', transform: 'scale(1.05)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    </div>

    <div className="relative z-10 max-w-[1600px] mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl text-left"
      >
        <h1 className="text-6xl md:text-[10rem] font-black text-white leading-[0.85] tracking-tighter uppercase mb-12">
          {titleLine1}
          <br />
          <span style={{ color: BLUE }}>{titleLine2}</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-light max-w-xl mb-12 tracking-tight">
          {subtitle}
        </p>
        <button
          onClick={onCta}
          className="group flex items-center gap-3 px-12 py-6 font-black uppercase tracking-[0.3em] text-xs text-white transition-all duration-500 hover:bg-white hover:text-black shadow-2xl"
          style={{ backgroundColor: BLUE }}
        >
          {ctaLabel}
          <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </motion.div>
    </div>
  </section>
);
