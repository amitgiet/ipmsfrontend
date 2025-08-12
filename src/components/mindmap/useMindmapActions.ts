
import { useState } from 'react';
import { toast as reactToastifyToast } from 'react-toastify';

interface MindmapNode {
  id: string;
  title: string;
  type: 'user' | 'epic' | 'feature' | 'task' | 'user_story';
  children: MindmapNode[];
  isExpanded: boolean;
  hasUserStory?: boolean;
}

interface UserStoryData {
  asA: string;
  iShouldBeAbleTo: string;
  soThatICan: string;
}

export const useMindmapActions = () => {
  const [showAddChildDialog, setShowAddChildDialog] = useState(false);
  const [showAddEpicDialog, setShowAddEpicDialog] = useState(false);
  const [selectedParentNode, setSelectedParentNode] = useState<MindmapNode | null>(null);
  const [showUserStoryDialog, setShowUserStoryDialog] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MindmapNode | null>(null);
  const [userStoryData, setUserStoryData] = useState<UserStoryData>({
    asA: '',
    iShouldBeAbleTo: '',
    soThatICan: ''
  });

  // React-toastify toast function
  const toast = ({ title, description, variant = 'default' }: { title: string; description: string; variant?: string }) => {
    const message = `${title}: ${description}`;
    
    switch (variant) {
      case 'destructive':
        reactToastifyToast.error(message);
        break;
      case 'success':
        reactToastifyToast.success(message);
        break;
      case 'warning':
        reactToastifyToast.warning(message);
        break;
      default:
        reactToastifyToast.info(message);
        break;
    }
  };

  const resetUserStoryData = () => {
    setUserStoryData({
      asA: '',
      iShouldBeAbleTo: '',
      soThatICan: ''
    });
  };

  const handleSetSelectedParent = (nodeId: string, nodes: MindmapNode[]) => {
    const findNodeById = (nodeList: MindmapNode[], id: string): MindmapNode | null => {
      for (const node of nodeList) {
        if (node.id === id) return node;
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
      return null;
    };

    const node = findNodeById(nodes, nodeId);
    if (node) {
      setSelectedParentNode(node);
      setShowAddChildDialog(true);
    }
  };

  const handleOpenUserStoryDialog = (node: MindmapNode) => {
    setSelectedNode(node);
    resetUserStoryData();
    setShowUserStoryDialog(true);
  };

  return {
    showAddChildDialog,
    setShowAddChildDialog,
    showAddEpicDialog,
    setShowAddEpicDialog,
    selectedParentNode,
    showUserStoryDialog,
    setShowUserStoryDialog,
    selectedNode,
    setSelectedNode,
    userStoryData,
    setUserStoryData,
    resetUserStoryData,
    handleSetSelectedParent,
    handleOpenUserStoryDialog,
    toast
  };
};
