import React, { useState } from 'react';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import {
  LogOut, Images, Users, FolderOpen, Settings2, Menu, X
} from 'lucide-react';
import BannerTab from './tabs/BannerTab';
import TeamTab from './tabs/TeamTab';
import ProjectsTab from './tabs/ProjectsTab';
import ServicesTab from './tabs/ServicesTab';

// ── Tab definitions ───────────────────────────────────────────────────────────
const tabs = [
  { id: 'banner',   label: 'Banner Images', icon: Images,     component: <BannerTab /> },
  { id: 'team',     label: 'Team Members',  icon: Users,      component: <TeamTab /> },
  { id: 'projects', label: 'Projects',      icon: FolderOpen, component: <ProjectsTab /> },
  { id: 'services', label: 'Services',      icon: Settings2,  component: <ServicesTab />, badge: 'Phase 2' },
];

export default function Dashboard() {
  const { session, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('banner');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const active = tabs.find(t => t.id === activeTab) ?? tabs[0];
  const email = session?.user?.email ?? '';
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">

      {/* ── Sidebar (desktop) ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-zinc-900 border-r border-zinc-800">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 overflow-hidden">
              <img src="/logo-full.png" alt="Civil Legacy" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                CLC <span className="text-[#0077B6]">Admin</span>
              </span>
              <p className="text-xs text-zinc-600 -mt-0.5">Content Management</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#0077B6]/20 border border-[#0077B6]/30 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-[#0077B6]">{initial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">{email}</p>
              <p className="text-xs text-zinc-500">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider px-2 mb-2">
            Content
          </p>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-[#0077B6]/15 text-[#0077B6] border border-[#0077B6]/20'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-3">
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </span>
              {'badge' in tab && tab.badge && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-zinc-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* ── Mobile sidebar overlay ────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <span className="text-lg font-bold">CLC <span className="text-[#0077B6]">Admin</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-500 hover:text-zinc-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#0077B6]/15 text-[#0077B6]'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                  }`}
                >
                  <span className="flex items-center gap-3"><tab.icon className="h-4 w-4" />{tab.label}</span>
                  {'badge' in tab && tab.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">{tab.badge}</span>
                  )}
                </button>
              ))}
            </nav>
            <div className="p-3 border-t border-zinc-800">
              <Button variant="ghost" className="w-full justify-start text-zinc-500 hover:text-red-400 hover:bg-red-950/30" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
          <button onClick={() => setMobileMenuOpen(true)} className="text-zinc-400 hover:text-zinc-100 p-1">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-sm">CLC <span className="text-[#0077B6]">Admin</span></span>
          <button onClick={signOut} className="text-zinc-500 hover:text-red-400 p-1">
            <LogOut className="h-4 w-4" />
          </button>
        </header>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8">
            {active.component}
          </div>
        </div>
      </main>
    </div>
  );
}