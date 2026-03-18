import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/sections/Hero';
import { ScrollingBanner } from '@/components/sections/ScrollingBanner';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { AccordionItem } from '@/components/sections/AccordionItem';
import { CONFIG, BLUE } from '@/lib/constants';

export const HomePage = () => {
  const [openIdx, setOpenIdx] = useState<number>(0);
  const navigate = useNavigate();

  const ACCORDION = [
    {
      title: 'Sustainable Infrastructure',
      content: 'We specialize in resilient systems. Our designs for 3200 stands at Suncoast demonstrate our ability to scale complex civil works while maintaining environmental stewardship.',
      image: CONFIG.SCROLL_IMAGES[0],
    },
    {
      title: 'Hydraulic Modelling',
      content: 'Using cutting-edge software like WaterGEMS and Civil 3D, we provide precise pipe modelling to ensure optimal pressure in stand subdivisions.',
      image: CONFIG.SCROLL_IMAGES[2],
    },
    {
      title: 'Industrial Excellence',
      content: 'From fuel stations in high-temperature environments to large-span industrial buildings, we maintain structural durability under operational loads.',
      image: CONFIG.SCROLL_IMAGES[5],
    },
  ];

  return (
    <div className="bg-white">
      <Hero
        titleLine1="SHAPING"
        titleLine2="LEGACY."
        subtitle="Zimbabwe's leading civil engineering consultancy delivering high-impact water and infrastructure solutions across the region."
        bgImage="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600"
        ctaLabel="View Reference List"
        onCta={() => navigate('/projects')}
      />

      <ScrollingBanner />

      {/* About teaser */}
      <section className="py-32 bg-white px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7">
            <SectionHeader
              title="Engineering Resilience"
              subtitle="Leveraging cutting-edge methodologies and a client-centric ethos to ensure resilient systems that serve communities for generations."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 text-left">
              <div className="space-y-4">
                <h4 className="text-2xl font-black uppercase tracking-tighter text-black">Our Mission</h4>
                <p className="text-gray-500 font-light leading-relaxed">
                  To empower engineers and organisations with practical, design-focused training and consultancy that elevates standards across the region.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-2xl font-black uppercase tracking-tighter text-black">Our Vision</h4>
                <p className="text-gray-500 font-light leading-relaxed">
                  To be the premier provider of engineering excellence and professional development in Southern Africa.
                </p>
              </div>
            </div>
          </div>

          {/* Stats card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div
              className="bg-black p-12 lg:p-20 text-white relative overflow-hidden text-left"
              style={{ borderLeft: `12px solid ${BLUE}` }}
            >
              <div className="text-[12rem] font-black leading-none tracking-tighter text-white opacity-5 absolute -top-10 right-0 pointer-events-none select-none">
                {String(CONFIG.PROJECTS.length)}
              </div>
              <h3 className="text-7xl font-black tracking-tighter mb-4 relative z-10">
                {String(CONFIG.PROJECTS.length)}+
              </h3>
              <p className="text-xs font-black uppercase tracking-[0.4em] mb-12 relative z-10" style={{ color: BLUE }}>
                Verified Assignments
              </p>
              <div className="space-y-6 border-t border-white/10 pt-8 relative z-10">
                <p className="text-gray-400 italic font-light text-lg leading-relaxed">
                  "We partner with municipalities to ensure infrastructure stands the test of time."
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={CONFIG.TEAM[0].img}
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ filter: 'grayscale(1)' }}
                    alt={CONFIG.TEAM[0].name}
                  />
                  <div>
                    <p className="font-bold text-sm">{String(CONFIG.TEAM[0].name)}</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">
                      {String(CONFIG.TEAM[0].role)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core capabilities accordion */}
      <section className="py-32 bg-black border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-6 mb-20">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Core Capabilities</h2>
            <div className="h-[2px] flex-grow bg-white/10" />
          </div>
          <div className="border-t border-white/10">
            {ACCORDION.map((item, idx) => (
              <AccordionItem
                key={idx}
                title={item.title}
                content={item.content}
                image={item.image}
                isOpen={openIdx === idx}
                onToggle={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
