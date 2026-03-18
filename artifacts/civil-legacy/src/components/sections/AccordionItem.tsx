import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BLUE } from '@/lib/constants';

export const AccordionItem = ({
  title,
  content,
  image,
  isOpen,
  onToggle,
}: {
  title: string;
  content: string;
  image: string;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className={`border-b border-white/10 transition-colors duration-500 ${isOpen ? 'bg-white/5' : ''}`}>
    <button
      onClick={onToggle}
      className="w-full py-10 px-8 flex items-center justify-between text-left focus:outline-none"
    >
      <span
        className="text-2xl font-black uppercase tracking-tighter transition-all"
        style={{ color: isOpen ? BLUE : '#ffffff' }}
      >
        {title}
      </span>
      <ChevronDown
        size={32}
        strokeWidth={3}
        className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
        style={{ color: isOpen ? BLUE : '#4b5563' }}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden"
        >
          <div className="px-8 pb-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <p className="text-gray-400 text-lg font-light leading-relaxed">{content}</p>
            <div
              className="h-64 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              style={{ filter: 'grayscale(1) brightness(0.5) contrast(1.25)' }}
            >
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
