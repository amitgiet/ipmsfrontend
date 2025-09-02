import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

export const isProjectInProgress = async (projectId: string): Promise<boolean> => {
  try { 

    const { data: project, error } = await apiCall(allRoutes.projects.getById(projectId), 'get');
    if (error) {
      console.error('❌ Error fetching project status:', error);
      return false;
    }

    if (!project) {
      console.warn('⚠️ No project found with ID:', projectId);
      return false;
    }

    const inProgress = project?.project_status === 'in-progress'; 
    
    return inProgress;
  } catch (error) {
    console.error('❌ Error in isProjectInProgress:', error);
    return false;
  }
};

export const getProjectStatus = async (projectId: string): Promise<string> => {
  try {

    if (!projectId) { 
      return 'unknown';
    }

    const { data: project, error } = await apiCall(allRoutes.projects.getById(projectId), 'get');

    if (error) {
      console.error('❌ Error fetching project status:', error);
      return 'unknown';
    }

    if (!project) {
      console.warn('⚠️ No project found with ID:', projectId);
      return 'not-found';
    }

    return project.data.status;
  } catch (error) {
    console.error('❌ Error in getProjectStatus:', error);
    return 'unknown';
  }
};
