import React, { useState, useRef } from 'react';
import { Upload, Camera, FileText, X, AlertCircle } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function UploadDropzone({ file, onFileSelect, onFileClear }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const validateAndSetFile = (selected) => {
    setError(null);
    if (!selected) return;

    if (selected.size > MAX_FILE_SIZE) {
      setError('File is larger than 10MB. Please choose a smaller file.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain'];
    if (!validTypes.includes(selected.type) && !selected.name.endsWith('.txt')) {
      setError('Unsupported file type. Please upload a JPG, PNG, WEBP photo or PDF document.');
      return;
    }

    if (selected.type.startsWith('image/')) {
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    onFileSelect(selected);
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
    onFileClear();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        id="file-upload-input"
        accept="image/jpeg,image/png,image/webp,application/pdf,text/plain"
        className="sr-only"
        onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        id="camera-upload-input"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
      />

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 text-sm rounded-lg bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 high-contrast:bg-black high-contrast:text-yellow-400 high-contrast:border-2 high-contrast:border-yellow-400"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-all ${
            dragActive
              ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-slate-50/50 dark:bg-slate-800/40'
          } high-contrast:bg-black high-contrast:border-yellow-400 high-contrast:border-2`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-slate-800 high-contrast:bg-yellow-400 high-contrast:text-black text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Upload className="w-7 h-7" aria-hidden="true" />
            </div>

            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100 high-contrast:text-yellow-400 text-base">
                Upload your letter, form, or notice
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 high-contrast:text-yellow-200 mt-1">
                Supports PDF, JPG, PNG, WEBP (Max 10MB)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 high-contrast:bg-yellow-400 high-contrast:text-black transition shadow-sm focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              >
                Choose File
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 high-contrast:bg-black high-contrast:text-yellow-400 high-contrast:border-yellow-400 transition min-h-[44px]"
              >
                <Camera className="w-4 h-4" aria-hidden="true" />
                <span>Take Photo</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Selected file preview */
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 high-contrast:bg-black high-contrast:border-yellow-400 high-contrast:border-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Uploaded document thumbnail preview"
                className="w-14 h-14 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-7 h-7" aria-hidden="true" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 dark:text-slate-100 high-contrast:text-yellow-400 truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 high-contrast:text-yellow-200">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Document'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            aria-label="Remove selected file"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 high-contrast:text-yellow-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadDropzone;
