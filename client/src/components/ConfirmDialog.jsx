import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete', isDanger = true }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 high-contrast:bg-black high-contrast:border-4 high-contrast:border-yellow-400 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
          <h3 id="dialog-title" className="text-lg font-bold text-slate-900 dark:text-white high-contrast:text-yellow-400">
            {title}
          </h3>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 high-contrast:text-yellow-100 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 high-contrast:border-yellow-400 high-contrast:text-yellow-400 min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white min-h-[44px] ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 high-contrast:bg-yellow-400 high-contrast:text-black'
                : 'bg-blue-600 hover:bg-blue-700 high-contrast:bg-yellow-400 high-contrast:text-black'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
