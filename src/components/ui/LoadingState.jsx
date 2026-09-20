import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading ERP Records...' }) => {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-center space-y-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">{message}</span>
    </div>
  );
};
