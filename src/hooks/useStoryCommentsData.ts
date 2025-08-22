
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
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const loadComments = async (storyId: string, projectId: string) => {
    if (!storyId || !projectId) return;

    try {
      setCurrentStoryId(storyId);
      setCurrentProjectId(projectId);
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

  // Refetch function to reload comments
  const refetchComments = async () => {
    if (currentStoryId && currentProjectId) {
      await loadComments(currentStoryId, currentProjectId);
    }
  };

  return {
    comments,
    setComments,
    loadComments,
    refetchComments
  };
};
