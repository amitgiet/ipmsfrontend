import { apiCall } from './apiCall';
import { allRoutes } from './routes';

export const skillsService = {
  // Get all skills
  getSkills: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${allRoutes.skills.list}?${queryString}` : allRoutes.skills.list;
    return await apiCall(url, 'get');
  },

  // Get single skill
  getSkill: async (id) => {
    return await apiCall(allRoutes.skills.get(id), 'get');
  },

  // Create new skill
  createSkill: async (skillData) => {
    return await apiCall(allRoutes.skills.create, 'post', skillData);
  },

  // Update skill
  updateSkill: async (id, skillData) => {
    return await apiCall(allRoutes.skills.update(id), 'put', skillData);
  },

  // Delete skill
  deleteSkill: async (id) => {
    return await apiCall(allRoutes.skills.delete(id), 'delete');
  }
};
