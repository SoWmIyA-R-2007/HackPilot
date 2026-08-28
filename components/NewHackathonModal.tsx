'use client';

import React, { useState } from 'react';
import { HackathonView, HackathonPriority, HackathonMode } from '@/lib/types';
import { X, Plus, Rocket } from 'lucide-react';
import { generateCode, generateId } from '@/lib/utils';

interface NewHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newHackathon: HackathonView) => void;
}

export const NewHackathonModal: React.FC<NewHackathonModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [teamName, setTeamName] = useState('');
  const [domain, setDomain] = useState('Artificial Intelligence');
  const [psId, setPsId] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [mode, setMode] = useState<HackathonMode>('online');
  const [priority, setPriority] = useState<HackathonPriority>('medium');
  const [submissionDeadline, setSubmissionDeadline] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !teamName.trim()) return;

    const id = generateId();
    const code = generateCode(id);

    const newHackathon: HackathonView = {
      id,
      code,
      title: title.trim(),
      teamName: teamName.trim(),
      domain: domain.trim(),
      psId: psId.trim() || `PS-${Math.floor(10 + Math.random() * 90)}`,
      problemStatement: problemStatement.trim() || 'No problem statement provided.',
      status: 'in_progress',
      priority,
      completion: 0,
      timeRemaining: submissionDeadline ? 'Active' : 'No deadline',
      kickoffDate: new Date().toISOString(),
      submissionDeadline: submissionDeadline ? new Date(submissionDeadline).toISOString() : null,
      bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      mode,
      websiteLink: websiteLink.trim() || null,
      operatives: [
        {
          id: 'op-default',
          name: 'Jane Doe',
          email: 'jane@company.com',
          role: 'Team Lead',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        },
      ],
      tasks: [
        {
          id: `t-init-1`,
          title: 'Review Problem Statement Specs & Requirements',
          completed: false,
          weight: 1,
          assigneeName: 'Jane Doe',
          assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        },
        {
          id: `t-init-2`,
          title: 'Set Up Repository & Core Architecture',
          completed: false,
          weight: 2,
          assigneeName: 'Jane Doe',
          assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        },
      ],
      notifications: [],
      rules: [],
    };

    onCreate(newHackathon);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl my-auto overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900/80 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Rocket className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-lg text-slate-100">
              New Hackathon
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Hackathon Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Global AI Challenge 2026"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Team Name *
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. BlockMasters"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Domain / Track
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Web3 & Crypto">Web3 & Crypto</option>
                <option value="ClimateTech">ClimateTech</option>
                <option value="FinTech">FinTech</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Problem Statement ID
              </label>
              <input
                type="text"
                value={psId}
                onChange={(e) => setPsId(e.target.value)}
                placeholder="PS-AI-99"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Format / Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as HackathonMode)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Problem Statement Description
            </label>
            <textarea
              rows={3}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="Detail the problem statement requirements, goals, and evaluation criteria..."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as HackathonPriority)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Submission Deadline
              </label>
              <input
                type="datetime-local"
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Portal Link
              </label>
              <input
                type="url"
                value={websiteLink}
                onChange={(e) => setWebsiteLink(e.target.value)}
                placeholder="https://hackathon.devpost.com"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-xl font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Hackathon</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



