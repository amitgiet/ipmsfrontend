import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

export const areAllTasksCompleted = async (storyId: string): Promise<boolean> => {
  try {
    const { data: tasks, error } = await apiCall(allRoutes.tasks.get(storyId), 'GET');

    if (error) {
      return false;
    }

    if (!tasks || tasks.length === 0) {
      return true; // If no tasks exist, allow QA transition
    }

    const incompleteTasks = tasks.filter(task => task.status !== 'completed');
    const allCompleted = incompleteTasks.length === 0;

    
    return allCompleted;
  } catch (error) {
    return false;
  }
};
