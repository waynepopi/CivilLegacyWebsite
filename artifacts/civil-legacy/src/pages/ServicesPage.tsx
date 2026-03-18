import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { CONFIG, BLUE } from '@/lib/constants';

export const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 bg-black min-h-screen text-white px-6 lg:px-12 text-left">
      <div className="max-w-[1600px] mx-auto py-32">
        <SectionHeader
          title="The Three Pillars"
          subtitle="Three segments ensuring a complete infrastructure life cycle."
          light
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-[3rem]">
          {CONFIG.SERVICES.map((pillar) => {
            const { Icon } = pillar;
            return (
              <motion.div
                key={pillar.id}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                className="bg-black p-12 lg:p-16 flex flex-col group transition-all duration-500"
              >
                <div
                  className="mb-12 transform group-hover:scale-110 origin-left transition-transform"
                  style={{ color: BLUE }}
                >
                  <Icon size={48} />
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">{String(pillar.title)}</h3>
                <p className="text-gray-400 text-lg font-light mb-12 leading-relaxed">{String(pillar.summary)}</p>
                <div className="flex-grow space-y-4 mb-20 border-l border-white/10 pl-6">
                  {pillar.details.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                      <div className="w-1.5 h-1.5 flex-shrink-0" style={{ backgroundColor: BLUE }} />
                      {String(item)}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/projects')}
                  className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-between px-8 rounded-xl transition-all duration-300 focus:outline-none"
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.backgroundColor = BLUE;
                    el.style.color = '#ffffff';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.backgroundColor = '#ffffff';
                    el.style.color = '#000000';
                  }}
                >
                  View Related Projects
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
