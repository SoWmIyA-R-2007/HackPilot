'use client';

import React from 'react';
import { HackathonView } from '@/lib/types';
import { Target, CheckCircle2, Clock, Users } from 'lucide-react';

interface StatsOverviewProps {
  hackathons: HackathonView[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ hackathons }) => {
  const totalMissions = hackathons.length;
  const activeMissions = hackathons.filter((h) => h.status === 'in_progress').length;
  
  // Calculate average completion
  const avgCompletion =
    hackathons.length > 0
      ? Math.round(
          hackathons.reduce((acc, h) => acc + h.completion, 0) / hackathons.length
        )
      : 0;

  // Urgent count
  const urgentCount = hackathons.filter(
    (h) => h.priority === 'high' || h.status === 'in_progress'
  ).length;

  // Total operatives count
  const totalOperatives = new Set(
    hackathons.flatMap((h) => h.operatives.map((o) => o.email))
  ).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Stat 1 */}
      <div className="bg-[#eee9e0] border-4 border-[#1a1a1a] p-4 shadow-brutal relative overflow-hidden group hover:-translate-y-0.5 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label font-bold text-xs uppercase tracking-wider text-[#4a4a4a]">
            Active Missions
          </span>
          <div className="w-8 h-8 bg-[#ffcc00] border-2 border-[#1a1a1a] flex items-center justify-center">
            <Target className="w-4 h-4 text-[#1a1a1a]" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-headline font-black text-3xl text-[#1a1a1a]">
            {activeMissions}
          </span>
          <span className="font-mono text-xs text-[#4a4a4a]">
            / {totalMissions} TOTAL
          </span>
        </div>
        <div className="mt-2 h-1.5 bg-[#f5f0e8] border border-[#1a1a1a]">
          <div
            className="h-full bg-[#1a1a1a]"
            style={{ width: `${totalMissions ? (activeMissions / totalMissions) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Stat 2 */}
      <div className="bg-[#eee9e0] border-4 border-[#1a1a1a] p-4 shadow-brutal relative overflow-hidden group hover:-translate-y-0.5 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label font-bold text-xs uppercase tracking-wider text-[#4a4a4a]">
            Completion Score
          </span>
          <div className="w-8 h-8 bg-[#0055ff] border-2 border-[#1a1a1a] flex items-center justify-center text-[#f5f0e8]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-headline font-black text-3xl text-[#1a1a1a]">
            {avgCompletion}%
          </span>
          <span className="font-mono text-xs text-[#4a4a4a]">AVG PROGRESS</span>
        </div>
        <div className="mt-2 h-1.5 bg-[#f5f0e8] border border-[#1a1a1a]">
          <div
            className="h-full bg-[#0055ff]"
            style={{ width: `${avgCompletion}%` }}
          />
        </div>
      </div>

      {/* Stat 3 */}
      <div className="bg-[#eee9e0] border-4 border-[#1a1a1a] p-4 shadow-brutal relative overflow-hidden group hover:-translate-y-0.5 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label font-bold text-xs uppercase tracking-wider text-[#4a4a4a]">
            Urgent Directives
          </span>
          <div className="w-8 h-8 bg-[#e63b2e] border-2 border-[#1a1a1a] flex items-center justify-center text-[#f5f0e8]">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-headline font-black text-3xl text-[#1a1a1a]">
            {urgentCount}
          </span>
          <span className="font-mono text-xs text-[#e63b2e] font-bold">
            HIGH PRIORITY
          </span>
        </div>
        <div className="mt-2 h-1.5 bg-[#f5f0e8] border border-[#1a1a1a]">
          <div
            className="h-full bg-[#e63b2e]"
            style={{ width: `${totalMissions ? (urgentCount / totalMissions) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Stat 4 */}
      <div className="bg-[#eee9e0] border-4 border-[#1a1a1a] p-4 shadow-brutal relative overflow-hidden group hover:-translate-y-0.5 transition-all">
        <div className="flex items-center justify-between mb-2">
          <span className="font-label font-bold text-xs uppercase tracking-wider text-[#4a4a4a]">
            Team Operatives
          </span>
          <div className="w-8 h-8 bg-[#ffcc00] border-2 border-[#1a1a1a] flex items-center justify-center text-[#1a1a1a]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-headline font-black text-3xl text-[#1a1a1a]">
            {totalOperatives}
          </span>
          <span className="font-mono text-xs text-[#4a4a4a]">DISPATCHED</span>
        </div>
        <div className="mt-2 h-1.5 bg-[#f5f0e8] border border-[#1a1a1a]">
          <div
            className="h-full bg-[#1a1a1a]"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
