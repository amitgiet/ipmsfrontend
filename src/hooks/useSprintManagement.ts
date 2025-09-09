
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '@/services/apiCall';
import { toast } from 'react-toastify';
import { allRoutes } from '@/services/routes';

interface Sprint {
  id: string;
  project_id: string;
  sprint_name: string;
  start_date: string;
  end_date: string;
  duration: number;
  status: 'created' | 'running' | 'completed';
  created_at: string;
  updated_at: string;
}

interface Story {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_progress' | 'qa' | 'done';
  story_points?: number;
  project_id: string;
  created_at: string;
  updated_at: string;
}

export const useSprintManagement = (sprintId?: string, projectId?: string) => {
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSprintData = async () => {
    if (!sprintId) return;

    try {
      setLoading(true);

      // Fetch sprint details
      const { data: sprintData, error: sprintError } = await apiCall(allRoutes.sprints.getSprintById(sprintId, projectId), 'get');

      if (sprintError) {
        console.error('❌ Error fetching sprint:', sprintError);
        return;
      }

      // Type the sprint data properly
      const typedSprint: Sprint = {
        ...sprintData.data,
        status: sprintData?.data?.status as 'created' | 'running' | 'completed'
      };
      setSprint(typedSprint);
    } catch (error) {
      console.error('❌ Error in fetchSprintData:', error);
      toast.error("Failed to fetch sprint data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    if (!sprintId) return;
    const { data, error } = await apiCall(allRoutes.stories.list(projectId, sprintId, 'for_sprint'), 'get');
    const modifiedStories = data.data.map((story: any) => ({
      ...story,
      status: story.status,
      story_points: story.story_point
    }));
    setStories(modifiedStories);
  };  

  const updateSprintStatus = async (newStatus: 'start' | 'complete') => {
    if (!sprint) return;

    try {
      let data = new FormData();
      data.append('project_id', projectId);
      data.append('sprint_id', sprintId);
      data.append('status', 'ready');

      const { error } = await apiCall(allRoutes.sprints.updateStatus(sprint.id, newStatus), 'post', data);
      if (error) {
        toast.error("Failed to update sprint status");
        return;
      }

      // Update local state
      setSprint(prev => prev ? { ...prev, status: 'running' } : null);

      toast.success(`Sprint status updated to ${newStatus}`);
 
    } catch (error) {
      console.error('❌ Error in updateSprintStatus:', error);
      toast.error("Failed to update sprint status");
    }
  };

  const updateStories = (updatedStories: Story[]) => {
    setStories(updatedStories);
  };

  const goBack = () => {
    if (sprint) {
      navigate(`/project/${projectId}?tab=sprints`);
    } else {
      navigate(-1);
    }
  };

  // Calculate target story points (sum of all story points in the sprint)
  const targetStoryPoints = sprint?.user_story_story_point_sum || 0;

  // Calculate completed story points
  const completedStoryPoints = sprint?.user_stories_completed_story_point_sum || 0;

  useEffect(() => {
    fetchSprintData();
    fetchStories();
  }, [sprintId, projectId]);

  return {
    sprint,
    stories,
    targetStoryPoints,
    completedStoryPoints,
    loading,
    goBack,
    fetchSprintData,
    updateStories,
    updateSprintStatus
  };
};
