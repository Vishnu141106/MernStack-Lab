import React from 'react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, task }) {
  if (!isOpen || !task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-sm" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-body">
          <div className="delete-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
          <h3>Delete Study Task?</h3>
          <p>
            Are you sure you want to delete <strong>&ldquo;{task.title}&rdquo;</strong> from local MongoDB?
          </p>
          <div className="delete-details-card">
            <span>Subject: <strong>{task.subject}</strong></span>
            <span>Collection: <code>smartstudy &gt; tasks</code></span>
          </div>

          <div className="modal-footer delete-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-danger-confirm"
              onClick={() => {
                onConfirm(task._id);
                onClose();
              }}
            >
              Yes, Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
