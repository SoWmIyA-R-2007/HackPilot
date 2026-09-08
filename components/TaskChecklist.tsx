'use client';

import React, { useState } from 'react';
import { TaskView, OperativeView } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';

interface TaskChecklistProps {
  tasks: TaskView[];
  operatives: OperativeView[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, weight: number, assigneeName: string, assigneeAvatar: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskChecklist: React.FC<TaskChecklistProps> = ({
  tasks,
  operatives,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newWeight, setNewWeight] = useState(1);
  const [selectedOperativeId, setSelectedOperativeId] = useState(operatives[0]?.id || '');
  const [isAdding, setIsAdding] = useState(false);

  // Helper for initials
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const op = operatives.find((o) => o.id === selectedOperativeId) || operatives[0];
    onAddTask(
      newTitle.trim(),
      newWeight,
      op ? op.name : 'Unassigned',
      op ? op.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    );
    setNewTitle('');
    setNewWeight(1);
    setIsAdding(false);
  };

  return (
    <div className="space-y-3">
      {/* Inline Form if adding */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="glass-card p-4 rounded-2xl space-y-3 shadow-xl animate-fade-in border border-amber-500/40"
        >
          <h4 className="font-semibold text-sm text-slate-100">Add New Task</h4>
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Implement rate limiting middleware"
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Impact Weight</label>
              <select
                value={newWeight}
                onChange={(e) => setNewWeight(Number(e.target.value))}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
              >
                <option value={1}>1x Minor</option>
                <option value={2}>2x Standard</option>
                <option value={3}>3x Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Assignee</label>
              <select
                value={selectedOperativeId}
                onChange={(e) => setSelectedOperativeId(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
              >
                {operatives.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Task List Items */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3.5 glass-card glass-card-hover rounded-2xl group"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-2 focus:ring-amber-500 border-slate-700 bg-slate-900 cursor-pointer accent-amber-500"
              />
              <span
                className={`text-sm text-slate-100 truncate font-medium ${
                  task.completed ? 'line-through opacity-50 text-slate-400' : ''
                }`}
              >
                {task.title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Member Initials Avatar */}
              <div
                className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center text-xs font-bold shadow-xs"
                title={`Assigned to ${task.assigneeName}`}
              >
                {getInitials(task.assigneeName)}
              </div>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Delete Task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 p-3 bg-slate-900/40 backdrop-blur-md border border-dashed border-slate-700 rounded-2xl text-slate-400 hover:bg-slate-800/60 hover:text-amber-400 transition-colors text-xs font-semibold cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      )}
    </div>
  );
};



