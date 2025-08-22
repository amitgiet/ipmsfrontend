import { useState } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

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

export const useStoryFetching = () => {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const fetchStory = async (storyId: string, projectId: string) => {
    if (!storyId) return;

    try {
      console.log('🔄 Fetching story...', { storyId, projectId });
      setLoading(true);
      setCurrentStoryId(storyId);
      setCurrentProjectId(projectId);

      const { data, error } = await apiCall(allRoutes.stories.get(storyId, projectId), 'get');

      if (error) {
        console.error('❌ Error fetching story:', error);
        return;
      }

      if (data) {
        console.log('📥 Raw API response:', data);
        const typedStory: Story = {
          id: data.data.id,
          title: data.data.title,
          description: data.data.description || undefined,
          priority: data.data.priority as 'low' | 'medium' | 'high' | 'urgent',
          status: data.data.status as 'to_do' | 'in_progress' | 'qa' | 'done' | 'ready' | 'in_grooming' | 'ready_for_estimate',
          story_points: data.data.story_points || undefined,
          project_id: data.data.project_id,
          created_at: data.data.created_at,
          updated_at: data.data.updated_at,
          media: data.data.media || []
        };
        console.log('✅ Setting story state:', typedStory);
        console.log('📁 Media count:', typedStory.media.length);
        setStory(typedStory);
      }
    } catch (error) {
      console.error('❌ Error in fetchStory:', error);

    } finally {
      setLoading(false);
    }
  };

  // Refetch function to reload the current story data
  const refetch = async () => {
    console.log('🔄 Refetching story data...', { currentStoryId, currentProjectId, storyId: story?.id });
    
    // If we have current IDs, use them
    if (currentStoryId && currentProjectId) {
      console.log('✅ Using stored IDs for refetch');
      await fetchStory(currentStoryId, currentProjectId);
    } 
    // If we have a story object but no stored IDs, use the story's IDs
    else if (story?.id && story?.project_id) {
      console.log('✅ Using story object IDs for refetch');
      await fetchStory(story.id, story.project_id);
    } 
    // If we still don't have IDs, we can't refetch
    else {
      console.error('❌ Cannot refetch: No story ID or project ID available');
    }
  };

  return {
    story,
    setStory,
    loading,
    setLoading,
    fetchStory,
    refetch
  };
};
