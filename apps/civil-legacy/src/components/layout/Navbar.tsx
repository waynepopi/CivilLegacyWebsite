import React, { useState, useEffect, useRef } from 'react';
import { Menu, ShoppingCart, GraduationCap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { CONFIG, SERVICE_CATEGORIES } from '@/config';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from '@/context/CartContext';
import { ThemeToggle } from '../ThemeToggle';
const BLUE = '#0077B6';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const { cartCount } = useCart();

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

  const showCart = ['/Services', '/Checkout', '/Mock-Payment-Gateway', '/Payment/Success', '/Payment/Error'].includes(location.pathname);

  let navClasses = "fixed w-full z-[100] transition-all duration-300 border-b border-black/10 dark:border-white/10 bg-white/85 dark:bg-black/85 ";
  if (!scrolled) {
    navClasses += "backdrop-blur-sm";
  } else if (scrollDirection === 'down') {
    navClasses += "backdrop-blur-xl";
  } else {
    navClasses += "backdrop-blur-none";
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={navClasses}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-24 items-center">
          {/* Logo */}
          <Link to="/Home" className="flex items-center gap-4 text-left focus:outline-none">
            <img
              src="/logo-mark.png"
              alt="Civil Legacy Logo Mark"
              className="h-16 w-auto object-contain"
            />
            <div>
              <div className="text-2xl font-black tracking-tighter uppercase leading-none">
                <span style={{ color: BLUE }}>{CONFIG.BRAND.NAME_1}</span>
                {" "}
                <span className="text-black dark:text-white">{CONFIG.BRAND.NAME_2}</span>
              </div>
              <div
                className="text-[9px] font-bold tracking-[0.4em] uppercase mt-1"
                style={{ color: BLUE }}
              >
                {CONFIG.BRAND.TAGLINE}
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-8">
                <NavigationMenuItem>
                  <Link to="/Home" className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all relative focus:outline-none ${isActive('/Home') ? 'text-[#0077B6]' : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/About" className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all relative focus:outline-none ${isActive('/About') ? 'text-[#0077B6]' : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>
                    About Us
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-[11px] font-black uppercase tracking-[0.25em] transition-colors h-auto p-0 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white data-[state=open]:text-black dark:data-[state=open]:text-white">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-white/95 dark:bg-black/95 border border-black/10 dark:border-white/10 rounded-xl shadow-2xl backdrop-blur-xl">
                      {SERVICE_CATEGORIES.map((category) => (
                        <li key={category.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/Services"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 text-left w-full"
                            >
                              <div className="text-sm font-bold text-black dark:text-white uppercase tracking-tighter mb-1">{category.title}</div>
                              <p className="line-clamp-2 text-xs leading-snug text-gray-600 dark:text-gray-400">
                                {category.summary}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/Projects" className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all relative focus:outline-none ${isActive('/Projects') ? 'text-[#0077B6]' : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>
                    Projects
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/Team" className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all relative focus:outline-none ${isActive('/Team') ? 'text-[#0077B6]' : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>
                    Team
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/Contact" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative focus:outline-none ${isActive('/Contact') ? 'text-[#0077B6]' : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white'}`}>
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-6">
              {/* Conditional Cart Button Rendering */}
              {showCart && (
                <Link
                  to="/Checkout"
                  className="relative p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors focus:outline-none group"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#0077B6] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                  <span className="absolute top-12 left-1/2 -translate-x-1/2 bg-white text-black dark:bg-black dark:text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-black/10 dark:border-white/10">
                    View Cart
                  </span>
                </Link>
              )}

              {/* Prominent Training Hub Link */}
              <Link
                to="/Training"
                className={`px-6 py-2.5 font-black uppercase tracking-[0.2em] text-[10px] rounded-md transition-all duration-300 focus:outline-none flex items-center gap-2 ${isActive('/Training') ? 'bg-[#0077B6] text-white' : 'bg-white text-black hover:bg-[#0077B6] hover:text-white'}`}
              >
                <GraduationCap size={14} /> Training Hub
              </Link>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Actions: Cart (Conditional) + Hamburger Menu */}
          <div className="lg:hidden flex items-center gap-4">
            {showCart && (
              <Link
                to="/Checkout"
                className="relative p-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors focus:outline-none"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#0077B6] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="text-black dark:text-white p-2 border border-black/20 dark:border-white/20 rounded focus:outline-none">
                  <Menu size={20} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px] bg-white dark:bg-black border-r border-black/10 dark:border-white/10 p-0 text-black dark:text-white">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation for the application</SheetDescription>
                <div className="pt-24 px-8 pb-4 h-full flex flex-col overflow-y-auto">
                  <Link to="/Home" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left text-3xl font-black uppercase tracking-tighter text-black dark:text-white hover:text-[#0077B6] dark:hover:text-[#0077B6] transition-colors py-4 border-b border-black/5 dark:border-white/5">Home</Link>
                  <Link to="/About" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left text-3xl font-black uppercase tracking-tighter text-black dark:text-white hover:text-[#0077B6] dark:hover:text-[#0077B6] transition-colors py-4 border-b border-black/5 dark:border-white/5">About Us</Link>
                  <Link to="/Services" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left text-3xl font-black uppercase tracking-tighter text-black dark:text-white hover:text-[#0077B6] dark:hover:text-[#0077B6] transition-colors py-4 border-b border-black/5 dark:border-white/5">Services</Link>
                  <div className="pl-6 py-2 space-y-4 border-b border-black/5 dark:border-white/5">
                    {SERVICE_CATEGORIES.map(cat => (
                      <Link key={cat.id} to="/Services" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left text-sm font-bold uppercase tracking-widest text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">{cat.title}</Link>
                    ))}
                  </div>
                  <Link to="/Projects" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left text-3xl font-black uppercase tracking-tighter text-black dark:text-white hover:text-[#0077B6] dark:hover:text-[#0077B6] transition-colors py-4 border-b border-black/5 dark:border-white/5">Projects</Link>
                  <Link to="/Team" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left text-3xl font-black uppercase tracking-tighter text-black dark:text-white hover:text-[#0077B6] dark:hover:text-[#0077B6] transition-colors py-4 border-b border-black/5 dark:border-white/5">Team</Link>
                  <Link to="/Contact" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left text-3xl font-black uppercase tracking-tighter text-black dark:text-white hover:text-[#0077B6] dark:hover:text-[#0077B6] transition-colors py-4 border-b border-black/5 dark:border-white/5">Contact</Link>
                  <div className="mt-8 mb-8">
                    <Link
                      to="/Training"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full py-4 text-center font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${isActive('/Training') ? 'bg-[#0077B6] text-white' : 'bg-white text-black hover:bg-[#0077B6] hover:text-white'}`}
                    >
                      <GraduationCap size={16} /> Training Hub
                    </Link>
                  </div>

                  <div className="mt-auto pb-12 border-t border-black/5 dark:border-white/5 pt-8 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                      Switch Theme
                    </span>
                    <ThemeToggle />
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

export default Navbar;
