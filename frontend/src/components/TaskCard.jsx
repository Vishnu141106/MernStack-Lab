import React from 'react';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const { _id, subject, title, description, date, priority, status } = task;

  const getPriorityClass = (p) => {
    switch (p) {
      case 'High':
        return 'badge-priority-high';
      case 'Medium':
        return 'badge-priority-med';
      case 'Low':
        return 'badge-priority-low';
      default:
        return 'badge-priority-med';
    }
  };

  const getStatusClass = (s) => {
    switch (s) {
      case 'Completed':
        return 'badge-status-completed';
      case 'In Progress':
        return 'badge-status-progress';
      case 'Pending':
        return 'badge-status-pending';
      default:
        return 'badge-status-pending';
    }
  };

  return (
    <div className={`task-card ${status === 'Completed' ? 'task-completed-card' : ''}`}>
      {/* Top Header: Subject Badge & Priority Tag */}
      <div className="task-card-header">
        <span className="subject-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          {subject}
        </span>
        <span className={`priority-pill ${getPriorityClass(priority)}`}>
          <span className="dot"></span>
          {priority} Priority
        </span>
      </div>

      {/* Title & Description */}
      <div className="task-body">
        <h3 className="task-title" title={title}>
          {title}
        </h3>
        {description ? (
          <p className="task-description">{description}</p>
        ) : (
          <p className="task-description empty-desc">No description provided.</p>
        )}
      </div>

      {/* Due Date & Quick Status Toggle */}
      <div className="task-meta">
        <div className="task-date" title={`Scheduled date: ${date}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{date}</span>
        </div>

        {/* Quick Status Select */}
        <div className="task-status-selector">
          <select
            className={`status-select ${getStatusClass(status)}`}
            value={status}
            onChange={(e) => onStatusChange(_id, e.target.value)}
            title="Change status directly"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Card Footer: Action Buttons */}
      <div className="task-card-footer">
        <div className="compass-doc-hint" title="Document in MongoDB Compass: smartstudy > tasks">
          <code>id: {_id?.slice(-6)}</code>
        </div>
        <div className="card-actions">
          <button
            className="action-btn edit-btn"
            onClick={() => onEdit(task)}
            title="Edit Task"
            aria-label="Edit Task"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span>Edit</span>
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(task)}
            title="Delete Task"
            aria-label="Delete Task"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
