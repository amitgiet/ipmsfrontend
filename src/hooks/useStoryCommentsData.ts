
import { useState } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

interface StoryComment {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
}

export const useStoryCommentsData = () => {
  const [comments, setComments] = useState<StoryComment[]>([]);

  const loadComments = async (storyId: string) => {
    if (!storyId) return;

    try {
      const { data, error } = await apiCall(allRoutes.stories.get(storyId), 'get');

      if (error) {
        console.error('❌ Error loading comments:', error);
        return;
      }

      if (data) {
        setComments(data as StoryComment[]);
        console.log('✅ Loaded comments:', data.length);
      }
    } catch (error) {
      console.error('❌ Error loading comments:', error);
    }
  };

  return {
    comments,
    setComments,
    loadComments
  };
};
