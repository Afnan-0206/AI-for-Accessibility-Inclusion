import React from 'react';
import { Languages } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', sub: 'English' },
  { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
  { code: 'kn', label: 'ಕನ್ನಡ', sub: 'Kannada' },
];

export function LanguageSelect({ value = 'en', onChange, id = 'language-select' }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800 dark:text-slate-200 high-contrast:text-yellow-400">
        Explanation Language / ವಿವರಣೆಯ ಭಾಷೆ / भाषा
      </label>
      <div className="grid grid-cols-3 gap-2">
        {LANGUAGES.map((lang) => {
          const isSelected = value === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onChange(lang.code)}
              aria-pressed={isSelected}
              className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border text-center transition-all focus:ring-2 focus:ring-blue-500 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-400 font-bold shadow-sm high-contrast:bg-yellow-400 high-contrast:text-black high-contrast:border-yellow-400'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 high-contrast:bg-black high-contrast:text-yellow-400 high-contrast:border-yellow-400'
              }`}
            >
              <span className="text-base font-bold">{lang.label}</span>
              <span className="text-xs opacity-75">{lang.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LanguageSelect;
