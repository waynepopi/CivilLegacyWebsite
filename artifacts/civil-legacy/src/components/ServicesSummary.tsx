import React from 'react';
import { Ruler, HardHat, GraduationCap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../components/SectionHeader';
import { Link } from 'react-router-dom';

export const ServicesSummary = () => {
  const servicePillars = [
    {
      id: "consultancy",
      title: "Consultancy",
      icon: <Ruler size={48} />,
      summary: "Precision-driven strategic engineering and detailed design.",
      details: ["Feasibility Studies", "Hydraulic Modeling", "Detailed Design"],
    },
    {
      id: "construction",
      title: "Construction",
      icon: <HardHat size={48} />,
      summary: "Implementation of heavy-duty urban and industrial infrastructure.",
      details: ["Roadworks", "Sewer Reticulation", "Reservoir Construction"],
    },
    {
      id: "training",
      title: "Training Hub",
      icon: <GraduationCap size={48} />,
      summary: "Industry-aligned software mastery for future engineers.",
      details: ["Civil 3D Training", "AutoCAD Workshops", "WaterGEMS Mastery"],
    }
  ];

  return (
    <div className="bg-black text-white px-6 lg:px-12 text-left">
      <div className="max-w-[1600px] mx-auto py-32">
        <SectionHeader title="Our Services" subtitle="A quick overview of our core service segments." light />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-[3rem]">
          {servicePillars.map((pillar) => (
            <motion.div
              key={pillar.id}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
              className="bg-black p-12 flex flex-col group transition-all duration-500"
            >
              <div className="mb-8 transform group-hover:scale-110 origin-left transition-transform" style={{ color: '#0077B6' }}>{pillar.icon}</div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">{pillar.title}</h3>
              <p className="text-gray-400 text-sm font-light mb-8 leading-relaxed h-16">{pillar.summary}</p>
              <div className="flex-grow space-y-3 mb-10 border-l border-white/10 pl-6">
                {pillar.details.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                    <div className="w-1.5 h-1.5" style={{ backgroundColor: '#0077B6' }}></div> {item}
                  </div>
                ))}
              </div>
              <Link
                to="/services"
                className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-between px-8 hover:text-white transition-all duration-300 rounded-xl"
                style={{ '--hover-bg': '#0077B6' } as React.CSSProperties}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#0077B6'; (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'white'; (e.currentTarget as HTMLAnchorElement).style.color = 'black'; }}
              >
                View Full Services <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};