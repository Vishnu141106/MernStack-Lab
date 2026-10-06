import React, { useState, useEffect } from 'react';

const COMMON_SUBJECTS = ['Java', 'Python', 'React', 'Node.js', 'Database / SQL', 'Data Structures', 'Web Development', 'Operating Systems', 'Networking', 'Mathematics'];

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit = null }) {
  const isEditing = !!taskToEdit;

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    description: '',
    date: getTodayDateString(),
    priority: 'Medium',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        subject: taskToEdit.subject || '',
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        date: taskToEdit.date || getTodayDateString(),
        priority: taskToEdit.priority || 'Medium',
        status: taskToEdit.status || 'Pending',
      });
    } else {
      setFormData({
        subject: '',
        title: '',
        description: '',
        date: getTodayDateString(),
        priority: 'Medium',
        status: 'Pending',
      });
    }
    setErrors({});
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.subject.trim()) errs.subject = 'Subject is required (e.g., Java)';
    if (!formData.title.trim()) errs.title = 'Title is required (e.g., Practice Arrays)';
    if (!formData.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave({
        subject: formData.subject.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        priority: formData.priority,
        status: formData.status,
      });
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <div>
              <h2>{isEditing ? 'Edit Study Task' : 'Create Study Task'}</h2>
              <p className="modal-subtitle">Will be saved to MongoDB: <code>smartstudy &gt; tasks</code></p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Subject Field & Quick Suggestions */}
          <div className="form-group">
            <label htmlFor="subject-input">
              Subject <span className="required-star">*</span>
            </label>
            <input
              id="subject-input"
              type="text"
              placeholder="e.g. Java, Python, React, DSA"
              value={formData.subject}
              onChange={(e) => {
                setFormData({ ...formData, subject: e.target.value });
                if (errors.subject) setErrors({ ...errors, subject: null });
              }}
              className={errors.subject ? 'input-error' : ''}
            />
            {errors.subject && <span className="field-error">{errors.subject}</span>}

            {/* Quick subject suggestion pills */}
            <div className="quick-suggestions">
              <span>Quick pick:</span>
              {COMMON_SUBJECTS.slice(0, 6).map((sub) => (
                <button
                  type="button"
                  key={sub}
                  className={`pill-suggestion ${formData.subject === sub ? 'active' : ''}`}
                  onClick={() => {
                    setFormData({ ...formData, subject: sub });
                    if (errors.subject) setErrors({ ...errors, subject: null });
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title-input">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="title-input"
              type="text"
              placeholder="e.g. Practice Arrays"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description-input">Description / Notes</label>
            <textarea
              id="description-input"
              rows="3"
              placeholder="e.g. Solve 5 array problems from LeetCode or course notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Date, Priority, Status Row */}
          <div className="form-row">
            {/* Target Date */}
            <div className="form-group col">
              <label htmlFor="date-input">
                Target Date <span className="required-star">*</span>
              </label>
              <input
                id="date-input"
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  if (errors.date) setErrors({ ...errors, date: null });
                }}
                className={errors.date ? 'input-error' : ''}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>

            {/* Priority */}
            <div className="form-group col">
              <label htmlFor="priority-select">Priority</label>
              <select
                id="priority-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>

            {/* Status */}
            <div className="form-group col">
              <label htmlFor="status-select">Status</label>
              <select
                id="status-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Pending">⏳ Pending</option>
                <option value="In Progress">⚡ In Progress</option>
                <option value="Completed">✅ Completed</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>Saving...</>
              ) : isEditing ? (
                <>Save Changes</>
              ) : (
                <>Add Task to MongoDB</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
