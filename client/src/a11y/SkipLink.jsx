import React from 'react';

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-black focus:font-bold focus:rounded-md focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-black"
    >
      Skip to main content
    </a>
  );
}

export default SkipLink;
