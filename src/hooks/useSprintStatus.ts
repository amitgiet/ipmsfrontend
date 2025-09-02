
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

interface SprintStatus {
  status: 'created' | 'running' | 'completed';
  sprintName: string;
}

export const useSprintStatus = (storyId?: string) => {
  const [sprintStatus, setSprintStatus] = useState<SprintStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSprintStatus = async () => {
      if (!storyId) {
        setLoading(false);
        return;
      }

      try {

        // Check if story is in any sprint
        // const { data: sprintData, error } = await apiCall(allRoutes.sprintBacklog.get(storyId), 'get');
        const demoData = {
          sprints: [{
            status: 'running',
            sprint_name: 'Sprint 1'
          }]
        }

        const error = null;
        if (error) {
          if (error.code === 'PGRST116') {
            // No sprint found - story is not in any sprint 
            setSprintStatus(null);
          } else {
            console.error('❌ Error checking sprint status:', error);
          }
          setLoading(false);
          return;
        }

          if (demoData?.sprints) {
          const sprint = demoData.sprints as { status: string; sprint_name: string };
          setSprintStatus({
            status: sprint.status as 'created' | 'running' | 'completed',
            sprintName: sprint.sprint_name
          }); 
        }
      } catch (error) {
        console.error('❌ Error in fetchSprintStatus:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSprintStatus();
  }, [storyId]);

  const canEditStory = true; // Removed sprint restriction logic
  const isInRunningSprint = sprintStatus?.status === 'running';
  const isInCompletedSprint = sprintStatus?.status === 'completed';

  return {
    sprintStatus,
    loading,
    canEditStory,
    isInRunningSprint,
    isInCompletedSprint
  };
};
