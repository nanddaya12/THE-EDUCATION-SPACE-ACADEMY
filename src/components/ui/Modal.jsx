import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, actions, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white rounded-3xl shadow-2xl w-full overflow-hidden border border-slate-200 ${maxWidth}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-display font-bold text-base text-on-surface">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">{children}</div>

        {actions && (
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
