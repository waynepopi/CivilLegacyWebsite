import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { LogOut, LayoutDashboard, Settings, Users, PieChart, PanelBottom } from 'lucide-react';
import ServicesTab from './tabs/ServicesTab';
import TeamTab from './tabs/TeamTab';
import FooterTab from './tabs/FooterTab';
import UsersTab from './tabs/UsersTab';
import MetricsTab from './tabs/MetricsTab';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('services');

  const tabs = [
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'footer', label: 'Footer', icon: PanelBottom },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'metrics', label: 'Metrics', icon: PieChart },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20">
            <LayoutDashboard className="h-6 w-6 text-blue-500" />
          </div>
          <span className="text-xl font-bold tracking-tight">Admin<span className="text-blue-500">Pro</span></span>
        </div>

        <div className="px-4 py-2 flex items-center justify-between border-b border-zinc-800/50 pb-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <span className="text-sm font-medium text-zinc-300">{user?.username.charAt(0)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{user?.username}</span>
              <span className="text-xs text-blue-400 mt-1">{user?.role}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600/10 text-blue-400'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-950/30"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-blue-500" />
            <span className="font-bold">AdminPro</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="text-zinc-400 hover:text-zinc-100">
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto p-4 bg-zinc-950 border-b border-zinc-800 space-x-2 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'services' && <ServicesTab />}
            {activeTab === 'team' && <TeamTab />}
            {activeTab === 'footer' && <FooterTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'metrics' && <MetricsTab />}
          </div>
        </div>
      </main>
    </div>
  );
}