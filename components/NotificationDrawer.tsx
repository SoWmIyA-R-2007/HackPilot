'use client';

import React from 'react';
import { MissionAlert } from '@/lib/types';
import { X, Bell, AlertTriangle, Users, Trophy, MessageSquare, CheckCheck, ArrowRight } from 'lucide-react';

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
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 w-full max-w-lg h-full flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="bg-slate-900/80 border-b border-slate-800 p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold shadow-xs border border-slate-700">
              <Bell className="w-4 h-4" />
            </div>
            <h1 className="font-bold text-lg text-slate-100 m-0">
              Notifications
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 transition-colors px-3 py-1.5 rounded-xl text-amber-400 text-xs font-semibold cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Notifications List Grouped */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#090d16]">
          {/* Today Group */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
              Today
            </h2>
            <div className="flex flex-col bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xs border border-slate-800 overflow-hidden">
              {/* Notification 1 - Unread */}
              <div className="flex items-start gap-3.5 p-4 hover:bg-slate-800/60 transition-colors relative border-b border-slate-800 group cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-amber-500" />
                <div className="w-9 h-9 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 font-bold shadow-xs border border-slate-700">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-100 truncate">Global Climate Hackathon</span>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0 font-medium">2m ago</span>
                  </div>
                  <p className="text-xs text-slate-300 m-0 mb-2 leading-relaxed">
                    Registration is now open! Early bird submissions close in 48 hours.
                  </p>
                  <a className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline" href="#">
                    View details <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Notification 2 - Urgent Alert */}
              <div className="flex items-start gap-3.5 p-4 hover:bg-slate-800/60 transition-colors relative border-b border-slate-800 group cursor-pointer">
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-red-500" />
                <div className="w-9 h-9 rounded-full bg-red-950/60 text-red-400 flex items-center justify-center shrink-0 font-bold shadow-xs border border-red-800/60">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-100 truncate">DevRel Hackathon</span>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0 font-medium">1h ago</span>
                  </div>
                  <p className="text-xs text-slate-300 m-0 mb-2 leading-relaxed">
                    Your submission is missing a demo video link. Please update before deadline.
                  </p>
                  <a className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:underline" href="#">
                    Fix issue <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Notification 3 - Team Request */}
              <div className="flex items-start gap-3.5 p-4 hover:bg-slate-800/60 transition-colors relative group cursor-pointer opacity-90">
                <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-100 truncate">Web3 Builders</span>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0 font-medium">4h ago</span>
                  </div>
                  <p className="text-xs text-slate-300 m-0 mb-2 leading-relaxed">
                    Alex Chen requested to join team "BlockMasters".
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="bg-amber-500 text-slate-950 text-xs font-bold px-3.5 py-1 rounded-full hover:bg-amber-400 transition-colors shadow-xs cursor-pointer">
                      Accept
                    </button>
                    <button className="bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-1 rounded-full hover:bg-slate-700 transition-colors border border-slate-700 cursor-pointer">
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Yesterday Group */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
              Yesterday
            </h2>
            <div className="flex flex-col bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xs border border-slate-800 overflow-hidden">
              <div className="flex items-start gap-3.5 p-4 hover:bg-slate-800/60 transition-colors relative border-b border-slate-800 group cursor-pointer opacity-80 hover:opacity-100">
                <div className="w-9 h-9 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 border border-slate-700">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-100 truncate">AI Innovators Challenge</span>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0 font-medium">Yesterday, 14:30</span>
                  </div>
                  <p className="text-xs text-slate-300 m-0 mb-2 leading-relaxed">
                    Congratulations! Your team won 2nd place in Best Overall category.
                  </p>
                  <a className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:underline" href="#">
                    View results <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 hover:bg-slate-800/60 transition-colors relative group cursor-pointer opacity-80 hover:opacity-100">
                <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 border border-slate-700">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-100 truncate">FinTech Disruptors</span>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0 font-medium">Yesterday, 09:15</span>
                  </div>
                  <p className="text-xs text-slate-300 m-0 leading-relaxed">
                    New announcement: The payment gateway API endpoint has been updated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



