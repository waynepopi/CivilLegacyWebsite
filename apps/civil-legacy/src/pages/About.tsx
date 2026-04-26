import React from 'react';
import { SectionHeader } from './Home';
import { CONFIG } from '@/config';
import { Helmet } from 'react-helmet-async';

const BLUE = '#0077B6';

const About = () => (
  <div className="min-h-screen  pt-24 text-left">
    <Helmet>
      <title>About Us | Civil Legacy Consultancy</title>
      <meta name="description" content="Learn about Civil Legacy's mission, vision, and engineering resilience." />
    </Helmet>
    <section className="py-32  px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-7">
          <SectionHeader
            title="Engineering Resilience"
            subtitle="Leveraging cutting-edge methodologies and a client-centric ethos to ensure resilient systems that serve communities for generations."
            light
            eyebrow="Our Story"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 text-left">
            <div className="space-y-4">
              <h4 className="text-2xl font-black uppercase tracking-tighter">Our Mission</h4>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                To empower engineers and organisations with practical, design-focused training and consultancy that elevates standards across the region.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-2xl font-black uppercase tracking-tighter">Our Vision</h4>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                To be the premier provider of engineering excellence and professional development in Southern Africa.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center">
          <div
            className="bg-black/5 dark:bg-white/5 p-12 lg:p-20  relative overflow-hidden text-left border border-black/10 dark:border-white/10"
            style={{ borderLeft: `12px solid ${BLUE}` }}
          >
            <div className="text-[12rem] font-black leading-none tracking-tighter  opacity-5 absolute -top-10 right-0 pointer-events-none select-none">
              15
            </div>
            <h3 className="text-7xl font-black tracking-tighter mb-4 relative z-10">
              15+
            </h3>
            <p className="text-xs font-black uppercase tracking-[0.4em] mb-12 relative z-10" style={{ color: BLUE }}>
              Successful Projects
            </p>
            <div className="space-y-6 border-t border-black/10 dark:border-white/10 pt-8 relative z-10">
              <p className="text-gray-600 dark:text-gray-400 italic font-light text-lg leading-relaxed">"We partner with municipalities to ensure infrastructure stands the test of time."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={CONFIG.TEAM[0].img}
                  className="w-12 h-12 rounded-full object-cover"
                  style={{ }}
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
  </div>
);

export default About;
