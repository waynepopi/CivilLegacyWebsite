import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Menu, X, ChevronRight, ArrowRight, ChevronDown,
  Facebook, Twitter, Linkedin, Instagram,
  HardHat, Ruler, GraduationCap, Mail, MapPin, Briefcase, Search, ShoppingCart
} from 'lucide-react';
import { FaTiktok, FaInstagram, FaLinkedinIn, FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

// ─── CENTRALIZED CONFIG ──────────────────────────────────────────────────────

const CONFIG = {
  BRAND: {
    NAME_1: 'CIVIL',
    NAME_2: 'LEGACY',
    TAGLINE: 'Consultancy',
    REGISTRATION: 'ZIE 198098 | ECZ 151080',
  },
  CONTACT: {
    MAIN_LINE: '0718 246 433',
    SECONDARY_LINE: '+263 71 440 6037',
    WHATSAPP_NUM: '263718246433',
    EMAIL: 'info@civillegacy.com',
    OFFICES: [
      { name: 'Headquarters', location: '1066 Dam View Mall, Chipinge' },
      { name: 'Gweru Branch', location: '4248 Avian Way, Northlea' },
    ],
    EXTENSIONS: [
      { name: 'Tech Pamela', num: '0718 246 434' },
      { name: 'Bridget', num: '0718 246 435' },
      { name: 'Sharlom', num: '0718 246 439' },
      { name: 'Eng. Panashe', num: '0718 246 446' },
      { name: 'Tanya', num: '0718 246 463' },
      { name: 'Albert', num: '0718 246 468' },
      { name: 'Eng. Mutero', num: '0718 246 470' },
      { name: 'Planner Farai', num: '0718 246 473' },
      { name: 'Chiwawa', num: '0718 246 474' },
    ],
  },
  PROJECTS: [
    { title: 'Suncoast Project', loc: 'Masvingo', sector: 'Residential', scope: 'Road Design, Water Reticulation, Sewer Reticulation, Stormwater Drainage', stands: '3200 Stands', date: 'Oct 2022', status: 'Completed' },
    { title: 'The Nest of Kenilworth', loc: 'Chipinge', sector: 'Residential', scope: 'Water, Stormwater, Sewer, Road and Public Lighting Design', stands: '3800 Stands', date: 'Nov 2025', status: 'Underway' },
    { title: 'Victoria Range', loc: 'Masvingo', sector: 'Residential', scope: 'Water & Sewer Reticulation Designs', stands: '500 Stands', date: 'Dec 2023', status: 'Completed' },
    { title: 'Boronia Farm Subdivision', loc: 'Harare', sector: 'Residential', scope: 'Water Reticulation Design', stands: '200 Stands', date: 'Mar 2025', status: 'Underway' },
    { title: 'Flamboyant Project', loc: 'Masvingo', sector: 'Residential', scope: 'Water Reticulation Design', stands: '400 Stands', date: 'Jan 2023', status: 'Completed' },
    { title: 'Mutare Recovery Facility', loc: 'Mutare', sector: 'Industrial', scope: 'Full structural design & geotechnical guidance for Industrial Waste Processing Structure', stands: 'Industrial', date: 'Completed', status: 'Completed' },
    { title: 'Madziwa Structural Development', loc: 'Gweru', sector: 'Industrial', scope: 'Full structural design, detailing and documentation for reinforced concrete multi-level building', stands: 'Multi-Storey', date: 'Completed', status: 'Completed' },
    { title: 'Popi Residence', loc: 'Gweru', sector: 'Residential', scope: 'High-end modern residential structural design with reinforced concrete framing and cantilever elements', stands: 'Randolph Phase 1', date: 'Underway', status: 'Underway' },
    { title: 'Proposed Shops & Offices', loc: 'Rusape', sector: 'Commercial', scope: 'Commercial double-storey structural design and reinforcement detailing under BS 8110 standards', stands: 'Stand 2461', date: 'Approved', status: 'Approved' },
    { title: 'Waste Stabilisation Ponds', loc: 'Gweru', sector: 'Infrastructure', scope: 'Design of complete wastewater stabilisation pond system and abattoir effluent treatment', stands: 'Connemara Farm', date: 'Completed', status: 'Completed' },
    { title: 'Fuel Service Station', loc: 'Muzarabani', sector: 'Commercial', scope: 'Commercial structural design of canopy, steel framing and composite infrastructure', stands: 'Energy Park', date: 'Completed', status: 'Completed' },
    { title: '219m² Residential Unit', loc: 'Chipinge', sector: 'Residential', scope: 'Structural design for modern medium-density residential development including boundary walls', stands: 'Residential', date: 'Completed', status: 'Completed' },
    { title: 'Residential Unit (St Kelvin)', loc: 'Chipinge', sector: 'Residential', scope: 'Full structural design and construction documentation for high-end multi-bedroom dwelling', stands: 'High-End', date: 'Completed', status: 'Completed' },
    { title: 'Church Structure Foundation', loc: 'Chipinge', sector: 'Institutional', scope: 'Structural foundation design and reinforcement detailing for institutional development', stands: 'UCCZ Gaza', date: 'Completed', status: 'Completed' },
    { title: 'Structural Building Development', loc: 'Mt Selinda', sector: 'Institutional', scope: 'Comprehensive multi-storey reinforced concrete building structural design and certification', stands: 'Multi-Storey', date: 'Completed', status: 'Completed' },
  ],
  TEAM: [
    { name: 'Eng. Dereck M. Popi', role: 'Company Director', id: 'ZIE 198098 | ECZ 151080', creds: 'BSc (Hons), MBA, Pr Eng', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600' },
    { name: 'Simbarashe Musakwembewa', role: 'Structural Expert', id: 'ZIE 084408 | ECZ 150285', creds: 'BSc (Hons), Pr. Eng, MECZ', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
    { name: 'Eng. Byron Muzovaka', role: 'GeoTech Expert', id: 'ZIE 144395 | ECZ 100645', creds: 'BSc (Hons), ECZ, Pr. Eng', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600' },
    { name: 'Eng. Panashe Gora', role: 'Lead Engineer', id: 'ZIE 144446 | ECZ 100446', creds: 'BSc (Hons), ECZ, Pr. Eng', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600' },
    { name: 'Tawanda Mvarume', role: 'Civil & Water Engineer', id: 'ZIE 150410 | ECZ 120511', creds: 'BSc (Hons), Civil Design Specialist', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600' },
  ],
  SCROLL_IMAGES: [
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1504307651254-35680f3366d4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517089535819-3d8569aa83fa?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800',
  ],
  SERVICES: [
    {
      id: 'construction',
      title: 'Construction',
      pillar: 'Construction',
      Icon: HardHat,
      summary: 'Implementation of heavy-duty urban and industrial infrastructure.',
      details: ['Roadworks', 'Sewer Reticulation', 'Reservoir Construction', 'Structural Works', 'Waste Stabilisation Ponds'],
      price: 1500, // Mock price for cart
    },
    {
      id: 'consultancy',
      title: 'Consultancy',
      pillar: 'Consultancy',
      Icon: Ruler,
      summary: 'Precision-driven strategic engineering and detailed design.',
      details: ['Feasibility Studies', 'Hydraulic Modeling', 'Detailed Design', 'Contract Administration', 'Structural Analysis'],
      price: 800, // Mock price for cart
    },
    {
      id: 'project-management',
      title: 'Project Management',
      pillar: 'Project Management',
      Icon: Briefcase,
      summary: 'End-to-end execution, supervision, and lifecycle management.',
      details: ['Project Planning', 'Risk Mitigation', 'Quality Assurance', 'Cost Control', 'Site Supervision'],
      price: 0, // Quote based
    },
    // Adding some more mock services for each pillar to demonstrate filtering
    {
      id: 'bridge-design',
      title: 'Bridge Design',
      pillar: 'Consultancy',
      Icon: Ruler,
      summary: 'Advanced structural design for urban and rural bridge infrastructure.',
      details: ['Structural Analysis', 'Load Testing', 'Material Spec'],
      price: 1200,
    },
    {
      id: 'road-construction',
      title: 'Highway Construction',
      pillar: 'Construction',
      Icon: HardHat,
      summary: 'Large scale highway and arterial road implementation.',
      details: ['Asphalt Laying', 'Earthworks', 'Drainage'],
      price: 5000,
    },
  ],
} as const;

type Page = 'home' | 'about' | 'services' | 'projects' | 'team' | 'contact' | 'training' | 'checkout' | 'mock-payment-gateway' | 'payment-success' | 'payment-error';

// ─── SHARED PRIMITIVES ───────────────────────────────────────────────────────

const BLUE = '#0077B6';

const SectionHeader = ({
  title,
  subtitle,
  light = false,
}: {
  title: string;
  subtitle: string;
  light?: boolean;
}) => (
  <div className="mb-20 text-left">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-1" style={{ backgroundColor: BLUE }} />
      <span
        className="text-[10px] font-black uppercase tracking-[0.5em]"
        style={{ color: light ? '#9ca3af' : BLUE }}
      >
        Technical Specification
      </span>
    </div>
    <h2
      className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6"
      style={{ color: light ? '#ffffff' : '#000000' }}
    >
      {title}
    </h2>
    <p
      className="text-xl font-light max-w-2xl leading-relaxed"
      style={{ color: light ? '#9ca3af' : '#4b5563' }}
    >
      {subtitle}
    </p>
  </div>
);

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

const Navbar = ({
  currentPage,
  setCurrentPage,
  cartCount,
}: {
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
  cartCount: number;
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (id: Page) => {
    setCurrentPage(id);
    setIsMobileMenuOpen(false);
  };

  const showCart = ['services', 'checkout', 'mock-payment-gateway', 'payment-success', 'payment-error'].includes(currentPage);

  let navClasses = "fixed w-full z-[100] transition-all duration-300 border-b border-white/10 bg-black/85 ";
  if (!scrolled) {
    navClasses += "backdrop-blur-sm";
  } else if (scrollDirection === 'down') {
    navClasses += "backdrop-blur-xl";
  } else {
    navClasses += "backdrop-blur-none";
  }

  return (
    <nav className={navClasses}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-24 items-center">
          {/* Logo */}
          <button onClick={() => navigate('home')} className="flex items-center gap-4 text-left focus:outline-none">
            <img
              src="/logo-mark.png"
              alt="Civil Legacy Logo Mark"
              className="h-16 w-auto object-contain"
            />
            <div>
              <div className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                {CONFIG.BRAND.NAME_1}
                <span style={{ color: BLUE }}>{CONFIG.BRAND.NAME_2}</span>
              </div>
              <div
                className="text-[9px] font-bold tracking-[0.4em] uppercase mt-1"
                style={{ color: BLUE }}
              >
                {CONFIG.BRAND.TAGLINE}
              </div>
            </div>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-8">
                <NavigationMenuItem>
                  <button onClick={() => navigate('home')} className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all relative focus:outline-none ${currentPage === 'home' ? 'text-[#0077B6]' : 'text-gray-400 hover:text-white'}`}>
                    Home
                  </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button onClick={() => navigate('about')} className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all relative focus:outline-none ${currentPage === 'about' ? 'text-[#0077B6]' : 'text-gray-400 hover:text-white'}`}>
                    About Us
                  </button>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 hover:text-white hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-white transition-colors h-auto p-0">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-black/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl">
                      {CONFIG.SERVICES.map((service) => (
                        <li key={service.id}>
                          <NavigationMenuLink asChild>
                            <button
                              onClick={() => navigate('services')}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 text-left w-full"
                            >
                              <div className="text-sm font-bold text-white uppercase tracking-tighter mb-1">{service.title}</div>
                              <p className="line-clamp-2 text-xs leading-snug text-gray-400">
                                {service.summary}
                              </p>
                            </button>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <button onClick={() => navigate('projects')} className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all relative focus:outline-none ${currentPage === 'projects' ? 'text-[#0077B6]' : 'text-gray-400 hover:text-white'}`}>
                    Projects
                  </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button onClick={() => navigate('team')} className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all relative focus:outline-none ${currentPage === 'team' ? 'text-[#0077B6]' : 'text-gray-400 hover:text-white'}`}>
                    Team
                  </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button onClick={() => navigate('contact')} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative focus:outline-none ${currentPage === 'contact' ? 'text-[#0077B6]' : 'text-gray-400 hover:text-white'}`}>
                    Contact
                  </button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-6">
              {/* Conditional Cart Button Rendering */}
              {showCart && (
                <button
                  onClick={() => navigate('checkout')}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors focus:outline-none group"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#0077B6] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                  <span className="absolute top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                    View Cart
                  </span>
                </button>
              )}

              {/* Prominent Training Hub Link */}
              <button
                onClick={() => navigate('training')}
                className={`px-6 py-2.5 font-black uppercase tracking-[0.2em] text-[10px] rounded-md transition-all duration-300 focus:outline-none flex items-center gap-2 ${currentPage === 'training' ? 'bg-[#0077B6] text-white' : 'bg-white text-black hover:bg-[#0077B6] hover:text-white'}`}
              >
                <GraduationCap size={14} /> Training Hub
              </button>
            </div>
          </div>

          {/* Mobile Actions: Cart (Conditional) + Hamburger Menu */}
          <div className="lg:hidden flex items-center gap-4">
            {showCart && (
              <button
                onClick={() => navigate('checkout')}
                className="relative p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#0077B6] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="text-white p-2 border border-white/20 rounded focus:outline-none">
                  <Menu size={20} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px] bg-black border-r border-white/10 p-0 text-white">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation for the application</SheetDescription>
                <div className="pt-24 px-8 pb-4 h-full flex flex-col overflow-y-auto">
                  <button onClick={() => navigate('home')} className="block w-full text-left text-3xl font-black uppercase tracking-tighter text-white hover:text-[#0077B6] transition-colors py-4 border-b border-white/5">Home</button>
                  <button onClick={() => navigate('about')} className="block w-full text-left text-3xl font-black uppercase tracking-tighter text-white hover:text-[#0077B6] transition-colors py-4 border-b border-white/5">About Us</button>
                  <button onClick={() => navigate('services')} className="block w-full text-left text-3xl font-black uppercase tracking-tighter text-white hover:text-[#0077B6] transition-colors py-4 border-b border-white/5">Services</button>
                  <div className="pl-6 py-2 space-y-4 border-b border-white/5">
                    {CONFIG.SERVICES.map(s => (
                      <button key={s.id} onClick={() => navigate('services')} className="block w-full text-left text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">{s.title}</button>
                    ))}
                  </div>
                  <button onClick={() => navigate('projects')} className="block w-full text-left text-3xl font-black uppercase tracking-tighter text-white hover:text-[#0077B6] transition-colors py-4 border-b border-white/5">Projects</button>
                  <button onClick={() => navigate('team')} className="block w-full text-left text-3xl font-black uppercase tracking-tighter text-white hover:text-[#0077B6] transition-colors py-4 border-b border-white/5">Team</button>
                  <button onClick={() => navigate('contact')} className="block w-full text-left text-3xl font-black uppercase tracking-tighter text-white hover:text-[#0077B6] transition-colors py-4 border-b border-white/5">Contact</button>
                  <div className="mt-8 mb-8">
                    <button
                      onClick={() => navigate('training')}
                      className={`w-full py-4 text-center font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${currentPage === 'training' ? 'bg-[#0077B6] text-white' : 'bg-white text-black hover:bg-[#0077B6] hover:text-white'}`}
                    >
                      <GraduationCap size={16} /> Training Hub
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ─── HERO ────────────────────────────────────────────────────────────────────

const Hero = ({
  titleLine1,
  titleLine2,
  subtitle,
  bgImage,
  ctaLabel,
  onCta,
}: {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  bgImage: string;
  ctaLabel: string;
  onCta: () => void;
}) => (
  <section className="relative h-[90vh] min-h-[600px] flex items-center bg-black overflow-hidden px-6 lg:px-12 border-b border-white/10">
    {/* Background */}
    <div className="absolute inset-0 z-0">
      <img
        src={bgImage}
        alt="Hero"
        className="w-full h-full object-cover"
        style={{ filter: 'grayscale(1) brightness(0.3) contrast(1.25)', transform: 'scale(1.05)' }}
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
        <h1 className="text-6xl md:text-[10rem] font-black text-white leading-[0.85] tracking-tighter uppercase mb-12">
          {titleLine1}
          <br />
          <span style={{ color: BLUE }}>{titleLine2}</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-light max-w-xl mb-12 tracking-tight">
          {subtitle}
        </p>
        <button
          onClick={onCta}
          className="group flex items-center gap-3 px-12 py-6 font-black uppercase tracking-[0.3em] text-xs text-white transition-all duration-500 hover:bg-white hover:text-black shadow-2xl"
          style={{ backgroundColor: BLUE }}
        >
          {ctaLabel}
          <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </motion.div>
    </div>
  </section>
);

// ─── SCROLLING BANNER ────────────────────────────────────────────────────────

const ScrollingBanner = () => {
  const doubled = useMemo(
    () => [...CONFIG.SCROLL_IMAGES, ...CONFIG.SCROLL_IMAGES],
    [],
  );
  const totalOffset = CONFIG.SCROLL_IMAGES.length * 548;

  return (
    <div className="py-20 bg-black overflow-hidden border-y border-white/5">
      <motion.div
        className="flex gap-12 px-6"
        animate={{ x: [0, -totalOffset] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className="min-w-[500px] h-[350px] overflow-hidden flex-shrink-0 rounded-2xl border border-white/10"
            style={{ filter: 'grayscale(1) brightness(0.75)' }}
          >
            <img src={src} alt="Project" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ─── ACCORDION ITEM ──────────────────────────────────────────────────────────

const AccordionItem = ({
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
  <div className={`border-b border-white/10 transition-colors duration-500 ${isOpen ? 'bg-white/5' : ''}`}>
    <button
      onClick={onToggle}
      className="w-full py-10 px-8 flex items-center justify-between text-left focus:outline-none"
    >
      <span
        className="text-2xl font-black uppercase tracking-tighter transition-all"
        style={{ color: isOpen ? BLUE : '#ffffff' }}
      >
        {title}
      </span>
      <ChevronDown
        size={32}
        strokeWidth={3}
        className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
        style={{ color: isOpen ? BLUE : '#4b5563' }}
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
            <p className="text-gray-400 text-lg font-light leading-relaxed">{content}</p>
            <div
              className="h-64 border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              style={{ filter: 'grayscale(1) brightness(0.5) contrast(1.25)' }}
            >
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ─── FOOTER ──────────────────────────────────────────────────────────────────

const Footer = ({ setCurrentPage }: { setCurrentPage: (p: Page) => void }) => {
  const SOCIAL_ICONS = [Facebook, Twitter, Linkedin, Instagram];
  const { toast } = useToast();

  const copyPhone = () => {
    navigator.clipboard.writeText(String(CONFIG.CONTACT.MAIN_LINE));
    toast({ description: 'Copied to clipboard!' });
  };

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/5 text-left">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand & Trust */}
          <div>
            <img
              src="/logo-full.png"
              alt="Civil Legacy Full Logo"
              className="h-16 w-auto object-contain mb-8"
            />
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Zimbabwe's premier engineering legacy built on structural precision and water management excellence.
            </p>
            {/* Trust Elements */}
            <div className="mb-8 p-4 border border-white/10 rounded-xl bg-white/5 inline-block">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: BLUE }}>Accreditations</h4>
              <p className="text-xs font-bold text-white tracking-widest">{String(CONFIG.BRAND.REGISTRATION)}</p>
            </div>
            <div className="flex gap-4">
              {SOCIAL_ICONS.map((Icon, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 cursor-pointer border border-white/5 rounded-full transition-all hover:text-white"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.backgroundColor = BLUE)}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.05)')}
                >
                  <Icon size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BLUE }}>
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
              {(['home', 'about', 'services', 'projects', 'team', 'contact'] as Page[]).map((p) => (
                <li
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  {p === 'about' ? 'About Us' : p.charAt(0).toUpperCase() + p.slice(1)}
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BLUE }}>
              Operational Hubs
            </h4>
            <ul className="space-y-6 text-sm text-gray-400 font-light">
              {CONFIG.CONTACT.OFFICES.map((off, idx) => (
                <li key={idx} className="flex flex-col gap-1">
                  <span className="text-white font-bold uppercase tracking-widest text-[10px]">
                    {off.name}
                  </span>
                  <span>{off.location}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BLUE }}>
              Transmission
            </h4>
            <ul className="space-y-4 text-sm font-mono text-gray-400">
              <li>
                <button
                  onClick={copyPhone}
                  className="text-white font-black hover:text-[#0077B6] transition-colors cursor-pointer"
                  title="Click to copy"
                >
                  {String(CONFIG.CONTACT.MAIN_LINE)}
                </button>
              </li>
              <li>
                <a
                  href={`mailto:${String(CONFIG.CONTACT.EMAIL)}`}
                  className="hover:text-white transition-colors"
                >
                  {String(CONFIG.CONTACT.EMAIL)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-600 text-[10px] uppercase tracking-[0.4em] font-bold">
          <p>© 2026 {CONFIG.BRAND.NAME_1} {CONFIG.BRAND.NAME_2} CONSULTANCY</p>
          <p>CHIPINGE | GWERU | HARARE</p>
        </div>
      </div>
    </footer>
  );
};

// ─── PAGE: HOME ───────────────────────────────────────────────────────────────

const HomePage = ({ setCurrentPage }: { setCurrentPage: (p: Page) => void }) => {
  const [openIdx, setOpenIdx] = useState<number>(0);

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
    <div className="bg-black">
      <Hero
        titleLine1="SHAPING"
        titleLine2="LEGACY."
        subtitle="Zimbabwe's leading civil engineering consultancy delivering high-impact water and infrastructure solutions across the region."
        bgImage="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1600"
        ctaLabel="View Reference List"
        onCta={() => setCurrentPage('projects')}
      />

      <ScrollingBanner />

      {/* Banner */}
      <section className="bg-[#0077B6] py-16 px-6 lg:px-12 text-center border-y border-white/10">
        <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-sm">
          Technical Documentation Services
        </h3>
        <p className="text-white/80 font-bold tracking-widest uppercase text-xs md:text-sm">
          Comprehensive reporting, civil drawings, and regulatory submissions.
        </p>
      </section>

      {/* Four Pillars */}
      <section className="py-32 bg-black px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <SectionHeader
            title="The Four Pillars"
            subtitle="Four segments ensuring a complete infrastructure life cycle."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 text-left">
            {CONFIG.SERVICES.map((pillar) => {
              const { Icon } = pillar;
              return (
                <motion.div
                  key={pillar.id}
                  whileHover={{ y: -10 }}
                  className="bg-white/5 p-10 flex flex-col group border border-white/10 shadow-2xl rounded-2xl"
                >
                  <div className="mb-8 transform group-hover:scale-110 origin-left transition-transform" style={{ color: BLUE }}>
                    <Icon size={40} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">{String(pillar.title)}</h3>
                  <p className="text-gray-400 text-sm font-light mb-8 leading-relaxed flex-grow">{String(pillar.summary)}</p>
                  <div className="space-y-3 border-l-2 border-white/5 pl-4">
                    {pillar.details.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: BLUE }} />
                        {String(item)}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
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

      {/* Resilience Teaser (Duplicated at bottom) */}
      <section className="py-32 bg-black px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7">
            <SectionHeader
              title="Engineering Resilience"
              subtitle="Leveraging cutting-edge methodologies and a client-centric ethos to ensure resilient systems that serve communities for generations."
              light
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 text-left">
              <div className="space-y-4">
                <h4 className="text-2xl font-black uppercase tracking-tighter text-white">Our Mission</h4>
                <p className="text-gray-400 font-light leading-relaxed">
                  To empower engineers and organisations with practical, design-focused training and consultancy that elevates standards across the region.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-2xl font-black uppercase tracking-tighter text-white">Our Vision</h4>
                <p className="text-gray-400 font-light leading-relaxed">
                  To be the premier provider of engineering excellence and professional development in Southern Africa.
                </p>
              </div>
            </div>
          </div>

          {/* Stats card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div
              className="bg-white/5 p-12 lg:p-20 text-white relative overflow-hidden text-left border border-white/10"
              style={{ borderLeft: `12px solid ${BLUE}` }}
            >
              <div className="text-[12rem] font-black leading-none tracking-tighter text-white opacity-5 absolute -top-10 right-0 pointer-events-none select-none">
                15
              </div>
              <h3 className="text-7xl font-black tracking-tighter mb-4 relative z-10">
                15+
              </h3>
              <p className="text-xs font-black uppercase tracking-[0.4em] mb-12 relative z-10" style={{ color: BLUE }}>
                Verified Projects
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
                    <p className="font-bold text-sm text-white">{String(CONFIG.TEAM[0].name)}</p>
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

// ─── PAGE: ABOUT US ───────────────────────────────────────────────────────────

const AboutUsPage = () => (
  <div className="bg-black min-h-screen text-white pt-24">
    {/* About teaser */}
    <section className="py-32 bg-black px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-7">
          <SectionHeader
            title="Engineering Resilience"
            subtitle="Leveraging cutting-edge methodologies and a client-centric ethos to ensure resilient systems that serve communities for generations."
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 text-left">
            <div className="space-y-4">
              <h4 className="text-2xl font-black uppercase tracking-tighter text-white">Our Mission</h4>
              <p className="text-gray-400 font-light leading-relaxed">
                To empower engineers and organisations with practical, design-focused training and consultancy that elevates standards across the region.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-2xl font-black uppercase tracking-tighter text-white">Our Vision</h4>
              <p className="text-gray-400 font-light leading-relaxed">
                To be the premier provider of engineering excellence and professional development in Southern Africa.
              </p>
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div
            className="bg-white/5 p-12 lg:p-20 text-white relative overflow-hidden text-left border border-white/10"
            style={{ borderLeft: `12px solid ${BLUE}` }}
          >
            <div className="text-[12rem] font-black leading-none tracking-tighter text-white opacity-5 absolute -top-10 right-0 pointer-events-none select-none">
              15
            </div>
            <h3 className="text-7xl font-black tracking-tighter mb-4 relative z-10">
              15+
            </h3>
            <p className="text-xs font-black uppercase tracking-[0.4em] mb-12 relative z-10" style={{ color: BLUE }}>
              Verified Projects
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
                  <p className="font-bold text-sm text-white">{String(CONFIG.TEAM[0].name)}</p>
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

// ─── PAGE: TEAM ───────────────────────────────────────────────────────────────

const TeamPage = () => (
  <div className="pt-24 bg-black min-h-screen text-white px-6 lg:px-12 text-left">
    <div className="max-w-[1600px] mx-auto py-32">
      <SectionHeader
        title="Expertise"
        subtitle="Our multidisciplinary board of registered Professional Engineers."
        light
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
        {CONFIG.TEAM.map((member, i) => (
          <Card
            key={i}
            className="bg-white/5 border-white/10 hover:border-[#0077B6]/50 transition-all duration-500 overflow-hidden group rounded-[2rem] h-full flex flex-col"
          >
            <div className="relative aspect-square overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
              <img
                src={member.img}
                alt={String(member.name)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
                {String(member.name)}
              </CardTitle>
              <CardDescription className="font-bold text-xs uppercase tracking-widest" style={{ color: BLUE }}>
                {String(member.role)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-6 flex-grow">
              <div className="space-y-4">
                <div className="h-px bg-white/10 w-12" />
                <div className="space-y-1 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BLUE }} />
                    {String(member.creds)}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BLUE }} />
                    {String(member.id)}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <div className="flex gap-4">
                 {/* Social links could go here if needed, but keeping it clean as per brand */}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// ─── PAGE: STOREFRONT (SERVICES) ─────────────────────────────────────────────
const StorefrontHero = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) => (
  <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-black overflow-hidden px-6 lg:px-12 border-b border-white/10">
    <div className="absolute inset-0 z-0">
      <img
        src="https://images.unsplash.com/photo-1504307651254-35680f3366d4?auto=format&fit=crop&q=80&w=1600"
        alt="Storefront Hero"
        className="w-full h-full object-cover"
        style={{ filter: 'grayscale(1) brightness(0.2) contrast(1.2)' }}
      />
    </div>
    <div className="relative z-10 w-full max-w-4xl text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8"
      >
        Engineering <span style={{ color: BLUE }}>Services</span> Store
      </motion.h2>
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="SEARCH CONSTRUCTION, CONSULTANCY, OR PROJECT MGMT..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 text-white font-bold tracking-widest uppercase placeholder:text-gray-500 focus:outline-none focus:border-[#0077B6] transition-all"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">
          <Search size={24} />
        </div>
      </div>
    </div>
  </section>
);

const ServicesPage = ({
  setCurrentPage,
  addToCart,
}: {
  setCurrentPage: (p: Page) => void;
  addToCart: (service: any) => void;
}) => {
  const { toast } = useToast();
  const [activePillar, setActivePillar] = useState<'All' | 'Construction' | 'Consultancy' | 'Project Management'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = CONFIG.SERVICES.filter((s) => {
    const matchesPillar = activePillar === 'All' || s.pillar === activePillar;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPillar && matchesSearch;
  });

  const pillars = ['All', 'Construction', 'Consultancy', 'Project Management'] as const;

  const handleQuoteRequest = (service: any) => {
    toast({
      title: "Quote Requested",
      description: `A technical specialist will contact you regarding ${service.title}.`,
    });
  };

  return (
    <div className="bg-black min-h-screen text-white text-left">
      <StorefrontHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
        {/* Pillar Filters */}
        <div className="flex flex-wrap gap-4 mb-20 justify-center">
          {pillars.map((pillar) => (
            <button
              key={pillar}
              onClick={() => setActivePillar(pillar)}
              className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 border ${
                activePillar === pillar
                  ? 'bg-[#0077B6] border-[#0077B6] text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {pillar}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/5 border-white/10 hover:border-[#0077B6]/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden flex flex-col h-full group">
                  <CardHeader className="p-10 pb-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-[#0077B6]/10 rounded-2xl text-[#0077B6] group-hover:scale-110 transition-transform">
                        <service.Icon size={32} />
                      </div>
                      <Badge variant="outline" className="text-[9px] uppercase tracking-[0.2em] border-white/10 text-gray-400">
                        {service.pillar}
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
                      {service.title}
                    </CardTitle>
                    <p className="text-gray-500 text-sm font-light leading-relaxed">
                      {service.summary}
                    </p>
                  </CardHeader>
                  <CardContent className="p-10 pt-0 flex-grow">
                     <div className="space-y-3 mb-8">
                        {service.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <div className="w-1 h-1 rounded-full bg-[#0077B6]" />
                            {detail}
                          </div>
                        ))}
                     </div>
                     {service.price > 0 && (
                        <div className="text-2xl font-black text-white mb-6">
                          ${service.price.toLocaleString()}
                          <span className="text-[10px] text-gray-500 ml-2 font-bold uppercase tracking-widest">Est. Base Price</span>
                        </div>
                     )}
                  </CardContent>
                  <CardFooter className="p-10 pt-0">
                    {service.pillar === 'Project Management' ? (
                      <Button
                        className="w-full h-16 bg-white text-black hover:bg-white/90 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all"
                        onClick={() => handleQuoteRequest(service)}
                      >
                        Request a Quote
                      </Button>
                    ) : (
                      <Button
                        className="w-full h-16 bg-[#0077B6] hover:bg-[#0077B6]/80 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all"
                        onClick={() => addToCart(service)}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-32">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-500">No Services Found</h3>
            <p className="text-gray-600 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Training Hub Sticky Tab */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[90] hidden md:block">
        <button
          onClick={() => setCurrentPage('training')}
          className="bg-white text-black border-y border-l border-white/10 px-6 py-6 rounded-l-3xl shadow-2xl flex flex-col items-center gap-4 hover:bg-[#0077B6] hover:text-white transition-all duration-500 group"
        >
          <GraduationCap size={24} className="group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-lr] font-black uppercase tracking-[0.3em] text-[10px]">Training Hub</span>
        </button>
      </div>

      {/* Training Hub FAB for Mobile */}
      <div className="fixed left-6 bottom-6 z-[100] md:hidden">
        <button
          onClick={() => setCurrentPage('training')}
          className="bg-white text-black w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#0077B6] hover:text-white transition-all"
        >
          <GraduationCap size={24} />
        </button>
      </div>
    </div>
  );
};

// ─── PAGE: PROJECTS ───────────────────────────────────────────────────────────

const ProjectsPage = () => (
  <div className="pt-24 bg-black min-h-screen px-6 lg:px-12 text-left text-white">
    <div className="max-w-[1600px] mx-auto py-32">
      <SectionHeader
        title="Project Reference"
        subtitle="Comprehensive structural and civil assignments across Zimbabwe."
        light
      />
      
      {/* Featured Projects Carousel */}
      <Carousel className="w-full max-w-6xl mx-auto mb-32">
        <CarouselContent>
          {CONFIG.PROJECTS.slice(0, 5).map((proj, i) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3 p-4">
              <Card className="bg-white/5 border-white/10 h-full flex flex-col hover:border-[#0077B6]/50 transition-all duration-500 rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-white/20 text-gray-400">
                      {String(proj.sector)}
                    </Badge>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{String(proj.status)}</span>
                  </div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter text-white">
                    {String(proj.title)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex-grow">
                   <p className="text-gray-400 font-light text-sm italic mb-4 line-clamp-3">"{String(proj.scope)}"</p>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0077B6]">
                      <MapPin size={12} /> {String(proj.loc)}
                   </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="bg-white/5 border-white/10 text-white hover:bg-[#0077B6] -left-12" />
          <CarouselNext className="bg-white/5 border-white/10 text-white hover:bg-[#0077B6] -right-12" />
        </div>
      </Carousel>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CONFIG.PROJECTS.map((proj, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-white/5 border-white/10 hover:border-[#0077B6]/30 transition-all duration-500 rounded-[2rem] h-full">
              <CardHeader className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="secondary" className="bg-[#0077B6]/10 text-[#0077B6] border-none text-[8px] uppercase tracking-widest">
                    {String(proj.sector)}
                  </Badge>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{String(proj.date)}</span>
                </div>
                <CardTitle className="text-xl font-black uppercase tracking-tighter text-white">
                  {String(proj.title)}
                </CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] mt-1" style={{ color: BLUE }}>
                  {String(proj.loc)}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="space-y-4">
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                    <p className="text-gray-400 text-xs font-light leading-relaxed line-clamp-2">
                       {String(proj.scope)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                       Capacity: {String(proj.stands)}
                    </div>
                    <Badge variant="outline" className={`text-[8px] uppercase tracking-widest ${proj.status === 'Completed' ? 'border-green-500/50 text-green-500' : 'border-[#0077B6]/50 text-[#0077B6]'}`}>
                       {String(proj.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

// ─── PAGE: CONTACT ────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  type: z.enum(["General Inquiry", "RFQ", "Corporate Training"]),
  message: z.string().min(10, "Please provide more details"),
});

type ContactValues = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const { toast } = useToast();
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      type: "General Inquiry",
      message: "",
    },
  });

  const copyPhone = () => {
    navigator.clipboard.writeText(String(CONFIG.CONTACT.MAIN_LINE));
    toast({ description: 'Copied to clipboard!' });
  };

  const onSubmit = (values: ContactValues) => {
    const sanitizedName = encodeURIComponent(values.name.trim().toUpperCase());
    const sanitizedEmail = encodeURIComponent(values.email.trim().toUpperCase());
    const sanitizedType = encodeURIComponent(values.type.trim().toUpperCase());
    const sanitizedMessage = encodeURIComponent(values.message.trim().toUpperCase());
    
    const whatsappMessage = encodeURIComponent(
      `CIVIL LEGACY INQUIRY\n\nTYPE: ${decodeURIComponent(sanitizedType)}\nNAME: ${decodeURIComponent(sanitizedName)}\nEMAIL: ${decodeURIComponent(sanitizedEmail)}\n\nMESSAGE: ${decodeURIComponent(sanitizedMessage)}`,
    );
    
    window.open(
      `https://wa.me/${String(CONFIG.CONTACT.WHATSAPP_NUM)}?text=${whatsappMessage}`,
      '_blank',
      'noopener,noreferrer',
    );
    
    toast({
      title: "Inquiry Initialized",
      description: "Redirecting to WhatsApp for secure transmission.",
    });
  };

  const SOCIAL_LINKS = [
    { icon: FaTiktok,      label: 'TikTok',    href: 'https://www.tiktok.com/@civillegacy' },
    { icon: FaInstagram,   label: 'Instagram',  href: 'https://www.instagram.com/civillegacy' },
    { icon: FaLinkedinIn,  label: 'LinkedIn',   href: 'https://www.linkedin.com/company/civillegacy' },
    { icon: FaFacebookF,   label: 'Facebook',   href: 'https://www.facebook.com/civillegacy' },
    { icon: FaWhatsapp,    label: 'WhatsApp',   href: `https://wa.me/${String(CONFIG.CONTACT.WHATSAPP_NUM)}` },
    { icon: Mail,          label: 'Email',      href: `mailto:${String(CONFIG.CONTACT.EMAIL)}` },
    { icon: MapPin,        label: 'Location',   href: `https://maps.google.com/?q=${encodeURIComponent(String(CONFIG.CONTACT.OFFICES[0].location))}` },
  ];

  return (
    <div className="pt-24 bg-black min-h-screen px-6 lg:px-12 text-left text-white">
      <div className="max-w-[1600px] mx-auto py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Left: info */}
          <div>
            <SectionHeader
              title="Transmission"
              subtitle="Connect with technical headquarters for project consultations and training cohorts."
              light
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: BLUE }}>
                  Direct Feed
                </h5>
                <button
                  onClick={copyPhone}
                  className="text-4xl font-black text-white hover:text-[#0077B6] transition-colors cursor-pointer tracking-tighter"
                  title="Click to copy"
                >
                  {String(CONFIG.CONTACT.MAIN_LINE)}
                </button>
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: BLUE }}>
                  Network Node
                </h5>
                <a
                  href={`mailto:${String(CONFIG.CONTACT.EMAIL)}`}
                  className="text-2xl font-black text-white break-all hover:text-[#0077B6] transition-colors tracking-tighter"
                >
                  {String(CONFIG.CONTACT.EMAIL)}
                </a>
              </div>
            </div>
            
            <div className="mt-16 bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8" style={{ color: BLUE }}>
                Satellite Links
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                  <a 
                    key={label} 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#0077B6]/60 hover:bg-white/5 transition-all group"
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-[#0077B6]/20 transition-colors text-gray-400 group-hover:text-white">
                      <Icon size={18} />
                    </span>
                    <span className="text-xs font-black text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors">
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Hook Form */}
          <div
            className="p-12 lg:p-16 rounded-[3rem] border border-white/5 relative bg-white/5 overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 opacity-5 rounded-bl-full"
              style={{ backgroundColor: BLUE }}
            />
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
              Secure Uplink
            </h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-12">
               Encryption-ready technical inquiry portal
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">FullName</FormLabel>
                      <FormControl>
                        <Input placeholder="DESIGNATION / NAME" {...field} className="bg-transparent border-white/10 text-white font-bold h-14 rounded-xl focus:border-[#0077B6]" />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">EmailAddress</FormLabel>
                      <FormControl>
                        <Input placeholder="NODE@NETWORK.COM" {...field} className="bg-transparent border-white/10 text-white font-bold h-14 rounded-xl focus:border-[#0077B6]" />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">InquiryRouting</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-white/10 text-white font-bold h-14 rounded-xl focus:border-[#0077B6]">
                            <SelectValue placeholder="SELECT ROUTE" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-white/10 text-white uppercase font-bold">
                          <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                          <SelectItem value="RFQ">Request for Quotation (RFQ)</SelectItem>
                          <SelectItem value="Corporate Training">Corporate Training Cohort</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">ProjectParameters</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="DESCRIBE TECHNICAL REQUIREMENTS..." 
                          className="bg-transparent border-white/10 text-white font-bold rounded-xl focus:border-[#0077B6] min-h-[120px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-16 bg-[#0077B6] hover:bg-[#0077B6]/80 text-white font-black uppercase tracking-[0.4em] rounded-xl transition-all duration-300"
                >
                  Initiate Secure Transmission
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: CHECKOUT ───────────────────────────────────────────────────────────

const checkoutSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  whatsapp_number: z.string().min(10, "Valid WhatsApp number is required"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = ({
  cart,
  removeFromCart,
  setCurrentPage,
}: {
  cart: any[];
  removeFromCart: (index: number) => void;
  setCurrentPage: (p: Page) => void;
}) => {
  const { toast } = useToast();
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      whatsapp_number: "",
    },
  });

  const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);

  const onSubmit = async (values: CheckoutValues) => {
    try {
      const response = await fetch('http://localhost:5000/api/paynow/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          items: cart.map(item => ({ id: item.id, title: item.title, price: item.price })),
          total,
        }),
      });

      const data = await response.json();
      if (data.browserurl) {
        window.location.href = data.browserurl;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not initiate payment. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Failed to connect to the server.",
      });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-48 pb-32 bg-black min-h-screen text-center px-6">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-8">Your Cart is Empty</h2>
        <Button
          onClick={() => setCurrentPage('services')}
          className="bg-[#0077B6] text-white px-12 h-16 font-black uppercase tracking-widest rounded-2xl"
        >
          Browse Services
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 bg-black min-h-screen text-white px-6 lg:px-12 text-left">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Left: Cart Items */}
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-12">Your <span style={{ color: BLUE }}>Order</span></h2>
          <div className="space-y-6">
            {cart.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl flex justify-between items-center group">
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tighter text-white mb-1">{item.title}</h4>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.pillar}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-lg font-black text-white">${item.price?.toLocaleString()}</span>
                  <button
                    onClick={() => removeFromCart(idx)}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-8 border-t border-white/10 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
            <span className="text-4xl font-black text-white">${total.toLocaleString()}</span>
          </div>
        </div>

        {/* Right: Checkout Form */}
        <div className="bg-white/5 p-12 lg:p-16 rounded-[3rem] border border-white/10 relative overflow-hidden">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Checkout</h3>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-12">Finalize your technical acquisition</p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">FullName</FormLabel>
                    <FormControl>
                      <Input placeholder="YOUR FULL NAME" {...field} className="bg-transparent border-white/10 text-white font-bold h-14 rounded-xl focus:border-[#0077B6]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">EmailAddress</FormLabel>
                    <FormControl>
                      <Input placeholder="EMAIL@EXAMPLE.COM" {...field} className="bg-transparent border-white/10 text-white font-bold h-14 rounded-xl focus:border-[#0077B6]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="07XX XXX XXX" {...field} className="bg-transparent border-white/10 text-white font-bold h-14 rounded-xl focus:border-[#0077B6]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsapp_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="263XXXXXXXXX" {...field} className="bg-transparent border-white/10 text-white font-bold h-14 rounded-xl focus:border-[#0077B6]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-20 bg-[#0077B6] hover:bg-[#0077B6]/80 text-white font-black uppercase tracking-[0.4em] text-xs rounded-2xl shadow-2xl transition-all"
              >
                Pay with Paynow
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

// ─── PAGE: MOCK PAYMENT GATEWAY ──────────────────────────────────────────────

const MockPaymentGateway = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const simulate = (type: 'success' | 'error') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = type === 'success' ? '/payment/success' : '/payment/error';
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f4f6] p-6">
      <Card className="max-w-md w-full p-12 bg-white shadow-2xl rounded-[3rem] text-center border-none">
        <img src="/logo-full.png" alt="Civil Legacy" className="h-12 mx-auto mb-12 grayscale" />
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Paynow <span className="text-blue-600">Mock</span> Gateway</h2>
        <p className="text-gray-500 text-sm mb-12 font-medium">This is a simulation for testing the Paynow integration flow.</p>
        
        <div className="space-y-4">
          <Button
            onClick={() => simulate('success')}
            disabled={loading}
            className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest rounded-2xl"
          >
            {loading ? 'Processing...' : 'Simulate Successful Payment'}
          </Button>
          <Button
            onClick={() => simulate('error')}
            disabled={loading}
            className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl"
          >
            {loading ? 'Processing...' : 'Simulate Failure'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

// ─── PAGE: SUCCESS/ERROR ─────────────────────────────────────────────────────

const SuccessPage = () => (
  <div className="pt-48 pb-32 bg-black min-h-screen text-center px-6">
    <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-12">
      <ChevronRight size={48} className="rotate-270" />
    </div>
    <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">Payment Successful</h2>
    <p className="text-gray-400 text-xl font-light max-w-xl mx-auto mb-12">
      Your transaction has been processed successfully. Our team will contact you shortly to begin the service delivery.
    </p>
    <Button
       onClick={() => window.location.href = '/'}
       className="bg-white text-black px-12 h-16 font-black uppercase tracking-widest rounded-2xl hover:bg-[#0077B6] hover:text-white transition-all"
    >
      Return Home
    </Button>
  </div>
);

const ErrorPage = () => (
  <div className="pt-48 pb-32 bg-black min-h-screen text-center px-6">
    <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-12">
      <X size={48} />
    </div>
    <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">Payment Failed</h2>
    <p className="text-gray-400 text-xl font-light max-w-xl mx-auto mb-12">
      We couldn't process your payment. Please check your credentials and try again, or contact support if the issue persists.
    </p>
    <Button
       onClick={() => window.location.href = '/services'}
       className="bg-[#0077B6] text-white px-12 h-16 font-black uppercase tracking-widest rounded-2xl"
    >
      Return to Store
    </Button>
  </div>
);

const TrainingHubPage = () => {
  const COURSES = [
    {
      title: 'Civil & Water Design',
      description: 'Master industry-standard software for infrastructure design. From Civil 3D alignments to WaterGEMS hydraulic modeling, gain the technical edge required for modern engineering projects.',
      features: ['Civil 3D Proficiency', 'WaterGEMS Modeling', 'AutoCAD Mastery', 'SewerGEMS Design'],
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Technical Documentation',
      description: 'Elevate your reporting standards. Learn to produce professional BOQs, technical specifications, and feasibility reports that meet international consultancy benchmarks.',
      features: ['BOQ Preparation', 'Technical Spec Writing', 'Feasibility Analytics', 'Contract Documentation'],
      image: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'ZIE Reports Mentorship',
      description: 'Strategic guidance for your Professional Interview. We provide structured mentorship on report compilation and presentation for ZIE/ECZ registration.',
      features: ['Report Structuring', 'Professional Review Prep', 'Competency Mapping', 'Mock Interviews'],
      image: 'https://images.unsplash.com/photo-1517089535819-3d8569aa83fa?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Live Interactive Sessions',
      description: 'Real-time technical workshops and peer-review seminars. Join our digital classroom to solve complex project scenarios under the direct supervision of registered Professional Engineers.',
      features: ['Live Q&A Sessions', 'Case Study Clinics', 'Software Troubleshooting', 'Technical Networking'],
      image: 'https://images.unsplash.com/photo-1590402421685-822c23913936?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <div className="bg-black">
      <Hero
        titleLine1="KNOWLEDGE"
        titleLine2="TRANSFER."
        subtitle="Empowering the next generation of engineers through rigorous software mastery and technical documentation mentorship."
        bgImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600"
        ctaLabel="Explore Courses"
        onCta={() => {
          const el = document.getElementById('courses');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <section id="courses" className="py-32 bg-black px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <SectionHeader
            title="Curriculum"
            subtitle="Industry-aligned training modules designed to bridge the gap between academic theory and professional practice."
            light
          />
          
          <div className="grid grid-cols-1 gap-32 mt-32">
            {COURSES.map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-20 items-center`}
              >
                <div className="lg:w-1/2">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-[#0077B6]/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative aspect-video overflow-hidden rounded-[3rem] border border-white/10">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2 text-left">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-[12px] font-black text-[#0077B6] uppercase tracking-[0.4em]">Module 0{idx + 1}</span>
                    <div className="h-px w-12 bg-white/20" />
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
                    {course.title}
                  </h3>
                  <p className="text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-xl">
                    {course.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-12">
                    {course.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0077B6]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#"
                    target="_blank"
                    className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-[#0077B6] hover:text-white transition-all duration-500 group"
                  >
                    Enroll Now
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification CTA */}
      <section className="py-32 bg-black border-y border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-r from-white/5 to-transparent p-12 md:p-24 rounded-[4rem] border border-white/10 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#0077B6]/5 rounded-full blur-3xl -mr-48 -mt-48" />
             <GraduationCap size={64} className="mx-auto text-[#0077B6] mb-8" />
             <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">Ready to Elevate Your Career?</h2>
             <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto mb-12">
               Join our cohort of engineering professionals and gain the practical skills that top-tier consultancies demand.
             </p>
             <a
               href="#"
               target="_blank"
               className="inline-flex items-center gap-4 px-12 py-6 bg-[#0077B6] text-white font-black uppercase tracking-[0.3em] text-xs rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-2xl"
             >
               Apply for Cohort
               <ChevronRight size={18} />
             </a>
          </div>
        </div>
      </section>
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<any[]>([]);
  const { toast } = useToast();

  const addToCart = (service: any) => {
    setCart((prev) => [...prev, service]);
    toast({
      title: "Service Added",
      description: `${service.title} has been added to your cart.`,
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':     return <HomePage setCurrentPage={setCurrentPage} />;
      case 'about':    return <AboutUsPage />;
      case 'team':     return <TeamPage />;
      case 'services': return <ServicesPage setCurrentPage={setCurrentPage} addToCart={addToCart} />;
      case 'projects': return <ProjectsPage />;
      case 'contact':  return <ContactPage />;
      case 'training': return <TrainingHubPage />;
      case 'checkout': return <CheckoutPage cart={cart} removeFromCart={removeFromCart} setCurrentPage={setCurrentPage} />;
      case 'mock-payment-gateway': return <MockPaymentGateway />;
      case 'payment-success': return <SuccessPage />;
      case 'payment-error': return <ErrorPage />;
      default:         return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div
      className="antialiased text-black bg-black min-h-screen overflow-x-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} cartCount={cart.length} />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer setCurrentPage={setCurrentPage} />
      <Toaster />

      {/* WhatsApp Floating Widget */}
      <a
        href="https://wa.me/263714406037"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] hover:scale-110 transition-all duration-300 flex items-center justify-center group"
      >
        <FaWhatsapp size={32} />
        {/* Optional tooltip */}
        <span className="absolute right-16 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Chat with us
        </span>
      </a>
    </div>
  );
}
