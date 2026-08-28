'use client';

import React, { useState, useEffect } from 'react';
import { HackathonView, MissionAlert, ToastMessage } from '@/lib/types';
import { INITIAL_MOCK_HACKATHONS, INITIAL_MISSION_ALERTS } from '@/lib/mock-data';
import { Navbar } from '@/components/Navbar';
import { StatsOverview } from '@/components/StatsOverview';
import { HackathonCard } from '@/components/HackathonCard';
import { HackathonModal } from '@/components/HackathonModal';
import { NewHackathonModal } from '@/components/NewHackathonModal';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { ToastContainer } from '@/components/ToastContainer';
import { LayoutGrid, Filter, Plus, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const [hackathons, setHackathons] = useState<HackathonView[]>(INITIAL_MOCK_HACKATHONS);
  const [alerts, setAlerts] = useState<MissionAlert[]>(INITIAL_MISSION_ALERTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // UI state
  const [selectedHackathon, setSelectedHackathon] = useState<HackathonView | null>(null);
  const [isNewMissionOpen, setIsNewMissionOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'submitted' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [isConnectedToSupabase, setIsConnectedToSupabase] = useState(false);

  // Attempt to load live data from Supabase
  useEffect(() => {
    const loadSupabaseData = async () => {
      try {
        const supabase = createClient();
        const { data: dbHackathons, error } = await supabase
          .from('hackathons')
          .select('*, tasks(*), teams(*, team_members(*, profiles(*)))');

        if (!error && dbHackathons && dbHackathons.length > 0) {
          setIsConnectedToSupabase(true);
          // Transform DB schema to HackathonView model
          const mappedViews: HackathonView[] = dbHackathons.map((h: any) => ({
            id: h.id,
            code: `#HCK-${h.id.slice(0, 4).toUpperCase()}`,
            title: h.name,
            teamName: h.teams?.[0]?.team_name || 'Team Operatives',
            domain: h.domain || 'Technology',
            psId: h.ps_id || 'PS-01',
            problemStatement: h.ps_description || 'No statement provided.',
            status: h.status || 'in_progress',
            priority: h.priority || 'medium',
            completion: h.progress_percent || 0,
            timeRemaining: 'ACTIVE',
            kickoffDate: h.created_at,
            submissionDeadline: h.submission_deadline,
            bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            mode: h.mode,
            websiteLink: h.website_link,
            operatives:
              h.teams?.[0]?.team_members?.map((m: any) => ({
                id: m.id,
                name: m.profiles?.full_name || 'Operative',
                email: m.profiles?.email || m.invited_email || 'user@hacktrack.dev',
                role: m.role || 'Member',
                avatar: m.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              })) || [],
            tasks:
              h.tasks?.map((t: any) => ({
                id: t.id,
                title: t.task_name,
                completed: t.status === 'done',
                weight: t.weight || 1,
                assigneeName: 'Operative',
                assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              })) || [],
            notifications: [],
            rules: [],
          }));

          setHackathons(mappedViews);
        }
      } catch {
        // Fall back to initial mock state gracefully
        setIsConnectedToSupabase(false);
      }
    };

    loadSupabaseData();
  }, []);

  // Toast Helper
  const addToast = (type: 'success' | 'alert' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Hackathon CRUD Handlers
  const handleCreateHackathon = (newHackathon: HackathonView) => {
    setHackathons((prev) => [newHackathon, ...prev]);
    addToast('success', 'MISSION INITIALIZED', `Hackathon "${newHackathon.title}" launched successfully.`);
  };

  const handleUpdateHackathon = (updated: HackathonView) => {
    setHackathons((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
    if (selectedHackathon?.id === updated.id) {
      setSelectedHackathon(updated);
    }
  };

  const handleDeleteHackathon = (id: string) => {
    setHackathons((prev) => prev.filter((h) => h.id !== id));
    addToast('alert', 'MISSION ABORTED', 'Hackathon record removed from command system.');
  };

  // Trigger Email Dispatch Simulation
  const handleTriggerEmailDispatch = (title: string, recipientCount: number) => {
    addToast(
      'success',
      'EMAIL DISPATCH SENT',
      `Sent automated status & deadline warning email to ${recipientCount} team operatives for "${title}".`
    );
  };

  const handleSendCustomEmailDispatch = (subject: string, body: string, targetCount: number) => {
    addToast(
      'success',
      'BROADCAST SENT',
      `Custom email broadcast "${subject}" dispatched to ${targetCount} operatives.`
    );
  };

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
    addToast('info', 'LOG CLEARED', 'All system alerts marked as read.');
  };

  // Filter Logic
  const filteredHackathons = hackathons.filter((h) => {
    const matchesSearch =
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.psId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || h.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const unreadAlertsCount = alerts.filter((a) => a.unread).length;

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#1a1a1a] flex flex-col font-body selection:bg-[#ffcc00] selection:text-[#1a1a1a]">
      {/* Navbar */}
      <Navbar
        onOpenNewMission={() => setIsNewMissionOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadAlertsCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Banner strip showing connection status */}
        <div className="bg-[#eee9e0] border-2 border-[#1a1a1a] px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-brutal-sm font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse" />
            <span className="font-bold text-[#1a1a1a]">STATUS: OPERATIONAL</span>
            <span className="text-[#8a8a8a]">|</span>
            <span className="text-[#4a4a4a]">
              {isConnectedToSupabase
                ? 'SYNCED WITH SUPABASE DATABASE'
                : 'LOCAL MEMORY STORE (DEMO READY)'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#4a4a4a] hidden sm:inline">
              TOTAL RECORDS: {hackathons.length}
            </span>
          </div>
        </div>

        {/* Hero Metrics Overview */}
        <StatsOverview hackathons={hackathons} />

        {/* Filter Controls Bar */}
        <div className="bg-[#eee9e0] border-4 border-[#1a1a1a] p-4 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-[#1a1a1a]" />
            <h2 className="font-headline font-bold text-lg uppercase tracking-tight text-[#1a1a1a]">
              MISSION REGISTRY
            </h2>
          </div>

          {/* Status Tabs & Priority Filter */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs w-full md:w-auto">
            <div className="flex bg-[#f5f0e8] border-2 border-[#1a1a1a] p-0.5">
              {[
                { id: 'all', label: 'ALL' },
                { id: 'in_progress', label: 'IN PROGRESS' },
                { id: 'submitted', label: 'SUBMITTED' },
                { id: 'completed', label: 'COMPLETED' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1 font-bold uppercase transition-all cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-[#ffcc00] text-[#1a1a1a] border border-[#1a1a1a]'
                      : 'text-[#4a4a4a] hover:bg-[#eee9e0]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Priority Select Filter */}
            <div className="flex items-center gap-1 bg-[#f5f0e8] border-2 border-[#1a1a1a] px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-[#1a1a1a]" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="bg-transparent font-mono text-xs font-bold text-[#1a1a1a] focus:outline-none cursor-pointer"
              >
                <option value="all">ALL PRIORITIES</option>
                <option value="high">HIGH PRIORITY</option>
                <option value="medium">MEDIUM PRIORITY</option>
                <option value="low">LOW PRIORITY</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hackathon Cards Grid */}
        {filteredHackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((h) => (
              <HackathonCard
                key={h.id}
                hackathon={h}
                onSelect={(selected) => setSelectedHackathon(selected)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#eee9e0] border-4 border-[#1a1a1a] p-12 text-center shadow-brutal space-y-4">
            <div className="w-16 h-16 bg-[#ffcc00] border-2 border-[#1a1a1a] flex items-center justify-center mx-auto shadow-brutal-sm">
              <ShieldCheck className="w-8 h-8 text-[#1a1a1a]" />
            </div>
            <h3 className="font-headline font-bold text-xl uppercase text-[#1a1a1a]">
              NO MATCHING MISSIONS FOUND
            </h3>
            <p className="font-mono text-xs text-[#4a4a4a] max-w-md mx-auto">
              No hackathon records matched your active filter or search query. Try adjusting your filters or initialize a new mission.
            </p>
            <button
              onClick={() => setIsNewMissionOpen(true)}
              className="bg-[#1a1a1a] hover:bg-[#ffcc00] hover:text-[#1a1a1a] text-[#f5f0e8] border-2 border-[#1a1a1a] px-6 py-2.5 font-label font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-brutal transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>INITIALIZE NEW MISSION</span>
            </button>
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <HackathonModal
        hackathon={selectedHackathon}
        onClose={() => setSelectedHackathon(null)}
        onUpdateHackathon={handleUpdateHackathon}
        onDeleteHackathon={handleDeleteHackathon}
        onTriggerEmailDispatch={handleTriggerEmailDispatch}
      />

      <NewHackathonModal
        isOpen={isNewMissionOpen}
        onClose={() => setIsNewMissionOpen(false)}
        onCreate={handleCreateHackathon}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={alerts}
        onMarkAllRead={handleMarkAllRead}
        onSendEmailDispatch={handleSendCustomEmailDispatch}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
