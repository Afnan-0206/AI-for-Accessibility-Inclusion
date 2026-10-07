import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConstellationGrid from '@/components/ui/constellation-grid';
import {
  FileText,
  Calendar,
  Volume2,
  ShieldCheck,
  Languages,
  ArrowRight,
  Upload,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const ctaDestination = isAuthenticated ? '/dashboard' : '/login';

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden pb-16">
      {/* Full-Page Interactive Constellation Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <ConstellationGrid theme="dark" className="w-full h-full" />
      </div>

      {/* Subtle global gradient vignette for consistent atmosphere across the entire page */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/70 pointer-events-none" aria-hidden="true" />

      {/* Main Page Content Layered Above Canvas */}
      <div className="relative z-10">
        {/* Hero Section — Seamlessly flows without any dark/white border or dividing line */}
        <section className="relative overflow-hidden pt-16 sm:pt-24 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-blue-300 shrink-0" aria-hidden="true" />
              <span>Public Service Citizen Document Assistant</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight drop-shadow-md">
              Understand important documents in your language.
            </h1>

            <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Take a photo or upload a document. Samajh explains what it means, what you need to do, and what deadlines matter.
            </p>

            {/* Supported Languages */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-slate-400" aria-hidden="true" />
                Available in:
              </span>
              <span className="px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-xs sm:text-sm font-bold text-white shadow-xs">
                English
              </span>
              <span className="px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-xs sm:text-sm font-bold text-white shadow-xs">
                ಕನ್ನಡ (Kannada)
              </span>
              <span className="px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-xs sm:text-sm font-bold text-white shadow-xs">
                हिन्दी (Hindi)
              </span>
            </div>

            {/* Primary and Secondary Call to Action */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={ctaDestination}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-500/30 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                <Upload className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Explain a document</span>
                <ArrowRight className="w-5 h-5 ml-1 shrink-0" aria-hidden="true" />
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-white/30"
              >
                How it works
              </a>
            </div>
          </div>
        </section>

        {/* Core Benefits / What Samajh Solves */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white drop-shadow-sm">
              Clear, honest answers to simplify official paperwork
            </h2>
            <p className="text-slate-300 mt-2 sm:mt-3 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Official government, tax, utility, and welfare notices are often confusing. Samajh breaks them down step-by-step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Simple explanations */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-xl flex flex-col hover:border-blue-400/50 hover:shadow-2xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Simple explanations
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm flex-1">
                Plain language summaries without legal jargon or confusing administrative terms.
              </p>
            </div>

            {/* Card 2: Important actions & deadlines */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-xl flex flex-col hover:border-amber-400/50 hover:shadow-2xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Actions & Deadlines
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm flex-1">
                Numbered steps on what you must do immediately, including payment deadlines and penalties.
              </p>
            </div>

            {/* Card 3: Read aloud & Accessibility */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-xl flex flex-col hover:border-emerald-400/50 hover:shadow-2xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center mb-4">
                <Volume2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Read Aloud & Voice Input
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm flex-1">
                Listen to summaries in Kannada, Hindi, or English. Ask questions with your voice.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20 scroll-mt-24">
          <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-800 p-6 sm:p-10 md:p-12 shadow-2xl">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/20 px-3.5 py-1 rounded-full border border-blue-400/30">
                Three Easy Steps
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-3">
                How Samajh helps you
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center mb-4 shadow-md">
                  1
                </div>
                <h3 className="text-lg font-bold text-white">Upload or Snap</h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Take a clear picture of any document with your phone camera or upload a PDF/photo.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center mb-4 shadow-md">
                  2
                </div>
                <h3 className="text-lg font-bold text-white">Choose Language</h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Select your preferred language: English, Kannada, or Hindi.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center mb-4 shadow-md">
                  3
                </div>
                <h3 className="text-lg font-bold text-white">Take Action</h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  See exact amounts, deadlines, documents to carry, and warnings about potential fraud.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center pt-8 border-t border-slate-800">
              <Link
                to={ctaDestination}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25"
              >
                <span>Get started now</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Safety & Integrity Note */}
        <footer className="max-w-4xl mx-auto px-4 text-center mt-14 sm:mt-16 text-slate-400 text-xs leading-relaxed">
          <p>
            Samajh is an informational citizen assistance tool designed to clarify government, utility, and legal paperwork.
            Always cross-check with official department portals before financial transactions.
          </p>
        </footer>
      </div>
    </div>
  );
}
