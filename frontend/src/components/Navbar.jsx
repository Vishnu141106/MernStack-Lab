import React from 'react';

export default function Navbar({ onAddTask, onOpenGuide, dbStatus }) {
  const isConnected = dbStatus?.status === 'online';

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <path d="M10 6h6" />
              <path d="M10 10h6" />
            </svg>
          </div>
          <div>
            <div className="brand-title">
              Smart<span>Study</span>
            </div>
            <div className="brand-subtitle">Local MongoDB &bull; MERN Lab</div>
          </div>
        </div>

        {/* Database Status & Action Buttons */}
        <div className="navbar-actions">
          {/* Connection Status Pill */}
          <button 
            className={`status-pill ${isConnected ? 'status-connected' : 'status-disconnected'}`}
            onClick={onOpenGuide}
            title="Click to view MongoDB connection & Compass details"
          >
            <span className="status-dot"></span>
            <span className="status-text">
              {isConnected ? (
                <>
                  <span className="db-name">smartstudy</span>.tasks (27017)
                </>
              ) : (
                'MongoDB Offline - Setup Guide'
              )}
            </span>
          </button>

          {/* Compass Guide Button */}
          <button 
            className="btn-secondary"
            onClick={onOpenGuide}
            title="Open MongoDB Compass setup & troubleshooting guide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            <span>Compass Guide</span>
          </button>

          {/* Add Task Button */}
          <button 
            className="btn-primary"
            onClick={onAddTask}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
