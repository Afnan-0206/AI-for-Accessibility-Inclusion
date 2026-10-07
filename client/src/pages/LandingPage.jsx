import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Calendar,
  CheckCircle2,
  Volume2,
  ShieldCheck,
  Languages,
  ArrowRight,
  AlertTriangle,
  Upload,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const ctaDestination = isAuthenticated ? '/dashboard' : '/login';

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-16">
      {/* Hero Section */}
      <section className="bg-white border-b-2 border-slate-200 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-sm font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-700" aria-hidden="true" />
            <span>Public Service Citizen Document Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Understand important documents in your language.
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Take a photo or upload a document. Samajh explains what it means, what you need to do, and what deadlines matter.
          </p>

          {/* Three Supported Languages Badge */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-slate-500" aria-hidden="true" />
              Available in:
            </span>
            <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-md text-sm font-bold text-slate-800">
              English
            </span>
            <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-md text-sm font-bold text-slate-800">
              ಕನ್ನಡ (Kannada)
            </span>
            <span className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-md text-sm font-bold text-slate-800">
              हिन्दी (Hindi)
            </span>
          </div>

          {/* Primary and Secondary Call to Action */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={ctaDestination}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-bold text-white bg-blue-800 hover:bg-blue-900 shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <Upload className="w-5 h-5" aria-hidden="true" />
              <span>Explain a document</span>
              <ArrowRight className="w-5 h-5 ml-1" aria-hidden="true" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl text-lg font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 transition-colors focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Core Benefits / What Samajh Solves */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Clear, honest answers to simplify official paperwork
          </h2>
          <p className="text-slate-600 mt-2 text-base max-w-xl mx-auto">
            Official government, tax, utility, and welfare notices are often confusing. Samajh breaks them down step-by-step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Simple explanations */}
          <div className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-xs flex flex-col">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Simple explanations
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm flex-1">
              Plain language summaries without legal jargon or confusing administrative terms.
            </p>
          </div>

          {/* Card 2: Important actions & deadlines */}
          <div className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-xs flex flex-col">
            <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Actions & Deadlines
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm flex-1">
              Numbered steps on what you must do immediately, including payment deadlines and penalties.
            </p>
          </div>

          {/* Card 3: Read aloud & Accessibility */}
          <div className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-xs flex flex-col">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <Volume2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Read Aloud & Voice Input
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm flex-1">
              Listen to summaries in Kannada, Hindi, or English. Ask questions with your voice.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 scroll-mt-24">
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 sm:p-12 shadow-xs">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Three Easy Steps
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
              How Samajh helps you
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-800 text-white font-extrabold text-xl flex items-center justify-center mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Upload or Snap</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Take a clear picture of any document with your phone camera or upload a PDF/photo.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-800 text-white font-extrabold text-xl flex items-center justify-center mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Choose Language</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Select your preferred language: English, Kannada, or Hindi.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-800 text-white font-extrabold text-xl flex items-center justify-center mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Take Action</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                See exact amounts, deadlines, documents to carry, and warnings about potential fraud.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center pt-8 border-t border-slate-200">
            <Link
              to={ctaDestination}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white bg-blue-800 hover:bg-blue-900 transition-colors shadow-sm"
            >
              <span>Get started now</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Safety & Integrity Note */}
      <footer className="max-w-4xl mx-auto px-4 text-center mt-16 text-slate-500 text-xs">
        <p>
          Samajh is an informational citizen assistance tool designed to clarify government, utility, and legal paperwork.
          Always cross-check with official department portals before financial transactions.
        </p>
      </footer>
    </div>
  );
}
