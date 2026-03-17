import React, { useState, useEffect, useMemo } from 'react';
import {
  Menu, X, Phone, Mail, MapPin, Clock,
  ChevronRight, CheckCircle, Quote,
  Facebook, Twitter, Linkedin, Instagram,
  HardHat, Droplets, Ruler, Pencil,
  ArrowRight, Users, Award, Building2,
  BookOpen, Calculator, Info, Target, Eye, Truck,
  Plus, Minus, ChevronDown, GraduationCap, Globe, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONFIG = {
  BRAND: {
    NAME: "CIVIL LEGACY",
    TAGLINE: "Consultancy",
    ACCENT: "#0077B6",
    REGISTRATION: "ZIE 198098 | ECZ 151080"
  },
  CONTACT: {
    MAIN_LINE: "0718 246 433",
    SECONDARY_LINE: "+263 71 440 6037",
    WHATSAPP_NUM: "263718246433",
    EMAIL: "info@civillegacy.com",
    OFFICES: [
      { name: "Headquarters", location: "1066 Dam View Mall, Chipinge" },
      { name: "Gweru Branch", location: "4248 Avian Way, Northlea" }
    ],
    EXTENSIONS: [
      { name: "Tech Pamela", num: "0718 246 434" },
      { name: "Bridget", num: "0718 246 435" },
      { name: "Sharlom", num: "0718 246 439" },
      { name: "Eng. Panashe", num: "0718 246 446" },
      { name: "Tanya", num: "0718 246 463" },
      { name: "Albert", num: "0718 246 468" },
      { name: "Eng. Mutero", num: "0718 246 470" },
      { name: "Planner Farai", num: "0718 246 473" },
      { name: "Chiwawa", num: "0718 246 474" }
    ]
  },
  PROJECTS: [
    { title: "Suncoast Project", loc: "Masvingo", scope: "Road Design, Water Reticulation, Sewer Reticulation, Stormwater Drainage", stands: "3200 Stands", date: "Oct 2022" },
    { title: "The Nest of Kenilworth", loc: "Chipinge", scope: "Water, Stormwater, Sewer, Road and Public Lighting Design", stands: "3800 Stands", date: "Nov 2025" },
    { title: "Victoria Range", loc: "Masvingo", scope: "Water & Sewer Reticulation Designs", stands: "500 Stands", date: "Dec 2023" },
    { title: "Boronia Farm Subdivision", loc: "Harare", scope: "Water Reticulation Design", stands: "200 Stands", date: "Mar 2025" },
    { title: "Flamboyant Project", loc: "Masvingo", scope: "Water Reticulation Design", stands: "400 Stands", date: "Jan 2023" },
    { title: "Mutare Recovery Facility", loc: "Mutare", scope: "Full structural design & geotechnical guidance for Industrial Waste Processing Structure", stands: "Industrial", date: "Completed" },
    { title: "Madziwa Structural Development", loc: "Gweru", scope: "Full structural design, detailing and documentation for reinforced concrete multi-level building", stands: "Multi-Storey", date: "Completed" },
    { title: "Popi Residence", loc: "Gweru", scope: "High-end modern residential structural design with reinforced concrete framing and cantilever elements", stands: "Randolph Phase 1", date: "Underway" },
    { title: "Proposed Shops & Offices", loc: "Rusape", scope: "Commercial double-storey structural design and reinforcement detailing under BS 8110 standards", stands: "Stand 2461", date: "Approved" },
    { title: "Waste Stabilisation Ponds", loc: "Gweru", scope: "Design of complete wastewater stabilisation pond system and abattoir effluent treatment", stands: "Connemara Farm", date: "Completed" },
    { title: "Fuel Service Station", loc: "Muzarabani", scope: "Commercial structural design of canopy, steel framing and composite infrastructure", stands: "Energy Park", date: "Completed" },
    { title: "219m² Residential Unit", loc: "Chipinge", scope: "Structural design for modern medium-density residential development including boundary walls", stands: "Residential", date: "Completed" },
    { title: "Residential Unit (St Kelvin)", loc: "Chipinge", scope: "Full structural design and construction documentation for high-end multi-bedroom dwelling", stands: "High-End", date: "Completed" },
    { title: "Church Structure Foundation", loc: "Chipinge", scope: "Structural foundation design and reinforcement detailing for institutional development", stands: "UCCZ Gaza", date: "Completed" },
    { title: "Structural Building Development", loc: "Mt Selinda", scope: "Comprehensive multi-storey reinforced concrete building structural design and certification", stands: "Multi-Storey", date: "Completed" }
  ],
  TEAM: [
    { name: "Eng. Dereck M. Popi", role: "Company Director", id: "ZIE 198098 | ECZ 151080", creds: "BSc (Hons), MBA, Pr Eng", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600" },
    { name: "Simbarashe Musakwembewa", role: "Structural Expert", id: "ZIE 084408 | ECZ 150285", creds: "BSc (Hons), Pr. Eng, MECZ", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600" },
    { name: "Eng. Byron Muzovaka", role: "GeoTech Expert", id: "ZIE 144395 | ECZ 100645", creds: "BSc (Hons), ECZ, Pr. Eng", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600" },
    { name: "Tawanda Mvarume", role: "Civil & Water Engineer", id: "BSc (Hons)", creds: "Civil Design Specialist", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600" },
    { name: "Shylet Moyo", role: "Quantity Surveyor", id: "BSc (Hons)", creds: "BOQ & Cost Analysis", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600" }
  ],
  SCROLL_IMAGES: [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1504307651254-35680f3366d4?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1517089535819-3d8569aa83fa?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800"
  ]
};

const Navbar = ({ currentPage, setCurrentPage }: { currentPage: string; setCurrentPage: (page: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Firm', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Projects', id: 'projects' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-black/90 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-24 items-center">
          <div className="cursor-pointer group text-left" onClick={() => setCurrentPage('home')}>
            <div className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
              {CONFIG.BRAND.NAME.split(' ')[0]}<span style={{ color: '#0077B6' }}>{CONFIG.BRAND.NAME.split(' ')[1]}</span>
            </div>
            <div className="text-[9px] font-bold tracking-[0.4em] uppercase mt-1" style={{ color: '#0077B6' }}>
              {CONFIG.BRAND.TAGLINE}
            </div>
          </div>

          <div className="hidden lg:flex space-x-12">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all relative ${
                  currentPage === link.id ? 'text-[#0077B6]' : 'text-gray-400 hover:text-white'
                }`}
                style={currentPage === link.id ? { color: '#0077B6' } : undefined}
              >
                {link.name}
                {currentPage === link.id && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 w-full h-[2px]" style={{ backgroundColor: '#0077B6' }} />
                )}
              </button>
            ))}
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 border border-white/20 rounded">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-0 top-24 bg-black z-40 lg:hidden px-8 pt-12 text-left"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { setCurrentPage(link.id); setIsOpen(false); }}
                className="block w-full text-left text-4xl font-black uppercase tracking-tighter mb-8 text-white hover:text-[#0077B6] transition-colors"
              >
                {link.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ title, subtitle, bgImage, cta1, onCta1 }: { title: string; subtitle: string; bgImage: string; cta1: string; onCta1: () => void }) => {
  const words = title.split(' ');
  const firstPart = words.slice(0, 2).join(' ');
  const secondPart = words.slice(2).join(' ');

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center bg-black overflow-hidden px-6 lg:px-12 border-b border-white/10 text-left">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Hero background"
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(1) brightness(0.3) contrast(1.25)', transform: 'scale(1.05)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <h1 className="text-6xl md:text-[10rem] font-black text-white leading-[0.85] tracking-tighter uppercase mb-12">
            {firstPart} <br /> <span style={{ color: '#0077B6' }}>{secondPart}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-xl mb-12 tracking-tight">
            {subtitle}
          </p>
          <button
            onClick={onCta1}
            className="group px-12 py-6 text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-white hover:text-black transition-all duration-500 shadow-2xl flex items-center gap-2"
            style={{ backgroundColor: '#0077B6' }}
          >
            {cta1} <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const ScrollingBanner = () => {
  const displayImages = useMemo(() => [...CONFIG.SCROLL_IMAGES, ...CONFIG.SCROLL_IMAGES], []);
  const totalOffset = CONFIG.SCROLL_IMAGES.length * 548;

  return (
    <div className="py-20 bg-black overflow-hidden border-y border-white/5">
      <motion.div
        className="flex gap-12 px-6"
        animate={{ x: [0, -totalOffset] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {displayImages.map((src, i) => (
          <div key={i} className="min-w-[500px] h-[350px] overflow-hidden flex-shrink-0 rounded-2xl border border-white/10 transition-all duration-700" style={{ filter: 'grayscale(1) brightness(0.75)' }}>
            <img src={src} alt="Structural Detail" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, light = false }: { title: string; subtitle: string; light?: boolean }) => (
  <div className="mb-20 text-left">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-1" style={{ backgroundColor: '#0077B6' }}></div>
      <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${light ? 'text-gray-400' : ''}`} style={!light ? { color: '#0077B6' } : undefined}>
        Technical Specification
      </span>
    </div>
    <h2 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 ${light ? 'text-white' : 'text-black'}`}>
      {title}
    </h2>
    <p className={`text-xl font-light max-w-2xl leading-relaxed ${light ? 'text-gray-400' : 'text-gray-600'}`}>
      {subtitle}
    </p>
  </div>
);

const AccordionItem = ({ title, content, isOpen, onClick, image }: { title: string; content: string; isOpen: boolean; onClick: () => void; image: string }) => (
  <div className={`border-b border-white/10 transition-all duration-500 ${isOpen ? 'bg-white/5' : ''}`}>
    <button
      className="w-full py-10 flex items-center justify-between text-left focus:outline-none px-8"
      onClick={onClick}
    >
      <span className={`text-2xl font-black uppercase tracking-tighter transition-all ${isOpen ? 'scale-105 origin-left' : 'text-white'}`} style={isOpen ? { color: '#0077B6' } : undefined}>
        {title}
      </span>
      <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : 'text-gray-600'}`} style={isOpen ? { color: '#0077B6' } : undefined}>
        <ChevronDown size={32} strokeWidth={3} />
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="px-8 pb-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
            <div className="text-gray-400 text-lg font-light leading-relaxed">
              {content}
            </div>
            <div className="h-64 border border-white/10 rounded-xl overflow-hidden shadow-2xl" style={{ filter: 'grayscale(1) brightness(0.5) contrast(1.25)' }}>
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Footer = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => (
  <footer className="bg-black text-white pt-24 pb-12 border-t border-white/5 text-left">
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div className="col-span-1 md:col-span-1">
          <span className="text-3xl font-black text-white tracking-tighter mb-8 block leading-none">
            {CONFIG.BRAND.NAME.split(' ')[0]}<span style={{ color: '#0077B6' }}>{CONFIG.BRAND.NAME.split(' ')[1]}</span>
          </span>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Zimbabwe's premier engineering legacy built on structural precision and water management excellence.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
              <div key={idx} className="w-10 h-10 bg-white/5 flex items-center justify-center text-gray-500 transition-all cursor-pointer border border-white/5 rounded-full shadow-lg hover:bg-[#0077B6] hover:text-white">
                <Icon size={16} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: '#0077B6' }}>System</h4>
          <ul className="space-y-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
            <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setCurrentPage('home')}>Home</li>
            <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setCurrentPage('about')}>Expertise</li>
            <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setCurrentPage('services')}>Services</li>
            <li className="hover:text-white cursor-pointer transition-colors" onClick={() => setCurrentPage('projects')}>Projects</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: '#0077B6' }}>Operational Hubs</h4>
          <ul className="space-y-6 text-sm text-gray-400 font-light">
            {CONFIG.CONTACT.OFFICES.map((off, idx) => (
              <li key={idx} className="flex flex-col gap-1">
                <span className="text-white font-bold uppercase tracking-widest text-[10px]">{off.name}</span>
                <span>{off.location}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: '#0077B6' }}>Transmission</h4>
          <ul className="space-y-4 text-sm font-mono text-gray-400">
            <li className="text-white font-black">{CONFIG.CONTACT.MAIN_LINE}</li>
            <li>{CONFIG.CONTACT.EMAIL}</li>
            <li className="text-[10px] uppercase tracking-widest opacity-50">{CONFIG.BRAND.REGISTRATION}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 pt-10 flex justify-between items-center text-gray-600 text-[10px] uppercase tracking-[0.4em] font-bold">
        <p>© 2026 {CONFIG.BRAND.NAME} CONSULTANCY</p>
        <p>CHIPINGE | GWERU | HARARE</p>
      </div>
    </div>
  </footer>
);

const HomePage = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const projectCount = CONFIG.PROJECTS.length;

  const accordionData = [
    { title: "Sustainable Infrastructure", content: "We specialize in resilient systems. Our designs for 3200 stands at Suncoast demonstrate our ability to scale complex civil works while maintaining environmental stewardship.", image: CONFIG.SCROLL_IMAGES[0] },
    { title: "Hydraulic Modelling", content: "Using cutting-edge software like WaterGEMS and Civil 3D, we provide precise pipe modelling to ensure optimal pressure in stand subdivisions.", image: CONFIG.SCROLL_IMAGES[2] },
    { title: "Industrial Excellence", content: "From fuel stations in high-temperature environments to large-span industrial buildings, we maintain structural durability under operational loads.", image: CONFIG.SCROLL_IMAGES[5] }
  ];

  return (
    <div className="bg-white">
      <Hero
        title="SHAPING LEGACY."
        subtitle="Zimbabwe's leading civil engineering consultancy delivering high-impact water and infrastructure solutions across the region."
        bgImage="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600"
        cta1="View Reference List"
        onCta1={() => setCurrentPage('projects')}
      />

      <ScrollingBanner />

      <section className="py-32 bg-white px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-7">
              <SectionHeader
                title="Engineering Resilience"
                subtitle="Leveraging cutting-edge methodologies and a client-centric ethos to ensure resilient systems that serve communities for generations."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 text-left">
                <div className="space-y-4">
                  <h4 className="text-2xl font-black uppercase tracking-tighter">Our Mission</h4>
                  <p className="text-gray-500 font-light leading-relaxed">To empower engineers and organisations with practical, design-focused training and consultancy that elevates standards across the region.</p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-black uppercase tracking-tighter">Our Vision</h4>
                  <p className="text-gray-500 font-light leading-relaxed">To be the premier provider of engineering excellence and professional development in Southern Africa.</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="bg-black p-12 lg:p-20 text-white relative overflow-hidden text-left" style={{ borderLeft: '12px solid #0077B6' }}>
                <div className="text-[12rem] font-black leading-none tracking-tighter text-white opacity-5 absolute -top-10 right-0 pointer-events-none">{projectCount}</div>
                <h3 className="text-7xl font-black tracking-tighter mb-4 relative z-10">{projectCount}+</h3>
                <p className="text-xs font-black uppercase tracking-[0.4em] mb-12 relative z-10" style={{ color: '#0077B6' }}>Verified Assignments</p>
                <div className="space-y-6 border-t border-white/10 pt-8 relative z-10">
                  <p className="text-gray-400 italic font-light text-lg leading-relaxed">"We partner with municipalities to ensure infrastructure stands the test of time."</p>
                  <div className="flex items-center gap-4">
                    <img src={CONFIG.TEAM[0].img} className="w-12 h-12 rounded-full object-cover" style={{ filter: 'grayscale(1)' }} alt="Director" />
                    <div>
                      <p className="font-bold text-sm">Eng. Dereck M. Popi</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">Company Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-black border-y border-white/5">
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
    </div>
  );
};

const AboutPage = () => (
  <div className="pt-24 bg-black min-h-screen text-white px-6 lg:px-12 text-left">
    <div className="max-w-[1600px] mx-auto py-32">
      <SectionHeader title="Expertise" subtitle="Our multidisciplinary board of registered Professional Engineers." light />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-20">
        {CONFIG.TEAM.map((member, i) => (
          <div key={i} className="border border-white/10 p-12 hover:border-[#0077B6] transition-all group relative overflow-hidden bg-white/5 rounded-[2rem] shadow-2xl" style={{ '--tw-border-opacity': '1' } as React.CSSProperties}>
            <div className="w-full aspect-square mb-10 overflow-hidden rounded-2xl transition-all duration-700" style={{ filter: 'grayscale(1)' }}>
              <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="text-3xl font-black uppercase tracking-tighter mb-2">{member.name}</h4>
            <p className="font-bold text-xs uppercase tracking-widest mb-6" style={{ color: '#0077B6' }}>{member.role}</p>
            <div className="space-y-2 pt-6 border-t border-white/5 font-mono text-[10px] text-gray-500 uppercase">{member.creds} <br /> {member.id}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ServicesPage = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => {
  const servicePillars = [
    {
      id: "consultancy",
      title: "Consultancy",
      icon: <Ruler size={48} />,
      summary: "Precision-driven strategic engineering and detailed design.",
      details: ["Feasibility Studies", "Hydraulic Modeling", "Detailed Design", "Contract Administration", "Structural Analysis"],
      stats: "BS 8110 Standard Compliant"
    },
    {
      id: "construction",
      title: "Construction",
      icon: <HardHat size={48} />,
      summary: "Implementation of heavy-duty urban and industrial infrastructure.",
      details: ["Roadworks", "Sewer Reticulation", "Reservoir Construction", "Structural Works", "Waste Stabilisation Ponds"],
      stats: "Full Site Supervision"
    },
    {
      id: "training",
      title: "Training Hub",
      icon: <GraduationCap size={48} />,
      summary: "Industry-aligned software mastery for future engineers.",
      details: ["Civil 3D Training", "AutoCAD Workshops", "WaterGEMS Mastery", "BOQ Preparation", "Case-Study Analysis"],
      stats: "Practical Design Focused"
    }
  ];

  return (
    <div className="pt-24 bg-black min-h-screen text-white px-6 lg:px-12 text-left">
      <div className="max-w-[1600px] mx-auto py-32">
        <SectionHeader title="The Three Pillars" subtitle="Three segments ensuring a complete infrastructure life cycle." light />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-[3rem]">
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
              <button
                onClick={() => setCurrentPage('projects')}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-between px-8 hover:text-white transition-all duration-300 rounded-xl"
                style={{ '--hover-bg': '#0077B6' } as React.CSSProperties}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0077B6'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white'; (e.currentTarget as HTMLButtonElement).style.color = 'black'; }}
              >
                View Related Projects <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectsPage = () => (
  <div className="pt-24 bg-white min-h-screen px-6 lg:px-12 text-left text-black">
    <div className="max-w-[1600px] mx-auto py-32">
      <SectionHeader title="Project Reference" subtitle="Comprehensive structural and civil assignments across Zimbabwe." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 px-1 bg-gray-200 border border-gray-200 shadow-2xl">
        {CONFIG.PROJECTS.map((proj, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white p-12 hover:bg-gray-50 transition-all group">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-4 text-left">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 block" style={{ color: '#0077B6' }}>{proj.loc}</span>
                <h3 className="text-3xl font-black uppercase tracking-tighter group-hover:transition-colors" onMouseEnter={e => (e.currentTarget.style.color = '#0077B6')} onMouseLeave={e => (e.currentTarget.style.color = '')}>{proj.title}</h3>
              </div>
              <div className="md:text-right text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{proj.date}</p>
                <p className="text-xs font-mono font-bold text-gray-900 mt-1 uppercase tracking-tighter">{proj.stands}</p>
              </div>
            </div>
            <div className="flex gap-4 items-start text-left">
              <div className="w-1 h-12 bg-gray-100 flex-shrink-0"></div>
              <p className="text-gray-500 font-light text-base leading-relaxed max-w-2xl italic">{proj.scope}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', details: '' });

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = CONFIG.CONTACT.WHATSAPP_NUM;
    const message = `ENGINEERING INQUIRY\n\nNAME: ${formData.name.toUpperCase()}\nEMAIL: ${formData.email.toUpperCase()}\nDETAILS: ${formData.details.toUpperCase()}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pt-24 bg-white min-h-screen px-6 lg:px-12 text-left">
      <div className="max-w-[1600px] mx-auto py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="text-left">
            <SectionHeader title="Let's Build" subtitle="Connect with technical headquarters for project consultations and training cohorts." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 text-left">
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: '#0077B6' }}>Official Line</h5>
                <p className="text-3xl font-black text-black">{CONFIG.CONTACT.MAIN_LINE}</p>
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: '#0077B6' }}>Email</h5>
                <p className="text-xl font-black text-black break-all">{CONFIG.CONTACT.EMAIL}</p>
              </div>
            </div>
            <div className="mt-16 bg-black p-10 rounded-[2rem] text-white">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-6" style={{ color: '#0077B6' }}>Staff Extensions</h4>
              <div className="grid grid-cols-2 gap-4">
                {CONFIG.CONTACT.EXTENSIONS.map((ext, i) => (
                  <div key={i} className="text-[10px] border-l border-white/20 pl-4">
                    <span className="block font-bold">{ext.name}</span>
                    <span className="text-gray-500">{ext.num}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-black p-12 lg:p-20 text-left rounded-[3rem] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full" style={{ backgroundColor: '#0077B6' }}></div>
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-12">Direct WhatsApp Inquiry</h3>
            <form onSubmit={handleWhatsAppSubmit} className="space-y-10">
              <input
                type="text" required placeholder="IDENTIFICATION (FULL NAME)"
                className="w-full bg-transparent border-b-2 border-white/20 py-4 outline-none text-white font-bold text-lg uppercase focus:border-[#0077B6] transition-colors"
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email" required placeholder="EMAIL ADDR"
                className="w-full bg-transparent border-b-2 border-white/20 py-4 outline-none text-white font-bold text-lg uppercase focus:border-[#0077B6] transition-colors"
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <textarea
                rows={3} required placeholder="PROJECT REQUIREMENTS"
                className="w-full bg-transparent border-b-2 border-white/20 py-4 outline-none text-white font-bold text-lg uppercase focus:border-[#0077B6] transition-colors resize-none"
                onChange={e => setFormData({ ...formData, details: e.target.value })}
              />
              <button
                type="submit"
                className="w-full py-6 text-white font-black uppercase tracking-[0.4em] transition-all duration-500 rounded-xl"
                style={{ backgroundColor: '#0077B6' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white'; (e.currentTarget as HTMLButtonElement).style.color = 'black'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0077B6'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
              >
                Transmit via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage setCurrentPage={setCurrentPage} />;
      case 'about': return <AboutPage />;
      case 'services': return <ServicesPage setCurrentPage={setCurrentPage} />;
      case 'projects': return <ProjectsPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="selection:bg-[#0077B6] selection:text-white antialiased text-black bg-black min-h-screen overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
