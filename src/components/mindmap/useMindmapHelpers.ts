
interface MindmapNode {
  id: string;
  title: string;
  type: 'user' | 'epic' | 'feature' | 'task' | 'user_story';
  children: MindmapNode[];
  isExpanded: boolean;
  hasUserStory?: boolean;
}

export const useMindmapHelpers = () => {
  const getNextType = (currentType: string): 'epic' | 'feature' | 'task' => {
    switch (currentType) {
      case 'user': return 'epic';
      case 'epic': return 'feature';
      case 'feature': return 'task';
      default: return 'task';
    }
  };

  const findNodeById = (nodeList: MindmapNode[], id: string): MindmapNode | null => {
    for (const node of nodeList) {
      if (node.id === id) return node;
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
    return null;
  };

  const addNodeToParent = (nodeList: MindmapNode[], parentId: string, newNode: MindmapNode): MindmapNode[] => {
    return nodeList.map(node => {
      if (node.id === parentId) {
        return { ...node, children: [...node.children, newNode], isExpanded: true };
      }
      return { ...node, children: addNodeToParent(node.children, parentId, newNode) };
    });
  };

  const toggleNodeExpansion = (nodeList: MindmapNode[], nodeId: string): MindmapNode[] => {
    return nodeList.map(node => {
      if (node.id === nodeId) {
        return { ...node, isExpanded: !node.isExpanded };
      }
      return { ...node, children: toggleNodeExpansion(node.children, nodeId) };
    });
  };

  const removeNode = (nodeList: MindmapNode[], nodeId: string): MindmapNode[] => {
    return nodeList
      .filter(node => node.id !== nodeId)
      .map(node => ({ ...node, children: removeNode(node.children, nodeId) }));
  };

  const updateNodeTitle = (nodeList: MindmapNode[], nodeId: string, newTitle: string): MindmapNode[] => {
    return nodeList.map(node => {
      if (node.id === nodeId) {
        return { ...node, title: newTitle };
      }
      return { ...node, children: updateNodeTitle(node.children, nodeId, newTitle) };
    });
  };

  const updateNodeUserStoryStatus = (nodeList: MindmapNode[], nodeId: string, hasUserStory: boolean): MindmapNode[] => {
    return nodeList.map(node => {
      if (node.id === nodeId) {
        return { ...node, hasUserStory };
      }
      return { ...node, children: updateNodeUserStoryStatus(node.children, nodeId, hasUserStory) };
    });
  };

  const toSentenceCase = (str: string): string => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return {
    getNextType,
    findNodeById,
    addNodeToParent,
    toggleNodeExpansion,
    removeNode,
    updateNodeTitle,
    updateNodeUserStoryStatus,
    toSentenceCase
  };
};
