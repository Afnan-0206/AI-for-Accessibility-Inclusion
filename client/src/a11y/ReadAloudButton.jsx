import React from 'react';
import { Volume2, Square } from 'lucide-react';
import { useSpeech } from './useSpeech';

export function ReadAloudButton({ text, language = 'en', className = '', label = 'Read aloud' }) {
  const { speak, stop, speaking, supported, notice } = useSpeech();

  if (!supported || !text) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    if (speaking) {
      stop();
    } else {
      speak(text, language);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        aria-label={speaking ? 'Stop reading aloud' : `${label} in ${language}`}
        aria-pressed={speaking}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          speaking
            ? 'bg-amber-600 text-white hover:bg-amber-700 ring-2 ring-amber-400 animate-pulse'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700 high-contrast:bg-yellow-400 high-contrast:text-black high-contrast:hover:bg-yellow-300'
        } ${className}`}
      >
        {speaking ? (
          <>
            <Square className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" aria-hidden="true" />
            <span>{label}</span>
          </>
        )}
      </button>

      {notice && (
        <span className="text-xs text-amber-600 dark:text-amber-400 italic" role="status">
          {notice}
        </span>
      )}
    </div>
  );
}

export default ReadAloudButton;
