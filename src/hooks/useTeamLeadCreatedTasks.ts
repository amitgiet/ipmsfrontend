
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';


export const useTeamLeadCreatedTasks = (currentUserEmail: string) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCreatedTasks = async () => {
    try {
      if (!currentUserEmail) {
        setTasks([]);
        setLoading(false);
        return;
      }

      const { data: tasksData, error: tasksError } = await apiCall(allRoutes.tasks.list(null, null, true), 'get');

      if (tasksError) {
        console.error('❌ Error fetching created tasks:', tasksError);
        throw tasksError;
      }

      const typedTasks = (tasksData?.data || []).map(task => ({
        ...task,
        status: task.status as 'to_do' | 'in_progress' | 'completed'
      }));

      setTasks(typedTasks);
    } catch (error) {
      console.error('❌ Error in fetchCreatedTasks:', error);
      toast.error("Failed to fetch your tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatedTasks();
  }, [currentUserEmail]);

  return {
    tasks,
    loading,
    refetch: fetchCreatedTasks
  };
};
