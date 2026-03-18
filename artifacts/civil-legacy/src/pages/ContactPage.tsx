import React, { useState } from 'react';
import { SectionHeader } from '@/components/sections/SectionHeader';
import { CONFIG, BLUE } from '@/lib/constants';

export const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', details: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Sanitize all inputs via encodeURIComponent before injecting into URL
    const sanitizedName = encodeURIComponent(form.name.trim().toUpperCase());
    const sanitizedEmail = encodeURIComponent(form.email.trim().toUpperCase());
    const sanitizedDetails = encodeURIComponent(form.details.trim().toUpperCase());
    const message = encodeURIComponent(
      `ENGINEERING INQUIRY\n\nNAME: ${decodeURIComponent(sanitizedName)}\nEMAIL: ${decodeURIComponent(sanitizedEmail)}\nDETAILS: ${decodeURIComponent(sanitizedDetails)}`,
    );
    window.open(
      `https://wa.me/${String(CONFIG.CONTACT.WHATSAPP_NUM)}?text=${message}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div className="pt-24 bg-white min-h-screen px-6 lg:px-12 text-left">
      <div className="max-w-[1600px] mx-auto py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Left: info */}
          <div>
            <SectionHeader
              title="Let's Build"
              subtitle="Connect with technical headquarters for project consultations and training cohorts."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: BLUE }}>
                  Official Line
                </h5>
                <p className="text-3xl font-black text-black">{String(CONFIG.CONTACT.MAIN_LINE)}</p>
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: BLUE }}>
                  Email
                </h5>
                <p className="text-xl font-black text-black break-all">{String(CONFIG.CONTACT.EMAIL)}</p>
              </div>
            </div>
            <div className="mt-16 bg-black p-10 rounded-[2rem] text-white">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-6" style={{ color: BLUE }}>
                Staff Extensions
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {CONFIG.CONTACT.EXTENSIONS.map((ext, i) => (
                  <div key={i} className="text-[10px] border-l border-white/20 pl-4">
                    <span className="block font-bold">{String(ext.name)}</span>
                    <span className="text-gray-500">{String(ext.num)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: WhatsApp form */}
          <div
            className="p-12 lg:p-20 text-left rounded-[3rem] border border-white/5 relative overflow-hidden"
            style={{ backgroundColor: '#000000' }}
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full"
              style={{ backgroundColor: BLUE }}
            />
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-12">
              Direct WhatsApp Inquiry
            </h3>
            <form onSubmit={handleSubmit} className="space-y-10">
              <input
                type="text"
                required
                placeholder="IDENTIFICATION (FULL NAME)"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent border-b-2 border-white/20 py-4 outline-none text-white font-bold text-lg uppercase placeholder-white/30 focus:border-[#0077B6] transition-colors"
              />
              <input
                type="email"
                required
                placeholder="EMAIL ADDR"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent border-b-2 border-white/20 py-4 outline-none text-white font-bold text-lg uppercase placeholder-white/30 focus:border-[#0077B6] transition-colors"
              />
              <textarea
                rows={3}
                required
                placeholder="PROJECT REQUIREMENTS"
                value={form.details}
                onChange={e => setForm({ ...form, details: e.target.value })}
                className="w-full bg-transparent border-b-2 border-white/20 py-4 outline-none text-white font-bold text-lg uppercase placeholder-white/30 focus:border-[#0077B6] transition-colors resize-none"
              />
              <button
                type="submit"
                className="w-full py-6 text-white font-black uppercase tracking-[0.4em] rounded-xl transition-all duration-500 focus:outline-none"
                style={{ backgroundColor: BLUE }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.backgroundColor = '#ffffff';
                  el.style.color = '#000000';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.backgroundColor = BLUE;
                  el.style.color = '#ffffff';
                }}
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
