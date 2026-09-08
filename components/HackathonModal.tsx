'use client';

import React from 'react';
import { HackathonView } from '@/lib/types';
import { TaskChecklist } from './TaskChecklist';
import {
  X,
  ExternalLink,
  Trash2,
  UserPlus,
  FileText,
  Code,
  Layers,
} from 'lucide-react';

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

  // Task Handlers
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = hackathon.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const newCompletion = updatedTasks.length
      ? Math.round((completedCount / updatedTasks.length) * 100)
      : 0;

    onUpdateHackathon({
      ...hackathon,
      tasks: updatedTasks,
      completion: newCompletion,
    });
  };

  const handleAddTask = (title: string, weight: number, assigneeName: string, assigneeAvatar: string) => {
    const newTask = {
      id: `t-${Date.now()}`,
      title,
      completed: false,
      weight,
      assigneeName,
      assigneeAvatar,
    };
    const updatedTasks = [...hackathon.tasks, newTask];
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const newCompletion = Math.round((completedCount / updatedTasks.length) * 100);

    onUpdateHackathon({
      ...hackathon,
      tasks: updatedTasks,
      completion: newCompletion,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = hackathon.tasks.filter((t) => t.id !== taskId);
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const newCompletion = updatedTasks.length
      ? Math.round((completedCount / updatedTasks.length) * 100)
      : 0;

    onUpdateHackathon({
      ...hackathon,
      tasks: updatedTasks,
      completion: newCompletion,
    });
  };

  const completedTasksCount = hackathon.tasks.filter((t) => t.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="bg-amber-500/20 text-amber-400 font-mono text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40 shadow-xs">
              {hackathon.code}
            </span>
            <h2 className="font-bold text-lg text-slate-100 truncate">
              {hackathon.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Title & Progress Header Strip */}
        <div className="p-6 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 space-y-4 shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-extrabold text-slate-100 m-0">
                  {hackathon.title}
                </h1>
                <span className="bg-amber-500/20 text-amber-400 px-3 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {hackathon.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                {hackathon.problemStatement}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onTriggerEmailDispatch(hackathon.title, hackathon.operatives.length)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 transition-colors cursor-pointer"
              >
                Send Email Broadcast
              </button>
            </div>
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-700 ease-in-out shadow-lg shadow-amber-500/30"
              style={{ width: `${hackathon.completion}%` }}
            />
          </div>
        </div>

        {/* Modal Main Body Grid */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#090d16]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Sprint Tasks Checklist */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-base text-slate-100 m-0">
                  Sprint Tasks
                </h3>
                <span className="text-xs text-slate-400 font-bold font-mono">
                  {completedTasksCount} / {hackathon.tasks.length} Completed
                </span>
              </div>

              <TaskChecklist
                tasks={hackathon.tasks}
                operatives={hackathon.operatives}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>

            {/* Right Column: Overview, Team, Resources */}
            <div className="lg:col-span-4 space-y-5">
              {/* Overview Box */}
              <div className="glass-card p-5 rounded-2xl">
                <h3 className="font-bold text-sm text-slate-100 mb-4">
                  Overview
                </h3>
                <dl className="space-y-3 text-xs">
                  <div className="flex justify-between items-baseline border-b border-slate-800 pb-2">
                    <dt className="text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                      Team
                    </dt>
                    <dd className="text-slate-200 font-semibold">
                      {hackathon.teamName}
                    </dd>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-800 pb-2">
                    <dt className="text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                      Track / Domain
                    </dt>
                    <dd className="text-slate-200 font-semibold">
                      {hackathon.domain}
                    </dd>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-slate-800 pb-2">
                    <dt className="text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                      Format
                    </dt>
                    <dd className="text-slate-200 font-semibold capitalize">
                      {hackathon.mode || 'Online'}
                    </dd>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <dt className="text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                      Repository
                    </dt>
                    <dd className="text-amber-400 font-bold flex items-center gap-1 cursor-pointer hover:underline">
                      <span>{hackathon.websiteLink ? 'Portal Link' : 'github-repo'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Team Box */}
              <div className="glass-card p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-slate-100">
                    Team Roster
                  </h3>
                  <button className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer">
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  {hackathon.operatives.map((op) => (
                    <div key={op.id} className="flex items-center gap-3">
                      <img
                        src={op.avatar}
                        alt={op.name}
                        className="w-8 h-8 rounded-full border border-slate-700 object-cover bg-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-200 truncate m-0">
                          {op.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate m-0">
                          {op.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources Box */}
              <div className="glass-card p-5 rounded-2xl">
                <h3 className="font-bold text-sm text-slate-100 mb-3">
                  Resources
                </h3>
                <ul className="space-y-2 text-xs">
                  <li>
                    <a href="#" className="text-amber-400 font-semibold hover:underline flex items-center gap-2 py-1">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Problem Specs Doc</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-amber-400 font-semibold hover:underline flex items-center gap-2 py-1">
                      <Code className="w-4 h-4 text-amber-400" />
                      <span>API Specification</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-amber-400 font-semibold hover:underline flex items-center gap-2 py-1">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Figma Designs</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-900/80 border-t border-slate-800 px-6 py-3 flex items-center justify-between gap-4 shrink-0">
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete hackathon: ${hackathon.title}?`)) {
                onDeleteHackathon(hackathon.id);
                onClose();
              }
            }}
            className="text-red-400 hover:bg-red-500/10 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Hackathon</span>
          </button>

          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};



