import React from 'react';
import { ReadAloudButton } from '../a11y/ReadAloudButton';

export function SectionCard({
  title,
  icon: Icon,
  readAloudText,
  language = 'en',
  children,
  className = '',
  highlight = false,
}) {
  return (
    <section
      className={`rounded-2xl border p-5 md:p-6 transition-all ${
        highlight
          ? 'bg-amber-50/70 border-amber-300 dark:bg-amber-950/20 dark:border-amber-800'
          : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'
      } high-contrast:bg-black high-contrast:border-yellow-400 high-contrast:border-2 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/60 high-contrast:border-yellow-400">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-700 high-contrast:bg-yellow-400 high-contrast:text-black text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
          <h2 className="text-lg font-bold text-slate-900 dark:text-white high-contrast:text-yellow-400">
            {title}
          </h2>
        </div>

        {readAloudText && (
          <ReadAloudButton text={readAloudText} language={language} label="Listen" />
        )}
      </div>

      <div className="text-slate-700 dark:text-slate-200 high-contrast:text-yellow-100">
        {children}
      </div>
    </section>
  );
}

export default SectionCard;
