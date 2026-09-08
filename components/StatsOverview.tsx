'use client';

import React from 'react';
import { HackathonView } from '@/lib/types';

interface StatsOverviewProps {
  hackathons: HackathonView[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ hackathons }) => {
  const totalMissions = hackathons.length;
  const activeMissions = hackathons.filter((h) => h.status === 'in_progress').length;
  const completedMissions = hackathons.filter((h) => h.status === 'completed' || h.status === 'submitted').length;
  
  // Overdue count (high priority or past deadline)
  const overdueCount = hackathons.filter(
    (h) => h.priority === 'high' && h.status === 'in_progress'
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Stat 1: Total Hackathons */}
      <div className="glass-card glass-card-hover p-4 rounded-2xl">
        <div className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-bold">
          Total Hackathons
        </div>
        <div className="text-slate-100 text-3xl font-extrabold">
          {totalMissions}
        </div>
      </div>

      {/* Stat 2: In Progress */}
      <div className="glass-card glass-card-hover p-4 rounded-2xl">
        <div className="text-amber-400/90 text-xs uppercase tracking-wider mb-2 font-bold">
          In Progress
        </div>
        <div className="text-amber-400 text-3xl font-extrabold">
          {activeMissions}
        </div>
      </div>

      {/* Stat 3: Overdue */}
      <div className="glass-card glass-card-hover p-4 rounded-2xl">
        <div className="text-red-400/90 text-xs uppercase tracking-wider mb-2 font-bold">
          Overdue / Urgent
        </div>
        <div className="text-red-400 text-3xl font-extrabold">
          {overdueCount}
        </div>
      </div>

      {/* Stat 4: Completed */}
      <div className="glass-card glass-card-hover p-4 rounded-2xl">
        <div className="text-emerald-400/90 text-xs uppercase tracking-wider mb-2 font-bold">
          Completed
        </div>
        <div className="text-emerald-400 text-3xl font-extrabold">
          {completedMissions}
        </div>
      </div>
    </div>
  );
};



