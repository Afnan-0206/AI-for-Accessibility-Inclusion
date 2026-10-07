import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 high-contrast:bg-yellow-400 high-contrast:text-black flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white high-contrast:text-yellow-400 mb-2">
        Page Not Found
      </h1>
      <p className="text-slate-600 dark:text-slate-300 high-contrast:text-yellow-100 max-w-md mb-6 text-sm">
        The page or document you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 high-contrast:bg-yellow-400 high-contrast:text-black transition shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}

export default NotFound;
