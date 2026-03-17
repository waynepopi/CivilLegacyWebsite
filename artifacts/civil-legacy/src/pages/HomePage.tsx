import React, { useState } from 'react';
import { Hero, ScrollingBanner, AccordionItem } from '../components/SharedComponents';
import { SectionHeader } from '../components/SectionHeader';
import { ServicesSummary } from '../components/ServicesSummary';
import { ProjectsSummary } from '../components/ProjectsSummary';
import { CONFIG } from '../lib/config';
import { useNavigate } from 'react-router-dom';
import { AboutPage } from './AboutPage';

export const HomePage = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate();
  const projectCount = CONFIG.PROJECTS.length;

  const accordionData = [
    { title: "Sustainable Infrastructure", content: "We specialize in resilient systems. Our designs for 3200 stands at Suncoast demonstrate our ability to scale complex civil works while maintaining environmental stewardship. Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: CONFIG.SCROLL_IMAGES[0] },
    { title: "Hydraulic Modelling", content: "Using cutting-edge software like WaterGEMS and Civil 3D, we provide precise pipe modelling to ensure optimal pressure in stand subdivisions. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", image: CONFIG.SCROLL_IMAGES[2] },
    { title: "Industrial Excellence", content: "From fuel stations in high-temperature environments to large-span industrial buildings, we maintain structural durability under operational loads. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.", image: CONFIG.SCROLL_IMAGES[5] }
  ];

  return (
    <div className="bg-black text-white">
      <Hero
        title="SHAPING LEGACY."
        subtitle="Zimbabwe's leading civil engineering consultancy delivering high-impact water and infrastructure solutions across the region."
        bgImage="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600"
        cta1="View Reference List"
        onCta1={() => navigate('/projects')}
      />

      <ScrollingBanner />

      <section className="py-32 bg-black px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-7">
              <SectionHeader
                title="Engineering Resilience"
                subtitle="Leveraging cutting-edge methodologies and a client-centric ethos to ensure resilient systems that serve communities for generations."
                light={true}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 text-left">
                <div className="space-y-4">
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-white">Our Mission</h4>
                  <p className="text-gray-400 font-light leading-relaxed">To empower engineers and organisations with practical, design-focused training and consultancy that elevates standards across the region. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-white">Our Vision</h4>
                  <p className="text-gray-400 font-light leading-relaxed">To be the premier provider of engineering excellence and professional development in Southern Africa. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="bg-[#111] p-12 lg:p-20 text-white relative overflow-hidden text-left shadow-2xl rounded-2xl" style={{ borderLeft: '12px solid #0077B6' }}>
                <div className="text-[12rem] font-black leading-none tracking-tighter text-white opacity-5 absolute -top-10 right-0 pointer-events-none">{projectCount}</div>
                <h3 className="text-7xl font-black tracking-tighter mb-4 relative z-10">{projectCount}+</h3>
                <p className="text-xs font-black uppercase tracking-[0.4em] mb-12 relative z-10" style={{ color: '#0077B6' }}>Verified Assignments</p>
                <div className="space-y-6 border-t border-white/10 pt-8 relative z-10">
                  <p className="text-gray-400 italic font-light text-lg leading-relaxed">"We partner with municipalities to ensure infrastructure stands the test of time."</p>
                  <div className="flex items-center gap-4">
                    <img src={CONFIG.TEAM[0].img} className="w-12 h-12 rounded-full object-cover" style={{ filter: 'grayscale(1)' }} alt="Director" />
                    <div>
                      <p className="font-bold text-sm text-white">Eng. Dereck M. Popi</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">Company Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Summary Section */}
      <section className="border-t border-white/5 bg-black">
         <ServicesSummary />
      </section>

      {/* Projects Summary Section */}
      <section className="border-t border-white/5 bg-[#050505]">
         <ProjectsSummary />
      </section>

      {/* Core Capabilities */}
      <section className="py-32 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-6 mb-20 text-left">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Core Capabilities</h2>
            <div className="h-[2px] flex-grow bg-white/10"></div>
          </div>
          <div className="border-t border-white/10">
            {accordionData.map((item, idx) => (
              <AccordionItem
                key={idx} title={item.title} content={item.content} image={item.image}
                isOpen={openIndex === idx} onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Firm Section Appended to the end of the home page */}
      <section className="border-t border-white/5 bg-black pb-24">
         <AboutPage />
      </section>
    </div>
  );
};