
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useToast } from '@/hooks/use-toast';

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

export const useTeamLeadCreatedTasks = (currentUserEmail: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCreatedTasks = async () => {
    try {
      if (!currentUserEmail) {
        setTasks([]);
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching tasks created by:', currentUserEmail);

        const { data: tasksData, error: tasksError } = await apiCall(allRoutes.tasks.list, 'get');
        


      if (tasksError) {
        console.error('❌ Error fetching created tasks:', tasksError);
        throw tasksError;
      }

      console.log('✅ Created tasks fetched:', tasksData?.length || 0);
      
      // Type assertion to ensure status is properly typed
      const typedTasks = (tasksData || []).map(task => ({
        ...task,
        status: task.status as 'to_do' | 'in_progress' | 'completed'
      }));
      
      setTasks(typedTasks);
    } catch (error) {
      console.error('❌ Error in fetchCreatedTasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your tasks",
        variant: "destructive",
      });
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
