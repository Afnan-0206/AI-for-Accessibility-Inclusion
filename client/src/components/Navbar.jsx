import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { A11yToolbar } from './A11yIntegration';
import { FileText, Clock, LogOut, User as UserIcon, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-slate-200 shadow-xs">
      {/* Nanditha's A11yToolbar in the global header */}
      <A11yToolbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Public Service Identity */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-lg p-1"
            aria-label="Samajh Home — Citizen Document Assistance"
          >
            <div className="w-11 h-11 bg-blue-800 rounded-lg flex items-center justify-center text-white shadow-sm border border-blue-900 group-hover:bg-blue-900 transition-colors">
              <FileText className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  Samajh
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  ಸಮಝ್ / समझ
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Public Document Assistance
              </p>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main Navigation">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isActive('/dashboard')
                      ? 'bg-blue-800 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  <span>Explain Document</span>
                </Link>

                <Link
                  to="/history"
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isActive('/history')
                      ? 'bg-blue-800 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>History</span>
                </Link>

                {/* User Info & Logout */}
                <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-300">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                    <UserIcon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user?.name || user?.email || 'Citizen'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-red-700 hover:bg-red-50 hover:text-red-800 border border-transparent hover:border-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
                  aria-label="Log out of your account"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-800 hover:bg-blue-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
