import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDocuments, deleteDocument } from '../api/client';
import {
  FileText,
  Clock,
  AlertTriangle,
  Info,
  Trash2,
  ArrowRight,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Plus
} from 'lucide-react';

export default function HistoryPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [docToDelete, setDocToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDocuments();
      if (Array.isArray(data)) {
        // Sort safely newest first
        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setDocuments(sorted);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      setError(err.message || 'Could not load your history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const confirmDelete = async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDocument(docToDelete.id);
      setDocuments((prev) => prev.filter((d) => d.id !== docToDelete.id));
      setSuccessMessage('Document removed from your history.');
      setTimeout(() => setSuccessMessage(''), 4000);
      setDocToDelete(null);
    } catch (err) {
      setError(err.message || 'Could not delete the document. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderUrgencyBadge = (urgencyRaw) => {
    const urgency = (urgencyRaw || 'low').toLowerCase();
    if (urgency === 'high') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-100 text-red-900 border border-red-300 text-xs font-bold uppercase">
          <AlertTriangle className="w-3.5 h-3.5 text-red-700" aria-hidden="true" />
          <span>High Urgency</span>
        </span>
      );
    }
    if (urgency === 'medium') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase">
          <Clock className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
          <span>Medium Urgency</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold uppercase">
        <Info className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
        <span>Informational</span>
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Document History
          </h1>
          <p className="text-slate-600 text-base mt-1">
            Review previous notices, payment instructions, and Q&A answers
          </p>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-blue-800 hover:bg-blue-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span>Explain new document</span>
        </Link>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div
          className="mb-6 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 flex items-center gap-3"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
          <p className="text-sm font-bold text-emerald-900">{successMessage}</p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-center gap-3"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center" role="status" aria-live="polite">
          <div className="w-10 h-10 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-bold text-slate-800">Loading your documents…</p>
          <p className="text-sm text-slate-500 mt-1">Fetching your historical explanations</p>
        </div>
      ) : documents.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <FileText className="w-8 h-8" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            You haven't explained any documents yet.
          </h2>
          <p className="text-slate-600 text-sm mb-6">
            Take a photo or upload an official notice, bill, or government letter to get clear guidance.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-blue-800 hover:bg-blue-900 shadow-sm transition-colors"
          >
            <span>Explain your first document</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        /* Document Cards List */
        <div className="space-y-4" role="feed" aria-label="Previous documents list">
          {documents.map((doc) => {
            const analysis = doc.analysis || {};
            const docDate = new Date(doc.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <article
                key={doc.id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 uppercase">
                        {analysis.documentType || 'Official Notice'}
                      </span>
                      {renderUrgencyBadge(analysis.urgency)}
                      <span className="text-xs text-slate-500 font-medium ml-1">
                        {docDate}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                      {analysis.title || doc.fileName}
                    </h2>

                    <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                      {analysis.summary || 'Summary unavailable.'}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 font-medium">
                      <span>File: {doc.fileName}</span>
                      <span>•</span>
                      <span>Language: {doc.language?.toUpperCase() || 'EN'}</span>
                    </div>
                  </div>

                  {/* Actions: Open and Delete */}
                  <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    <Link
                      to={`/documents/${doc.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-colors"
                      aria-label={`Open explanation for ${analysis.title || doc.fileName}`}
                    >
                      <span>Open</span>
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDocToDelete(doc)}
                      className="p-2.5 rounded-xl text-slate-500 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-300 focus:outline-none focus:ring-4 focus:ring-red-100 transition-colors"
                      aria-label={`Delete ${analysis.title || doc.fileName}`}
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Accessible Confirmation Modal for Deletion */}
      {docToDelete && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border-2 border-slate-300 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>

            <h3 id="modal-title" className="text-xl font-bold text-slate-900">
              Delete Document Explanation?
            </h3>

            <p className="text-slate-600 text-sm mt-2">
              Are you sure you want to delete{' '}
              <span className="font-bold text-slate-900">
                "{docToDelete.analysis?.title || docToDelete.fileName}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDocToDelete(null)}
                disabled={isDeleting}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-200"
              >
                {isDeleting ? (
                  <span>Deleting…</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete document</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
