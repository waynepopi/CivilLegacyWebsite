import React from 'react';
import { Ruler, HardHat, GraduationCap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../components/SectionHeader';
import { Link } from 'react-router-dom';

export const ServicesPage = () => {
  const servicePillars = [
    {
      id: "consultancy",
      title: "Consultancy",
      icon: <Ruler size={48} />,
      summary: "Precision-driven strategic engineering and detailed design.",
      details: ["Feasibility Studies", "Hydraulic Modeling", "Detailed Design", "Contract Administration", "Structural Analysis", "Lorem ipsum dolor sit amet", "Consectetur adipiscing elit", "Sed do eiusmod tempor incididunt"],
      stats: "BS 8110 Standard Compliant"
    },
    {
      id: "construction",
      title: "Construction",
      icon: <HardHat size={48} />,
      summary: "Implementation of heavy-duty urban and industrial infrastructure.",
      details: ["Roadworks", "Sewer Reticulation", "Reservoir Construction", "Structural Works", "Waste Stabilisation Ponds", "Ut enim ad minim veniam", "Quis nostrud exercitation ullamco", "Laboris nisi ut aliquip ex ea commodo consequat"],
      stats: "Full Site Supervision"
    },
    {
      id: "training",
      title: "Training Hub",
      icon: <GraduationCap size={48} />,
      summary: "Industry-aligned software mastery for future engineers.",
      details: ["Civil 3D Training", "AutoCAD Workshops", "WaterGEMS Mastery", "BOQ Preparation", "Case-Study Analysis", "Duis aute irure dolor in reprehenderit", "In voluptate velit esse cillum dolore", "Eu fugiat nulla pariatur"],
      stats: "Practical Design Focused"
    }
  ];

  return (
    <div className="pt-24 bg-black min-h-screen text-white px-6 lg:px-12 text-left">
      <div className="max-w-[1600px] mx-auto py-32">
        <SectionHeader title="The Three Pillars" subtitle="Three segments ensuring a complete infrastructure life cycle. We provide top-notch services across various disciplines, ensuring quality and sustainability in every project." light />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-[3rem] mb-32">
          {servicePillars.map((pillar) => (
            <motion.div
              key={pillar.id}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
              className="bg-black p-12 lg:p-16 flex flex-col group transition-all duration-500"
            >
              <div className="mb-12 transform group-hover:scale-110 origin-left transition-transform" style={{ color: '#0077B6' }}>{pillar.icon}</div>
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">{pillar.title}</h3>
              <p className="text-gray-400 text-lg font-light mb-12 leading-relaxed h-20">{pillar.summary}</p>
              <div className="flex-grow space-y-4 mb-20 border-l border-white/10 pl-6">
                {pillar.details.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                    <div className="w-1.5 h-1.5" style={{ backgroundColor: '#0077B6' }}></div> {item}
                  </div>
                ))}
              </div>
              <Link
                to="/projects"
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-between px-8 hover:text-white transition-all duration-300 rounded-xl"
                style={{ '--hover-bg': '#0077B6' } as React.CSSProperties}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#0077B6'; (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'white'; (e.currentTarget as HTMLAnchorElement).style.color = 'black'; }}
              >
                View Related Projects <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Extended Placeholder Section for Future Services Details */}
        <div className="border-t border-white/10 pt-32">
          <SectionHeader title="Advanced Capabilities" subtitle="Deep dive into our specialised service offerings and methodologies." light />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-20">
            <div className="space-y-8">
              <h4 className="text-3xl font-black uppercase tracking-tighter" style={{ color: '#0077B6' }}>Structural Diagnostics</h4>
              <p className="text-gray-400 font-light leading-relaxed text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p className="text-gray-400 font-light leading-relaxed text-lg">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
              </p>
            </div>

            <div className="h-full min-h-[400px] border border-white/10 rounded-[2rem] overflow-hidden relative shadow-2xl">
              <img src="https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800" alt="Placeholder structural diagnostic" className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-32">
            <div className="h-full min-h-[400px] border border-white/10 rounded-[2rem] overflow-hidden relative shadow-2xl md:order-1 order-2">
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800" alt="Placeholder project management" className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" />
            </div>

            <div className="space-y-8 md:order-2 order-1">
              <h4 className="text-3xl font-black uppercase tracking-tighter" style={{ color: '#0077B6' }}>Project Lifecycle Management</h4>
              <p className="text-gray-400 font-light leading-relaxed text-lg">
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.
              </p>
              <ul className="space-y-4 pt-4">
                {["Lorem Ipsum Dolor Sit", "Amet Consectetur Adipiscing", "Elit Sed Do Eiusmod"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-white font-bold tracking-wider uppercase text-sm">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0077B6' }}></div> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};