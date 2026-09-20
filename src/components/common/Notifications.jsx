import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Notifications = () => {
  const { notifications } = useApp();

  if (!notifications.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border text-xs font-semibold backdrop-blur-md animate-slide-up ${
            n.type === 'success'
              ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700'
              : n.type === 'error'
              ? 'bg-rose-900/90 text-rose-100 border-rose-700'
              : 'bg-slate-900/90 text-slate-100 border-slate-700'
          }`}
        >
          {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {n.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {n.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
          <span className="flex-1">{n.message}</span>
        </div>
      ))}
    </div>
  );
};
