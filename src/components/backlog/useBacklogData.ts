
import { apiCall } from '@/services/apiCall';
import { useState, useEffect } from 'react';
import { allRoutes } from '@/services/routes';

interface UserStory {
  id: string;
  storyId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate';
  storyPoints?: number;
  projectId: string;
}

export const useBacklogData = (projectId: string) => {
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserStories = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const { data, error } = await apiCall(allRoutes.stories.list(projectId), 'get');  
      if (error) {
        console.error('❌ Error loading user stories:', error);
        return;
      }
      setUserStories(data?.data || []);
    } catch (error) {
      console.error('❌ Error loading user stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserStories();
  }, [projectId]);

  return {
    userStories,
    setUserStories,
    loading,
    loadUserStories
  };
};
