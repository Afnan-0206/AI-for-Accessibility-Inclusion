import React from 'react';
import { Loader2 } from 'lucide-react';

export function Loader({ text = 'Reading your document...', subtext = 'Gemini AI is analyzing the text, finding deadlines, and translating...' }) {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-4"
      aria-live="polite"
      role="status"
    >
      <div className="relative">
        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 high-contrast:text-yellow-400 animate-spin" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-bold text-slate-800 dark:text-slate-100 high-contrast:text-yellow-400">
          {text}
        </p>
        {subtext && (
          <p className="text-xs text-slate-500 dark:text-slate-400 high-contrast:text-yellow-200 max-w-sm">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

export default Loader;
