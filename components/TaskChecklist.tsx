'use client';

import React, { useState } from 'react';
import { TaskView, OperativeView } from '@/lib/types';
import { CheckSquare, Square, Plus, Award, Trash2 } from 'lucide-react';

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

  // Calculate weighted stats
  const totalWeight = tasks.reduce((sum, t) => sum + t.weight, 0);
  const completedWeight = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.weight, 0);
  const weightedProgress = totalWeight ? Math.round((completedWeight / totalWeight) * 100) : 0;

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
    <div className="space-y-4">
      {/* Weighted Progress Header */}
      <div className="bg-[#f5f0e8] border-2 border-[#1a1a1a] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-brutal-sm">
        <div>
          <span className="font-label font-bold text-xs uppercase tracking-wider text-[#4a4a4a]">
            WEIGHTED CHECKLIST COMPLETION
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline font-black text-2xl text-[#1a1a1a]">
              {weightedProgress}%
            </span>
            <span className="font-mono text-xs text-[#4a4a4a]">
              ({completedWeight} of {totalWeight} Total Weight Points)
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#ffcc00] hover:bg-[#1a1a1a] hover:text-[#f5f0e8] text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 py-1.5 font-label font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-brutal-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isAdding ? 'CANCEL' : 'ADD DIRECTIVE'}</span>
        </button>
      </div>

      {/* Inline Add Task Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="bg-[#eee9e0] border-2 border-[#1a1a1a] p-4 shadow-brutal-sm space-y-3 animate-fade-in"
        >
          <h4 className="font-headline font-bold text-sm uppercase text-[#1a1a1a]">
            NEW MISSION TASK DIRECTIVE
          </h4>
          <div>
            <label className="block font-mono text-xs font-bold text-[#4a4a4a] mb-1">
              Task Title / Description
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Integrate Resend Email API for Reminders"
              className="w-full bg-[#f5f0e8] border-2 border-[#1a1a1a] px-3 py-2 font-body text-sm text-[#1a1a1a] focus:outline-none focus:bg-[#ffffff]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs font-bold text-[#4a4a4a] mb-1">
                Task Weight Impact (1 = Minor, 3 = Critical)
              </label>
              <select
                value={newWeight}
                onChange={(e) => setNewWeight(Number(e.target.value))}
                className="w-full bg-[#f5f0e8] border-2 border-[#1a1a1a] px-3 py-2 font-mono text-sm text-[#1a1a1a] focus:outline-none"
              >
                <option value={1}>1x Weight (Minor / Quick Task)</option>
                <option value={2}>2x Weight (Standard Feature)</option>
                <option value={3}>3x Weight (Critical / Demo / Pitch)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-[#4a4a4a] mb-1">
                Assign Operative
              </label>
              <select
                value={selectedOperativeId}
                onChange={(e) => setSelectedOperativeId(e.target.value)}
                className="w-full bg-[#f5f0e8] border-2 border-[#1a1a1a] px-3 py-2 font-mono text-sm text-[#1a1a1a] focus:outline-none"
              >
                {operatives.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name} ({op.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="bg-[#eee9e0] hover:bg-[#e8e3da] text-[#1a1a1a] border-2 border-[#1a1a1a] px-3 py-1 font-label font-bold text-xs uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#1a1a1a] hover:bg-[#ffcc00] hover:text-[#1a1a1a] text-[#f5f0e8] border-2 border-[#1a1a1a] px-4 py-1 font-label font-bold text-xs uppercase cursor-pointer transition-all"
            >
              CREATE TASK
            </button>
          </div>
        </form>
      )}

      {/* Task List Items */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`border-2 border-[#1a1a1a] p-3 flex items-center justify-between gap-3 transition-all ${
              task.completed ? 'bg-[#e8e3da] opacity-75' : 'bg-[#f5f0e8] hover:bg-[#eee9e0]'
            }`}
          >
            {/* Checkbox & Title */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => onToggleTask(task.id)}
                className="text-[#1a1a1a] hover:text-[#0055ff] transition-colors cursor-pointer shrink-0"
              >
                {task.completed ? (
                  <CheckSquare className="w-5 h-5 fill-[#ffcc00] text-[#1a1a1a]" />
                ) : (
                  <Square className="w-5 h-5 text-[#1a1a1a]" />
                )}
              </button>

              <span
                className={`font-body text-sm font-medium text-[#1a1a1a] truncate ${
                  task.completed ? 'line-through text-[#6a6a6a]' : ''
                }`}
              >
                {task.title}
              </span>
            </div>

            {/* Weight & Assignee Pill */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="bg-[#1a1a1a] text-[#ffcc00] border border-[#1a1a1a] px-2 py-0.5 font-mono text-[10px] font-bold">
                {task.weight}x WEIGHT
              </span>

              <div
                className="flex items-center gap-1.5 bg-[#eee9e0] border border-[#1a1a1a] px-2 py-0.5 font-mono text-[11px] text-[#1a1a1a] hidden sm:flex"
                title={`Assigned to ${task.assigneeName}`}
              >
                <img
                  src={task.assigneeAvatar}
                  alt={task.assigneeName}
                  className="w-4 h-4 rounded-full border border-[#1a1a1a] object-cover"
                />
                <span className="truncate max-w-[90px]">{task.assigneeName}</span>
              </div>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1 text-[#6a6a6a] hover:text-[#e63b2e] transition-colors cursor-pointer"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center p-6 border-2 border-dashed border-[#1a1a1a] bg-[#eee9e0]">
            <Award className="w-8 h-8 text-[#6a6a6a] mx-auto mb-2" />
            <p className="font-mono text-xs text-[#6a6a6a]">
              No tasks defined for this mission yet. Click "ADD DIRECTIVE" to create one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
