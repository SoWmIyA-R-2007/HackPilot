'use client';

import React, { useState } from 'react';
import { HackathonView, TaskView, OperativeView } from '@/lib/types';
import { TaskChecklist } from './TaskChecklist';
import {
  X,
  Layers,
  Users,
  CheckCircle2,
  Mail,
  Send,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface HackathonModalProps {
  hackathon: HackathonView | null;
  onClose: () => void;
  onUpdateHackathon: (updated: HackathonView) => void;
  onDeleteHackathon: (id: string) => void;
  onTriggerEmailDispatch: (hackathonTitle: string, recipientCount: number) => void;
}

export const HackathonModal: React.FC<HackathonModalProps> = ({
  hackathon,
  onClose,
  onUpdateHackathon,
  onDeleteHackathon,
  onTriggerEmailDispatch,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'tasks' | 'team' | 'reminders'>('specs');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Developer');

  if (!hackathon) return null;

  // Handle task toggling
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = hackathon.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    
    // Recalculate completion
    const totalW = updatedTasks.reduce((acc, t) => acc + t.weight, 0);
    const completedW = updatedTasks
      .filter((t) => t.completed)
      .reduce((acc, t) => acc + t.weight, 0);
    const newCompletion = totalW ? Math.round((completedW / totalW) * 100) : 0;

    onUpdateHackathon({
      ...hackathon,
      tasks: updatedTasks,
      completion: newCompletion,
    });
  };

  // Add task
  const handleAddTask = (
    title: string,
    weight: number,
    assigneeName: string,
    assigneeAvatar: string
  ) => {
    const newTask: TaskView = {
      id: `t-${Date.now()}`,
      title,
      completed: false,
      weight,
      assigneeName,
      assigneeAvatar,
    };
    const updatedTasks = [...hackathon.tasks, newTask];

    const totalW = updatedTasks.reduce((acc, t) => acc + t.weight, 0);
    const completedW = updatedTasks
      .filter((t) => t.completed)
      .reduce((acc, t) => acc + t.weight, 0);
    const newCompletion = totalW ? Math.round((completedW / totalW) * 100) : 0;

    onUpdateHackathon({
      ...hackathon,
      tasks: updatedTasks,
      completion: newCompletion,
    });
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = hackathon.tasks.filter((t) => t.id !== taskId);
    const totalW = updatedTasks.reduce((acc, t) => acc + t.weight, 0);
    const completedW = updatedTasks
      .filter((t) => t.completed)
      .reduce((acc, t) => acc + t.weight, 0);
    const newCompletion = totalW ? Math.round((completedW / totalW) * 100) : 0;

    onUpdateHackathon({
      ...hackathon,
      tasks: updatedTasks,
      completion: newCompletion,
    });
  };

  // Invite operative
  const handleInviteOperative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const namePart = inviteEmail.split('@')[0];
    const newOp: OperativeView = {
      id: `op-${Date.now()}`,
      name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
    };

    onUpdateHackathon({
      ...hackathon,
      operatives: [...hackathon.operatives, newOp],
    });
    setInviteEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-[#f5f0e8] border-4 border-[#1a1a1a] shadow-brutal-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Top Header */}
        <div className="bg-[#1a1a1a] text-[#f5f0e8] p-4 flex items-center justify-between border-b-4 border-[#1a1a1a] shrink-0">
          <div className="flex items-center gap-3">
            <span className="bg-[#ffcc00] text-[#1a1a1a] font-mono text-xs font-bold px-2 py-1 border border-[#1a1a1a]">
              {hackathon.code}
            </span>
            <div>
              <h2 className="font-headline font-bold text-lg sm:text-xl uppercase tracking-tight truncate max-w-md">
                {hackathon.title}
              </h2>
              <p className="font-mono text-xs text-[#a0a0a0]">
                TEAM: {hackathon.teamName} // DOMAIN: {hackathon.domain}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-[#eee9e0] hover:bg-[#e63b2e] hover:text-[#f5f0e8] text-[#1a1a1a] border-2 border-[#1a1a1a] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header Navigation */}
        <div className="flex border-b-4 border-[#1a1a1a] bg-[#eee9e0] overflow-x-auto hide-scrollbar shrink-0">
          {[
            { id: 'specs', label: 'MISSION SPECS', icon: Layers },
            { id: 'tasks', label: `TASKS (${hackathon.tasks.length})`, icon: CheckCircle2 },
            { id: 'team', label: `OPERATIVES (${hackathon.operatives.length})`, icon: Users },
            { id: 'reminders', label: 'EMAIL DISPATCHES', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 font-label font-bold text-xs uppercase tracking-wider border-r-2 border-[#1a1a1a] transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#ffcc00] text-[#1a1a1a] shadow-[inset_0_-4px_0_0_#1a1a1a]'
                    : 'bg-[#eee9e0] text-[#4a4a4a] hover:bg-[#f5f0e8]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#f5f0e8]">
          {/* TAB 1: MISSION SPECS */}
          {activeTab === 'specs' && (
            <div className="space-y-6 animate-fade-in">
              {/* Problem Statement Card */}
              <div className="bg-[#eee9e0] border-2 border-[#1a1a1a] p-5 shadow-brutal-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label font-bold text-xs uppercase tracking-wider text-[#4a4a4a]">
                    PROBLEM STATEMENT DIRECTIVE
                  </span>
                  {hackathon.psId && (
                    <span className="bg-[#1a1a1a] text-[#ffcc00] font-mono text-xs font-bold px-2 py-0.5 border border-[#1a1a1a]">
                      {hackathon.psId}
                    </span>
                  )}
                </div>
                <p className="font-body text-sm text-[#1a1a1a] leading-relaxed">
                  {hackathon.problemStatement}
                </p>
              </div>

              {/* Grid Metadata Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-[#eee9e0] border-2 border-[#1a1a1a] p-4 shadow-brutal-sm">
                  <span className="text-[#6a6a6a] font-bold block mb-1">MODE / FORMAT</span>
                  <span className="font-bold text-sm uppercase text-[#1a1a1a]">
                    {hackathon.mode || 'ONLINE'}
                  </span>
                </div>

                <div className="bg-[#eee9e0] border-2 border-[#1a1a1a] p-4 shadow-brutal-sm">
                  <span className="text-[#6a6a6a] font-bold block mb-1">PRIORITY LEVEL</span>
                  <span className="font-bold text-sm uppercase text-[#e63b2e]">
                    {hackathon.priority} PRIORITY
                  </span>
                </div>

                <div className="bg-[#eee9e0] border-2 border-[#1a1a1a] p-4 shadow-brutal-sm">
                  <span className="text-[#6a6a6a] font-bold block mb-1">STATUS</span>
                  <span className="font-bold text-sm uppercase text-[#1a1a1a]">
                    {hackathon.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-[#eee9e0] border-2 border-[#1a1a1a] p-4 shadow-brutal-sm">
                  <span className="text-[#6a6a6a] font-bold block mb-1">SUBMISSION DEADLINE</span>
                  <span className="font-bold text-xs text-[#1a1a1a]">
                    {formatDate(hackathon.submissionDeadline)}
                  </span>
                </div>

                <div className="bg-[#eee9e0] border-2 border-[#1a1a1a] p-4 shadow-brutal-sm">
                  <span className="text-[#6a6a6a] font-bold block mb-1">KICKOFF DATE</span>
                  <span className="font-bold text-xs text-[#1a1a1a]">
                    {formatDate(hackathon.kickoffDate)}
                  </span>
                </div>

                <div className="bg-[#eee9e0] border-2 border-[#1a1a1a] p-4 shadow-brutal-sm">
                  <span className="text-[#6a6a6a] font-bold block mb-1">WEBSITE LINK</span>
                  {hackathon.websiteLink ? (
                    <a
                      href={hackathon.websiteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0055ff] hover:underline font-bold flex items-center gap-1 truncate"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[#6a6a6a]">N/A</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TASK CHECKLIST */}
          {activeTab === 'tasks' && (
            <div className="animate-fade-in">
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
            <div className="space-y-6 animate-fade-in">
              {/* Operatives Roster Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hackathon.operatives.map((op) => (
                  <div
                    key={op.id}
                    className="bg-[#eee9e0] border-2 border-[#1a1a1a] p-4 flex items-center gap-4 shadow-brutal-sm"
                  >
                    <img
                      src={op.avatar}
                      alt={op.name}
                      className="w-12 h-12 rounded-full border-2 border-[#1a1a1a] object-cover bg-[#ffcc00]"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-headline font-bold text-sm text-[#1a1a1a] truncate">
                        {op.name}
                      </h4>
                      <p className="font-mono text-xs text-[#0055ff] font-bold truncate">
                        {op.role}
                      </p>
                      <p className="font-mono text-[11px] text-[#6a6a6a] truncate">
                        {op.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invite New Operative Form */}
              <form
                onSubmit={handleInviteOperative}
                className="bg-[#eee9e0] border-2 border-[#1a1a1a] p-5 shadow-brutal-sm space-y-3"
              >
                <h4 className="font-headline font-bold text-sm uppercase text-[#1a1a1a] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#ffcc00]" />
                  <span>DISPATCH TEAM OPERATIVE INVITATION</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="operative.email@company.dev"
                      className="w-full bg-[#f5f0e8] border-2 border-[#1a1a1a] px-3 py-2 font-mono text-xs text-[#1a1a1a] focus:outline-none focus:bg-[#ffffff]"
                    />
                  </div>
                  <div>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full bg-[#f5f0e8] border-2 border-[#1a1a1a] px-3 py-2 font-mono text-xs text-[#1a1a1a] focus:outline-none"
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
                  className="bg-[#1a1a1a] hover:bg-[#ffcc00] hover:text-[#1a1a1a] text-[#f5f0e8] border-2 border-[#1a1a1a] px-4 py-2 font-label font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-brutal-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SEND INVITE DISPATCH</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: REMINDERS & EMAIL DISPATCHES */}
          {activeTab === 'reminders' && (
            <div className="space-y-6 animate-fade-in">
              {/* Trigger Email Button */}
              <div className="bg-[#ffcc00] border-4 border-[#1a1a1a] p-5 shadow-brutal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-headline font-bold text-base uppercase text-[#1a1a1a] flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#1a1a1a]" />
                    <span>MANUAL EMAIL DISPATCH TRIGGER</span>
                  </h4>
                  <p className="font-body text-xs text-[#1a1a1a] mt-1">
                    Send an immediate deadline warning and checklist status email to all {hackathon.operatives.length} team operatives.
                  </p>
                </div>

                <button
                  onClick={() =>
                    onTriggerEmailDispatch(hackathon.title, hackathon.operatives.length)
                  }
                  className="bg-[#1a1a1a] hover:bg-[#e63b2e] text-[#f5f0e8] border-2 border-[#1a1a1a] px-4 py-2 font-label font-bold text-xs uppercase flex items-center gap-2 transition-all shadow-brutal-sm cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>DISPATCH EMAIL NOW</span>
                </button>
              </div>

              {/* Automated Rules */}
              <div className="space-y-3">
                <h4 className="font-headline font-bold text-sm uppercase text-[#1a1a1a]">
                  AUTOMATED REMINDER SCHEDULE
                </h4>
                {hackathon.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-[#eee9e0] border-2 border-[#1a1a1a] p-4 flex items-center justify-between gap-3 shadow-brutal-sm"
                  >
                    <div>
                      <span className="bg-[#1a1a1a] text-[#ffcc00] font-mono text-[10px] font-bold px-2 py-0.5 border border-[#1a1a1a]">
                        {rule.timeframe}
                      </span>
                      <p className="font-body text-xs text-[#1a1a1a] font-medium mt-1">
                        {rule.description}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] font-bold bg-[#0055ff] text-[#f5f0e8] px-2 py-0.5 border border-[#1a1a1a]">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-[#eee9e0] border-t-4 border-[#1a1a1a] p-4 flex items-center justify-between gap-4 shrink-0">
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete mission: ${hackathon.title}?`)) {
                onDeleteHackathon(hackathon.id);
                onClose();
              }
            }}
            className="bg-[#eee9e0] hover:bg-[#e63b2e] hover:text-[#f5f0e8] text-[#e63b2e] border-2 border-[#1a1a1a] px-3 py-2 font-label font-bold text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">ABORT MISSION</span>
          </button>

          <button
            onClick={onClose}
            className="bg-[#1a1a1a] hover:bg-[#ffcc00] hover:text-[#1a1a1a] text-[#f5f0e8] border-2 border-[#1a1a1a] px-6 py-2 font-label font-bold text-xs uppercase tracking-wider shadow-brutal-sm transition-all cursor-pointer"
          >
            CLOSE CONTROL
          </button>
        </div>
      </div>
    </div>
  );
};
