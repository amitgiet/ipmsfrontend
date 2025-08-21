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

export const useStoryUpdates = (
  story: UserStory | null,
  updateStoryStatus: (status: UserStory['status']) => Promise<void>
) => {
  const { projectId, storyId } = useParams();

  const updateDescription = async (description: string, setStory: (story: UserStory | null) => void) => {
    if (!story) return;

    const trimmedDescription = description.trim();

    // Don't update if description is empty or hasn't changed
    if (!trimmedDescription || trimmedDescription === story.description) {
      return;
    }

    try {
      const { error } = await apiCall(allRoutes.stories.update(story.id), 'post', {
        project_id: projectId,
        description: trimmedDescription,
        updated_at: new Date().toISOString(),
        _method: "patch"
      });
      if (error) {
        toast.error("Failed to update description");
        return;
      }

      setStory({ ...story, description: trimmedDescription });

      // await updateStoryStatus('in_grooming');

      toast.success("Description updated successfully");
    } catch (error) {
      console.error('Error updating description:', error);
      toast.error("Failed to update description");
    }
  };

  const updateStoryPoints = async (storyPoints: number, setStory: (story: UserStory | null) => void) => {
    if (!storyId || !projectId) return;

    try {
      const { error } = await apiCall(allRoutes.stories.updateStoryPoints(storyId), 'post', { project_id: projectId, story_point: storyPoints });

      if (error) {
        console.error('❌ Error updating story points:', error);
        toast.error("Failed to update story points");
        return;
      }

      // Don't call setStory here since it's already been updated in the parent component
      setStory({ ...story, storyPoints });

      // Don't change status when updating story points - removed this line:
      // await updateStoryStatus('in_grooming');

      toast.success("Story points updated successfully");
    } catch (error) {
      console.error('Error updating story points:', error);
      toast.error("Failed to update story points");
    }
  };

  return {
    updateDescription,
    updateStoryPoints
  };
};
