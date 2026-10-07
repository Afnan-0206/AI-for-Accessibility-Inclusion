import React, { createContext, useContext, useState, useEffect } from 'react';
import { Type, Eye } from 'lucide-react';

const A11yContext = createContext(null);

export function A11yProvider({ children }) {
  const [textSize, setTextSize] = useState('normal'); // 'normal' | 'large' | 'xlarge'
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Apply text size to root document
    const root = document.documentElement;
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${textSize}`);

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [textSize, highContrast]);

  const cycleTextSize = () => {
    if (textSize === 'normal') setTextSize('large');
    else if (textSize === 'large') setTextSize('xlarge');
    else setTextSize('normal');
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  return (
    <A11yContext.Provider
      value={{
        textSize,
        setTextSize,
        cycleTextSize,
        highContrast,
        toggleHighContrast,
      }}
    >
      <div className={`${textSize === 'large' ? 'text-lg' : textSize === 'xlarge' ? 'text-xl' : 'text-base'} ${highContrast ? 'contrast-125' : ''}`}>
        {children}
      </div>
    </A11yContext.Provider>
  );
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) {
    return {
      textSize: 'normal',
      highContrast: false,
      cycleTextSize: () => {},
      toggleHighContrast: () => {},
    };
  }
  return ctx;
}

/**
 * A11yToolbar - Placed in the global header for citizen accessibility needs.
 * Low literacy, elderly, or visually impaired citizens can increase font size or toggle high contrast.
 */
export function A11yToolbar() {
  const { textSize, cycleTextSize, highContrast, toggleHighContrast } = useA11y();

  const getTextSizeLabel = () => {
    if (textSize === 'large') return 'Text: Large';
    if (textSize === 'xlarge') return 'Text: Extra Large';
    return 'Text: Normal';
  };

  return (
    <div
      className="bg-slate-900 text-slate-100 py-1.5 px-4 text-xs flex flex-wrap items-center justify-between border-b border-slate-800"
      role="region"
      aria-label="Accessibility tools"
    >
      <div className="flex items-center gap-2 text-slate-300 font-medium">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
        <span>Samajh Citizen Accessibility Services</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={cycleTextSize}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label={`Change text size. Currently ${textSize}`}
        >
          <Type className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
          <span>{getTextSizeLabel()}</span>
        </button>

        <button
          type="button"
          onClick={toggleHighContrast}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            highContrast
              ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
              : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
          }`}
          aria-pressed={highContrast}
          aria-label="Toggle High Contrast Mode"
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{highContrast ? 'High Contrast: ON' : 'High Contrast'}</span>
        </button>
      </div>
    </div>
  );
}

export default A11yToolbar;
