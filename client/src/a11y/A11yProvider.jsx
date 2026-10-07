import React, { createContext, useContext, useState, useEffect } from 'react';

const A11yContext = createContext();

const FONT_SCALES = [100, 125, 150, 200];

export function A11yProvider({ children }) {
  const [fontScale, setFontScale] = useState(() => {
    return parseInt(localStorage.getItem('samajh_font_scale') || '100', 10);
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('samajh_theme') || 'light';
  });

  const [dyslexicFont, setDyslexicFont] = useState(() => {
    return localStorage.getItem('samajh_dyslexic_font') === 'true';
  });

  const [increasedSpacing, setIncreasedSpacing] = useState(() => {
    return localStorage.getItem('samajh_spacing') === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('samajh_reduced_motion') === 'true';
  });

  // Apply attributes to <html> whenever state changes
  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', theme);
    root.setAttribute('data-font-scale', fontScale.toString());
    root.setAttribute('data-dyslexic', dyslexicFont.toString());
    root.setAttribute('data-spacing', increasedSpacing.toString());
    root.setAttribute('data-reduced-motion', reducedMotion.toString());

    // Root CSS variables for instantaneous response
    root.style.fontSize = `${fontScale}%`;

    localStorage.setItem('samajh_font_scale', fontScale.toString());
    localStorage.setItem('samajh_theme', theme);
    localStorage.setItem('samajh_dyslexic_font', dyslexicFont.toString());
    localStorage.setItem('samajh_spacing', increasedSpacing.toString());
    localStorage.setItem('samajh_reduced_motion', reducedMotion.toString());
  }, [fontScale, theme, dyslexicFont, increasedSpacing, reducedMotion]);

  const increaseFont = () => {
    setFontScale((prev) => {
      const idx = FONT_SCALES.indexOf(prev);
      return idx < FONT_SCALES.length - 1 ? FONT_SCALES[idx + 1] : prev;
    });
  };

  const decreaseFont = () => {
    setFontScale((prev) => {
      const idx = FONT_SCALES.indexOf(prev);
      return idx > 0 ? FONT_SCALES[idx - 1] : prev;
    });
  };

  const cycleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'high-contrast';
      return 'light';
    });
  };

  const toggleDyslexicFont = () => setDyslexicFont((prev) => !prev);
  const toggleSpacing = () => setIncreasedSpacing((prev) => !prev);
  const toggleReducedMotion = () => setReducedMotion((prev) => !prev);

  const resetA11y = () => {
    setFontScale(100);
    setTheme('light');
    setDyslexicFont(false);
    setIncreasedSpacing(false);
    setReducedMotion(false);
  };

  return (
    <A11yContext.Provider
      value={{
        fontScale,
        theme,
        dyslexicFont,
        increasedSpacing,
        reducedMotion,
        increaseFont,
        decreaseFont,
        cycleTheme,
        setTheme,
        toggleDyslexicFont,
        toggleSpacing,
        toggleReducedMotion,
        resetA11y,
      }}
    >
      {children}
    </A11yContext.Provider>
  );
}

export function useA11y() {
  const context = useContext(A11yContext);
  if (!context) {
    throw new Error('useA11y must be used within an A11yProvider');
  }
  return context;
}

export default A11yProvider;
