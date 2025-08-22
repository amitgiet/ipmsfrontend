
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'to_do' | 'in_progress' | 'completed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  story_id: string;
  user_stories: {
    title: string;
    project_id: string;
    projects: {
      project_name: string;
    };
  };
}

export const useQACreatedTasks = (currentUserEmail: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTasks = async () => {
    try {
      if (!currentUserEmail) {
        setTasks([]);
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching tasks for QA:', currentUserEmail);

      // Fetch tasks that are either created by this user OR assigned to this user
      const { data: tasksData, error: tasksError } = await apiCall(allRoutes.tasks.getTasksByUserEmail(currentUserEmail), 'get');

      if (tasksError)   {
        console.error('❌ Error fetching QA tasks:', tasksError);
        throw tasksError;
      }

      console.log('✅ QA tasks fetched:', tasksData?.length || 0);
      
      // Type assertion to ensure status is properly typed
      const typedTasks = (tasksData || []).map(task => ({
        ...task,
        status: task.status as 'to_do' | 'in_progress' | 'completed'
      }));
      
      setTasks(typedTasks);
    } catch (error) {
      console.error('❌ Error in fetchMyTasks:', error);
        toast.error("Failed to fetch your tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, [currentUserEmail]);

  return {
    tasks,
    loading,
    refetch: fetchMyTasks
  };
};
