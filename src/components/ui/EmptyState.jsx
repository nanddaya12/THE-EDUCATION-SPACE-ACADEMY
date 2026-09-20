import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ title = 'No Records Found', description = 'There are no items to display in this category.', actionLabel, onAction }) => {
  return (
    <div className="p-12 bg-white rounded-2xl border border-slate-200/80 text-center space-y-4 my-4">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        <Inbox className="w-7 h-7" />
      </div>
      <div>
        <h3 className="font-display font-bold text-base text-on-surface">{title}</h3>
        <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-soft transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
