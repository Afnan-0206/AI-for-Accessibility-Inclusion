import { useState, useEffect, useRef, useCallback } from 'react';

const LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
};

export function useVoiceInput(langCode = 'en') {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = LANG_MAP[langCode] || 'en-IN';

      recognition.onstart = () => {
        setListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        const current = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join('');
        setTranscript(current);
      };

      recognition.onerror = (e) => {
        setListening(false);
        setError(e.error || 'Voice input failed');
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [langCode]);

  const start = useCallback(() => {
    if (!supported || !recognitionRef.current) return;
    try {
      setTranscript('');
      setError(null);
      recognitionRef.current.lang = LANG_MAP[langCode] || 'en-IN';
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Voice recognition start warning:', err);
    }
  }, [supported, langCode]);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
  }, []);

  return {
    start,
    stop,
    listening,
    transcript,
    supported,
    error,
  };
}
