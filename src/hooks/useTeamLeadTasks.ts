
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useToast } from '@/hooks/use-toast';

export const useTeamLeadTasks = (projectIds: string[], userEmail?: string) => {
  const [runningTasks, setRunningTasks] = useState<number>(0);
  const [assignedTasks, setAssignedTasks] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      if (projectIds.length === 0 || !userEmail) {
        setRunningTasks(0);
        setAssignedTasks(0);
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching tasks assigned to:', userEmail, 'for projects:', projectIds);

      // Get all user stories for these projects
      const { data: storiesData, error: storiesError } = await apiCall(allRoutes.stories.list, 'get');

      if (storiesError) {
        console.error('❌ Error fetching stories:', storiesError);
        throw storiesError;
      }

      if (!storiesData || storiesData.length === 0) {
        setRunningTasks(0);
        setAssignedTasks(0);
        setLoading(false);
        return;
      }

      const storyIds = storiesData.map(story => story.id);

      // Get all tasks assigned to the current user
      const { data: allTasksData, error: allTasksError } = await apiCall(allRoutes.tasks.list, 'get');

      if (allTasksError) {
        console.error('❌ Error fetching assigned tasks:', allTasksError);
        throw allTasksError;
      }

      // Get tasks that are in progress and assigned to the current user
        const { data: runningTasksData, error: runningTasksError } = await apiCall(allRoutes.tasks.list, 'get');

      if (runningTasksError) {
        console.error('❌ Error fetching running tasks:', runningTasksError);
        throw runningTasksError;
      }

      const totalTasks = allTasksData?.length || 0;
      const runningTasksCount = runningTasksData?.length || 0;

      console.log('✅ Tasks assigned to', userEmail, '- Total:', totalTasks, 'Running:', runningTasksCount);
      setAssignedTasks(totalTasks);
      setRunningTasks(runningTasksCount);
    } catch (error) {
      console.error('❌ Error in fetchTasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectIds.join(','), userEmail]);

  return {
    runningTasks,
    assignedTasks,
    loading,
    refetch: fetchTasks
  };
};
