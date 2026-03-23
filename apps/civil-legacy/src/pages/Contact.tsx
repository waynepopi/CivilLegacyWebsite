import React from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin } from 'lucide-react';
import { FaTiktok, FaInstagram, FaLinkedinIn, FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { CONFIG } from '@/config';
import { SectionHeader } from './Home';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet-async';

const BLUE = '#0077B6';

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  type: z.enum(["General Inquiry", "RFQ", "Corporate Training"]),
  message: z.string().min(10, "Please provide more details"),
});

type ContactValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      type: "General Inquiry",
      message: "",
    },
  });

  const copyPhone = () => {
    navigator.clipboard.writeText(String(CONFIG.CONTACT.MAIN_LINE));
    toast({ description: 'Copied to clipboard!' });
  };

  const onSubmit = (values: ContactValues) => {
    const sanitizedName = encodeURIComponent(values.name.trim().toUpperCase());
    const sanitizedEmail = encodeURIComponent(values.email.trim().toUpperCase());
    const sanitizedType = encodeURIComponent(values.type.trim().toUpperCase());
    const sanitizedMessage = encodeURIComponent(values.message.trim().toUpperCase());
    
    const whatsappMessage = encodeURIComponent(
      `CIVIL LEGACY INQUIRY\n\nTYPE: ${decodeURIComponent(sanitizedType)}\nNAME: ${decodeURIComponent(sanitizedName)}\nEMAIL: ${decodeURIComponent(sanitizedEmail)}\n\nMESSAGE: ${decodeURIComponent(sanitizedMessage)}`,
    );
    
    window.open(
      `https://wa.me/${String(CONFIG.CONTACT.WHATSAPP_NUM)}?text=${whatsappMessage}`,
      '_blank',
      'noopener,noreferrer',
    );
    
    toast({
      title: "Inquiry Initialized",
      description: "Redirecting to WhatsApp for secure transmission.",
    });
  };

  const SOCIAL_LINKS = [
    { icon: FaTiktok,      label: 'TikTok',    href: 'https://www.tiktok.com/@civillegacy' },
    { icon: FaInstagram,   label: 'Instagram',  href: 'https://www.instagram.com/civillegacy' },
    { icon: FaLinkedinIn,  label: 'LinkedIn',   href: 'https://www.linkedin.com/company/civillegacy' },
    { icon: FaFacebookF,   label: 'Facebook',   href: 'https://www.facebook.com/civillegacy' },
    { icon: FaWhatsapp,    label: 'WhatsApp',   href: `https://wa.me/${String(CONFIG.CONTACT.WHATSAPP_NUM)}` },
    { icon: Mail,          label: 'Email',      href: `mailto:${String(CONFIG.CONTACT.EMAIL)}` },
    { icon: MapPin,        label: 'Location',   href: `https://maps.google.com/?q=${encodeURIComponent(String(CONFIG.CONTACT.OFFICES[0].location))}` },
  ];

  return (
    <div className="pt-24 bg-black min-h-screen px-6 lg:px-12 text-left text-white">
      <Helmet>
        <title>Contact Us | Civil Legacy Consultancy</title>
        <meta name="description" content="Connect with technical headquarters for project consultations and training cohorts." />
      </Helmet>
      <div className="max-w-[1600px] mx-auto py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Left: info */}
          <div>
            <SectionHeader
              title="Transmission"
              subtitle="Connect with technical headquarters for project consultations and training cohorts."
              light
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: BLUE }}>
                  Direct Feed
                </h5>
                <button
                  onClick={copyPhone}
                  className="text-4xl font-black text-white hover:text-[#0077B6] transition-colors cursor-pointer tracking-tighter"
                  title="Click to copy"
                >
                  {String(CONFIG.CONTACT.MAIN_LINE)}
                </button>
              </div>
              <div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: BLUE }}>
                  Network Node
                </h5>
                <a
                  href={`mailto:${String(CONFIG.CONTACT.EMAIL)}`}
                  className="text-2xl font-black text-white break-all hover:text-[#0077B6] transition-colors tracking-tighter"
                >
                  {String(CONFIG.CONTACT.EMAIL)}
                </a>
              </div>
            </div>
            
            <div className="mt-16 bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8" style={{ color: BLUE }}>
                Satellite Links
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                  <a 
                    key={label} 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#0077B6]/60 hover:bg-white/5 transition-all group"
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-[#0077B6]/20 transition-colors text-gray-400 group-hover:text-white">
                      <Icon size={18} />
                    </span>
                    <span className="text-xs font-black text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors">
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Hook Form */}
          <div
            className="p-12 lg:p-16 rounded-[3rem] border border-white/5 relative bg-white/5 overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 opacity-5 rounded-bl-full"
              style={{ backgroundColor: BLUE }}
            />
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
              Secure Uplink
            </h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-12">
               Encryption-ready technical inquiry portal
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">FullName</FormLabel>
                      <FormControl>
                        <Input placeholder="DESIGNATION / NAME" {...field} className="bg-transparent border-white/10 text-white font-bold h-14 rounded-xl focus:border-[#0077B6]" />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">EmailAddress</FormLabel>
                      <FormControl>
                        <Input placeholder="NODE@NETWORK.COM" {...field} className="bg-transparent border-white/10 text-white font-bold h-14 rounded-xl focus:border-[#0077B6]" />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">InquiryRouting</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-white/10 text-white font-bold h-14 rounded-xl focus:border-[#0077B6]">
                            <SelectValue placeholder="SELECT ROUTE" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-white/10 text-white uppercase font-bold">
                          <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                          <SelectItem value="RFQ">Request for Quotation (RFQ)</SelectItem>
                          <SelectItem value="Corporate Training">Corporate Training Cohort</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest font-black text-gray-500">ProjectParameters</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="DESCRIBE TECHNICAL REQUIREMENTS..." 
                          className="bg-transparent border-white/10 text-white font-bold rounded-xl focus:border-[#0077B6] min-h-[120px] resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-16 bg-[#0077B6] hover:bg-[#0077B6]/80 text-white font-black uppercase tracking-[0.4em] rounded-xl transition-all duration-300"
                >
                  Initiate Secure Transmission
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
