import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 high-contrast:border-yellow-400 bg-slate-950/85 backdrop-blur-md high-contrast:bg-black py-6 px-4 text-xs text-slate-400 high-contrast:text-yellow-400 relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="space-y-1">
          <p className="font-semibold text-slate-800 dark:text-slate-200 high-contrast:text-yellow-400">
            Samajh — AI for Accessibility & Inclusion
          </p>
          <p>
            This tool provides plain-language explanations at a 5th-grade reading level. It does not provide legal advice.
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 high-contrast:text-yellow-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 high-contrast:text-yellow-400" />
          <span>Files are never stored on disk. Analysis only.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
