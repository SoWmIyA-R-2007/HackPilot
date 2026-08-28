'use client';

import React from 'react';
import { Home, List, Bell, Settings, Rocket } from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'hackathons' | 'notifications' | 'settings';
  onSelectTab: (tab: 'dashboard' | 'hackathons' | 'notifications' | 'settings') => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'hackathons', label: 'Hackathons', icon: List },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/80 z-50 flex flex-col shadow-2xl">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-800/80 bg-slate-900/60">
        <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400">
          <Rocket className="w-4.5 h-4.5 stroke-[2.5]" />
        </div>
        <span className="text-slate-100 font-extrabold text-lg tracking-tight">
          Mission Control
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3.5 py-5 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400 font-bold shadow-xs backdrop-blur-md border border-amber-500/40'
                  : 'text-slate-400 font-medium hover:bg-slate-800/60 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400 stroke-[2.5]' : 'text-slate-400'}`} />
                <span className="text-xs sm:text-sm">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="bg-amber-500 text-slate-950 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

