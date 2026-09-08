'use client';

import React from 'react';
import { ToastMessage } from '@/lib/types';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          if (toast.type === 'success')
            return <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />;
          if (toast.type === 'warning' || toast.type === 'alert')
            return <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />;
          return <Info className="w-4 h-4 text-amber-700 shrink-0" />;
        };

        return (
          <div
            key={toast.id}
            className="glass-card shadow-2xl rounded-2xl p-4 flex items-start gap-3 text-xs pointer-events-auto animate-fade-in border border-amber-500/40 bg-slate-900/90 backdrop-blur-xl"
          >
            <div className="mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-slate-100">
                {toast.title}
              </h5>
              <p className="text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => onRemoveToast(toast.id)}
              className="text-slate-500 hover:text-slate-200 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};



