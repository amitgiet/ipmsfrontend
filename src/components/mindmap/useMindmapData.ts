import { useState, useEffect } from 'react';

interface MindmapNode {
  id: string;
  title: string;
  type: 'user' | 'epic' | 'feature' | 'task' | 'user_story';
  children: MindmapNode[];
  isExpanded: boolean;
  hasUserStory?: boolean;
}

export const useMindmapData = (projectId: string) => {
  // Demo data - same structure as original
  const [nodes, setNodes] = useState<MindmapNode[]>([
    {
      id: 'user_1',
      title: 'John Smith',
      type: 'user',
      children: [
        {
          id: 'epic_1',
          title: 'User Authentication',
          type: 'epic',
          children: [
            {
              id: 'feature_1',
              title: 'Login System',
              type: 'feature',
              children: [
                {
                  id: 'task_1',
                  title: 'Implement OAuth',
                  type: 'task',
                  children: [],
                  isExpanded: true,
                  hasUserStory: false,
                }
              ],
              isExpanded: true,
              hasUserStory: false,
            }
          ],
          isExpanded: true,
          hasUserStory: false,
        }
      ],
      isExpanded: true,
      hasUserStory: false,
    },
    {
      id: 'user_2',
      title: 'Sarah Johnson',
      type: 'user',
      children: [
        {
          id: 'epic_2',
          title: 'Dashboard Features',
          type: 'epic',
          children: [
            {
              id: 'feature_2',
              title: 'Analytics Widgets',
              type: 'feature',
              children: [],
              isExpanded: true,
              hasUserStory: false,
            }
          ],
          isExpanded: true,
          hasUserStory: false,
        }
      ],
      isExpanded: true,
      hasUserStory: false,
    }
  ]);

  const [loading, setLoading] = useState(false);

  const loadMindmapData = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };

  useEffect(() => {
    loadMindmapData();
  }, [projectId]);

  return {
    nodes,
    setNodes,
    loading,
    loadMindmapData
  };
};
