import axios from 'axios';

// The Express backend defaults to http://localhost:5000, or cloud URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

export const taskApi = {
  // GET /api/tasks - Retrieve all tasks with optional filters
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
    if (filters.subject && filters.subject !== 'All') params.append('subject', filters.subject);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get(`/tasks${queryString}`);
    return response.data;
  },

  // GET /api/tasks/:id - Retrieve single task
  getTaskById: async (id) => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  // POST /api/tasks - Create new task in local MongoDB smartstudy.tasks
  createTask: async (taskData) => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  // PUT /api/tasks/:id - Update existing task
  updateTask: async (id, taskData) => {
    const response = await apiClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // DELETE /api/tasks/:id - Remove task from smartstudy.tasks
  deleteTask: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },

  // GET /api/health - Check Backend & Local MongoDB connection status
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default apiClient;
