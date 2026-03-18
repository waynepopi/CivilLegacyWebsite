import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONFIG, BLUE } from '@/lib/constants';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
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

  const NAV_LINKS = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  const closeMenu = () => setIsOpen(false);

  // Determine nav styling based on scroll state
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
          <NavLink to="/" onClick={closeMenu} className="flex items-center gap-4 text-left focus:outline-none">
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
          </NavLink>

          {/* Desktop links */}
          <div className="hidden lg:flex space-x-12">
            {NAV_LINKS.map(({ name, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `text-[11px] font-black uppercase tracking-[0.25em] transition-all relative focus:outline-none ${
                    isActive ? '' : 'text-gray-400 hover:text-white transition-colors'
                  }`
                }
                style={({ isActive }) => ({ color: isActive ? BLUE : undefined })}
              >
                {({ isActive }) => (
                  <>
                    <span>{name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute -bottom-2 left-0 w-full h-[2px]"
                        style={{ backgroundColor: BLUE }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="lg:hidden text-white p-2 border border-white/20 rounded focus:outline-none"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="absolute top-24 left-0 w-full bg-[#0a0a0a] z-[99] lg:hidden border-b-4 border-[#0077B6]"
          >
            <div className="px-8 pt-8 pb-4">
              {NAV_LINKS.map(({ name, path }, index) => {
                const isLast = index === NAV_LINKS.length - 1;
                return (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block w-full text-left text-4xl font-black uppercase tracking-tighter transition-colors focus:outline-none py-4 ${
                        isActive ? 'text-[#0077B6]' : 'text-white hover:text-[#0077B6]'
                      } ${!isLast ? 'border-b border-white/5' : ''}`
                    }
                  >
                    {name}
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
