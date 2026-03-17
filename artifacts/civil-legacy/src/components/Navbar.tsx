import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { CONFIG } from '../lib/config';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPage = location.pathname;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Firm', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-black/90 border-b border-white/10 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-24 items-center">
          <Link to="/" className="cursor-pointer group text-left">
            <div className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
              {CONFIG.BRAND.NAME.split(' ')[0]}<span style={{ color: '#0077B6' }}>{CONFIG.BRAND.NAME.split(' ')[1]}</span>
            </div>
            <div className="text-[9px] font-bold tracking-[0.4em] uppercase mt-1" style={{ color: '#0077B6' }}>
              {CONFIG.BRAND.TAGLINE}
            </div>
          </Link>

          <div className="hidden lg:flex space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all relative ${
                  currentPage === link.path ? 'text-[#0077B6]' : 'text-gray-400 hover:text-white'
                }`}
                style={currentPage === link.path ? { color: '#0077B6' } : undefined}
              >
                {link.name}
                {currentPage === link.path && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 w-full h-[2px]" style={{ backgroundColor: '#0077B6' }} />
                )}
              </Link>
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
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block w-full text-left text-4xl font-black uppercase tracking-tighter mb-8 text-white hover:text-[#0077B6] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};