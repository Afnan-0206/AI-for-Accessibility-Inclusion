import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after login
  const from = location.state?.from?.pathname || '/dashboard';
  const wasSessionExpired = new URLSearchParams(location.search).get('expired') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(wasSessionExpired ? 'Your session has expired. Please sign in again.' : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(trimmedEmail, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Could not sign you in. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-md bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            Citizen Portal
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to Samajh
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Access your explained documents and ask follow-up questions
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-6 sm:px-10 rounded-2xl border-2 border-slate-200 shadow-sm">
          {error && (
            <div
              className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-start gap-3"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm font-semibold text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="login-email" className="block text-base font-bold text-slate-900 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-11 pr-4 py-3.5 text-base rounded-xl border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-base font-bold text-slate-900 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3.5 text-base rounded-xl border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-lg font-bold text-white bg-blue-800 hover:bg-blue-900 active:bg-blue-950 disabled:opacity-60 disabled:cursor-not-allowed shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing you in…</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-slate-100 text-center">
            <p className="text-base text-slate-700">
              Don’t have an account yet?{' '}
              <Link
                to="/register"
                className="font-bold text-blue-800 hover:text-blue-950 underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
