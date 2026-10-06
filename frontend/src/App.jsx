import { useState, useEffect, useCallback, useMemo } from 'react';
import { taskApi } from './api/taskApi';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import CompassGuideModal from './components/CompassGuideModal';
import Toast from './components/Toast';
import './App.css';

function App() {
  // Task State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState({ status: 'checking', database: 'smartstudy', collection: 'tasks' });

  // Filter & Search State
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Modals & Feedback State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Check Backend & MongoDB status
  const checkConnection = useCallback(async () => {
    try {
      const health = await taskApi.checkHealth();
      setDbStatus(health);
    } catch {
      setDbStatus({ status: 'offline', database: 'smartstudy', collection: 'tasks' });
    }
  }, []);

  // Fetch tasks from local Express API
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await taskApi.getTasks();
      if (res && res.data) {
        setTasks(res.data);
      }
      checkConnection();
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showToast('Could not connect to Express backend at http://localhost:5000', 'error');
      setDbStatus({ status: 'offline', database: 'smartstudy', collection: 'tasks' });
    } finally {
      setLoading(false);
    }
  }, [checkConnection]);

  // Initial load
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(checkConnection, 10000); // Check DB status every 10s
    return () => clearInterval(interval);
  }, [fetchTasks, checkConnection]);

  // Dynamically compute unique subjects for filter dropdown
  const availableSubjects = useMemo(() => {
    const subjectsSet = new Set(['Java', 'Python', 'React', 'Node.js']);
    tasks.forEach((t) => {
      if (t.subject) subjectsSet.add(t.subject.trim());
    });
    return Array.from(subjectsSet).sort();
  }, [tasks]);

  // Filter tasks locally based on search and dropdown selections
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        t.title?.toLowerCase().includes(searchLower) ||
        t.subject?.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower);

      // Subject
      const matchesSubject = selectedSubject === 'All' || t.subject?.toLowerCase() === selectedSubject.toLowerCase();

      // Status
      const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;

      // Priority
      const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;

      return matchesSearch && matchesSubject && matchesStatus && matchesPriority;
    });
  }, [tasks, search, selectedSubject, selectedStatus, selectedPriority]);

  // Handle Create or Update task
  const handleSaveTask = async (taskData) => {
    try {
      if (taskToEdit) {
        // Update existing task (PUT /api/tasks/:id)
        const res = await taskApi.updateTask(taskToEdit._id, taskData);
        setTasks((prev) => prev.map((t) => (t._id === taskToEdit._id ? res.data : t)));
        showToast(`Task "${taskData.title}" updated in MongoDB Compass (smartstudy > tasks)!`, 'success');
      } else {
        // Create new task (POST /api/tasks)
        const res = await taskApi.createTask(taskData);
        setTasks((prev) => [res.data, ...prev]);
        showToast(`Task "${taskData.title}" saved to MongoDB: smartstudy > tasks!`, 'success');
      }
      setIsTaskModalOpen(false);
      setTaskToEdit(null);
      checkConnection();
    } catch (err) {
      console.error('Error saving task:', err);
      const errMsg = err.response?.data?.message || 'Failed to save task. Ensure MongoDB service is running.';
      showToast(errMsg, 'error');
      throw err;
    }
  };

  // Quick Status change directly from Task Card
  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    try {
      const updated = { ...task, status: newStatus };
      const res = await taskApi.updateTask(taskId, updated);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
      showToast(`Status updated to "${newStatus}" for "${task.title}"`, 'success');
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Failed to update status in MongoDB', 'error');
    }
  };

  // Handle Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await taskApi.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      showToast('Task removed from MongoDB Compass (smartstudy > tasks)', 'success');
    } catch (err) {
      console.error('Error deleting task:', err);
      showToast('Failed to delete task from MongoDB', 'error');
    }
  };

  // Modal Triggers
  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedSubject('All');
    setSelectedStatus('All');
    setSelectedPriority('All');
  };

  return (
    <div className="app-wrapper">
      {/* Sticky Modern Navbar */}
      <Navbar
        onAddTask={openCreateModal}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        dbStatus={dbStatus}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Statistics Dashboard */}
        <StatsBar tasks={tasks} />

        {/* Filter and Search Bar */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          availableSubjects={availableSubjects}
          onReset={handleResetFilters}
        />

        {/* Task Grid Header */}
        <div className="section-header">
          <div className="section-title">
            <span>Study Tasks</span>
            <span className="badge-count">{filteredTasks.length} of {tasks.length}</span>
          </div>

          <button className="btn-secondary" onClick={fetchTasks} title="Refresh tasks from MongoDB">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            <span>Sync</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Connecting to Local MongoDB (smartstudy.tasks)...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          /* Task Grid */
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="empty-title">
              {tasks.length === 0 ? 'No study tasks found in MongoDB' : 'No matching tasks found'}
            </h3>
            <p className="empty-subtitle">
              {tasks.length === 0
                ? 'Your local MongoDB "smartstudy.tasks" collection is currently empty. Click below to add your first study task!'
                : 'Try adjusting your search query, subject filter, status, or priority filter.'}
            </p>
            {tasks.length === 0 ? (
              <button className="btn-primary" onClick={openCreateModal}>
                + Add First Task
              </button>
            ) : (
              <button className="btn-secondary" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Create / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        task={taskToDelete}
      />

      {/* MongoDB Compass & Windows Service Guide Modal */}
      <CompassGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        dbStatus={dbStatus}
      />

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
