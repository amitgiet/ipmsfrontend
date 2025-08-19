
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        console.log('🔄 Checking sprint status for story:', storyId);

        // Check if story is in any sprint
        const { data: sprintData, error } = await supabase
          .from('sprint_backlog')
          .select(`
            sprint_id,
            sprints (
              status,
              sprint_name
            )
          `)
          .eq('story_id', storyId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No sprint found - story is not in any sprint
            console.log('✅ Story is not in any sprint');
            setSprintStatus(null);
          } else {
            console.error('❌ Error checking sprint status:', error);
          }
          setLoading(false);
          return;
        }

        if (sprintData?.sprints) {
          const sprint = sprintData.sprints as { status: string; sprint_name: string };
          setSprintStatus({
            status: sprint.status as 'created' | 'running' | 'completed',
            sprintName: sprint.sprint_name
          });
          console.log('✅ Found sprint status:', sprint.status);
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
