import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SkipLink } from '../a11y/SkipLink';
import { LogOut, History, PlusCircle } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 shadow-md">
      <SkipLink />
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            to={user ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 text-white outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl px-1.5 py-1 hover:opacity-95 transition"
            aria-label="Samajh home"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              स
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-white">Samajh</span>
              <span className="hidden sm:inline-block text-xs font-medium text-slate-300">
                AI for Accessibility
              </span>
            </div>
          </Link>

          {/* Mobile logout or quick action */}
          {user && (
            <div className="flex md:hidden items-center gap-1">
              <Link
                to="/dashboard"
                className="p-2 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition"
                aria-label="New Document"
              >
                <PlusCircle className="w-5 h-5 text-blue-400" />
              </Link>
              <Link
                to="/history"
                className="p-2 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition"
                aria-label="History"
              >
                <History className="w-5 h-5 text-slate-300" />
              </Link>
            </div>
          )}
        </div>

        {/* Right: Auth Nav */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-200 hidden lg:inline">
                Hello, <strong className="text-white font-semibold">{user.name}</strong>
              </span>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-sm transition active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload</span>
              </Link>

              <Link
                to="/history"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition"
              >
                <History className="w-4 h-4 text-slate-300" />
                <span>History</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-rose-300 hover:text-white hover:bg-rose-950/60 border border-rose-800/60 transition cursor-pointer"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
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
                className="px-3 py-1.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-lg transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition shadow-sm"
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

