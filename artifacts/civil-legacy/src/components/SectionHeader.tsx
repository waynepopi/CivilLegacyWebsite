import React from 'react';

export const SectionHeader = ({ title, subtitle, light = false }: { title: string; subtitle: string; light?: boolean }) => (
  <div className="mb-20 text-left">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-1" style={{ backgroundColor: '#0077B6' }}></div>
      <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${light ? 'text-gray-400' : ''}`} style={!light ? { color: '#0077B6' } : undefined}>
        Technical Specification
      </span>
    </div>
    <h2 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 ${light ? 'text-white' : 'text-black'}`}>
      {title}
    </h2>
    <p className={`text-xl font-light max-w-2xl leading-relaxed ${light ? 'text-gray-400' : 'text-gray-600'}`}>
      {subtitle}
    </p>
  </div>
);