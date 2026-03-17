import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { CONFIG } from '../lib/config';
import { motion } from 'framer-motion';

export const ProjectsPage = () => (
  <div className="pt-24 bg-black min-h-screen px-6 lg:px-12 text-left text-white">
    <div className="max-w-[1600px] mx-auto py-32">
      <SectionHeader title="Project Reference" subtitle="Comprehensive structural and civil assignments across Zimbabwe." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px px-px bg-white/10 border border-white/10 shadow-2xl">
        {CONFIG.PROJECTS.map((proj, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-black p-12 hover:bg-white/5 transition-all group">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-4 text-left">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 block" style={{ color: '#0077B6' }}>{proj.loc}</span>
                <h3 className="text-3xl font-black uppercase tracking-tighter group-hover:transition-colors" onMouseEnter={e => (e.currentTarget.style.color = '#0077B6')} onMouseLeave={e => (e.currentTarget.style.color = '')}>{proj.title}</h3>
              </div>
              <div className="md:text-right text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{proj.date}</p>
                <p className="text-xs font-mono font-bold text-gray-300 mt-1 uppercase tracking-tighter">{proj.stands}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start text-left">
              <div className="w-1 h-12 flex-shrink-0" style={{ backgroundColor: '#0077B6' }}></div>
              <p className="text-gray-400 font-light text-base leading-relaxed max-w-2xl italic">{proj.scope}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);