import React from 'react';
import './Sidebar.css';

export default function Sidebar({ open, isMobile, chatHistory, onNewChat, onSelectChat, config, setConfig, models, onClose }) {
  const mobileClass = isMobile ? 'sidebar--mobile' : '';
  const openClass = open ? 'sidebar--open' : 'sidebar--closed';

  return (
    <aside className={`sidebar ${mobileClass} ${openClass}`}>
      <div className="sidebar__header">
        {isMobile && (
          <button className="sidebar__close" onClick={onClose} aria-label="Close sidebar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <button className="sidebar__new-chat" onClick={onNewChat}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="sidebar__section">
        <p className="sidebar__label">Recent</p>
        <div className="sidebar__history">
          {chatHistory.map(chat => (
            <button
              key={chat.id}
              className={`sidebar__chat-item ${chat.active ? 'sidebar__chat-item--active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="sidebar__chat-title">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar__section">
        <p className="sidebar__label">Configuration</p>

        <div className="sidebar__config-group">
          <label className="sidebar__config-label">Model</label>
          <select
            className="sidebar__select"
            value={config.model}
            onChange={e => setConfig(c => ({ ...c, model: e.target.value }))}
          >
            {models.map(m => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="sidebar__config-group">
          <label className="sidebar__config-label">
            Temperature
            <span className="sidebar__config-value">{config.temperature.toFixed(1)}</span>
          </label>
          <input
            type="range"
            className="sidebar__range"
            min="0" max="1" step="0.1"
            value={config.temperature}
            onChange={e => setConfig(c => ({ ...c, temperature: parseFloat(e.target.value) }))}
          />
          <div className="sidebar__range-labels">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>

        <div className="sidebar__config-group">
          <label className="sidebar__config-label">
            Context Chunks
            <span className="sidebar__config-value">{config.topK}</span>
          </label>
          <input
            type="range"
            className="sidebar__range"
            min="1" max="6" step="1"
            value={config.topK}
            onChange={e => setConfig(c => ({ ...c, topK: parseInt(e.target.value) }))}
          />
          <div className="sidebar__range-labels">
            <span>1</span>
            <span>6</span>
          </div>
        </div>
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__footer-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
          Quantum RAG Engine
        </div>
      </div>
    </aside>
  );
}