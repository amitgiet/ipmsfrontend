
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '@/services/apiCall';
import { useToast } from '@/hooks/use-toast';
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

export const useSprintManagement = (sprintId?: string) => {
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchSprintData = async () => {
    if (!sprintId) return;

    try {
      setLoading(true);
      console.log('🔄 Fetching sprint data for:', sprintId);

      // Fetch sprint details
      const { data: sprintData, error: sprintError } = await apiCall(allRoutes.sprints.getSprintById(sprintId), 'GET');

      if (sprintError) {
        console.error('❌ Error fetching sprint:', sprintError);
        toast({
          title: "Error",
          description: "Failed to fetch sprint details",
          variant: "destructive",
        });
        return;
      }

      // Type the sprint data properly
      const typedSprint: Sprint = {
        ...sprintData,
        status: sprintData.status as 'created' | 'running' | 'completed'
      };
      setSprint(typedSprint);

      // Fetch stories assigned to this sprint through sprint_backlog
      const { data: sprintBacklogData, error: backlogError } = await apiCall(allRoutes.sprints.getSprintBacklog(sprintId), 'GET');
      

      if (backlogError) {
        console.error('❌ Error fetching sprint stories:', backlogError);
        toast({
          title: "Error",
          description: "Failed to fetch sprint stories",
          variant: "destructive",
        });
        return;
      }

      // Extract and type the stories data properly
      const typedStories: Story[] = (sprintBacklogData || [])
        .filter(item => item.user_stories) // Filter out any null user_stories
        .map(item => {
          const story = item.user_stories as any;
          return {
            ...story,
            priority: story.priority as 'low' | 'medium' | 'high' | 'urgent',
            // Map story status to sprint kanban status - ready stories start as to_do in sprint
            status: story.status === 'ready' ? 'to_do' : story.status as 'to_do' | 'in_progress' | 'qa' | 'done',
            description: story.description || undefined,
            story_points: story.story_points || undefined
          };
        });

      console.log('✅ Fetched sprint data:', { sprint: typedSprint, stories: typedStories });
      setStories(typedStories);
    } catch (error) {
      console.error('❌ Error in fetchSprintData:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sprint data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSprintStatus = async (newStatus: 'running' | 'completed') => {
    if (!sprint) return;

    try {

        const { error } = await apiCall(allRoutes.sprints.update(sprint.id), 'PUT', { status: newStatus });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update sprint status",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setSprint(prev => prev ? { ...prev, status: newStatus } : null);

      toast({
        title: "Success",
        description: `Sprint status updated to ${newStatus}`,
      });

      console.log('✅ Sprint status updated successfully');
    } catch (error) {
      console.error('❌ Error in updateSprintStatus:', error);
      toast({
        title: "Error",
        description: "Failed to update sprint status",
        variant: "destructive",
      });
    }
  };

  const updateStories = (updatedStories: Story[]) => {
    setStories(updatedStories);
  };

  const goBack = () => {
    if (sprint) {
      navigate(`/project/${sprint.project_id}`);
    } else {
      navigate(-1);
    }
  };

  // Calculate target story points (sum of all story points in the sprint)
  const targetStoryPoints = stories.reduce((sum, story) => sum + (story.story_points || 0), 0);
  
  // Calculate completed story points
  const completedStoryPoints = stories
    .filter(story => story.status === 'done')
    .reduce((sum, story) => sum + (story.story_points || 0), 0);

  useEffect(() => {
    fetchSprintData();
  }, [sprintId]);

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
