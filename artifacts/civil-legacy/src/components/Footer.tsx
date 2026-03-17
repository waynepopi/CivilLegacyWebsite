import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../lib/config';

export const Footer = () => (
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
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Expertise</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link to="/projects" className="hover:text-white transition-colors">Projects</Link></li>
            <li>
              <a
                href="/company_profile.pdf"
                download
                className="hover:text-white transition-colors flex items-center gap-2 mt-4 text-[#0077B6]"
              >
                <span>Download Profile</span>
              </a>
            </li>
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