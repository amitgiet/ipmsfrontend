import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

interface UserStory {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate';
  storyPoints?: number;
  projectId: string;
}

export const useStoryStatusActions = (
  story: UserStory | null,
  updateStoryStatus: (status: UserStory['status']) => Promise<void>
) => {
  const { projectId, storyId } = useParams();

  const markAsReady = async () => {
    if (!story) return;

    try {
      const { error } = await apiCall(allRoutes.stories.markAsReady(storyId), 'post',{
        project_id: projectId,
        story_points: story.storyPoints
        });
      if (error) {
        toast.error("Failed to mark story as ready");
        return;
      }

      // await updateStoryStatus('ready');

      toast.success("Story marked as ready");
    } catch (error) {
      console.error('Error marking story as ready:', error);
      toast.error("Failed to mark story as ready");
    }
  };

  const markReadyForEstimate = async () => {
    if (!story) return;

    try {
      const { error } = await apiCall(allRoutes.stories.markReadyForEstimate(storyId, projectId), 'post');
      if (error) {
        toast.error("Failed to mark story as ready for estimate");
        return;
      }
      toast.success("Story marked as ready for estimate");
    } catch (error) {
      console.error('Error marking story as ready for estimate:', error);
      toast.error("Failed to mark story as ready for estimate");
    }
  };

  return {
    markAsReady,
    markReadyForEstimate
  };
};
