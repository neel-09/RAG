import React, { useState, useRef, useEffect } from 'react';
import './InputBar.css';

export default function InputBar({ onSend, isLoading, config, setConfig, models }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  function autoResize() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }

  function handleChange(e) {
    setValue(e.target.value);
    autoResize();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="input-bar">
      <div className="input-bar__inner">
        <div className="input-bar__toolbar">
          <div className="input-bar__toolbar-left">
            <select
              className="input-bar__select"
              value={config.model}
              onChange={e => setConfig(c => ({ ...c, model: e.target.value }))}
            >
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <div className="input-bar__divider" />
            <div className="input-bar__param">
              <span className="input-bar__param-label">Temp</span>
              <input
                type="number"
                className="input-bar__param-input"
                value={config.temperature}
                min="0"
                max="1"
                step="0.1"
                onChange={e => setConfig(c => ({ ...c, temperature: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="input-bar__divider" />
            <div className="input-bar__param">
              <span className="input-bar__param-label">Chunks</span>
              <input
                type="number"
                className="input-bar__param-input"
                value={config.topK}
                min="1"
                max="6"
                step="1"
                onChange={e => setConfig(c => ({ ...c, topK: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>
          <span className="input-bar__hint">⌵ Enter to send · Shift+Enter for newline</span>
        </div>

        <div className="input-bar__compose">
          <textarea
            ref={textareaRef}
            className="input-bar__textarea"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about quantum mechanics, entanglement, Bell's theorem…"
            rows={1}
            disabled={isLoading}
          />
          <button
            className={`input-bar__send ${canSend ? 'input-bar__send--active' : ''} ${isLoading ? 'input-bar__send--loading' : ''}`}
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send"
          >
            {isLoading ? (
              <svg className="input-bar__spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}