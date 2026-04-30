import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { CONFIG, SERVICE_CATEGORIES } from '@/config';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const BLUE = '#0077B6';

export const SectionHeader = ({
  title,
  subtitle,
  light = false,
  eyebrow ="Civil Legacy",
}: {
  title: string;
  subtitle: string;
  light?: boolean;
  eyebrow?: string;
}) => (
  <div className="mb-20 text-left">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-1" style={{ backgroundColor: BLUE }} />
      <span
        className={`text-[10px] font-black uppercase tracking-[0.5em] ${light ? 'text-gray-500 dark:text-gray-600 dark:text-gray-400' : 'text-[#0077B6]'}`}
      >
        {eyebrow}
      </span>
    </div>
    <h2
      className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 ${light ? 'text-black dark:text-white' : 'text-black dark:text-white'}`}
    >
      {title}
    </h2>
    <p
      className={`text-xl font-light max-w-2xl leading-relaxed ${light ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}
    >
      {subtitle}
    </p>
  </div>
);

export const Hero = ({
  titleLine1,
  titleLine2,
  subtitle,
  bgImage,
  ctaLabel,
  onCta,
  children,
}: {
  titleLine1: string;
  titleLine2: string | string[];
  subtitle: string;
  bgImage: string;
  ctaLabel: string;
  onCta: () => void;
  children?: React.ReactNode;
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    if (!Array.isArray(titleLine2)) return undefined;
    
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % titleLine2.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [titleLine2]);

  const currentText = Array.isArray(titleLine2) ? titleLine2[currentTextIndex] : titleLine2;

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden px-6 lg:px-12 border-b border-black/10 dark:border-white/10">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Hero"
          fetchPriority="high"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.3) contrast(1.25)', transform: 'scale(1.05)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl text-left"
        >
          <h1 className="text-[clamp(1.75rem,7.5vw,10rem)] font-black text-white leading-[0.85] tracking-tighter uppercase mb-8 md:mb-12 flex flex-col items-start">
            {titleLine1}
            <span className="relative h-[1.15em] overflow-hidden inline-flex items-center pb-1" style={{ color: BLUE }}>
              <span className="invisible whitespace-nowrap">{currentText}</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={currentText}
                  initial={{ y:"100%", opacity: 0 }}
                  animate={{ y:"0%", opacity: 1 }}
                  exit={{ y:"-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute left-0 top-0 whitespace-nowrap"
                >
                  {currentText}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-xl mb-12 tracking-tight">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col lg:flex-row flex-wrap gap-4 mt-8"
        >
          <button
            onClick={onCta}
            className="group flex items-center justify-center gap-3 px-7 py-4 font-black uppercase tracking-[0.3em] text-xs text-white transition-all duration-500 hover:scale-105 shadow-2xl rounded-full"
            style={{ backgroundColor: BLUE }}
          >
            {ctaLabel}
            <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </button>
          {children}
        </motion.div>
      </div>
    </section>
  );
};

import { getScrollingImages } from '@/services/cmsService';

export const ScrollingBanner = () => {
  const [images, setImages] = useState<string[]>(CONFIG.SCROLL_IMAGES as unknown as string[]);

  useEffect(() => {
    getScrollingImages().then((data) => {
      if (data && data.length > 0) {
        setImages(data);
      }
    });
  }, []);

  const count = images.length || 1;

  // Tile 4 copies so the seam never shows
  const tiled = useMemo(() => [...images, ...images, ...images, ...images], [images]);

  const loopPx  = count * (512 + 48); // card width + gap
  const duration = loopPx / 35; // ~35 px/s

  return (
    <div className="py-20 overflow-hidden border-y border-black/5 dark:border-white/5">
      <style>{`
        @keyframes cl-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-${loopPx}px); }
        }
        .cl-strip {
          animation: cl-scroll ${duration}s linear infinite;
        }
      `}</style>

      <div className="cl-strip flex gap-12 px-6 will-change-transform">
        {tiled.map((src, i) => (
          <div
            key={i}
            className="min-w-[500px] h-[350px] overflow-hidden flex-shrink-0 rounded-2xl border border-black/10 dark:border-white/10 cursor-pointer"
            style={{ filter: 'brightness(0.75)', transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.045)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
            }}
          >
            <img src={src} alt="Project" loading="lazy" width={500} height={350} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const AccordionItem = ({
  title,
  content,
  image,
  isOpen,
  onToggle,
}: {
  title: string;
  content: string;
  image: string;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className={`border-b border-black/10 dark:border-white/10 transition-colors duration-500 ${isOpen ? 'bg-black/5 dark:bg-white/5' : ''}`}>
    <button
      onClick={onToggle}
      className="w-full py-10 px-8 flex items-center justify-between text-left focus:outline-none"
    >
      <span
        className={`text-2xl font-black uppercase tracking-tighter transition-all ${isOpen ? 'text-[#0077B6]' : 'text-black dark:text-white'}`}
      >
        {title}
      </span>
      <ChevronDown
        size={32}
        strokeWidth={3}
        className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#0077B6]' : 'text-gray-600 dark:text-gray-400'}`}
      />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden"
        >
          <div className="px-8 pb-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg font-light leading-relaxed">{content}</p>
            <div
              className="h-64 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl"
              style={{ filter: 'brightness(0.5) contrast(1.25)' }}
            >
              <img src={image} alt={title} loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Home = () => {
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
      image: CONFIG.SCROLL_IMAGES[4],
    },
  ];

  return (
    <div className="">
      <Helmet>
        <title>Home | Civil Legacy Consultancy</title>
        <meta name="description" content="Zimbabwe's leading civil engineering consultancy delivering high-impact water and infrastructure solutions across the region." />
      </Helmet>

      <Hero
        titleLine1="SHAPING"
        titleLine2={["LEGACY.","CONSTRUCTION.","CONSULTANCY.","EXCELLENCE.","PROFESSIONALISM.","PROJECT MANAGEMENT."]}
        subtitle="Zimbabwe's leading civil engineering consultancy delivering high-impact water and infrastructure solutions across the region."
        bgImage="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=60&w=1080"
        ctaLabel="View Our Projects"
        onCta={() => navigate('/Projects')}
      >
        <button
          onClick={() => navigate('/Services')}
          className="group flex items-center justify-center gap-3 px-7 py-4 font-black uppercase tracking-[0.3em] text-xs text-black transition-all duration-500 hover:scale-105 shadow-2xl bg-gradient-to-r from-[#0077B6] via-white/90 to-[#0077B6] rounded-full animate-gradient-flow"
        >
          <span>Build with US</span>
          <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
        </button>
        <button
          onClick={() => navigate('/Training')}
          className="group flex items-center justify-center gap-3 px-7 py-4 font-black uppercase tracking-[0.3em] text-xs text-black transition-all duration-500 hover:scale-105 shadow-2xl bg-white rounded-full"
        >
          Join Training Now
          <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </Hero>

      <ScrollingBanner />

      {/* Banner */}
      <section className="bg-[#0077B6] py-16 px-6 lg:px-12 text-center border-y border-black/10 dark:border-white/10">
        <h3 className="text-3xl md:text-5xl font-black  uppercase tracking-tighter mb-4 drop-shadow-sm">
          Documentation Services
        </h3>
        <p className="/80 font-bold tracking-widest uppercase text-xs md:text-sm">
          Comprehensive reporting, civil drawings, and regulatory submissions.
        </p>
      </section>

      {/* Service Pillars */}
      <section className="py-32  px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <SectionHeader
            title="Our Pillars"
            subtitle="Three core disciplines ensuring a complete infrastructure life cycle."
            light
            eyebrow="What We Do"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
            {SERVICE_CATEGORIES.map((pillar) => {
              const { Icon } = pillar;
              return (
                <motion.div
                  key={pillar.id}
                  whileHover={{ y: -10 }}
                  onClick={() => navigate('/Services')}
                  className="bg-black/5 dark:bg-white/5 p-10 flex flex-col group border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl cursor-pointer"
                >
                  <div className="mb-8 transform group-hover:scale-110 origin-left transition-transform" style={{ color: BLUE }}>
                    <Icon size={40} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{pillar.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed flex-grow">{pillar.summary}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core capabilities accordion */}
      <section className="py-32  border-y border-black/5 dark:border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-6 mb-20">
            <h2 className="text-4xl font-black  uppercase tracking-tighter">Our Expertise</h2>
            <div className="h-[2px] flex-grow bg-black/10 dark:bg-white/10" />
          </div>
          <div className="border-t border-black/10 dark:border-white/10">
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

      {/* Resilience Teaser (Duplicated at bottom) */}
      <section className="py-32  px-6 lg:px-12 border-t border-black/5 dark:border-white/5">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7">
            <SectionHeader
              title="Engineering Resilience"
              subtitle="Leveraging cutting-edge methodologies and a client-centric ethos to ensure resilient systems that serve communities for generations."
              light
              eyebrow="Who We Are"
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

          {/* Stats card */}
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
                    src={CONFIG.TEAM[0].img.replace('w=600', 'w=150').replace('q=80', 'q=60')}
                    className="w-12 h-12 rounded-full object-cover"
                    style={{ objectPosition: (CONFIG.TEAM[0] as any).pos || 'center' }}
                    alt={CONFIG.TEAM[0].name}
                    loading="lazy"
                    width={48}
                    height={48}
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
};

export default Home;
