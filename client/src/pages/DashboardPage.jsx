import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyzeDocument, getDocuments } from '../api/client';
import {
  Upload,
  Camera,
  FileText,
  FileCheck,
  Languages,
  AlertCircle,
  X,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Selected file and preview state
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('kn'); // Default to Kannada for the target demo path!

  // Async states: 'ready' | 'uploading' | 'analyzing' | 'successful' | 'failed'
  const [appState, setAppState] = useState('ready');
  const [errorMessage, setErrorMessage] = useState('');

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Recent history preview
  const [recentDocs, setRecentDocs] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Load recent history
  useEffect(() => {
    let mounted = true;
    async function loadRecent() {
      setIsLoadingHistory(true);
      try {
        const docs = await getDocuments();
        if (mounted && Array.isArray(docs)) {
          setRecentDocs(docs.slice(0, 3));
        }
      } catch (err) {
        console.warn('Could not load recent documents:', err);
      } finally {
        if (mounted) setIsLoadingHistory(false);
      }
    }
    loadRecent();
    return () => {
      mounted = false;
    };
  }, []);

  const handleFileSelection = (selectedFile) => {
    setErrorMessage('');
    if (!selectedFile) return;

    // Validate size (10 MB maximum)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      setErrorMessage('Please choose a PDF or image smaller than 10 MB.');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessage('Please upload a PDF document or an image (JPEG, PNG, WEBP).');
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleExplain = async () => {
    if (!file) {
      setErrorMessage('Please select or photograph a document first.');
      return;
    }

    setErrorMessage('');
    setAppState('uploading');

    try {
      // Transition to analyzing state for clear visibility
      setTimeout(() => {
        setAppState('analyzing');
      }, 400);

      const result = await analyzeDocument(file, selectedLanguage);
      setAppState('successful');

      if (result && result.id) {
        navigate(`/documents/${result.id}`);
      } else {
        throw new Error('Analysis completed but document identifier is missing.');
      }
    } catch (err) {
      setAppState('failed');
      setErrorMessage(err.message || 'Your document could not be analyzed. Please try again.');
    }
  };

  const languages = [
    { code: 'kn', name: 'ಕನ್ನಡ', label: 'Kannada' },
    { code: 'hi', name: 'हिन्दी', label: 'Hindi' },
    { code: 'en', name: 'English', label: 'English' },
  ];

  const isProcessing = appState === 'uploading' || appState === 'analyzing';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Welcome / Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-800 mb-1">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          <span>Samajh Citizen Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explain a Document
        </h1>
        <p className="mt-1 text-slate-600 text-base">
          Upload any official notice, letter, or bill. We will break down what it means in plain words.
        </p>
      </div>

      {/* Accessible Live Status Announcement */}
      <div className="sr-only" aria-live="polite" role="status">
        {appState === 'uploading' && 'Uploading your document, please wait.'}
        {appState === 'analyzing' && 'Reading your document. Identifying actions and deadlines.'}
        {appState === 'successful' && 'Document analysis complete. Loading your results.'}
        {appState === 'failed' && `Error: ${errorMessage}`}
      </div>

      {/* Error Announcement Banner */}
      {errorMessage && (
        <div
          className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-300 flex items-start gap-3"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-red-900">Notice</h3>
            <p className="text-sm text-red-800 mt-0.5">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-red-700 hover:text-red-900 p-1"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Upload & Configuration Card */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Step 1: Upload or Capture File */}
        <section aria-labelledby="upload-heading">
          <h2 id="upload-heading" className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-800 text-white text-xs font-extrabold flex items-center justify-center">
              1
            </span>
            <span>Upload or photograph document</span>
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Supports PDF, JPEG, PNG, or WEBP (Max 10 MB)
          </p>

          {/* Hidden inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            id="file-picker-input"
            onChange={(e) => handleFileSelection(e.target.files?.[0])}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            id="camera-picker-input"
            onChange={(e) => handleFileSelection(e.target.files?.[0])}
          />

          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-3 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-colors ${
                isDragging
                  ? 'border-blue-700 bg-blue-50'
                  : 'border-slate-300 bg-slate-50/70 hover:bg-slate-50'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8" aria-hidden="true" />
              </div>

              <p className="text-lg font-bold text-slate-800 mb-1">
                Drag and drop your document here
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Or choose from your device or mobile camera
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-blue-800 hover:bg-blue-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 transition-colors"
                >
                  <FileText className="w-5 h-5" aria-hidden="true" />
                  <span>Choose document</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-slate-800 bg-white hover:bg-slate-100 border-2 border-slate-300 shadow-xs focus:outline-none focus:ring-4 focus:ring-slate-200 transition-colors"
                >
                  <Camera className="w-5 h-5 text-slate-700" aria-hidden="true" />
                  <span>Take a photo</span>
                </button>
              </div>
            </div>
          ) : (
            /* Selected File Preview Box */
            <div className="bg-slate-50 rounded-2xl border-2 border-slate-300 p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {previewUrl ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-300 bg-white shrink-0 shadow-xs">
                      <img
                        src={previewUrl}
                        alt="Uploaded document preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 border-2 border-red-200">
                      <FileText className="w-8 h-8" aria-hidden="true" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-slate-900 break-all">
                      {file.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold">
                        {file.type === 'application/pdf' ? 'PDF Document' : 'Photo Image'}
                      </span>
                      <span>•</span>
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Ready to explain
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold text-red-700 hover:bg-red-50 border border-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 self-end sm:self-auto"
                  aria-label="Remove selected document"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  <span>Remove file</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Step 2: Language Selector */}
        <section className="mt-8 pt-8 border-t-2 border-slate-100" aria-labelledby="language-heading">
          <h2 id="language-heading" className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-800 text-white text-xs font-extrabold flex items-center justify-center">
              2
            </span>
            <span>Select language for explanation</span>
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Samajh will explain actions, deadlines, and amounts in this language.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {languages.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  disabled={isProcessing}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                    isSelected
                      ? 'border-blue-800 bg-blue-50/80 ring-2 ring-blue-800'
                      : 'border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xl font-bold text-slate-900">
                      {lang.name}
                    </span>
                    {isSelected && (
                      <span className="w-3 h-3 rounded-full bg-blue-800" aria-hidden="true" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    {lang.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Primary Action Button */}
        <div className="mt-10 pt-6 border-t-2 border-slate-100">
          <button
            type="button"
            onClick={handleExplain}
            disabled={!file || isProcessing}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-lg font-bold text-white bg-blue-800 hover:bg-blue-900 active:bg-blue-950 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-live="polite"
          >
            {appState === 'uploading' ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading…</span>
              </>
            ) : appState === 'analyzing' ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>Reading your document…</span>
              </>
            ) : (
              <>
                <span>Explain this document</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent History Section */}
      <section className="mt-12" aria-labelledby="recent-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="recent-heading" className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-600" aria-hidden="true" />
            <span>Recently Explained Documents</span>
          </h2>
          <Link
            to="/history"
            className="text-sm font-bold text-blue-800 hover:text-blue-950 underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
          >
            View all history →
          </Link>
        </div>

        {isLoadingHistory ? (
          <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
            Loading recent documents…
          </div>
        ) : recentDocs.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border-2 border-slate-200 text-center">
            <p className="text-slate-600 text-base">You haven’t explained any documents yet.</p>
            <p className="text-slate-500 text-xs mt-1">Upload a document above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recentDocs.map((doc) => {
              const urgency = doc.analysis?.urgency || 'medium';
              return (
                <Link
                  key={doc.id}
                  to={`/documents/${doc.id}`}
                  className="group bg-white p-5 rounded-xl border-2 border-slate-200 hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 truncate">
                        {doc.analysis?.documentType || 'Document'}
                      </span>
                      {urgency === 'high' && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                          Urgent
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-800 transition-colors line-clamp-2 text-base">
                      {doc.analysis?.title || doc.fileName}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    <span className="font-semibold text-blue-700 group-hover:underline">Open →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
