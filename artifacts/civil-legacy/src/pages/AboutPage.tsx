import React from 'react';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { CONFIG, BLUE } from '@/lib/constants';

export const AboutPage = () => (
  <div className="pt-24 bg-black min-h-screen text-white px-6 lg:px-12 text-left">
    <div className="max-w-[1600px] mx-auto py-32">
      <SectionHeader
        title="Expertise"
        subtitle="Our multidisciplinary board of registered Professional Engineers."
        light
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-20">
        {CONFIG.TEAM.map((member, i) => (
          <div
            key={i}
            className="border border-white/10 p-12 hover:border-[#0077B6] transition-all group relative overflow-hidden bg-white/5 rounded-[2rem] shadow-2xl"
          >
            <div
              className="w-full aspect-square mb-10 overflow-hidden rounded-2xl"
              style={{ filter: 'grayscale(1)' }}
            >
              <img src={member.img} alt={String(member.name)} className="w-full h-full object-cover" />
            </div>
            <h4 className="text-3xl font-black uppercase tracking-tighter mb-2">{String(member.name)}</h4>
            <p className="font-bold text-xs uppercase tracking-widest mb-6" style={{ color: BLUE }}>
              {String(member.role)}
            </p>
            <div className="space-y-1 pt-6 border-t border-white/5 font-mono text-[10px] text-gray-500 uppercase">
              <p>{String(member.creds)}</p>
              <p>{String(member.id)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
