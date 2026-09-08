'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Bell, HelpCircle, LogOut, User } from 'lucide-react';
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
          timeZone: 'UTC',
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
        // Fallback
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
    router.push('/login');
  };

  return (
    <header className="sticky top-0 h-16 bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800/80 z-40 px-6 flex items-center justify-between shadow-lg w-full">
      {/* Search Input Bar Pill */}
      <div className="flex items-center bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800 w-96 shadow-inner focus-within:border-amber-500 focus-within:bg-slate-900 transition-all">
        <Search className="w-4 h-4 text-slate-400 shrink-0 font-bold" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search hackathons, tracks, teams..."
          className="bg-transparent border-none focus:outline-none text-xs sm:text-sm text-slate-100 px-2 w-full placeholder:text-slate-500 font-medium"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Help Icon */}
        <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer" title="Help & Support">
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-slate-950 shadow-xs" />
          )}
        </button>

        {/* New Hackathon Button */}
        <button
          onClick={onOpenNewMission}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 border border-amber-400"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Hackathon</span>
        </button>

        {/* Profile Avatar Pill & Sign Out */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-extrabold text-xs border border-slate-700 shadow-xs">
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200 hidden xl:inline">
            {userEmail}
          </span>
          <button
            onClick={handleSignOut}
            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};



