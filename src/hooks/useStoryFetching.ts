
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
}

export const useStoryFetching = () => {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);


  const fetchStory = async (storyId: string) => {
    if (!storyId) return;

    try {
      console.log('🔄 Fetching story data for:', storyId);
      setLoading(true);

      const { data, error } = await apiCall(allRoutes.stories.get(storyId), 'get');

      if (error) {
        console.error('❌ Error fetching story:', error);

        return;
      }

      if (data) {
        const typedStory: Story = {
          id: data.id,
          title: data.title,
          description: data.description || undefined,
          priority: data.priority as 'low' | 'medium' | 'high' | 'urgent',
          status: data.status as 'to_do' | 'in_progress' | 'qa' | 'done' | 'ready' | 'in_grooming' | 'ready_for_estimate',
          story_points: data.story_points || undefined,
          project_id: data.project_id,
          created_at: data.created_at,
          updated_at: data.updated_at
        };

        setStory(typedStory);
        console.log('✅ Story data fetched successfully:', typedStory);
      }
    } catch (error) {
      console.error('❌ Error in fetchStory:', error);

    } finally {
      setLoading(false);
    }
  };

  return {
    story,
    setStory,
    loading,
    setLoading,
    fetchStory
  };
};
