import React from 'react';

export default function FilterBar({
  search,
  setSearch,
  selectedSubject,
  setSelectedSubject,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  availableSubjects = [],
  onReset
}) {
  const hasActiveFilters = 
    search.trim() !== '' || 
    selectedSubject !== 'All' || 
    selectedStatus !== 'All' || 
    selectedPriority !== 'All';

  return (
    <div className="filter-bar">
      {/* Search Input */}
      <div className="search-box">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search by title, subject, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="clear-search-btn" onClick={() => setSearch('')} title="Clear search">
            &times;
          </button>
        )}
      </div>

      {/* Dropdown Filters */}
      <div className="filters-group">
        {/* Subject Filter */}
        <div className="filter-item">
          <label>Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="All">All Subjects</option>
            {availableSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-item">
          <label>Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="filter-item">
          <label>Priority</label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button className="btn-reset" onClick={onReset} title="Reset all filters">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
