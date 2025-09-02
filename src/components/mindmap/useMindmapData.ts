import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
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
  const [nodes, setNodes] = useState<MindmapNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to normalize and add missing props
  const normalizeMindmapData = (data: any[]) => {
    const map: Record<number, any> = {};
    const roots: any[] = [];
  
    // First pass: create all nodes
    data.forEach(item => {
      map[item.id] = {
        id: item.id,
        title: item.title,
        type: item.parent_id ? "child" : "user", // Change "child" to "epic"/"feature" if needed
        children: [],
        isExpanded: true,
        hasUserStory: Boolean(item.has_user_story)
      };
    });
  
    // Second pass: assign children to parents
    data.forEach(item => {
      if (item.parent_id) {
        map[item.parent_id]?.children.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });
  
    return roots;
  };

  const loadMindmapData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall(allRoutes.mindmap.get(projectId), 'get');

      if (response?.data?.data) {
        const transformedData = normalizeMindmapData(response.data.data); 
        setNodes(transformedData);
      } else {
        setNodes([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load mindmap');
      setNodes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMindmapData();
  }, [projectId]);

  return {
    nodes,
    setNodes,
    loading,
    error,
    loadMindmapData
  };
};
