'use client';

import React from 'react';
import { ToastMessage } from '@/lib/types';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getBg = () => {
          if (toast.type === 'success') return 'bg-[#ffcc00] border-[#1a1a1a] text-[#1a1a1a]';
          if (toast.type === 'alert') return 'bg-[#e63b2e] border-[#1a1a1a] text-[#f5f0e8]';
          return 'bg-[#0055ff] border-[#1a1a1a] text-[#f5f0e8]';
        };

        const getIcon = () => {
          if (toast.type === 'success') return <CheckCircle2 className="w-5 h-5" />;
          if (toast.type === 'alert') return <AlertTriangle className="w-5 h-5" />;
          return <Info className="w-5 h-5" />;
        };

        return (
          <div
            key={toast.id}
            className={`border-4 shadow-brutal-lg p-3 flex items-start gap-3 pointer-events-auto animate-fade-in ${getBg()}`}
          >
            <div className="shrink-0 mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <h5 className="font-headline font-bold text-xs uppercase tracking-tight">
                {toast.title}
              </h5>
              <p className="font-body text-xs mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 text-current hover:opacity-75 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
