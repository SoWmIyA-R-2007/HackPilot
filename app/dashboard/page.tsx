'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { StatsOverview } from '@/components/StatsOverview';
import { HackathonCard } from '@/components/HackathonCard';
import { HackathonModal } from '@/components/HackathonModal';
import { NewHackathonModal } from '@/components/NewHackathonModal';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { ToastContainer } from '@/components/ToastContainer';
import { HackathonView, MissionAlert, ToastMessage } from '@/lib/types';
import { INITIAL_MOCK_HACKATHONS, INITIAL_MISSION_ALERTS } from '@/lib/mock-data';
import { LayoutGrid, ListFilter, Plus, Search } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'hackathons' | 'notifications' | 'settings'>('dashboard');
  const [hackathons, setHackathons] = useState<HackathonView[]>(INITIAL_MOCK_HACKATHONS);
  const [alerts, setAlerts] = useState<MissionAlert[]>(INITIAL_MISSION_ALERTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed' | 'high_priority'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedHackathon, setSelectedHackathon] = useState<HackathonView | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Sync activeTab with notifications
  useEffect(() => {
    if (activeTab === 'notifications') {
      setIsNotificationOpen(true);
    }
  }, [activeTab]);

  const addToast = (title: string, message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      title,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers
  const handleCreateHackathon = (newHackathon: HackathonView) => {
    setHackathons((prev) => [newHackathon, ...prev]);
    addToast('Hackathon Created', `${newHackathon.title} successfully added.`, 'success');
  };

  const handleUpdateHackathon = (updated: HackathonView) => {
    setHackathons((prev) =>
      prev.map((h) => (h.id === updated.id ? updated : h))
    );
    if (selectedHackathon?.id === updated.id) {
      setSelectedHackathon(updated);
    }
  };

  const handleDeleteHackathon = (id: string) => {
    const target = hackathons.find((h) => h.id === id);
    setHackathons((prev) => prev.filter((h) => h.id !== id));
    if (selectedHackathon?.id === id) {
      setSelectedHackathon(null);
    }
    if (target) {
      addToast('Hackathon Removed', `${target.title} deleted.`, 'warning');
    }
  };

  const handleTriggerEmailDispatch = (title: string, count: number) => {
    addToast(
      'Email Dispatch Broadcasted',
      `Sent deadline & status update email to ${count} team members for ${title}.`,
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
    <div className="bg-[#090d16] min-h-screen text-slate-100 font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'notifications') setIsNotificationOpen(true);
        }}
        unreadCount={unreadAlertsCount}
      />

      {/* Top Header Navbar */}
      <Navbar
        onOpenNewMission={() => setIsNewModalOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        unreadCount={unreadAlertsCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <div className="pl-64 pt-16 min-h-screen">
        <main className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Top Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display-lg text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Mission Control
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
                Overview of active hackathons, team tasks, and sprint progress
              </p>
            </div>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 border border-amber-400"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Hackathon</span>
            </button>
          </div>

          {/* 4 Metric Stat Cards */}
          <StatsOverview hackathons={hackathons} />

          {/* Active Hackathons Section */}
          <div className="space-y-4">
            {/* Toolbar: Filter Pills & View Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-panel p-4 rounded-2xl">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <span className="text-xs font-extrabold text-slate-200 mr-1">Active Hackathons</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'in_progress', label: 'In Progress' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'high_priority', label: 'High Priority' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id as any)}
                    className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                      activeFilter === filter.id
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 border border-amber-400'
                        : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-slate-100 border border-slate-800'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1 cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-amber-500/20 text-amber-400 shadow-xs border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Compact List View"
                >
                  <ListFilter className="w-4 h-4" />
                  <span className="hidden sm:inline">List View</span>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1 cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-amber-500/20 text-amber-400 shadow-xs border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid View</span>
                </button>
              </div>
            </div>

            {/* Hackathons Render List / Grid */}
            {filteredHackathons.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3.5' : 'space-y-2.5'}>
                {filteredHackathons.map((h) => (
                  <HackathonCard
                    key={h.id}
                    hackathon={h}
                    onSelect={(selected) => setSelectedHackathon(selected)}
                  />
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
      <HackathonModal
        hackathon={selectedHackathon}
        onClose={() => setSelectedHackathon(null)}
        onUpdateHackathon={handleUpdateHackathon}
        onDeleteHackathon={handleDeleteHackathon}
        onTriggerEmailDispatch={handleTriggerEmailDispatch}
      />

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
