import React, { useState } from 'react';

export default function CompassGuideModal({ isOpen, onClose, dbStatus }) {
  const [copied, setCopied] = useState(false);
  const uri = 'mongodb://127.0.0.1:27017/smartstudy';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge badge-compass">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
            </div>
            <div>
              <h2>Local MongoDB &amp; Compass Guide</h2>
              <p className="modal-subtitle">Strictly Local Database &bull; No Cloud / No Atlas</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="guide-body">
          {/* Status banner */}
          <div className={`guide-status-box ${dbStatus?.status === 'online' ? 'status-ok' : 'status-alert'}`}>
            <div className="guide-status-dot"></div>
            <div>
              <strong>Current Backend DB Status:</strong>{' '}
              {dbStatus?.status === 'online' ? (
                <span className="text-emerald">Connected to Local MongoDB ({dbStatus.database}.{dbStatus.collection})</span>
              ) : (
                <span className="text-rose">Backend cannot connect to MongoDB at 127.0.0.1:27017. See instructions below to start it!</span>
              )}
            </div>
          </div>

          {/* Connection URI copy box */}
          <div className="uri-copy-container">
            <div className="uri-label">MongoDB Compass Connection String:</div>
            <div className="uri-box">
              <code>{uri}</code>
              <button className="btn-copy" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy URI'}
              </button>
            </div>
          </div>

          {/* Architecture diagram */}
          <div className="guide-section">
            <h3>1. Application Architecture</h3>
            <div className="arch-flow">
              <div className="arch-step">
                <span className="arch-badge">Frontend</span>
                <strong>React (Vite)</strong>
                <code>:5173</code>
              </div>
              <div className="arch-arrow">&rarr; Axios &rarr;</div>
              <div className="arch-step">
                <span className="arch-badge">Backend</span>
                <strong>Express API</strong>
                <code>:5000</code>
              </div>
              <div className="arch-arrow">&rarr; Mongoose &rarr;</div>
              <div className="arch-step">
                <span className="arch-badge">Database</span>
                <strong>Local MongoDB</strong>
                <code>:27017</code>
              </div>
              <div className="arch-arrow">&harr; Inspect in</div>
              <div className="arch-step arch-compass">
                <span className="arch-badge">GUI Client</span>
                <strong>MongoDB Compass</strong>
                <code>smartstudy.tasks</code>
              </div>
            </div>
          </div>

          {/* Step 2: How to start MongoDB on Windows */}
          <div className="guide-section">
            <h3>2. How to Start MongoDB Service on Windows</h3>
            <div className="guide-steps-list">
              <div className="guide-step-item">
                <div className="step-num">A</div>
                <div className="step-content">
                  <strong>Command Prompt / PowerShell (Run as Administrator):</strong>
                  <div className="code-snippet">net start MongoDB</div>
                  <p className="step-sub">To stop it later: <code>net stop MongoDB</code></p>
                </div>
              </div>

              <div className="guide-step-item">
                <div className="step-num">B</div>
                <div className="step-content">
                  <strong>Via Windows Services Manager:</strong>
                  <p>1. Press <kbd>Win + R</kbd>, type <code>services.msc</code>, and hit Enter.</p>
                  <p>2. Scroll down to find <strong>MongoDB Server (MongoDB)</strong>.</p>
                  <p>3. Right-click it and click <strong>Start</strong>.</p>
                </div>
              </div>

              <div className="guide-step-item">
                <div className="step-num">C</div>
                <div className="step-content">
                  <strong>Or start manually from Terminal (mongod):</strong>
                  <div className="code-snippet">mongod --dbpath "C:\data\db"</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Verifying in MongoDB Compass */}
          <div className="guide-section">
            <h3>3. Verifying in MongoDB Compass</h3>
            <ol className="compass-verify-steps">
              <li>Launch <strong>MongoDB Compass</strong> from your Start Menu.</li>
              <li>In the &ldquo;New Connection&rdquo; field, paste <code>mongodb://127.0.0.1:27017</code> and click <strong>Connect</strong>.</li>
              <li>In the left sidebar, click on the <strong>smartstudy</strong> database.</li>
              <li>Click on the <strong>tasks</strong> collection.</li>
              <li>Add, Edit, or Delete tasks from this web app and click the <strong>Refresh</strong> button in Compass to verify updates live!</li>
            </ol>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-modal-submit" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
