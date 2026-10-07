import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff, MessageSquare, Bot, User } from 'lucide-react';
import { useVoiceInput } from '../a11y/useVoiceInput';
import { ReadAloudButton } from '../a11y/ReadAloudButton';

export function ChatBox({ onAskQuestion, language = 'en', loading = false }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const { start, stop, listening, transcript, supported: voiceSupported } = useVoiceInput(language);

  // Sync speech recognition transcript into the input
  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
    }
  }, [transcript]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanQuestion = question.trim();
    if (!cleanQuestion || loading) return;

    if (listening) stop();

    const userMsg = { id: Date.now(), sender: 'user', text: cleanQuestion };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');

    try {
      const answer = await onAskQuestion(cleanQuestion);
      const botMsg = { id: Date.now() + 1, sender: 'bot', text: answer };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, could not get an answer right now. Please try again.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Messages list */}
      {messages.length > 0 && (
        <div
          className="space-y-3 max-h-96 overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-400 border border-slate-200 dark:border-slate-800"
          aria-live="polite"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-sm ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white dark:bg-blue-500 high-contrast:bg-yellow-400 high-contrast:text-black font-semibold'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 high-contrast:bg-black high-contrast:text-yellow-400 high-contrast:border-yellow-400'
                }`}
              >
                <div className="flex items-center gap-2 text-xs opacity-75">
                  {m.sender === 'user' ? (
                    <User className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{m.sender === 'user' ? 'You' : 'Samajh'}</span>
                </div>

                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                {m.sender === 'bot' && (
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-700 high-contrast:border-yellow-400">
                    <ReadAloudButton text={m.text} language={language} label="Listen to Answer" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 text-sm text-slate-500 dark:text-slate-400 italic">
              <Bot className="w-4 h-4 animate-bounce" aria-hidden="true" />
              <span>Samajh is thinking...</span>
            </div>
          )}
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              language === 'kn'
                ? 'ದಾಖಲೆಯ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ...'
                : language === 'hi'
                ? 'दस्तावेज़ के बारे में सवाल पूछें...'
                : 'Ask a question about this document...'
            }
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-blue-500 high-contrast:bg-black high-contrast:text-yellow-400 high-contrast:border-yellow-400"
          />

          {voiceSupported && (
            <button
              type="button"
              onClick={listening ? stop : start}
              aria-label={listening ? 'Stop voice listening' : 'Start speaking your question'}
              aria-pressed={listening}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition ${
                listening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {listening ? (
                <MicOff className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Mic className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!question.trim() || loading}
          className="px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 transition flex items-center gap-1.5 high-contrast:bg-yellow-400 high-contrast:text-black shrink-0 min-h-[44px]"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
