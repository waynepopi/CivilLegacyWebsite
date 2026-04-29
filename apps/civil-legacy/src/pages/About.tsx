import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Users, Award, BookOpen, DollarSign, Layers } from 'lucide-react';
import { SectionHeader } from './Home';
import { CONFIG } from '@/config';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const BLUE = '#0077B6';

const About = () => {
  const navigate = useNavigate();
  const projectCount = CONFIG.PROJECTS?.length || 0;
  const projectMetric = projectCount > 0 ? `${projectCount}+ Successful Projects` : "Proven Track Record Across Infrastructure Projects";

  return (
    <div className="min-h-screen pt-24 bg-background text-foreground text-left overflow-x-hidden transition-colors duration-300">
      <Helmet>
        <title>About Us | Civil Legacy Consultancy</title>
        <meta name="description" content="Civil Legacy Consultancy is a Zimbabwe-based civil and water engineering firm dedicated to delivering high-quality, sustainable infrastructure solutions." />
      </Helmet>

      {/* 1. Hero / Story Section - Open Layout */}
      <section className="relative min-h-[80vh] flex items-center pt-32 pb-24 px-6 lg:px-12 bg-black dark:bg-[#0a0a0a] overflow-hidden">
        {/* Background Accent Shapes */}
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-[#0077B6]/10 to-transparent skew-x-[-15deg] transform translate-x-1/4 pointer-events-none" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-[#0077B6]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0077B6]/20 to-transparent" />
        
        <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[2px]" style={{ backgroundColor: BLUE }} />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#0077B6]">Civil Legacy</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-10 text-white">
              Engineering Resilient <br />
              <span style={{ color: BLUE }}>Infrastructure</span> <br />
              for Generations
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl leading-relaxed mb-12">
              Civil Legacy Consultancy is a Zimbabwe-based civil and water engineering firm dedicated to delivering high-quality, sustainable infrastructure solutions. We partner with municipalities, utilities, and private sector clients to design and implement resilient systems that serve communities today and for generations to come.
            </p>

            <div className="flex flex-wrap gap-6">
              <button
                onClick={() => navigate('/projects')}
                className="group flex items-center justify-center gap-3 px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] text-white transition-all duration-300 hover:scale-105 shadow-[0_20px_50px_-15px_rgba(0,119,182,0.3)] rounded-full cursor-pointer"
                style={{ backgroundColor: BLUE }}
              >
                View Our Projects
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="group flex items-center justify-center gap-3 px-10 py-5 font-black uppercase tracking-[0.2em] text-[10px] text-white border border-white/10 hover:bg-white/5 transition-all duration-300 rounded-full cursor-pointer"
              >
                Get in Touch
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Right Side: Large Silhouette Cutout + Integrated Quote */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:flex justify-end items-end h-full relative self-end"
          >
            <div className="relative translate-y-24">
              {/* Decorative accent behind silhouette */}
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#0077B6]/10 rounded-full blur-3xl" />
              
              {/* Director Quote - Floating over the cutout */}
              <div className="absolute left-[-50%] top-[40%] z-20 w-[400px] pointer-events-none">
                 <div className="relative pl-8">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0077B6]" />
                    <p className="text-xl lg:text-2xl font-bold text-white italic leading-snug mb-4 drop-shadow-lg">
                      “We partner with municipalities to ensure infrastructure stands the test of time.”
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-[1px] bg-gray-500" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 drop-shadow-md">
                         Eng. Dereck M. Popi <span className="mx-2 text-[#0077B6]">|</span> <span className="font-light text-gray-500">Company Director</span>
                      </p>
                    </div>
                 </div>
              </div>

              {/* Silhouette Placeholder */}
              <div className="w-[350px] h-[500px] lg:w-[450px] lg:h-[650px] bg-white/5 rounded-t-[120px] relative flex items-center justify-center border-x border-t border-white/10 shadow-2xl backdrop-blur-md overflow-hidden">
                <div className="flex flex-col items-center gap-6 opacity-20 transform -translate-y-12">
                   <Users size={120} className="text-white" />
                   <div className="flex flex-col items-center text-white">
                      <span className="text-xs font-black uppercase tracking-[0.5em]">Director</span>
                      <span className="text-[10px] font-light uppercase tracking-[0.3em] opacity-70">Cutout Placeholder</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="relative py-32 bg-black/5 dark:bg-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl">
            <SectionHeader
              title="Our Story"
              subtitle="Building foundations for economic growth and community resilience."
              light
              eyebrow="The Heritage"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  At Civil Legacy Consultancy, we believe infrastructure is more than engineering. It is the foundation of economic growth, public health, and community resilience.
                </p>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  Founded with a vision to raise the standard of civil and water engineering across the region, we combine technical expertise, practical design experience, and a client-first approach to deliver solutions that work in the real world.
                </p>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  From large-scale water reticulation systems to structural and infrastructure design, our work is guided by one principle: build systems that last.
                </p>
                <p className="text-lg text-muted-foreground font-light leading-relaxed">
                  We don’t just design, we partner, advise, and empower. Through our consultancy and training services, we equip engineers and organisations with the tools and knowledge needed to deliver sustainable infrastructure at scale.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Slanted decoration */}
        <div className="absolute bottom-0 right-0 w-1/3 h-64 bg-background opacity-50" 
             style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }} />
      </section>

      {/* 3. Mission and Vision Section */}
      <section className="py-32 px-6 lg:px-12 bg-background">
        <div className="max-w-[1600px] mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mission Card */}
              <div className="group p-12 lg:p-16 border border-border hover:border-[#0077B6]/30 transition-colors relative overflow-hidden bg-black/5 dark:bg-white/5 rounded-[2rem]">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500" style={{ color: BLUE }}>
                  <Award size={120} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 text-foreground">Mission</h3>
                  <p className="text-2xl font-bold text-foreground mb-8 leading-tight">
                    To empower engineers and organisations through practical, design-driven consultancy and training, elevating the standard of water, wastewater, and civil infrastructure across the region.
                  </p>
                  <p className="text-lg text-muted-foreground font-light max-w-[600px] leading-relaxed">
                    We focus on real-world application, bridging the gap between theory and implementation to ensure infrastructure projects are efficient, sustainable, and scalable.
                  </p>
                </div>
              </div>

              {/* Vision Card */}
              <div className="group p-12 lg:p-16 bg-black dark:bg-white text-white dark:text-black relative overflow-hidden rounded-[2rem]">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500" style={{ color: BLUE }}>
                  <Layers size={120} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 text-inherit">Vision</h3>
                  <p className="text-2xl font-bold text-inherit mb-8 leading-tight">
                    To be the leading provider of engineering excellence and professional development in Southern Africa, building a legacy of innovation, capacity development, and environmental stewardship.
                  </p>
                  <p className="text-lg opacity-70 font-light max-w-[600px] leading-relaxed">
                    We aim to shape the future of infrastructure by developing both systems and the people who build them.
                  </p>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* 4. Why Civil Legacy Consultancy Section */}
      <section className="py-32 px-6 lg:px-12 bg-black/5 dark:bg-white/5">
        <div className="max-w-[1600px] mx-auto text-center mb-24">
          <SectionHeader
            title="Why Civil Legacy?"
            subtitle="Distinguished by technical precision and a commitment to long-term community value."
            light
            eyebrow="The Difference"
          />
        </div>
        
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {[
            { title: "Client-Centric Engineering Approach", icon: Users },
            { title: "Proven Experience Across Infrastructure Projects", icon: Award },
            { title: "Practical, Design-Focused Training", icon: BookOpen },
            { title: "Transparent Project Delivery & Costing", icon: DollarSign },
            { title: "End-to-End Engineering Solutions", icon: Layers }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-background p-10 rounded-2xl border border-border shadow-sm text-left flex flex-col items-start group transition-all"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-8 transition-colors" style={{ backgroundColor: `${BLUE}15`, color: BLUE }}>
                <item.icon size={28} />
              </div>
              <h4 className="text-xl font-black uppercase tracking-tighter leading-tight text-foreground group-hover:text-[#0077B6] transition-colors">
                {item.title}
              </h4>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
