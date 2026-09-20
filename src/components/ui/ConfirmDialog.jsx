import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { AlertTriangle, AlertOctagon } from 'lucide-react';

export const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Destructive Action', 
  message = 'Are you sure you want to proceed with this operation?',
  confirmText = 'Confirm Action',
  requireTypedConfirmation = false,
  requiredMatch = 'DELETE'
}) => {
  const [typedInput, setTypedInput] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTypedInput('');
    }
  }, [isOpen]);

  const canConfirm = !requireTypedConfirmation || typedInput.trim() === requiredMatch;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={() => {
              if (canConfirm) {
                onConfirm();
                onClose();
              }
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-soft disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {confirmText}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            {requireTypedConfirmation ? (
              <AlertOctagon className="w-5 h-5 text-rose-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            )}
          </div>
          <div className="space-y-1 pt-0.5">
            <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
          </div>
        </div>

        {requireTypedConfirmation && (
          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
            <label className="text-[11px] font-bold text-rose-900 block">
              High-Risk Action: To confirm, type <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-rose-300 text-rose-700">{requiredMatch}</span> below:
            </label>
            <input
              type="text"
              placeholder={`Type ${requiredMatch} to confirm`}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              className="w-full p-2 rounded-lg border border-rose-300 text-xs font-mono font-bold bg-white focus:outline-none focus:border-rose-600 uppercase"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
