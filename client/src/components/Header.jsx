import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { A11yToolbar } from '../a11y/A11yToolbar';
import { SkipLink } from '../a11y/SkipLink';
import { BookOpen, LogOut, History, PlusCircle } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 high-contrast:border-yellow-400 high-contrast:bg-black">
      <SkipLink />
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            to={user ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 text-blue-400 high-contrast:text-yellow-400 font-bold text-xl tracking-tight focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            aria-label="Samajh home"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 high-contrast:bg-yellow-400 high-contrast:text-black text-white flex items-center justify-center font-black text-lg shadow-sm">
              स
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-white high-contrast:text-yellow-400">Samajh</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-normal text-slate-400 high-contrast:text-yellow-200">
                AI for Accessibility
              </span>
            </div>
          </Link>

          {/* Mobile logout or quick action */}
          {user && (
            <div className="flex md:hidden items-center gap-1">
              <Link
                to="/dashboard"
                className="p-2 text-slate-600 dark:text-slate-300 high-contrast:text-yellow-400 hover:bg-slate-100 rounded-lg"
                aria-label="New Document"
              >
                <PlusCircle className="w-5 h-5" />
              </Link>
              <Link
                to="/history"
                className="p-2 text-slate-600 dark:text-slate-300 high-contrast:text-yellow-400 hover:bg-slate-100 rounded-lg"
                aria-label="History"
              >
                <History className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>

        {/* Center: Accessibility Toolbar */}
        <A11yToolbar />

        {/* Right: Auth Nav */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 high-contrast:text-yellow-400 hidden lg:inline">
                Hello, {user.name}
              </span>
              <Link
                to="/dashboard"
                className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 high-contrast:bg-yellow-400 high-contrast:text-black transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload</span>
              </Link>
              <Link
                to="/history"
                className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 high-contrast:text-yellow-400"
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 high-contrast:text-yellow-400 high-contrast:border-yellow-400"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/architecture"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-300 bg-blue-500/20 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition shadow-xs"
              >
                Architecture
              </Link>
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white high-contrast:text-yellow-400 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 high-contrast:bg-yellow-400 high-contrast:text-black transition shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
