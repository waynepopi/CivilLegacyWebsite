import React from 'react';
import { SectionHeader } from './SectionHeader';
import { CONFIG } from '../lib/config';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const ProjectsSummary = () => {
  const recentProjects = CONFIG.PROJECTS.slice(0, 4);

  return (
    <div className="bg-[#050505] min-h-screen px-6 lg:px-12 text-left text-white">
      <div className="max-w-[1600px] mx-auto py-32">
        <SectionHeader title="Recent Projects" subtitle="A glimpse into our latest infrastructure developments." light />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
          {recentProjects.map((proj, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-[#0a0a0a] p-12 hover:bg-[#111] transition-all group border-b border-white/5">
              <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-4 text-left">
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 block" style={{ color: '#0077B6' }}>{proj.loc}</span>
                  <h3 className="text-3xl font-black uppercase tracking-tighter group-hover:transition-colors" onMouseEnter={e => (e.currentTarget.style.color = '#0077B6')} onMouseLeave={e => (e.currentTarget.style.color = '')}>{proj.title}</h3>
                </div>
                <div className="md:text-right text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{proj.date}</p>
                  <p className="text-xs font-mono font-bold text-gray-500 mt-1 uppercase tracking-tighter">{proj.stands}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start text-left">
                <div className="w-1 h-12 bg-white/10 flex-shrink-0" style={{ backgroundColor: '#0077B6' }}></div>
                <p className="text-gray-400 font-light text-base leading-relaxed max-w-2xl italic">{proj.scope}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 flex justify-center">
            <Link
                to="/projects"
                className="inline-flex py-5 bg-[#0077B6] text-white font-black uppercase tracking-[0.2em] text-xs items-center justify-center px-12 hover:bg-white hover:text-black transition-all duration-300 rounded-xl gap-4 shadow-2xl"
              >
                View All Projects <ArrowRight size={18} />
              </Link>
        </div>
      </div>
    </div>
  );
};