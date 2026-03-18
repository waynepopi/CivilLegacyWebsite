import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CONFIG } from '@/lib/constants';

export const ScrollingBanner = () => {
  const doubled = useMemo(
    () => [...CONFIG.SCROLL_IMAGES, ...CONFIG.SCROLL_IMAGES],
    [],
  );
  const totalOffset = CONFIG.SCROLL_IMAGES.length * 548;

  return (
    <div className="py-20 bg-black overflow-hidden border-y border-white/5">
      <motion.div
        className="flex gap-12 px-6"
        animate={{ x: [0, -totalOffset] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className="min-w-[500px] h-[350px] overflow-hidden flex-shrink-0 rounded-2xl border border-white/10"
            style={{ filter: 'grayscale(1) brightness(0.75)' }}
          >
            <img src={src} alt="Project" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
