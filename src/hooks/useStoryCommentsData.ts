
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

  const loadComments = async (storyId: string, projectId: string) => {
    if (!storyId || !projectId) return;

    try {
      const { data, error } = await apiCall(allRoutes.comments.get(projectId, 'user_story', storyId), 'get');
      
      if (error) {
        console.error('❌ Error loading comments:', error);
        return;
      }

      if (data) {
        setComments(data.data);
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
