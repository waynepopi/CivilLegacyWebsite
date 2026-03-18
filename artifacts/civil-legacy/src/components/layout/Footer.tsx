import React from 'react';
import { NavLink } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { CONFIG, BLUE } from '@/lib/constants';

export const Footer = () => {
  const SOCIAL_ICONS = [Facebook, Twitter, Linkedin, Instagram];

  const NAV_LINKS = [
    { name: 'Home', path: '/' },
    { name: 'Expertise', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
  ];

  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/5 text-left">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div>
            <img
              src="/logo-full.png"
              alt="Civil Legacy Full Logo"
              className="h-16 w-auto object-contain mb-8"
            />
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Zimbabwe's premier engineering legacy built on structural precision and water management excellence.
            </p>
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
              System
            </h4>
            <ul className="space-y-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
              {NAV_LINKS.map(({ name, path }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className="hover:text-white cursor-pointer transition-colors"
                  >
                    {name}
                  </NavLink>
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
              <li className="text-white font-black">{String(CONFIG.CONTACT.MAIN_LINE)}</li>
              <li>{String(CONFIG.CONTACT.EMAIL)}</li>
              <li className="text-[10px] uppercase tracking-widest opacity-50">
                {String(CONFIG.BRAND.REGISTRATION)}
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
