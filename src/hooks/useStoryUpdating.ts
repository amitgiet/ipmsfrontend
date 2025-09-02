import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

interface Story {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_progress' | 'qa' | 'done' | 'ready' | 'in_grooming' | 'ready_for_estimate';
  story_points?: number;
  project_id: string;
  created_at: string;
  updated_at: string;
  media: {
    id: string;
    name: string;
    url: string;
  }[];
}

export const useStoryUpdating = () => {

  const updateStory = async (story: Story, updates: Partial<Story>, setStory: (story: Story | null) => void) => {
    if (!story) return;

    try { 

      const { error } = await apiCall(allRoutes.stories.update(story.id), 'put', {
        ...updates,
        updated_at: new Date().toISOString()
      });
      if (error) {
        console.error('❌ Error updating story:', error);
        toast.error("Failed to update story");
        return;
      }

      // Update local state with the updated story object
      const updatedStory = { ...story, ...updates };
      setStory(updatedStory); 
      
      toast.success("Story updated successfully");  
    } catch (error) {
      console.error('❌ Error in updateStory:', error);
      toast.error("Failed to update story");
    }
  };

  const updateStoryStatus = async (story: Story, status: Story['status'], setStory: (story: Story | null) => void) => {
    if (!story) return;

    try { 

      const { error } = await apiCall(allRoutes.stories.update(story.id), 'put', { 
        status,
        updated_at: new Date().toISOString()
      });
      if (error) {
        console.error('❌ Error updating story status:', error);
        toast.error("Failed to update story status");
        return;
      }

      // Update local state with the updated story object
      const updatedStory = { ...story, status };
      setStory(updatedStory); 
    } catch (error) {
      console.error('❌ Error in updateStoryStatus:', error);
      toast.error("Failed to update story status");
    }
  };

  return {
    updateStory,
    updateStoryStatus
  };
};
