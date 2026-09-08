'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HackathonView,
  TaskView,
  OperativeView,
  ToastMessage,
} from '@/lib/types';
import {
  getStoredHackathons,
  saveStoredHackathons,
} from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { TaskChecklist } from '@/components/TaskChecklist';
import { ToastContainer } from '@/components/ToastContainer';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Layers,
  Mail,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
  Users,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function HackathonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const hackathonId = params?.id as string;

  const [hackathon, setHackathon] = useState<HackathonView | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team' | 'dispatches'>('overview');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Invite operative state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Developer');

  // Load Hackathon data
  useEffect(() => {
    if (!hackathonId) return;

    const loadData = async () => {
      // 1. Try stored local data
      const allHackathons = getStoredHackathons();
      const match = allHackathons.find((h) => h.id === hackathonId);

      if (match) {
        setHackathon(match);
        setLoading(false);
        return;
      }

      // 2. Try Supabase fallback
      try {
        const supabase = createClient();
        const { data: h, error } = await supabase
          .from('hackathons')
          .select('*, tasks(*), teams(*, team_members(*, profiles(*)))')
          .eq('id', hackathonId)
          .single();

        if (!error && h) {
          const mapped: HackathonView = {
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
            bannerImage:
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
            mode: h.mode,
            websiteLink: h.website_link,
            operatives:
              h.teams?.[0]?.team_members?.map((m: any) => ({
                id: m.id,
                name: m.profiles?.full_name || 'Operative',
                email: m.profiles?.email || m.invited_email || 'user@hacktrack.dev',
                role: m.role || 'Member',
                avatar:
                  m.profiles?.avatar_url ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              })) || [],
            tasks:
              h.tasks?.map((t: any) => ({
                id: t.id,
                title: t.task_name,
                completed: t.status === 'done',
                weight: t.weight || 1,
                assigneeName: 'Operative',
                assigneeAvatar:
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              })) || [],
            notifications: [],
            rules: [],
          };
          setHackathon(mapped);
        }
      } catch {
        // Fallback complete
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [hackathonId]);

  // Toast Helper
  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'alert' | 'info' = 'info'
  ) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to persist hackathon state
  const updateHackathonState = (updated: HackathonView) => {
    setHackathon(updated);
    const all = getStoredHackathons();
    const nextList = all.map((h) => (h.id === updated.id ? updated : h));
    saveStoredHackathons(nextList);
  };

  // Task Toggle
  const handleToggleTask = (taskId: string) => {
    if (!hackathon) return;

    const updatedTasks = hackathon.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const totalW = updatedTasks.reduce((sum, t) => sum + t.weight, 0);
    const completedW = updatedTasks
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + t.weight, 0);
    const newCompletion = totalW ? Math.round((completedW / totalW) * 100) : 0;

    const updated: HackathonView = {
      ...hackathon,
      tasks: updatedTasks,
      completion: newCompletion,
    };

    updateHackathonState(updated);
    addToast('Task Updated', 'Sprint progress updated successfully.', 'success');
  };

  // Add Task
  const handleAddTask = (
    title: string,
    weight: number,
    assigneeName: string,
    assigneeAvatar: string
  ) => {
    if (!hackathon) return;

    const newTask: TaskView = {
      id: `t-${Date.now()}`,
      title,
      completed: false,
      weight,
      assigneeName,
      assigneeAvatar,
    };
    const updatedTasks = [...hackathon.tasks, newTask];
    const totalW = updatedTasks.reduce((sum, t) => sum + t.weight, 0);
    const completedW = updatedTasks
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + t.weight, 0);
    const newCompletion = totalW ? Math.round((completedW / totalW) * 100) : 0;

    const updated: HackathonView = {
      ...hackathon,
      tasks: updatedTasks,
      completion: newCompletion,
    };

    updateHackathonState(updated);
    addToast('Task Added', `New task "${title}" assigned.`, 'success');
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    if (!hackathon) return;

    const updatedTasks = hackathon.tasks.filter((t) => t.id !== taskId);
    const totalW = updatedTasks.reduce((sum, t) => sum + t.weight, 0);
    const completedW = updatedTasks
      .filter((t) => t.completed)
      .reduce((sum, t) => sum + t.weight, 0);
    const newCompletion = totalW ? Math.round((completedW / totalW) * 100) : 0;

    const updated: HackathonView = {
      ...hackathon,
      tasks: updatedTasks,
      completion: newCompletion,
    };

    updateHackathonState(updated);
    addToast('Task Removed', 'Task removed from sprint checklist.', 'info');
  };

  // Invite Operative
  const handleInviteOperative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hackathon || !inviteEmail.trim()) return;

    const namePart = inviteEmail.split('@')[0];
    const newOp: OperativeView = {
      id: `op-${Date.now()}`,
      name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };

    const updated: HackathonView = {
      ...hackathon,
      operatives: [...hackathon.operatives, newOp],
    };

    updateHackathonState(updated);
    setInviteEmail('');
    addToast(
      'Invitation Sent',
      `Invite dispatched to ${newOp.email} as ${newOp.role}.`,
      'success'
    );
  };

  // Delete Hackathon
  const handleDeleteHackathon = () => {
    if (!hackathon) return;
    if (confirm(`Are you sure you want to delete mission "${hackathon.title}"?`)) {
      const all = getStoredHackathons();
      const filtered = all.filter((h) => h.id !== hackathon.id);
      saveStoredHackathons(filtered);
      router.push('/dashboard');
    }
  };

  // Email Broadcast Trigger
  const handleSendEmailBroadcast = () => {
    if (!hackathon) return;
    addToast(
      'Broadcast Sent',
      `Sent automated status & warning email to ${hackathon.operatives.length} operatives for "${hackathon.title}".`,
      'success'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-amber-400 font-mono text-sm">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span>LOADING MISSION CONTROL DIRECTIVE...</span>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400" />
        <h2 className="text-xl font-bold text-slate-100">MISSION RECORD NOT FOUND</h2>
        <p className="text-xs text-slate-400 max-w-sm text-center">
          The requested hackathon record does not exist or was removed from Mission Control.
        </p>
        <Link
          href="/dashboard"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex font-body selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <Sidebar activeTab="hackathons" onSelectTab={() => router.push('/dashboard')} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pl-16 md:pl-64">
        <Navbar
          onOpenNewMission={() => router.push('/dashboard')}
          onOpenNotifications={() => router.push('/dashboard')}
          unreadCount={0}
          searchQuery=""
          onSearchChange={() => {}}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Navigation & Title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/dashboard"
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                </Link>
                <span className="bg-amber-500/10 text-amber-400 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {hackathon.code}
                </span>
                <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-lg uppercase">
                  {hackathon.status.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight pt-1">
                {hackathon.title}
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                TEAM: <span className="text-slate-200">{hackathon.teamName}</span> • DOMAIN:{' '}
                <span className="text-slate-200">{hackathon.domain}</span>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={handleSendEmailBroadcast}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Broadcast Email</span>
              </button>
              <button
                onClick={handleDeleteHackathon}
                className="bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 p-2.5 rounded-xl transition-colors cursor-pointer"
                title="Delete Hackathon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview & Specs', icon: Layers },
              { id: 'tasks', label: `Tasks (${hackathon.tasks.length})`, icon: CheckCircle2 },
              { id: 'team', label: `Team (${hackathon.operatives.length})`, icon: Users },
              { id: 'dispatches', label: 'Dispatches & Schedule', icon: Mail },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW & SPECS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Problem Statement Card */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    PROBLEM STATEMENT DIRECTIVE
                  </span>
                  {hackathon.psId && (
                    <span className="bg-slate-900 text-amber-400 font-mono text-xs px-2.5 py-1 rounded-md border border-amber-500/20">
                      {hackathon.psId}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-body">
                  {hackathon.problemStatement}
                </p>
              </div>

              {/* Grid Metadata Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">MODE / FORMAT</span>
                  <span className="text-sm font-bold text-slate-100 uppercase">
                    {hackathon.mode || 'ONLINE'}
                  </span>
                </div>

                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">PRIORITY LEVEL</span>
                  <span className="text-sm font-bold text-red-400 uppercase">
                    {hackathon.priority} PRIORITY
                  </span>
                </div>

                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">COMPLETION STATUS</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    {hackathon.completion}% COMPLETED
                  </span>
                </div>

                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">SUBMISSION DEADLINE</span>
                  <span className="text-xs font-bold text-slate-200">
                    {formatDate(hackathon.submissionDeadline)}
                  </span>
                </div>

                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">KICKOFF DATE</span>
                  <span className="text-xs font-bold text-slate-200">
                    {formatDate(hackathon.kickoffDate)}
                  </span>
                </div>

                <div className="glass-card p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">PORTAL / WEBSITE</span>
                  {hackathon.websiteLink ? (
                    <a
                      href={hackathon.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline font-semibold text-xs inline-flex items-center gap-1 truncate"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-500 text-xs">N/A</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TASKS CHECKLIST */}
          {activeTab === 'tasks' && (
            <div className="glass-card p-6 rounded-2xl border border-slate-800">
              <TaskChecklist
                tasks={hackathon.tasks}
                operatives={hackathon.operatives}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          )}

          {/* TAB 3: TEAM OPERATIVES */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Roster Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hackathon.operatives.map((op) => (
                  <div
                    key={op.id}
                    className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-4"
                  >
                    <img
                      src={op.avatar}
                      alt={op.name}
                      className="w-12 h-12 rounded-full border border-amber-500/30 object-cover bg-amber-500/20"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-100 truncate">{op.name}</h4>
                      <p className="text-xs text-amber-400 font-semibold truncate">{op.role}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{op.email}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invite Form */}
              <form
                onSubmit={handleInviteOperative}
                className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4"
              >
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Dispatch Operative Invitation</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="operative.email@company.dev"
                      className="w-full bg-slate-900/80 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full bg-slate-900/80 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none"
                    >
                      <option value="Frontend Lead">Frontend Lead</option>
                      <option value="Backend Architect">Backend Architect</option>
                      <option value="AI / ML Specialist">AI / ML Specialist</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Pitch Lead">Pitch Lead</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 inline-flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invitation Email</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: DISPATCHES & SCHEDULE */}
          {activeTab === 'dispatches' && (
            <div className="space-y-6">
              {/* Broadcast Banner */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Instant Email Dispatch Trigger</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Send immediate status warning & checklist reminder to all {hackathon.operatives.length} team operatives.
                  </p>
                </div>
                <button
                  onClick={handleSendEmailBroadcast}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20 inline-flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Trigger Broadcast Now</span>
                </button>
              </div>

              {/* Schedule Rules */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Automated Reminder Schedule
                </h4>
                {hackathon.rules && hackathon.rules.length > 0 ? (
                  hackathon.rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="glass-card p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/20">
                          {rule.timeframe}
                        </span>
                        <p className="text-xs text-slate-200 mt-1">{rule.description}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/50">
                        ACTIVE
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="glass-card p-4 rounded-xl border border-slate-800 text-xs text-slate-400">
                    Standard automated reminder sequence active (7 days before, 3 days before, 24h final alert).
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
