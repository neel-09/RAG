import React, { useEffect, useRef } from 'react';
import Message from './Message';
import './ChatArea.css';

function WelcomeScreen({ suggestedQueries, onSuggestedQuery }) {
  return (
    <div className="welcome">
      <div className="welcome__icon">
        <svg width="48" height="48" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="40" rx="34" ry="13" stroke="#0A84FF" strokeWidth="1.5" opacity="0.85" />
          <ellipse cx="40" cy="40" rx="34" ry="13" stroke="#64D2FF" strokeWidth="1.2" opacity="0.55" transform="rotate(60 40 40)" />
          <ellipse cx="40" cy="40" rx="34" ry="13" stroke="#0A84FF" strokeWidth="1.2" opacity="0.45" transform="rotate(120 40 40)" />
          <circle cx="40" cy="40" r="7" fill="url(#wg)" />
          <circle cx="74" cy="40" r="4" fill="#0A84FF" opacity="0.9" />
          <circle cx="23" cy="14.5" r="3.5" fill="#64D2FF" opacity="0.8" />
          <circle cx="23" cy="65.5" r="3.5" fill="#0A84FF" opacity="0.8" />
          <defs>
            <radialGradient id="wg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#64D2FF" />
              <stop offset="100%" stopColor="#0A84FF" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <h1 className="welcome__title">Quantum AI</h1>
      <p className="welcome__tagline">Retrieval-augmented quantum mechanics intelligence</p>
      <p className="welcome__desc">
        Ask questions about quantum entanglement, Bell's theorem, decoherence, quantum computing, and more.
        I reason over a curated knowledge base with real-time vector retrieval.
      </p>

      <div className="welcome__chips">
        {suggestedQueries.map((q, i) => (
          <button
            key={i}
            className="welcome__chip"
            onClick={() => onSuggestedQuery(q)}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="typing-indicator__avatar">QAI</div>
      <div className="typing-indicator__bubble">
        <span className="typing-indicator__dot" style={{ animationDelay: '0ms' }} />
        <span className="typing-indicator__dot" style={{ animationDelay: '160ms' }} />
        <span className="typing-indicator__dot" style={{ animationDelay: '320ms' }} />
        <span className="typing-indicator__label">Retrieving context…</span>
      </div>
    </div>
  );
}

export default function ChatArea({ messages, isLoading, suggestedQueries, onSuggestedQuery }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <main className="chat-area">
      <div className="chat-area__inner">
        {messages.length === 0 && !isLoading ? (
          <WelcomeScreen suggestedQueries={suggestedQueries} onSuggestedQuery={onSuggestedQuery} />
        ) : (
          <>
            {messages.map(msg => (
              <Message key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </main>
  );
}