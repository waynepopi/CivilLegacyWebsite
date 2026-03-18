import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { CONFIG, BLUE } from '@/lib/constants';

export const ProjectsPage = () => (
  <div className="pt-24 bg-white min-h-screen px-6 lg:px-12 text-left text-black">
    <div className="max-w-[1600px] mx-auto py-32">
      <SectionHeader
        title="Project Reference"
        subtitle="Comprehensive structural and civil assignments across Zimbabwe."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-gray-200 border border-gray-200 shadow-2xl">
        {CONFIG.PROJECTS.map((proj, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white p-12 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-4">
              <div>
                <span
                  className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 block"
                  style={{ color: BLUE }}
                >
                  {String(proj.loc)}
                </span>
                <h3 className="text-3xl font-black uppercase tracking-tighter group-hover:text-[#0077B6] transition-colors">
                  {String(proj.title)}
                </h3>
              </div>
              <div className="md:text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {String(proj.date)}
                </p>
                <p className="text-xs font-mono font-bold text-gray-900 mt-1 uppercase tracking-tighter">
                  {String(proj.stands)}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-1 h-12 bg-gray-100 flex-shrink-0" />
              <p className="text-gray-500 font-light text-base leading-relaxed italic">{String(proj.scope)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);
