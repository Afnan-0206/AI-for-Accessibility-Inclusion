import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Frontend hook contract for voice input integration.
 * Connects microphone speech-to-text to input fields.
 * Designed to integrate with Nanditha's accessibility suite.
 */
export function useVoiceInput(lang = 'en') {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (SpeechRecognition) {
      setIsSupported(true);
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;

        // Map language code for recognition
        let speechLang = 'en-IN';
        if (lang === 'kn') speechLang = 'kn-IN';
        else if (lang === 'hi') speechLang = 'hi-IN';

        recognition.lang = speechLang;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        recognition.onerror = (event) => {
          console.warn('Speech recognition notice:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setError('Microphone access was denied. Please allow microphone permissions.');
          } else {
            setError('Could not understand audio. Please try speaking again or type.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('SpeechRecognition initialization failed', e);
        setIsSupported(false);
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [lang]);

  const startListening = useCallback(() => {
    setError(null);
    if (!recognitionRef.current) {
      setError('Voice recognition is not supported in this browser.');
      return;
    }

    try {
      setTranscript('');
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Recognition start issue:', err);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}

export default useVoiceInput;
