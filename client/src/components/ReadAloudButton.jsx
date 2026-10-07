import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * ReadAloudButton Integration Point (A11y Contract)
 * Placeholder component for Nanditha's accessibility system.
 * Provides fallback browser speech synthesis if available.
 */
export default function ReadAloudButton({ text, lang = 'en', className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    if (lang === 'kn') {
      utterance.lang = 'kn-IN';
    } else if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.9; // Slightly slower, clear civic cadence

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const getLabel = () => {
    if (isPlaying) {
      if (lang === 'kn') return 'ನಿಲ್ಲಿಸಿ (Stop)';
      if (lang === 'hi') return 'रोकें (Stop)';
      return 'Stop reading';
    }
    if (lang === 'kn') return 'ಓದಿ ಕೇಳಿ (Read aloud)';
    if (lang === 'hi') return 'सुनें (Read aloud)';
    return 'Read aloud';
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 ${
        isPlaying
          ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
          : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-sm'
      } ${className}`}
      aria-label={`${isPlaying ? 'Stop reading' : 'Read aloud'}: ${text ? text.slice(0, 40) : ''}`}
      aria-pressed={isPlaying}
      title="Listen to this section"
    >
      {isPlaying ? (
        <VolumeX className="w-4 h-4 text-amber-700" aria-hidden="true" />
      ) : (
        <Volume2 className="w-4 h-4 text-blue-700" aria-hidden="true" />
      )}
      <span>{getLabel()}</span>
    </button>
  );
}
