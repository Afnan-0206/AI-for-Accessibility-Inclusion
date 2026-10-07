import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please provide your name.');
      return;
    }

    if (!trimmedEmail) {
      setError('Please provide your email address.');
      return;
    }

    if (!password) {
      setError('Please choose a password.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long for account security.');
      return;
    }

    if (password !== confirmPassword) {
      setError('The two passwords do not match. Please retype carefully.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(trimmedName, trimmedEmail, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Could not create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-md bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            New Citizen Registration
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create your Samajh account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Free and secure access to document explanations in your language
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

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="register-name" className="block text-base font-bold text-slate-900 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="block w-full pl-11 pr-4 py-3.5 text-base rounded-xl border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-base font-bold text-slate-900 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  id="register-email"
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
              <label htmlFor="register-password" className="block text-base font-bold text-slate-900 mb-1.5">
                Password <span className="text-sm font-normal text-slate-500">(at least 8 characters)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3.5 text-base rounded-xl border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="block text-base font-bold text-slate-900 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3.5 text-base rounded-xl border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-lg font-bold text-white bg-blue-800 hover:bg-blue-900 active:bg-blue-950 disabled:opacity-60 disabled:cursor-not-allowed shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating your account…</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-slate-100 text-center">
            <p className="text-base text-slate-700">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-blue-800 hover:text-blue-950 underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
