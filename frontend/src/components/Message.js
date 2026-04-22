import React, { useState } from 'react';
import './Message.css';

function renderMarkdown(text) {
  // Bold
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // Lists
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  // Paragraphs
  html = html
    .split('\n\n')
    .map(para => {
      if (para.includes('<li>')) return `<ul>${para}</ul>`;
      if (para.match(/^<h[123]/)) return para;
      return `<p>${para.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');
  return html;
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Message({ message }) {
  const isUser = message.role === 'user';
  const [showChunks, setShowChunks] = useState(false);

  return (
    <div className={`message message--${isUser ? 'user' : 'ai'}`}>
      {!isUser && (
        <div className="message__avatar message__avatar--ai">QAI</div>
      )}

      <div className="message__content">
        <div className={`message__bubble message__bubble--${isUser ? 'user' : 'ai'} ${message.isError ? 'message__bubble--error' : ''}`}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div
              className="message__markdown"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
            />
          )}
        </div>

        <div className="message__meta">
          <span className="message__time">{formatTime(message.timestamp)}</span>

          {!isUser && message.chunksRetrieved > 0 && (
            <button
              className="message__chunks-btn"
              onClick={() => setShowChunks(v => !v)}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="9" height="9" rx="1" />
                <rect x="13" y="2" width="9" height="9" rx="1" />
                <rect x="2" y="13" width="9" height="9" rx="1" />
                <rect x="13" y="13" width="9" height="9" rx="1" />
              </svg>
              {message.chunksRetrieved} source{message.chunksRetrieved > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {showChunks && message.chunksPreview && (
          <div className="message__chunks">
            <p className="message__chunks-label">Retrieved Context</p>
            {message.chunksPreview.map((chunk, i) => (
              <div key={i} className="message__chunk">
                <span className="message__chunk-index">{i + 1}</span>
                <p>{chunk}…</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="message__avatar message__avatar--user">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  );
}