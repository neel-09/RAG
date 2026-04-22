import React from 'react';
import './Header.css';

const AtomIcon = () => (
  <svg width="28" height="28" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="40" cy="40" rx="32" ry="12" stroke="#0A84FF" strokeWidth="1.5" opacity="0.9" />
    <ellipse cx="40" cy="40" rx="32" ry="12" stroke="#64D2FF" strokeWidth="1.2" opacity="0.6" transform="rotate(60 40 40)" />
    <ellipse cx="40" cy="40" rx="32" ry="12" stroke="#0A84FF" strokeWidth="1.2" opacity="0.5" transform="rotate(120 40 40)" />
    <circle cx="40" cy="40" r="6" fill="url(#cg)" />
    <circle cx="72" cy="40" r="3.5" fill="#0A84FF" opacity="0.9" />
    <circle cx="24" cy="15.5" r="3" fill="#64D2FF" opacity="0.8" />
    <circle cx="24" cy="64.5" r="3" fill="#0A84FF" opacity="0.8" />
    <defs>
      <radialGradient id="cg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#64D2FF" />
        <stop offset="100%" stopColor="#0A84FF" />
      </radialGradient>
    </defs>
  </svg>
);

const STATUS_MAP = {
  idle: { label: 'Connecting…', color: 'var(--accent-amber)', glow: 'rgba(255,159,10,0.4)' },
  ready: { label: 'Ready', color: 'var(--accent-green)', glow: 'rgba(50,215,75,0.4)' },
  processing: { label: 'Processing', color: 'var(--accent-amber)', glow: 'rgba(255,159,10,0.4)' },
  error: { label: 'Offline', color: 'var(--accent-red)', glow: 'rgba(255,69,58,0.4)' },
};

export default function Header({ status, model, models, onToggleSidebar, sidebarOpen }) {
  const st = STATUS_MAP[status] || STATUS_MAP.idle;
  const modelLabel = models.find(m => m.id === model)?.label || model;

  return (
    <header className="header">
      <div className="header__left">
        <button
          className="header__sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {sidebarOpen ? (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        <div className="header__brand">
          <div className="header__atom">
            <AtomIcon />
          </div>
          <div>
            <div className="header__title">QuantumAI</div>
            <div className="header__subtitle">Retrieval-Augmented Intelligence</div>
          </div>
        </div>
      </div>

      <div className="header__right">
        <div className="header__model-chip">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          {modelLabel}
        </div>

        <div className="header__status">
          <span
            className="header__status-dot"
            style={{ background: st.color, boxShadow: `0 0 7px ${st.glow}` }}
          />
          <span className="header__status-text">{st.label}</span>
        </div>
      </div>
    </header>
  );
}