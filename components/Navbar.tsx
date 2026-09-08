'use client';

import React, { useState, useEffect } from 'react';
import { Rocket, Bell, Plus, Search, LogOut, Terminal, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onOpenNewMission: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewMission,
  onOpenNotifications,
  unreadCount,
  searchQuery,
  onSearchChange,
}) => {
  const router = useRouter();
  const [timeStr, setTimeStr] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string | null>('Lead Operative');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data?.user?.email) {
          setUserEmail(data.user.email.split('@')[0]);
        }
      } catch {
        // Fallback to default
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignored if offline
    }
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f5f0e8] border-b-4 border-[#1a1a1a] px-4 lg:px-8 py-3 shadow-[0_4px_0_0_#1a1a1a]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Block */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center border-2 border-[#1a1a1a] shadow-brutal-sm">
            <Rocket className="w-6 h-6 text-[#ffcc00]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline font-black text-xl lg:text-2xl uppercase tracking-tighter text-[#1a1a1a]">
                MISSION CONTROL
              </span>
              <span className="hidden sm:inline-block bg-[#ffcc00] border-2 border-[#1a1a1a] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                v2.0 LIVE
              </span>
            </div>
            <p className="font-mono text-[11px] text-[#4a4a4a] hidden md:block">
              HACKATHON AUTOMATION TRACKER // SYS.READY
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search hackathons, problem statements, domains..."
              className="w-full bg-[#eee9e0] border-2 border-[#1a1a1a] pl-9 pr-4 py-2 font-body text-sm text-[#1a1a1a] placeholder:text-[#6a6a6a] focus:outline-none focus:bg-[#ffffff] focus:shadow-brutal-sm transition-all"
            />
          </div>
        </div>

        {/* Controls & Clock */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live System Clock */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#eee9e0] border-2 border-[#1a1a1a] px-3 py-1.5 font-mono text-xs font-bold shadow-brutal-sm">
            <Terminal className="w-3.5 h-3.5 text-[#e63b2e]" />
            <span>{timeStr || '12:00:00 UTC'}</span>
          </div>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            id="btn-notifications-trigger"
            className="relative bg-[#eee9e0] hover:bg-[#ffcc00] border-2 border-[#1a1a1a] p-2 transition-all shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
            title="System Dispatches & Alerts"
          >
            <Bell className="w-5 h-5 text-[#1a1a1a]" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#e63b2e] text-[#f5f0e8] border-2 border-[#1a1a1a] font-mono text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* New Mission Button */}
          <button
            onClick={onOpenNewMission}
            id="btn-new-mission"
            className="bg-[#ffcc00] hover:bg-[#1a1a1a] hover:text-[#f5f0e8] text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 sm:px-4 py-2 font-label font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-brutal-sm active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">NEW MISSION</span>
            <span className="sm:hidden">NEW</span>
          </button>

          {/* Profile & Logout */}
          <div className="flex items-center border-2 border-[#1a1a1a] bg-[#eee9e0]">
            <div className="px-2 sm:px-3 py-1.5 flex items-center gap-2 border-r-2 border-[#1a1a1a]">
              <div className="w-6 h-6 bg-[#ffcc00] border border-[#1a1a1a] flex items-center justify-center font-mono font-bold text-xs">
                <User className="w-3.5 h-3.5 text-[#1a1a1a]" />
              </div>
              <span className="font-mono text-xs font-bold text-[#1a1a1a] hidden xl:inline">
                {userEmail}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              id="btn-logout"
              className="p-2 hover:bg-[#e63b2e] hover:text-[#f5f0e8] transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
