'use client';

import React from 'react';
import { HackathonView } from '@/lib/types';
import { Eye, Edit3 } from 'lucide-react';

interface HackathonCardProps {
  hackathon: HackathonView;
  onSelect: (hackathon: HackathonView) => void;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({
  hackathon,
  onSelect,
}) => {
  const getStatusDotColor = () => {
    if (hackathon.status === 'completed' || hackathon.status === 'submitted') return 'bg-emerald-600';
    if (hackathon.priority === 'high') return 'bg-red-600';
    return 'bg-amber-500';
  };

  return (
    <div
      onClick={() => onSelect(hackathon)}
      className="group glass-card glass-card-hover p-4 rounded-2xl flex items-center justify-between transition-all relative overflow-hidden cursor-pointer"
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
        {/* Status Dot */}
        <div className={`w-2.5 h-2.5 rounded-full ${getStatusDotColor()} shrink-0 shadow-xs`} />

        <div className="flex flex-col min-w-0">
          <span className="text-slate-100 font-semibold text-sm truncate group-hover:text-amber-400 transition-colors">
            {hackathon.title}
          </span>
          <span className="text-slate-400 text-xs font-mono font-medium">
            {hackathon.code} • {hackathon.teamName} • {hackathon.timeRemaining}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <span className="text-xs font-mono text-slate-400 w-8 text-right font-medium">
          {hackathon.completion}%
        </span>
        <div className="w-36 sm:w-44 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500 shadow-lg shadow-amber-500/30"
            style={{ width: `${hackathon.completion}%` }}
          />
        </div>
      </div>

      {/* Hover Action Buttons */}
      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-3 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(hackathon);
          }}
          className="text-slate-400 hover:text-amber-400 transition-colors p-1.5 rounded-full hover:bg-slate-800 cursor-pointer"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(hackathon);
          }}
          className="text-slate-400 hover:text-amber-400 transition-colors p-1.5 rounded-full hover:bg-slate-800 cursor-pointer"
          title="Edit Hackathon"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};



