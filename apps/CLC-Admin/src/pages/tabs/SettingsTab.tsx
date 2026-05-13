import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Settings, Save, Loader2, Globe, Mail, Phone, Share2 } from 'lucide-react';
import { logAdminAction } from '../../lib/auditLogger';

export default function SettingsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Civil Legacy',
    contactEmail: 'info@civillegacy.com',
    contactPhone: '+263 123 456 789',
    facebookUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    xUrl: '',
    whatsappUrl: '',
    seoDescription: 'Civil Engineering and Project Management Experts',
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
          const newSettings = { ...settings };
          data.forEach(row => {
            if (row.key in newSettings) {
              (newSettings as any)[row.key] = row.value;
            }
          });
          setSettings(newSettings);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;

      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      // Upsert settings
      const { error } = await supabase.from('site_settings').upsert(updates, { onConflict: 'key' });
      if (error) throw error;

      if (email) {
        await logAdminAction(email, 'UPDATE', 'settings', 'global', { updated_keys: Object.keys(settings) });
      }

      alert('Settings saved successfully.');
    } catch (err) {
      console.error('Save settings error:', err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-[#0077B6] animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="text-[#0077B6]" /> Global Settings
        </h2>
        <Button onClick={handleSave} disabled={saving} className="bg-[#0077B6] hover:bg-[#005f8e] text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Globe className="text-[#0077B6] h-5 w-5" /> General Information
            </CardTitle>
            <CardDescription className="text-zinc-400">Basic information about the website.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Site Name</label>
              <Input 
                value={settings.siteName} 
                onChange={e => handleChange('siteName', e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">SEO Default Description</label>
              <Input 
                value={settings.seoDescription} 
                onChange={e => handleChange('seoDescription', e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Mail className="text-[#0077B6] h-5 w-5" /> Contact Details
            </CardTitle>
            <CardDescription className="text-zinc-400">Main contact information shown across the site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Main Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input 
                  value={settings.contactEmail} 
                  onChange={e => handleChange('contactEmail', e.target.value)} 
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Main Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input 
                  value={settings.contactPhone} 
                  onChange={e => handleChange('contactPhone', e.target.value)} 
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Share2 className="text-[#0077B6] h-5 w-5" /> Social Media Links
            </CardTitle>
            <CardDescription className="text-zinc-400">Links to official social media profiles.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Facebook URL</label>
              <Input 
                value={settings.facebookUrl} 
                onChange={e => handleChange('facebookUrl', e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Instagram URL</label>
              <Input 
                value={settings.instagramUrl} 
                onChange={e => handleChange('instagramUrl', e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">TikTok URL</label>
              <Input 
                value={settings.tiktokUrl} 
                onChange={e => handleChange('tiktokUrl', e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
                placeholder="https://tiktok.com/@..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">LinkedIn URL</label>
              <Input 
                value={settings.linkedinUrl} 
                onChange={e => handleChange('linkedinUrl', e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
                placeholder="https://linkedin.com/company/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">YouTube URL</label>
              <Input 
                value={settings.youtubeUrl} 
                onChange={e => handleChange('youtubeUrl', e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
                placeholder="https://youtube.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">X (Twitter) URL</label>
              <Input 
                value={settings.xUrl} 
                onChange={e => handleChange('xUrl', e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
                placeholder="https://x.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">WhatsApp URL</label>
              <Input 
                value={settings.whatsappUrl} 
                onChange={e => handleChange('whatsappUrl', e.target.value)} 
                className="bg-zinc-800 border-zinc-700 text-white" 
                placeholder="https://wa.me/..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
