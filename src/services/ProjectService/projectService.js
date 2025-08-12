import { apiCall } from '../apiCall';
import { allRoutes } from '../routes';

export const projectService = {
  // Get all projects
  getProjects: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${allRoutes.projects.list}?${queryString}` : allRoutes.projects.list;
    return await apiCall(url, 'get');
  },

  // Get single project
  getProject: async (id) => {
    return await apiCall(allRoutes.projects.get(id), 'get');
  },

  // Create new project
  createProject: async (projectData) => {
    return await apiCall(allRoutes.projects.create, 'post', projectData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Update project
  updateProject: async (id, projectData) => {
    return await apiCall(allRoutes.projects.update(id), 'post', projectData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Delete project
  deleteProject: async (id) => {
    return await apiCall(allRoutes.projects.delete(id), 'delete');
  },

  // Get project stats
  getProjectStats: async () => {
    return await apiCall(allRoutes.projects.stats, 'get');
  },

  // Get recent activity
  getRecentActivity: async () => {
    return await apiCall(allRoutes.projects.recentActivity, 'get');
  }
}; 