import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CONFIG } from '@/config';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from '@/context/CartContext';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const BLUE = '#0077B6';

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

const Storefront = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();
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
      <Helmet>
        <title>Services | Civil Legacy Consultancy</title>
        <meta name="description" content="Explore our engineering services: Construction, Consultancy, and Project Management." />
      </Helmet>

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
                <Card className="bg-white/5 border-white/10 hover:border-[#0077B6]/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden flex flex-col h-full group text-left">
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
                        onClick={() => addToCart(service as any)}
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
          onClick={() => navigate('/training')}
          className="bg-white text-black border-y border-l border-white/10 px-6 py-6 rounded-l-3xl shadow-2xl flex flex-col items-center gap-4 hover:bg-[#0077B6] hover:text-white transition-all duration-500 group"
        >
          <GraduationCap size={24} className="group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-lr] font-black uppercase tracking-[0.3em] text-[10px]">Training Hub</span>
        </button>
      </div>

      {/* Training Hub FAB for Mobile */}
      <div className="fixed left-6 bottom-6 z-[100] md:hidden">
        <button
          onClick={() => navigate('/training')}
          className="bg-white text-black w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#0077B6] hover:text-white transition-all"
        >
          <GraduationCap size={24} />
        </button>
      </div>
    </div>
  );
};

export default Storefront;
