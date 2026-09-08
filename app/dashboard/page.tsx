'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { StatsOverview } from '@/components/StatsOverview';
import { HackathonCard } from '@/components/HackathonCard';
import { NewHackathonModal } from '@/components/NewHackathonModal';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { ToastContainer } from '@/components/ToastContainer';
import { HackathonView, MissionAlert, ToastMessage } from '@/lib/types';
import {
  INITIAL_MISSION_ALERTS,
  getStoredHackathons,
  saveStoredHackathons,
} from '@/lib/mock-data';
import { LayoutGrid, ListFilter, Plus, Search } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'hackathons' | 'notifications' | 'settings'>('dashboard');
  const [hackathons, setHackathons] = useState<HackathonView[]>([]);
  const [alerts, setAlerts] = useState<MissionAlert[]>(INITIAL_MISSION_ALERTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed' | 'high_priority'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Initialize stored hackathons on mount
  useEffect(() => {
    const list = getStoredHackathons();
    setHackathons(list);
  }, []);

  // Sync activeTab with notifications
  useEffect(() => {
    if (activeTab === 'notifications') {
      setIsNotificationOpen(true);
    }
  }, [activeTab]);

  const addToast = (title: string, message: string, type: 'success' | 'alert' | 'info' = 'info') => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastMessage = {
      id,
      title,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers
  const handleCreateHackathon = (newHackathon: HackathonView) => {
    const nextList = [newHackathon, ...hackathons];
    setHackathons(nextList);
    saveStoredHackathons(nextList);
    addToast('Hackathon Initialized', `${newHackathon.title} successfully launched.`, 'success');
  };

  const handleTriggerEmailDispatch = (title: string, count: number) => {
    addToast(
      'Email Broadcast Sent',
      `Dispatched warning email to ${count} operatives for "${title}".`,
      'success'
    );
  };

  // Filtering
  const filteredHackathons = hackathons.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'in_progress') return h.status === 'in_progress';
    if (activeFilter === 'completed') return h.status === 'completed' || h.status === 'submitted';
    if (activeFilter === 'high_priority') return h.priority === 'high';
    return true;
  });

  const unreadAlertsCount = alerts.filter((a) => a.unread).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex font-body selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pl-16 md:pl-64">
        {/* Top Navbar */}
        <Navbar
          onOpenNewMission={() => setIsNewModalOpen(true)}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          unreadCount={unreadAlertsCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Stats Overview Panel */}
          <StatsOverview hackathons={hackathons} />

          {/* Mission Control Registry & Filter Controls */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-amber-400" />
                <h2 className="font-extrabold text-base uppercase tracking-tight text-slate-100">
                  Mission Control Registry
                </h2>
                <span className="bg-slate-800 text-amber-400 text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-slate-700">
                  {filteredHackathons.length}
                </span>
              </div>

              {/* Action & Filter Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Filter Chips */}
                <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 font-mono text-xs">
                  {[
                    { id: 'all', label: 'ALL' },
                    { id: 'in_progress', label: 'ACTIVE' },
                    { id: 'completed', label: 'DONE' },
                    { id: 'high_priority', label: 'HIGH' },
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => setActiveFilter(chip.id as any)}
                      className={`px-3 py-1 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                        activeFilter === chip.id
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="List View"
                  >
                    <ListFilter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

                {/* New Mission Button */}
                <button
                  onClick={() => setIsNewModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>New Mission</span>
                </button>
              </div>
            </div>

            {/* Hackathons Render List / Grid */}
            {filteredHackathons.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3.5' : 'space-y-2.5'}>
                {filteredHackathons.map((h) => (
                  <HackathonCard key={h.id} hackathon={h} />
                ))}
              </div>
            ) : (
              <div className="glass-panel border-dashed border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-400 space-y-2">
                <Search className="w-8 h-8 text-amber-400 mx-auto mb-1 opacity-60" />
                <p className="font-bold text-sm text-slate-200">No hackathons found matching your query.</p>
                <p>Try adjusting your search query or active filter chips above.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal Dialogs */}
      <NewHackathonModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreateHackathon}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => {
          setIsNotificationOpen(false);
          setActiveTab('dashboard');
        }}
        alerts={alerts}
        onMarkAllRead={() => setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })))}
        onSendEmailDispatch={(subject, body, count) => handleTriggerEmailDispatch(subject, count)}
      />

      {/* Toast Alert Popups */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
