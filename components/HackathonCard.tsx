'use client';

import React from 'react';
import { HackathonView } from '@/lib/types';
import { Clock, Globe, Layers, ArrowRight } from 'lucide-react';

interface HackathonCardProps {
  hackathon: HackathonView;
  onSelect: (hackathon: HackathonView) => void;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({
  hackathon,
  onSelect,
}) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-[#e63b2e] text-[#f5f0e8] border-[#1a1a1a]';
      case 'medium':
        return 'bg-[#ffcc00] text-[#1a1a1a] border-[#1a1a1a]';
      default:
        return 'bg-[#eee9e0] text-[#4a4a4a] border-[#1a1a1a]';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-[#ffcc00] text-[#1a1a1a]';
      case 'completed':
        return 'bg-[#0055ff] text-[#f5f0e8]';
      case 'submitted':
        return 'bg-[#1a1a1a] text-[#ffcc00]';
      default:
        return 'bg-[#e8e3da] text-[#4a4a4a]';
    }
  };

  return (
    <div className="bg-[#eee9e0] border-4 border-[#1a1a1a] shadow-brutal flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-brutal-lg group">
      {/* Card Header Top Strip */}
      <div>
        <div className="bg-[#1a1a1a] text-[#f5f0e8] px-4 py-2 flex items-center justify-between font-mono text-xs border-b-4 border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <span className="text-[#ffcc00] font-bold">{hackathon.code}</span>
            <span className="text-[#8a8a8a]">|</span>
            <span className="uppercase text-[11px] tracking-wider truncate max-w-[140px]">
              {hackathon.teamName}
            </span>
          </div>
          <span
            className={`font-label font-bold text-[10px] uppercase px-2 py-0.5 border border-[#1a1a1a] ${getPriorityStyle(
              hackathon.priority
            )}`}
          >
            {hackathon.priority} PRIORITY
          </span>
        </div>

        {/* Banner / Header Title Area */}
        <div className="p-5 border-b-2 border-[#1a1a1a] bg-[#f5f0e8]">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-headline font-bold text-xl uppercase tracking-tight text-[#1a1a1a] group-hover:text-[#0055ff] transition-colors line-clamp-2">
              {hackathon.title}
            </h3>
            <span
              className={`font-mono text-[10px] font-bold uppercase px-2 py-1 border-2 border-[#1a1a1a] whitespace-nowrap shadow-brutal-sm ${getStatusStyle(
                hackathon.status
              )}`}
            >
              {hackathon.status.replace('_', ' ')}
            </span>
          </div>

          {/* Domain & Problem Statement Tag */}
          <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-xs">
            <span className="bg-[#1a1a1a] text-[#f5f0e8] px-2 py-1 border border-[#1a1a1a] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#ffcc00]" />
              {hackathon.domain}
            </span>
            {hackathon.psId && (
              <span className="bg-[#ffcc00] text-[#1a1a1a] px-2 py-1 border border-[#1a1a1a] font-bold">
                {hackathon.psId}
              </span>
            )}
            {hackathon.mode && (
              <span className="bg-[#eee9e0] border border-[#1a1a1a] px-2 py-1 text-[#4a4a4a] uppercase flex items-center gap-1">
                <Globe className="w-3 h-3 text-[#1a1a1a]" />
                {hackathon.mode}
              </span>
            )}
          </div>

          {/* Problem Statement Snippet */}
          <p className="font-body text-xs text-[#4a4a4a] mt-3 line-clamp-2 leading-relaxed">
            {hackathon.problemStatement}
          </p>
        </div>

        {/* Progress Bar & Countdown Section */}
        <div className="p-4 bg-[#eee9e0] border-b-2 border-[#1a1a1a]">
          <div className="flex items-center justify-between font-mono text-xs mb-2">
            <span className="font-label font-bold text-[#1a1a1a] flex items-center gap-1">
              MISSION PROGRESS
            </span>
            <span className="font-bold text-sm text-[#1a1a1a]">
              {hackathon.completion}%
            </span>
          </div>
          <div className="h-4 bg-[#f5f0e8] border-2 border-[#1a1a1a] relative overflow-hidden shadow-brutal-sm">
            <div
              className="h-full bg-[#ffcc00] bg-stripes transition-all duration-500 border-r-2 border-[#1a1a1a]"
              style={{ width: `${hackathon.completion}%` }}
            />
          </div>

          {/* Time Remaining Pill */}
          <div className="mt-3 flex items-center justify-between font-mono text-xs">
            <span className="text-[#4a4a4a] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#e63b2e]" />
              DEADLINE:
            </span>
            <span className="font-bold bg-[#e63b2e] text-[#f5f0e8] border border-[#1a1a1a] px-2 py-0.5 shadow-brutal-sm">
              {hackathon.timeRemaining}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Operatives & Open Action */}
      <div className="p-4 bg-[#f5f0e8] flex items-center justify-between gap-3">
        {/* Operative Avatars */}
        <div className="flex items-center">
          <span className="font-mono text-[10px] font-bold mr-2 text-[#4a4a4a] hidden sm:inline">
            TEAM:
          </span>
          <div className="flex -space-x-2">
            {hackathon.operatives.map((op) => (
              <img
                key={op.id}
                src={op.avatar}
                alt={op.name}
                title={`${op.name} (${op.role})`}
                className="w-7 h-7 rounded-full border-2 border-[#1a1a1a] object-cover bg-[#ffcc00]"
              />
            ))}
          </div>
        </div>

        {/* Open Button */}
        <button
          onClick={() => onSelect(hackathon)}
          className="bg-[#1a1a1a] hover:bg-[#ffcc00] hover:text-[#1a1a1a] text-[#f5f0e8] border-2 border-[#1a1a1a] px-3 py-1.5 font-label font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
        >
          <span>OPEN CONTROL</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
