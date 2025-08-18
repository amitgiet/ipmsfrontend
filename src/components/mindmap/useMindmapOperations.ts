import { apiCall } from "@/services/apiCall";
import { allRoutes } from "@/services/routes";

interface MindmapNode {
  id: string;
  title: string;
  type: 'user' | 'epic' | 'feature' | 'task' | 'user_story';
  children: MindmapNode[];
  isExpanded: boolean;
  hasUserStory?: boolean;
}

export const useMindmapOperations = (projectId: string) => {
  const saveMindmapNode = async (node: MindmapNode, parentId?: string) => {
    const payload = {
      ...node,
      project_id: projectId,
      parent_id: parentId
    }
    const response = await apiCall(allRoutes.mindmap.store, 'post', payload);
    return response;
  };

  const updateMindmapNode = async (nodeId: string, updates: Partial<{ title: string; is_expanded: boolean; has_user_story: boolean }>) => {
    // Demo operation - just log instead of updating in Supabase
    console.log('🔄 Demo: Updating mindmap node:', {
      node_id: nodeId,
      project_id: projectId,
      updates
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));

    console.log('✅ Demo: Mindmap node updated successfully');
  };

  const deleteMindmapNode = async (nodeId: string, projectId: string) => {
    const response = await apiCall(allRoutes.mindmap.delete(nodeId, projectId), 'delete');
    return response;
  };

  const markNodeAsHavingUserStory = async (nodeId: string) => {

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 150));

    console.log('✅ Demo: Node marked as having user story successfully');
  };

  return {
    saveMindmapNode,
    updateMindmapNode,
    deleteMindmapNode,
    markNodeAsHavingUserStory
  };
};
