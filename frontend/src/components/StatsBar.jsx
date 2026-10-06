import React from 'react';

export default function StatsBar({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const highPriority = tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total Tasks</span>
          <div className="stat-icon-wrapper icon-total">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
        </div>
        <div className="stat-value">{total}</div>
        <div className="stat-footer">smartstudy &bull; tasks collection</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Pending</span>
          <div className="stat-icon-wrapper icon-pending">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
        </div>
        <div className="stat-value text-pending">{pending}</div>
        <div className="stat-footer">Awaiting practice</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">In Progress</span>
          <div className="stat-icon-wrapper icon-progress">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
            </svg>
          </div>
        </div>
        <div className="stat-value text-progress">{inProgress}</div>
        <div className="stat-footer">Active study sessions</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Completed</span>
          <div className="stat-icon-wrapper icon-completed">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
        <div className="stat-value text-completed">{completed}</div>
        <div className="stat-footer">{completionRate}% completion rate</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">High Priority</span>
          <div className="stat-icon-wrapper icon-high">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
        </div>
        <div className="stat-value text-high">{highPriority}</div>
        <div className="stat-footer">Urgent focus needed</div>
      </div>
    </div>
  );
}
