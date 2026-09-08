'use client';

import React, { useState } from 'react';
import { HackathonView, HackathonPriority, HackathonMode } from '@/lib/types';
import { X, Rocket, Plus } from 'lucide-react';
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
      timeRemaining: submissionDeadline ? 'CALCULATING' : 'NO DEADLINE',
      kickoffDate: new Date().toISOString(),
      submissionDeadline: submissionDeadline ? new Date(submissionDeadline).toISOString() : null,
      bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      mode,
      websiteLink: websiteLink.trim() || null,
      operatives: [
        {
          id: 'op-default',
          name: 'Lead Operative',
          email: 'lead@hacktrack.dev',
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
          assigneeName: 'Lead Operative',
          assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        },
        {
          id: `t-init-2`,
          title: 'Set Up Repository & Core Architecture',
          completed: false,
          weight: 2,
          assigneeName: 'Lead Operative',
          assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        },
      ],
      notifications: [
        {
          id: `n-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          title: 'Mission Initialized',
          description: `Hackathon ${title} registered in Mission Control.`,
          type: 'system',
        },
      ],
      rules: [
        {
          id: `r-1`,
          timeframe: '24 Hours Before',
          description: 'Send urgent submission warning email.',
          active: true,
        },
      ],
    };

    onCreate(newHackathon);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-[#f5f0e8] border-4 border-[#1a1a1a] shadow-brutal-xl w-full max-w-2xl my-auto overflow-hidden">
        {/* Header */}
        <div className="bg-[#1a1a1a] text-[#f5f0e8] p-4 flex items-center justify-between border-b-4 border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ffcc00] border border-[#1a1a1a] flex items-center justify-center text-[#1a1a1a]">
              <Rocket className="w-5 h-5" />
            </div>
            <h2 className="font-headline font-bold text-lg uppercase tracking-tight">
              INITIALIZE NEW MISSION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-[#eee9e0] hover:bg-[#e63b2e] hover:text-[#f5f0e8] text-[#1a1a1a] border border-[#1a1a1a] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold text-[#1a1a1a] mb-1">
                HACKATHON NAME *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI Agents World Cup 2026"
                className="w-full bg-[#eee9e0] border-2 border-[#1a1a1a] px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:bg-[#ffffff]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-[#1a1a1a] mb-1">
                TEAM NAME *
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Quantum Pioneers"
                className="w-full bg-[#eee9e0] border-2 border-[#1a1a1a] px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:bg-[#ffffff]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold text-[#1a1a1a] mb-1">
                DOMAIN / TRACK
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-[#eee9e0] border-2 border-[#1a1a1a] px-3 py-2 font-mono text-xs text-[#1a1a1a] focus:outline-none"
              >
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Web3 & Crypto">Web3 & Crypto</option>
                <option value="ClimateTech">ClimateTech</option>
                <option value="FinTech">FinTech</option>
                <option value="HealthTech">HealthTech</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-[#1a1a1a] mb-1">
                PROBLEM STATEMENT ID
              </label>
              <input
                type="text"
                value={psId}
                onChange={(e) => setPsId(e.target.value)}
                placeholder="PS-AI-99"
                className="w-full bg-[#eee9e0] border-2 border-[#1a1a1a] px-3 py-2 font-mono text-xs text-[#1a1a1a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-[#1a1a1a] mb-1">
                EVENT MODE
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as HackathonMode)}
                className="w-full bg-[#eee9e0] border-2 border-[#1a1a1a] px-3 py-2 font-mono text-xs text-[#1a1a1a] focus:outline-none"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold text-[#1a1a1a] mb-1">
              PROBLEM STATEMENT DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="Detail the problem statement requirements, goals, and evaluation criteria..."
              className="w-full bg-[#eee9e0] border-2 border-[#1a1a1a] px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:bg-[#ffffff]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold text-[#1a1a1a] mb-1">
                PRIORITY LEVEL
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as HackathonPriority)}
                className="w-full bg-[#eee9e0] border-2 border-[#1a1a1a] px-3 py-2 font-mono text-xs text-[#1a1a1a] focus:outline-none"
              >
                <option value="high">HIGH PRIORITY</option>
                <option value="medium">MEDIUM PRIORITY</option>
                <option value="low">LOW PRIORITY</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-[#1a1a1a] mb-1">
                SUBMISSION DEADLINE
              </label>
              <input
                type="datetime-local"
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                className="w-full bg-[#eee9e0] border-2 border-[#1a1a1a] px-3 py-2 font-mono text-xs text-[#1a1a1a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-[#1a1a1a] mb-1">
                PORTAL WEBSITE LINK
              </label>
              <input
                type="url"
                value={websiteLink}
                onChange={(e) => setWebsiteLink(e.target.value)}
                placeholder="https://hackathon.devpost.com"
                className="w-full bg-[#eee9e0] border-2 border-[#1a1a1a] px-3 py-2 font-mono text-xs text-[#1a1a1a] focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t-2 border-[#1a1a1a] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#eee9e0] hover:bg-[#e8e3da] text-[#1a1a1a] border-2 border-[#1a1a1a] px-4 py-2 font-label font-bold text-xs uppercase cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="bg-[#ffcc00] hover:bg-[#1a1a1a] hover:text-[#f5f0e8] text-[#1a1a1a] border-2 border-[#1a1a1a] px-6 py-2 font-label font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-brutal-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>LAUNCH MISSION</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
