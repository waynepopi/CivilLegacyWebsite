import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';
import { FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CONFIG } from '@/config';
import { useToast } from '@/hooks/use-toast';

const BLUE = '#0077B6';

const Footer = () => {
  const socialLinks = [
    { Icon: Facebook, url: CONFIG.CONTACT.SOCIALS.FACEBOOK, label: 'Facebook' },
    { Icon: Twitter, url: CONFIG.CONTACT.SOCIALS.TWITTER, label: 'Twitter' },
    { Icon: Linkedin, url: CONFIG.CONTACT.SOCIALS.LINKEDIN, label: 'LinkedIn' },
    { Icon: Instagram, url: CONFIG.CONTACT.SOCIALS.INSTAGRAM, label: 'Instagram' },
    { Icon: FaTiktok, url: CONFIG.CONTACT.SOCIALS.TIKTOK, label: 'TikTok' },
    { Icon: FaWhatsapp, url: CONFIG.CONTACT.SOCIALS.WHATSAPP, label: 'WhatsApp' },
    { Icon: Mail, url: CONFIG.CONTACT.SOCIALS.EMAIL, label: 'Email' },
  ];
  const { toast } = useToast();

  const copyPhone = () => {
    navigator.clipboard.writeText(String(CONFIG.CONTACT.MAIN_LINE));
    toast({ description: 'Copied to clipboard!' });
  };

  const navLinks = [
    { label: 'Home', path: '/Home' },
    { label: 'About Us', path: '/About' },
    { label: 'Services', path: '/Services' },
    { label: 'Projects', path: '/Projects' },
    { label: 'Team', path: '/Team' },
    { label: 'Contact', path: '/Contact' },
  ];

  return (
    <footer className="bg-background text-foreground pt-24 pb-12 border-t border-black/5 dark:border-white/5 text-left">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand & Trust */}
          <div>
            <img
              src="/logo-full.png"
              alt="Civil Legacy Full Logo"
              className="h-16 w-auto object-contain mb-8"
            />
            <p className="text-gray-600 dark:text-gray-500 text-sm leading-relaxed mb-8">
              Zimbabwe's premier engineering legacy built on structural precision and water management excellence.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {socialLinks.map(({ Icon, url, label }, idx) => (
                <a
                  key={idx}
                  href={url}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center text-gray-500 cursor-pointer border border-black/5 dark:border-white/5 rounded-full transition-all hover:text-black dark:hover:text-white"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = BLUE)}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.05)')}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BLUE }}>
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-black dark:hover:text-white cursor-pointer transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offices */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8" style={{ color: BLUE }}>
              Branches
            </h4>
            <ul className="space-y-6 text-sm text-gray-600 dark:text-gray-400 font-light">
              {CONFIG.CONTACT.OFFICES.map((off, idx) => (
                <li key={idx} className="flex flex-col gap-1">
                  <span className="text-black dark:text-white font-bold uppercase tracking-widest text-[10px]">
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
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm font-mono text-gray-600 dark:text-gray-400">
              <li>
                <button
                  onClick={copyPhone}
                  className="text-black dark:text-white font-black hover:text-[#0077B6] transition-colors cursor-pointer"
                  title="Click to copy"
                >
                  {String(CONFIG.CONTACT.MAIN_LINE)}
                </button>
              </li>
              <li>
                <a
                  href={`mailto:${String(CONFIG.CONTACT.EMAIL)}`}
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  {String(CONFIG.CONTACT.EMAIL)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/5 dark:border-white/5 pt-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 dark:text-gray-600 text-[10px] uppercase tracking-[0.4em] font-bold">
          <p>© 2026 {CONFIG.BRAND.NAME_1} {CONFIG.BRAND.NAME_2} CONSULTANCY</p>
          <p>GWERU | CHIREDZI | CHIPINGE | HARARE</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
