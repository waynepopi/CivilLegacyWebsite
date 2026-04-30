import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, GraduationCap, CheckCircle2, ArrowRight, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ICON_MAP } from '@/config';
import { useCart } from '@/context/CartContext';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { getServiceCategories, getServices } from '@/services/orderService';

const BLUE = '#0077B6';

interface DBCategory {
  id: string;
  title: string;
  summary: string;
  icon_name: string;
}

interface DBService {
  id: string;
  category_id: string;
  title: string;
  summary: string;
  details: string[];
  price: number | null;
  icon_name: string;
  is_quote_only: boolean;
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
const StorefrontHero = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) => (
  <section className="relative h-[58vh] min-h-[380px] flex items-center justify-center overflow-hidden border-b border-black/10 dark:border-white/10">
    <div className="absolute inset-0 z-0">
      <img
        src="https://images.unsplash.com/photo-1504307651254-35680f3366d4?auto=format&fit=crop&q=80&w=1600"
        alt="Engineering Services"
        className="w-full h-full object-cover"
        style={{ filter: 'brightness(0.18) contrast(1.2)' }}
      />
    </div>
    <div className="relative z-10 w-full max-w-4xl text-center px-6">
      <motion.p
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-[10px] font-black uppercase tracking-[0.35em] mb-4"
        style={{ color: BLUE }}
      >
        Civil Legacy Consultancy
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-6xl font-black text-black dark:text-white uppercase tracking-tighter mb-8 leading-tight"
      >
        Engineering <span style={{ color: BLUE }}>Services</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-gray-600 dark:text-gray-400 text-sm font-light mb-10 max-w-xl mx-auto"
      >
        Browse our full suite of civil engineering and consultancy services. Select a category below to explore individual offerings and request a tailored quote.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="relative max-w-2xl mx-auto"
      >
        <input
          type="text"
          placeholder="Search services…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-16 bg-white/60 dark:bg-white/8 backdrop-blur-xl border border-black/10 dark:border-white/15 rounded-2xl px-6 pr-14 text-black dark:text-white font-medium tracking-wide placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-[#0077B6] transition-all text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">
          <Search size={20} />
        </div>
      </motion.div>
    </div>
  </section>
);

// ─── Category Tab Bar ─────────────────────────────────────────────────────────
const CategoryTabs = ({
  active,
  setActive,
  counts,
  tabsRef,
  categories,
}: {
  active: string;
  setActive: (id: string) => void;
  counts: Record<string, number>;
  tabsRef?: React.Ref<HTMLDivElement>;
  categories: DBCategory[];
}) => {
  const tabs = [{ id: 'all', title: 'All Services', icon_name: null }, ...categories];

  return (
    <div className="w-full overflow-x-auto" ref={tabsRef}>
      <div className="flex gap-3 min-w-max mx-auto justify-center pb-2">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const count = tab.id === 'all' ? Object.values(counts).reduce((a, b) => a + b, 0) : (counts[tab.id] ?? 0);
          const Icon = tab.icon_name ? ICON_MAP[tab.icon_name] : null;

          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black uppercase tracking-[0.12em] text-[10px] transition-all duration-300 border whitespace-nowrap ${
                isActive
                  ? 'bg-[#0077B6] border-[#0077B6] text-white shadow-lg shadow-[#0077B6]/20'
                  : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#0077B6]/40 hover:'
              }`}
            >
              {Icon && <Icon size={14} />}
              {tab.title}
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                  isActive ? 'bg-white/20 ' : 'bg-white/8 text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Category Info Banner (non-buyable) ───────────────────────────────────────
const CategoryBanner = ({ categoryId, categories }: { categoryId: string, categories: DBCategory[] }) => {
  if (categoryId === 'all') return null;
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return null;

  const Icon = cat.icon_name ? ICON_MAP[cat.icon_name] : null;

  return (
    <motion.div
      key={categoryId}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-5 p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 mb-10"
    >
      <div className="p-3.5 rounded-2xl shrink-0" style={{ background: `${BLUE}18` }}>
        {Icon && <Icon size={26} color={BLUE} />}
      </div>
      <div>
        <h2 className="text-lg font-black uppercase tracking-tighter  mb-1">{cat.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed max-w-2xl">{cat.summary}</p>
      </div>
    </motion.div>
  );
};

// ─── Child Service Card (buyable) ─────────────────────────────────────────────
const ServiceCard = ({
  service,
  categories,
  onAddToCart,
}: {
  service: DBService;
  categories: DBCategory[];
  onAddToCart: (s: DBService) => void;
}) => {
  const requiresQuote = service.is_quote_only;
  const categoryLabel = categories.find((c) => c.id === service.category_id)?.title ?? service.category_id;
  const Icon = service.icon_name ? ICON_MAP[service.icon_name] : ShoppingCart;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full"
    >
      <div className="group flex flex-col h-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-[2rem] overflow-hidden hover:border-[#0077B6]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#0077B6]/10">
        <div className="p-8 pb-5">
          <div className="flex items-start justify-between mb-6">
            <div
              className="p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300"
              style={{ background: `${BLUE}15` }}
            >
              {Icon && <Icon size={28} color={BLUE} />}
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 border border-black/10 dark:border-white/10 rounded-full px-3 py-1">
              {categoryLabel}
            </span>
          </div>
          <h3 className="text-xl font-black uppercase tracking-tighter  mb-2">{service.title}</h3>
          <p className="text-gray-500 text-sm font-light leading-relaxed">{service.summary}</p>
        </div>

        <div className="px-8 pb-5 flex-grow">
          <div className="space-y-2.5">
            {service.details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
                <CheckCircle2 size={12} className="shrink-0 text-[#0077B6]" />
                {detail}
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 pb-8 pt-4 border-t border-black/10 dark:border-white/10 mt-2">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">
                {requiresQuote ? 'Pricing' : 'Est. Starting Price'}
              </p>
              <p className={`font-black  tracking-tight ${requiresQuote ? 'text-lg mt-1' : 'text-3xl'}`}>
                {requiresQuote ? (
                  'Request a Quote below'
                ) : (
                  `$${(service.price ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                )}
              </p>
            </div>
            {!requiresQuote && (
              <p className="text-[9px] text-gray-600 font-medium text-right leading-tight max-w-[100px]">
                Final price<br />varies by scope
              </p>
            )}
          </div>

          {requiresQuote ? (
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group/btn w-full h-14 flex items-center justify-center gap-2 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] text-white transition-all duration-300  relative overflow-hidden cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #005f8f 100%)` }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Request Quote
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-white/0 group-hover/btn:bg-black/10 dark:bg-white/10 transition-all duration-300" />
            </a>
          ) : (
            <button
              onClick={() => onAddToCart(service)}
              className="group/btn w-full h-14 flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] text-white transition-all duration-300  relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #005f8f 100%)` }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingCart size={14} />
                Add to Cart
              </span>
              <span className="absolute inset-0 bg-white/0 group-hover/btn:bg-black/10 dark:bg-white/10 transition-all duration-300" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Storefront = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [services, setServices] = useState<DBService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, svcs] = await Promise.all([
          getServiceCategories(),
          getServices()
        ]);
        if (cats && svcs) {
          setCategories(cats);
          setServices(svcs);
        }
      } catch (err) {
        console.error("Failed to load store data:", err);
        toast({
          title: "Error loading services",
          description: "Could not connect to the database. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  // ── Hash-based deep linking ───────────────────────────────────────────────
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || categories.length === 0) return;
      
      const validIds = categories.map(c => c.id);
      if (validIds.includes(hash)) {
        setActiveCategory(hash);
        requestAnimationFrame(() => {
          tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [location, categories]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((c) => {
      map[c.id] = services.filter((s) => s.category_id === c.id).length;
    });
    return map;
  }, [categories, services]);

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory = activeCategory === 'all' || s.category_id === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        (s.details && s.details.some((d) => d.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, services]);

  const handleAddToCart = (service: DBService) => {
    // Map DBService shape to the shape CartContext expects
    addToCart({ 
      id: service.id,
      title: service.title,
      price: service.price ?? 0,
      pillar: service.category_id 
    } as any);
    toast({
      title: '✓ Added to Cart',
      description: `${service.title} has been added. Proceed to checkout when ready.`,
    });
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Services | Civil Legacy Consultancy</title>
        <meta name="description" content="Explore Civil Legacy's engineering services: Construction, Consultancy, and Project Management. Request a quote today." />
      </Helmet>

      <StorefrontHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-14">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B6]"></div>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <CategoryTabs active={activeCategory} setActive={setActiveCategory} counts={counts} tabsRef={tabsRef} categories={categories} />
            </div>

            <AnimatePresence mode="wait">
              <CategoryBanner key={activeCategory} categoryId={activeCategory} categories={categories} />
            </AnimatePresence>

            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-1" style={{ color: BLUE }}>
                  {activeCategory === 'all' ? 'All Categories' : categories.find((c) => c.id === activeCategory)?.title}
                </p>
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  {filteredServices.length} Service{filteredServices.length !== 1 ? 's' : ''} Available
                </h2>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover: transition-colors"
                >
                  Clear Search ✕
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} categories={categories} onAddToCart={handleAddToCart} />
                ))}
              </AnimatePresence>
            </div>

            {filteredServices.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-28"
              >
                <Search size={40} className="mx-auto text-gray-700 mb-4" />
                <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-600">No Services Found</h3>
                <p className="text-gray-700 mt-2 text-sm">Try adjusting your search term or selecting a different category.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="mt-6 px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover: hover:border-black/20 dark:border-white/20 transition-all"
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[90] hidden md:block">
        <button
          onClick={() => navigate('/Training')}
          className="bg-white text-black border-y border-l border-black/10 dark:border-white/10 px-5 py-6 rounded-l-3xl shadow-2xl flex flex-col items-center gap-4 hover:bg-[#0077B6] hover: transition-all duration-500 group"
        >
          <GraduationCap size={22} className="group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-lr] font-black uppercase tracking-[0.3em] text-[10px]">Training Hub</span>
        </button>
      </div>

      <div className="fixed left-4 bottom-24 z-[100] md:hidden">
        <button
          onClick={() => navigate('/Training')}
          className="bg-white text-black w-12 h-12 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#0077B6] hover: transition-all"
        >
          <GraduationCap size={20} />
        </button>
      </div>
    </div>
  );
};

export default Storefront;
