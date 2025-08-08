import { apiCall } from './apiCall';
import { allRoutes } from './routes';

export const taskService = {
  // Get all tasks
  getTasks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${allRoutes.tasks.list}?${queryString}` : allRoutes.tasks.list;
    return await apiCall(url, 'get');
  },

  // Get single task
  getTask: async (id) => {
    return await apiCall(allRoutes.tasks.get(id), 'get');
  },

  // Create new task
  createTask: async (taskData) => {
    return await apiCall(allRoutes.tasks.create, 'post', taskData);
  },

  // Update task
  updateTask: async (id, taskData) => {
    return await apiCall(allRoutes.tasks.update(id), 'put', taskData);
  },

  // Delete task
  deleteTask: async (id) => {
    return await apiCall(allRoutes.tasks.delete(id), 'delete');
  },

  // Assign task to user
  assignTask: async (id, userId) => {
    return await apiCall(allRoutes.tasks.assign(id), 'post', { userId });
  },

  // Update task status
  updateTaskStatus: async (id, status) => {
    return await apiCall(allRoutes.tasks.updateStatus(id), 'patch', { status });
  }
}; 