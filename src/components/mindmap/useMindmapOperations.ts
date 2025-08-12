
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
    // Demo operation - just log instead of saving to Supabase
    console.log('🔄 Demo: Saving mindmap node:', {
      node_id: node.id,
      project_id: projectId,
      title: node.title,
      type: node.type,
      parent_id: parentId || null,
      is_expanded: node.isExpanded,
      has_user_story: node.hasUserStory || false,
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    console.log('✅ Demo: Mindmap node saved successfully');
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

  const deleteMindmapNode = async (nodeId: string) => {
    // Demo operation - just log instead of deleting from Supabase
    console.log('🔄 Demo: Deleting mindmap node:', {
      node_id: nodeId,
      project_id: projectId
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));

    console.log('✅ Demo: Mindmap node deleted successfully');
  };

  const markNodeAsHavingUserStory = async (nodeId: string) => {
    // Demo operation - just log instead of updating in Supabase
    console.log('🔄 Demo: Marking node as having user story:', {
      node_id: nodeId,
      project_id: projectId,
      has_user_story: true
    });

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
