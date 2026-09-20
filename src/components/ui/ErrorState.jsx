import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export const ErrorState = ({ title = 'Failed to Load Records', message = 'An error occurred while communicating with the ERP backend server.', onRetry }) => {
  return (
    <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3 my-4">
      <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
      <div>
        <h3 className="font-bold text-sm text-rose-900">{title}</h3>
        <p className="text-xs text-rose-700 mt-1 max-w-md mx-auto">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 mx-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
};
