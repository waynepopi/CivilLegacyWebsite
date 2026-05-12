import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CONFIG } from '@/config';

export function useSiteSettings() {
  const [settings, setSettings] = useState({
    email: CONFIG.CONTACT.EMAIL,
    phone: CONFIG.CONTACT.MAIN_LINE,
    socials: { ...CONFIG.CONTACT.SOCIALS },
    seoDescription: '',
    siteName: CONFIG.BRAND.NAME_1 + ' ' + CONFIG.BRAND.NAME_2,
  });
  const [branches, setBranches] = useState(CONFIG.CONTACT.OFFICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, branchesRes] = await Promise.all([
          supabase.from('site_settings').select('*'),
          supabase.from('footer_branches').select('*').order('display_order', { ascending: true })
        ]);

        if (settingsRes.data && settingsRes.data.length > 0) {
          const newSettings = { ...settings };
          settingsRes.data.forEach((row: any) => {
            if (row.key === 'contactEmail') newSettings.email = row.value;
            if (row.key === 'contactPhone') newSettings.phone = row.value;
            if (row.key === 'facebookUrl') newSettings.socials.FACEBOOK = row.value;
            if (row.key === 'linkedinUrl') newSettings.socials.LINKEDIN = row.value;
            if (row.key === 'instagramUrl') newSettings.socials.INSTAGRAM = row.value;
            if (row.key === 'tiktokUrl') newSettings.socials.TIKTOK = row.value;
            if (row.key === 'youtubeUrl') (newSettings.socials as any).YOUTUBE = row.value;
            if (row.key === 'xUrl') (newSettings.socials as any).TWITTER = row.value;
            if (row.key === 'whatsappUrl') newSettings.socials.WHATSAPP = row.value;
            if (row.key === 'seoDescription') newSettings.seoDescription = row.value;
            if (row.key === 'siteName') newSettings.siteName = row.value;
          });
          setSettings(newSettings);
        }

        if (branchesRes.data && branchesRes.data.length > 0) {
          setBranches(branchesRes.data.map((b: any) => ({
            name: b.name,
            location: b.address,
            phone: b.phone
          })));
        }
      } catch (err) {
        console.error('Failed to fetch site settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { settings, branches, loading };
}
