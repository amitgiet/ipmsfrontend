
import { useState, useEffect } from 'react';

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
      console.log('🔄 Loading demo user stories for project:', projectId);
      setLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Demo data
      const demoStories: UserStory[] = [
        {
          id: '1',
          storyId: 'US-001',
          title: 'User Authentication System',
          description: 'Implement secure user login and registration with JWT tokens',
          priority: 'high',
          status: 'ready',
          storyPoints: 8,
          projectId: projectId,
        },
        {
          id: '2',
          storyId: 'US-002',
          title: 'Dashboard Analytics',
          description: 'Create comprehensive dashboard with charts and metrics',
          priority: 'medium',
          status: 'in_grooming',
          storyPoints: 13,
          projectId: projectId,
        },
        {
          id: '3',
          storyId: 'US-003',
          title: 'File Upload Feature',
          description: 'Allow users to upload and manage project documents',
          priority: 'low',
          status: 'to_do',
          storyPoints: 5,
          projectId: projectId,
        },
        {
          id: '4',
          storyId: 'US-004',
          title: 'Real-time Notifications',
          description: 'Implement push notifications for project updates',
          priority: 'urgent',
          status: 'ready_for_estimate',
          storyPoints: 10,
          projectId: projectId,
        },
        {
          id: '5',
          storyId: 'US-005',
          title: 'Team Collaboration Tools',
          description: 'Add chat, comments, and task assignment features',
          priority: 'medium',
          status: 'to_do',
          storyPoints: 15,
          projectId: projectId,
        }
      ];

      console.log('✅ Loaded demo user stories:', demoStories.length);
      setUserStories(demoStories);
    } catch (error) {
      console.error('❌ Error loading demo user stories:', error);
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
