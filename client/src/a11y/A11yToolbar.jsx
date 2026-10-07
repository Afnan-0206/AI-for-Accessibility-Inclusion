import React from 'react';
import { Sun, Moon, Eye, Type, AlignJustify, RotateCcw } from 'lucide-react';
import { useA11y } from './A11yProvider';

export function A11yToolbar() {
  const {
    fontScale,
    theme,
    dyslexicFont,
    increasedSpacing,
    increaseFont,
    decreaseFont,
    cycleTheme,
    toggleDyslexicFont,
    toggleSpacing,
    resetA11y,
  } = useA11y();

  return (
    <nav
      aria-label="Accessibility settings"
      className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-400 rounded-xl text-xs"
    >
      {/* Font Size decrease */}
      <button
        type="button"
        onClick={decreaseFont}
        disabled={fontScale <= 100}
        aria-label="Decrease text size"
        className="px-2 py-1 font-bold rounded bg-white dark:bg-slate-700 high-contrast:bg-yellow-400 high-contrast:text-black hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 focus:ring-2 focus:ring-blue-500"
      >
        A-
      </button>

      {/* Current Font Scale */}
      <span className="font-semibold text-slate-700 dark:text-slate-300 high-contrast:text-yellow-400 px-1" aria-live="polite">
        {fontScale}%
      </span>

      {/* Font Size increase */}
      <button
        type="button"
        onClick={increaseFont}
        disabled={fontScale >= 200}
        aria-label="Increase text size"
        className="px-2 py-1 font-bold rounded bg-white dark:bg-slate-700 high-contrast:bg-yellow-400 high-contrast:text-black hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 focus:ring-2 focus:ring-blue-500"
      >
        A+
      </button>

      <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 high-contrast:bg-yellow-400 mx-0.5" aria-hidden="true" />

      {/* Theme cycle */}
      <button
        type="button"
        onClick={cycleTheme}
        aria-label={`Switch theme (currently ${theme})`}
        className="flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-700 high-contrast:bg-yellow-400 high-contrast:text-black hover:bg-slate-200 dark:hover:bg-slate-600 focus:ring-2 focus:ring-blue-500"
      >
        {theme === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />}
        {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />}
        {theme === 'high-contrast' && <Eye className="w-3.5 h-3.5 text-black" aria-hidden="true" />}
        <span className="capitalize">{theme === 'high-contrast' ? 'Contrast' : theme}</span>
      </button>

      {/* Dyslexia font toggle */}
      <button
        type="button"
        onClick={toggleDyslexicFont}
        aria-label="Toggle dyslexia-friendly font"
        aria-pressed={dyslexicFont}
        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors focus:ring-2 focus:ring-blue-500 ${
          dyslexicFont
            ? 'bg-blue-600 text-white high-contrast:bg-yellow-400 high-contrast:text-black font-bold'
            : 'bg-white dark:bg-slate-700 high-contrast:bg-black high-contrast:text-yellow-400 high-contrast:border high-contrast:border-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-600'
        }`}
      >
        <Type className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Dyslexia</span>
      </button>

      {/* Spacing toggle */}
      <button
        type="button"
        onClick={toggleSpacing}
        aria-label="Toggle wide line and letter spacing"
        aria-pressed={increasedSpacing}
        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors focus:ring-2 focus:ring-blue-500 ${
          increasedSpacing
            ? 'bg-blue-600 text-white high-contrast:bg-yellow-400 high-contrast:text-black font-bold'
            : 'bg-white dark:bg-slate-700 high-contrast:bg-black high-contrast:text-yellow-400 high-contrast:border high-contrast:border-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-600'
        }`}
      >
        <AlignJustify className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Spacing</span>
      </button>

      {/* Reset */}
      <button
        type="button"
        onClick={resetA11y}
        aria-label="Reset accessibility settings to default"
        className="p-1 rounded text-slate-500 dark:text-slate-400 high-contrast:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-600 focus:ring-2 focus:ring-blue-500"
        title="Reset settings"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </nav>
  );
}

export default A11yToolbar;
