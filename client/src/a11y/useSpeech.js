import { useState, useEffect, useCallback, useRef } from 'react';

const LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
};

const LANG_DISPLAY = {
  en: 'English',
  hi: 'Hindi',
  kn: 'Kannada',
};

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [notice, setNotice] = useState(null);
  const voicesRef = useRef([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);

      const updateVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text, langCode = 'en') => {
      if (!supported || !text) return;

      stop();
      setNotice(null);

      const targetLang = LANG_MAP[langCode] || langCode;
      const allVoices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();

      // Find matching voice
      const exactVoice = allVoices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase());
      const prefixVoice = allVoices.find((v) => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
      const selectedVoice = exactVoice || prefixVoice;

      if (!selectedVoice && (langCode === 'kn' || langCode === 'hi')) {
        const langName = LANG_DISPLAY[langCode] || langCode;
        setNotice(`${langName} voice is not installed on this device. Reading with default system voice.`);
      }

      // Sentence chunking to prevent browser speech cutoff on long texts
      const sentences = text
        .split(/(?<=[.!?।\n])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (sentences.length === 0) return;

      setSpeaking(true);

      sentences.forEach((sentence, index) => {
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = targetLang;
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        utterance.rate = 0.95; // Slightly slower for low-literacy clarity

        if (index === sentences.length - 1) {
          utterance.onend = () => setSpeaking(false);
          utterance.onerror = () => setSpeaking(false);
        }

        window.speechSynthesis.speak(utterance);
      });
    },
    [supported, stop]
  );

  return {
    speak,
    stop,
    speaking,
    supported,
    notice,
  };
}
