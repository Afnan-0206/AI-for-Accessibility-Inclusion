import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDocument, askQuestion } from '../api/client';
import useVoiceInput from '../hooks/useVoiceInput';
import ReadAloudButton from '../components/ReadAloudButton';
import {
  FileText,
  AlertTriangle,
  Clock,
  Info,
  Calendar,
  CheckCircle,
  FileCheck,
  IndianRupee,
  ShieldAlert,
  Send,
  Mic,
  MicOff,
  ArrowLeft,
  Share2,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function DocumentResultPage() {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Q&A state
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaError, setQaError] = useState('');
  const [qaHistory, setQaHistory] = useState([]);

  // Voice input integration using accessibility contract
  const docLang = document?.language || 'en';
  const {
    isListening,
    transcript,
    isSupported: voiceSupported,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput(docLang);

  // Sync speech transcript into question field
  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
    }
  }, [transcript]);

  // Load document details
  useEffect(() => {
    let isMounted = true;
    async function fetchDoc() {
      setLoading(true);
      setError('');
      try {
        const data = await getDocument(id);
        if (isMounted) {
          setDocument(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'The requested document could not be loaded.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchDoc();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAsk = async (questionText) => {
    const textToSend = questionText || question;
    if (!textToSend || !textToSend.trim()) return;

    setQaError('');
    setIsAsking(true);
    try {
      const res = await askQuestion(id, {
        question: textToSend.trim(),
        language: document?.language || 'en',
      });

      const newEntry = {
        question: textToSend.trim(),
        answer: res?.answer || res?.data?.answer || 'No direct answer could be found.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setQaHistory((prev) => [...prev, newEntry]);
      setQuestion('');
      resetTranscript();
    } catch (err) {
      setQaError(err.message || 'Could not find an answer right now. Please try again.');
    } finally {
      setIsAsking(false);
    }
  };

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex flex-col items-center justify-center p-6" role="status" aria-live="polite">
        <div className="w-12 h-12 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xl font-bold text-slate-800">Reading your document…</p>
        <p className="text-sm text-slate-500 mt-1">Extracting actions, deadlines, and amounts.</p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-4 border border-red-200">
          <AlertTriangle className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Document Not Found</h1>
        <p className="text-slate-600 mb-6">{error || 'This document is unavailable or has been removed.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-blue-800 hover:bg-blue-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const analysis = document.analysis || {};
  const urgency = (analysis.urgency || 'low').toLowerCase();

  // Urgency badge with visual icon + text + high contrast border (never color alone)
  const renderUrgencyBadge = () => {
    if (urgency === 'high') {
      return (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-100 text-red-900 border-2 border-red-300 font-extrabold text-xs uppercase tracking-wide">
          <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" aria-hidden="true" />
          <span>HIGH URGENCY — ACTION NEEDED</span>
        </div>
      );
    }
    if (urgency === 'medium') {
      return (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-100 text-amber-900 border-2 border-amber-300 font-extrabold text-xs uppercase tracking-wide">
          <Clock className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
          <span>MEDIUM URGENCY — ATTENTION REQUIRED</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 border-2 border-emerald-300 font-extrabold text-xs uppercase tracking-wide">
        <Info className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
        <span>LOW URGENCY — INFORMATIONAL</span>
      </div>
    );
  };

  const exampleQuestions = [
    'When do I need to pay?',
    'What happens if I miss the deadline?',
    'How much do I need to pay?',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-800 hover:text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* 1. DOCUMENT HEADER */}
      <section
        className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm"
        aria-labelledby="doc-header-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-300">
              {analysis.documentType || 'Official Notice'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              File: {document.fileName}
            </span>
          </div>
          <div>{renderUrgencyBadge()}</div>
        </div>

        <h1 id="doc-header-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          {analysis.title || 'Official Document Explanation'}
        </h1>

        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 font-medium">
          <span>Explained on {new Date(document.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>Language: {document.language?.toUpperCase() || 'EN'}</span>
        </div>
      </section>

      {/* 2. SUMMARY SECTION */}
      <section
        className="bg-white rounded-2xl border-2 border-blue-200 p-6 sm:p-8 shadow-xs"
        aria-labelledby="summary-heading"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 id="summary-heading" className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-800" aria-hidden="true" />
            <span>What this means</span>
          </h2>
          {/* Read Aloud Integration Point */}
          <ReadAloudButton text={analysis.summary} lang={document.language} />
        </div>

        <p className="text-slate-800 text-base sm:text-lg leading-relaxed bg-blue-50/50 p-5 rounded-xl border border-blue-100">
          {analysis.summary || 'Summary unavailable for this document.'}
        </p>
      </section>

      {/* 3. ACTIONS SECTION */}
      {analysis.actions && analysis.actions.length > 0 && (
        <section
          className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs"
          aria-labelledby="actions-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 id="actions-heading" className="text-xl font-extrabold text-slate-900">
                What you need to do
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Complete these numbered steps in order
              </p>
            </div>
            {/* Read Aloud on Action Steps */}
            <ReadAloudButton
              text={analysis.actions.map((a, i) => `Step ${i + 1}: ${a.step}. Deadline: ${a.deadline}`).join('. ')}
              lang={document.language}
            />
          </div>

          <div className="space-y-4">
            {analysis.actions.map((act, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl border-2 border-slate-200 bg-slate-50/50"
              >
                <div className="w-9 h-9 rounded-full bg-blue-800 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-slate-900 leading-snug">
                    {act.step}
                  </p>
                  {act.deadline && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300">
                      <Clock className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                      <span>Deadline: {act.deadline}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. DEADLINES & AMOUNTS (2-Column Grid on Tablet/Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DEADLINES */}
        <section
          className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-xs flex flex-col"
          aria-labelledby="deadlines-heading"
        >
          <h2 id="deadlines-heading" className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-amber-600" aria-hidden="true" />
            <span>Important Deadlines</span>
          </h2>

          {analysis.deadlines && analysis.deadlines.length > 0 ? (
            <div className="space-y-3 flex-1">
              {analysis.deadlines.map((dl, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border-2 border-amber-200 bg-amber-50/60 flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-slate-800">
                    {dl.label}
                  </span>
                  <span className="text-base font-extrabold text-amber-950 px-2.5 py-0.5 rounded bg-amber-200/80">
                    {dl.date}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No specific deadlines mentioned in this document.</p>
          )}
        </section>

        {/* AMOUNTS */}
        <section
          className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-xs flex flex-col"
          aria-labelledby="amounts-heading"
        >
          <h2 id="amounts-heading" className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-4">
            <IndianRupee className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            <span>Amounts & Fees</span>
          </h2>

          {analysis.amounts && analysis.amounts.length > 0 ? (
            <div className="space-y-3 flex-1">
              {analysis.amounts.map((am, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border-2 border-emerald-200 bg-emerald-50/60 flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-slate-800">
                    {am.label}
                  </span>
                  <span className="text-lg font-extrabold text-emerald-950 px-3 py-0.5 rounded bg-emerald-200/80">
                    {am.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No payment amounts detected in this notice.</p>
          )}
        </section>
      </div>

      {/* 5. DOCUMENTS NEEDED */}
      {analysis.documentsNeeded && analysis.documentsNeeded.length > 0 && (
        <section
          className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs"
          aria-labelledby="docs-needed-heading"
        >
          <h2 id="docs-needed-heading" className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-4">
            <FileCheck className="w-5 h-5 text-blue-700" aria-hidden="true" />
            <span>Documents to bring or prepare</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.documentsNeeded.map((docItem, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-300 bg-slate-50"
              >
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-900">
                  {docItem}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. WARNINGS SECTION */}
      {analysis.warnings && analysis.warnings.length > 0 && (
        <section
          className="bg-red-50/70 rounded-2xl border-2 border-red-300 p-6 sm:p-8 shadow-xs"
          aria-labelledby="warnings-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 id="warnings-heading" className="text-lg font-extrabold text-red-950 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-700" aria-hidden="true" />
              <span>Important Warnings & Caution</span>
            </h2>
            <ReadAloudButton
              text={analysis.warnings.join('. ')}
              lang={document.language}
              className="border-red-200"
            />
          </div>

          <div className="space-y-3">
            {analysis.warnings.map((warn, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border-2 border-red-200 text-red-950 shadow-xs"
              >
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm font-bold leading-relaxed">{warn}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. ASK A QUESTION INTERFACE */}
      <section
        className="bg-white rounded-2xl border-2 border-blue-300 p-6 sm:p-8 shadow-sm"
        aria-labelledby="qa-heading"
      >
        <div className="mb-4">
          <h2 id="qa-heading" className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-700" aria-hidden="true" />
            <span>Have a question?</span>
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Ask anything about this document in your language using text or voice.
          </p>
        </div>

        {/* Example suggested questions */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-slate-500 block mb-2">Common questions:</span>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((eq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuestion(eq);
                  handleAsk(eq);
                }}
                disabled={isAsking}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                "{eq}"
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {qaError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-300 text-sm font-semibold text-red-800">
            {qaError}
          </div>
        )}

        {/* Voice error notice if applicable */}
        {voiceError && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-800">
            {voiceError}
          </div>
        )}

        {/* Question Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="space-y-3"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What do you want to know?"
              disabled={isAsking}
              className="w-full pl-4 pr-24 py-3.5 text-base rounded-xl border-2 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100 transition-colors"
              aria-label="Ask a question about this document"
            />

            <div className="absolute right-2 flex items-center gap-1">
              {/* Voice Input Microphone Integration */}
              <button
                type="button"
                onClick={handleToggleVoice}
                disabled={isAsking || !voiceSupported}
                className={`p-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  isListening
                    ? 'bg-red-600 text-white border-red-700 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
                title={
                  !voiceSupported
                    ? 'Voice input not supported on this browser'
                    : isListening
                    ? 'Listening... Click to stop'
                    : 'Click to speak your question'
                }
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 text-white" aria-hidden="true" />
                ) : (
                  <Mic className="w-5 h-5" aria-hidden="true" />
                )}
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAsking || !question.trim()}
                className="p-2 rounded-lg bg-blue-800 hover:bg-blue-900 disabled:bg-slate-300 text-white font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Submit question"
              >
                <Send className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {isListening && (
            <p className="text-xs text-red-700 font-bold animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              Listening to your voice… speak clearly.
            </p>
          )}

          {isAsking && (
            <div className="flex items-center gap-2 text-sm text-blue-800 font-bold" role="status" aria-live="polite">
              <div className="w-4 h-4 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
              <span>Finding the answer…</span>
            </div>
          )}
        </form>

        {/* Q&A Chat-Style Answer Cards */}
        {qaHistory.length > 0 && (
          <div className="mt-8 space-y-4 pt-6 border-t-2 border-slate-100" aria-label="Question and answers history">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Answers
            </h3>
            {qaHistory.map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border-2 border-blue-200 bg-slate-50 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-xs font-bold">
                      Question
                    </span>
                    <span className="text-xs text-slate-500">{item.timestamp}</span>
                  </div>
                </div>

                <p className="text-base font-bold text-slate-900">
                  "{item.question}"
                </p>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
                    {item.answer}
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Verified by Samajh AI</span>
                    <ReadAloudButton text={item.answer} lang={document.language} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
