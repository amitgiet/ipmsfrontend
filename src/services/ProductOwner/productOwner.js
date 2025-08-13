import { apiCall } from '../apiCall';
import { allRoutes } from '../routes';

export const productOwnerService = {    
  // Get all projects
  getTimeLogs: async (params = {}) => {
    const url = allRoutes.productOwner.time_logs_list;
    return await apiCall(url, 'get');
  },
  addTimeLog: async (data) => {
    const url = allRoutes.productOwner.add_time_log;
    return await apiCall(url, 'post', data);
  },
  getDashboard: async () => {
    const url = allRoutes.productOwner.dashboard;
    return await apiCall(url, 'get');
  },
  getAssignedProjects: async () => {
    const url = allRoutes.productOwner.get_assigned_projects;
    return await apiCall(url, 'get');
  }
}; 