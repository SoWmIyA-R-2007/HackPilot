'use client';

import React, { useState } from 'react';
import { MissionAlert } from '@/lib/types';
import { X, Bell, ShieldAlert, Users, Terminal, Send, Check } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: MissionAlert[];
  onMarkAllRead: () => void;
  onSendEmailDispatch: (subject: string, body: string, targetCount: number) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkAllRead,
  onSendEmailDispatch,
}) => {
  if (!isOpen) return null;

  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'team' | 'system'>('all');
  const [selectedAlert, setSelectedAlert] = useState<MissionAlert | null>(null);
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');

  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === 'all') return true;
    return a.type === activeFilter;
  });

  const handleOpenDispatch = (alert: MissionAlert) => {
    setSelectedAlert(alert);
    setCustomSubject(alert.suggestedSubject || `[MISSION ALERT] ${alert.title}`);
    setCustomBody(
      alert.suggestedBody ||
        `Attention Operatives,\n\n${alert.description}\n\nPlease check Mission Control.\n\nBest,\nMission Control`
    );
  };

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendEmailDispatch(customSubject, customBody, selectedAlert?.targetOperatives?.length || 3);
    setSelectedAlert(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#f5f0e8] border-l-4 border-[#1a1a1a] w-full max-w-md h-full flex flex-col shadow-brutal-xl animate-slide-in-right">
        {/* Header */}
        <div className="bg-[#1a1a1a] text-[#f5f0e8] p-4 flex items-center justify-between border-b-4 border-[#1a1a1a] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#e63b2e] border border-[#1a1a1a] flex items-center justify-center text-[#f5f0e8]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base uppercase tracking-tight">
                SYSTEM DISPATCHES
              </h3>
              <p className="font-mono text-[10px] text-[#a0a0a0]">
                REAL-TIME ALERTS & DISPATCH LOG
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 bg-[#eee9e0] hover:bg-[#e63b2e] hover:text-[#f5f0e8] text-[#1a1a1a] border border-[#1a1a1a] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls & Mark All Read */}
        <div className="p-3 bg-[#eee9e0] border-b-2 border-[#1a1a1a] flex items-center justify-between gap-2 shrink-0">
          <div className="flex gap-1">
            {['all', 'urgent', 'team', 'system'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f as any)}
                className={`px-2.5 py-1 font-mono text-[10px] font-bold uppercase border border-[#1a1a1a] cursor-pointer ${
                  activeFilter === f
                    ? 'bg-[#1a1a1a] text-[#ffcc00]'
                    : 'bg-[#f5f0e8] text-[#4a4a4a] hover:bg-[#eee9e0]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={onMarkAllRead}
            className="font-mono text-[10px] font-bold text-[#0055ff] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>

        {/* Dispatch Form Modal overlay if open */}
        {selectedAlert ? (
          <form
            onSubmit={handleDispatchSubmit}
            className="p-4 bg-[#eee9e0] border-b-4 border-[#1a1a1a] space-y-3 animate-fade-in shrink-0"
          >
            <div className="flex items-center justify-between">
              <span className="font-label font-bold text-xs uppercase text-[#e63b2e] flex items-center gap-1">
                <Send className="w-3.5 h-3.5" />
                BROADCAST EMAIL DISPATCH
              </span>
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="text-xs text-[#6a6a6a] hover:underline font-mono"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-bold text-[#4a4a4a] mb-1">
                EMAIL SUBJECT
              </label>
              <input
                type="text"
                required
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full bg-[#f5f0e8] border border-[#1a1a1a] px-2.5 py-1.5 font-mono text-xs text-[#1a1a1a] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] font-bold text-[#4a4a4a] mb-1">
                MESSAGE BODY
              </label>
              <textarea
                rows={4}
                required
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full bg-[#f5f0e8] border border-[#1a1a1a] px-2.5 py-1.5 font-mono text-xs text-[#1a1a1a] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#e63b2e] hover:bg-[#1a1a1a] text-[#f5f0e8] border-2 border-[#1a1a1a] py-2 font-label font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-brutal-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>DISPATCH TO TEAM OPERATIVES NOW</span>
            </button>
          </form>
        ) : null}

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAlerts.map((alert) => {
            const getIcon = () => {
              if (alert.type === 'urgent') return <ShieldAlert className="w-4 h-4 text-[#e63b2e]" />;
              if (alert.type === 'team') return <Users className="w-4 h-4 text-[#0055ff]" />;
              return <Terminal className="w-4 h-4 text-[#ffcc00]" />;
            };

            return (
              <div
                key={alert.id}
                className={`border-2 border-[#1a1a1a] p-3 shadow-brutal-sm relative transition-all ${
                  alert.unread ? 'bg-[#eee9e0]' : 'bg-[#f5f0e8] opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    {getIcon()}
                    <span className="font-headline font-bold text-xs text-[#1a1a1a] uppercase">
                      {alert.title}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-[#6a6a6a] shrink-0 font-bold">
                    {alert.time}
                  </span>
                </div>

                <p className="font-body text-xs text-[#4a4a4a] leading-normal">
                  {alert.description}
                </p>

                {alert.suggestedSubject && (
                  <button
                    onClick={() => handleOpenDispatch(alert)}
                    className="mt-2 text-[10px] font-mono font-bold text-[#0055ff] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>PREPARE EMAIL DISPATCH</span>
                  </button>
                )}
              </div>
            );
          })}

          {filteredAlerts.length === 0 && (
            <div className="text-center py-12 text-[#6a6a6a] font-mono text-xs">
              No active dispatches found in log.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
