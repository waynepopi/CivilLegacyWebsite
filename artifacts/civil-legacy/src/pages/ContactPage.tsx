import React, { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { CONFIG } from '../lib/config';

export const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', details: '' });

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = CONFIG.CONTACT.WHATSAPP_NUM;
    const message = `ENGINEERING INQUIRY\n\nNAME: ${formData.name.toUpperCase()}\nEMAIL: ${formData.email.toUpperCase()}\nDETAILS: ${formData.details.toUpperCase()}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pt-24 bg-black min-h-screen px-6 lg:px-12 text-left text-white">
      <div className="max-w-[1600px] mx-auto py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="text-left">
            <SectionHeader title="Let's Build" subtitle="Connect with technical headquarters for project consultations and training cohorts." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 text-left">
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: '#0077B6' }}>Official Line</h5>
                <p className="text-3xl font-black text-white">{CONFIG.CONTACT.MAIN_LINE}</p>
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: '#0077B6' }}>Email</h5>
                <p className="text-xl font-black text-white break-all">{CONFIG.CONTACT.EMAIL}</p>
              </div>
            </div>
            <div className="mt-16 bg-white/5 p-10 rounded-[2rem] text-white border border-white/10">
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
          <div className="bg-white/5 p-12 lg:p-20 text-left rounded-[3rem] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full" style={{ backgroundColor: '#0077B6' }}></div>
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