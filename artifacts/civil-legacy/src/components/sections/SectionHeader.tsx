import React from 'react';
import { BLUE } from '@/lib/constants';

export const SectionHeader = ({
  title,
  subtitle,
  light = false,
}: {
  title: string;
  subtitle: string;
  light?: boolean;
}) => (
  <div className="mb-20 text-left">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-1" style={{ backgroundColor: BLUE }} />
      <span
        className="text-[10px] font-black uppercase tracking-[0.5em]"
        style={{ color: light ? '#9ca3af' : BLUE }}
      >
        Technical Specification
      </span>
    </div>
    <h2
      className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6"
      style={{ color: light ? '#ffffff' : '#000000' }}
    >
      {title}
    </h2>
    <p
      className="text-xl font-light max-w-2xl leading-relaxed"
      style={{ color: light ? '#9ca3af' : '#4b5563' }}
    >
      {subtitle}
    </p>
  </div>
);
