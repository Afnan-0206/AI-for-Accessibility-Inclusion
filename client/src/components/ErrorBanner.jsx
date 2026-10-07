import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-200 high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-400 high-contrast:text-yellow-400 flex items-start justify-between gap-3 shadow-sm"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 high-contrast:text-yellow-400 mt-0.5" aria-hidden="true" />
        <span className="text-sm font-medium">{message}</span>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error notification"
          className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/60 high-contrast:hover:bg-yellow-400 high-contrast:hover:text-black shrink-0"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default ErrorBanner;
