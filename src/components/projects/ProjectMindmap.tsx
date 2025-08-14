
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MindmapHeader } from '@/components/mindmap/MindmapHeader';
import { MindmapControls } from '@/components/mindmap/MindmapControls';
import { MindmapContent } from '@/components/mindmap/MindmapContent';
import { MindmapTips } from '@/components/mindmap/MindmapTips';
import { UserStoryDialog } from '@/components/mindmap/UserStoryDialog';
import { AddChildItemDialog } from '@/components/mindmap/AddChildItemDialog';
import { AddEpicDialog } from '@/components/mindmap/AddEpicDialog';
import { useMindmapData } from '@/components/mindmap/useMindmapData';
import { useMindmapOperations } from '@/components/mindmap/useMindmapOperations';
import { useMindmapActions } from '@/components/mindmap/useMindmapActions';
import { useMindmapHelpers } from '@/components/mindmap/useMindmapHelpers';
import { toast } from "react-toastify";
interface MindmapNode {
  id: string;
  title: string;
  type: 'user' | 'epic' | 'feature' | 'task' | 'user_story';
  children: MindmapNode[];
  isExpanded: boolean;
  hasUserStory?: boolean;
}

interface ProjectMindmapProps {
  projectId: string;
  readOnly?: boolean;
}

export const ProjectMindmap = ({ projectId, readOnly = false }: ProjectMindmapProps) => {
  const { nodes, setNodes, loading, loadMindmapData } = useMindmapData(projectId);
  const { saveMindmapNode, updateMindmapNode, deleteMindmapNode, markNodeAsHavingUserStory } = useMindmapOperations(projectId);
  const {
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
  } = useMindmapActions();

  const {
    getNextType,
    findNodeById,
    addNodeToParent,
    toggleNodeExpansion,
    removeNode,
    updateNodeTitle,
    updateNodeUserStoryStatus,
    toSentenceCase
  } = useMindmapHelpers();

  // Fix existing nodes with incorrect casing
  useEffect(() => {
    const fixExistingNodes = async () => {
      for (const node of nodes) {
        if (node.type === 'user') {
          const sentenceCaseTitle = toSentenceCase(node.title);
          if (node.title !== sentenceCaseTitle) {
            try {
              await updateMindmapNode(node.id, { title: sentenceCaseTitle });
              setNodes(prev => updateNodeTitle(prev, node.id, sentenceCaseTitle));
              toast.success(`Updated "${node.title}" to "${sentenceCaseTitle}"`);
            } catch (error) {
              console.error('Failed to fix node title:', error);
            }
          }
        }
      }
    };

    if (nodes.length > 0 && !readOnly) {
      fixExistingNodes();
    }
  }, [nodes, updateMindmapNode, setNodes, toast, readOnly, toSentenceCase]);

  const addUser = async (title: string) => {
    const sentenceCaseTitle = toSentenceCase(title);

    const newNode: MindmapNode = {
      id: `node_${Date.now()}`,
      title: sentenceCaseTitle,
      type: 'user',
      children: [],
      isExpanded: true,
      hasUserStory: false,
    };

    try {
      await saveMindmapNode(newNode);
      setNodes(prev => [...prev, newNode]);
      toast.success("User added successfully");
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error("Failed to add user");
    }
  };

  const addEpicToUsers = async (epicTitle: string, selectedUserIds: string[]) => {
    if (!epicTitle.trim() || selectedUserIds.length === 0) return;

    try {
      for (const userId of selectedUserIds) {
        const newNode: MindmapNode = {
          id: `node_${Date.now()}_${userId}`,
          title: epicTitle,
          type: 'epic',
          children: [],
          isExpanded: true,
          hasUserStory: false,
        };

        await saveMindmapNode(newNode, userId);
        setNodes(prev => addNodeToParent(prev, userId, newNode));
      }

      toast.success(`Epic added to ${selectedUserIds.length} user(s)`);
    } catch (error) {
      console.error('Failed to add epic:', error);
      toast.error("Failed to add epic");
    }
  };

  const addChildItem = async (title: string) => {
    if (!selectedParentNode || readOnly) return;

    const newNode: MindmapNode = {
      id: `node_${Date.now()}`,
      title,
      type: 'task',
      children: [],
      isExpanded: true,
      hasUserStory: false,
    };

    try {
      const response = await saveMindmapNode(newNode, selectedParentNode.id);
      
      const newMindmapNode: MindmapNode = {
        ...response.data.data,
        children: []
      };

      setNodes(prev => addNodeToParent(prev, selectedParentNode.id, newMindmapNode));
      
      toast.success("Item added successfully");
    } catch (error) {
      console.error('Failed to add child item:', error);
      toast.error("Failed to add item");
    }
  };

  const toggleExpand = async (nodeId: string) => {
    const node = findNodeById(nodes, nodeId);
    if (!node) return;

    try {
      await updateMindmapNode(nodeId, { is_expanded: !node.isExpanded });
      setNodes(prev => toggleNodeExpansion(prev, nodeId));
    } catch (error) {
      console.error('Failed to toggle node expansion:', error);
    }
  };

  const deleteNode = async (nodeId: string) => {
    if (readOnly) return;

    try {
      await deleteMindmapNode(nodeId);
      setNodes(prev => removeNode(prev, nodeId));
    } catch (error) {
      console.error('Failed to delete node:', error);
    }
  };

  const handleAddToBacklog = async () => {
    if (!selectedNode || readOnly) return;

    const userStoryText = `As a ${userStoryData.asA} I should be able to ${userStoryData.iShouldBeAbleTo} so that I can ${userStoryData.soThatICan}`;
    
    const userStory = {
      ...selectedNode,
      title: userStoryText,
      type: 'user_story' as const,
      description: userStoryText
    };

    try {
      if (window && (window as any).addStoryToBacklog) {
        const success = await (window as any).addStoryToBacklog(userStory);
        if (success) {
          await markNodeAsHavingUserStory(selectedNode.id);
          setNodes(prev => updateNodeUserStoryStatus(prev, selectedNode.id, true));
          
          setShowUserStoryDialog(false);
          setSelectedNode(null);
          resetUserStoryData();

            toast.success("User story created and added to backlog");
        } else {
          toast.error("Failed to add user story to backlog");
        }
      } else {
        toast.error("Backlog function not available. Please try switching to the backlog tab and back.");
      }
    } catch (error) {
      toast.error("Failed to add user story to backlog");
    }
  };

  const userNodes = nodes.filter(node => node.type === 'user');
  const hasUsers = userNodes.length > 0;

  if (loading) {
    return (
      <Card>
        <MindmapHeader readOnly={readOnly} />
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <MindmapHeader readOnly={readOnly} />
        <CardContent>
          <div className="space-y-4">
            <MindmapControls
              onAddUser={addUser}
              onShowAddEpicDialog={() => setShowAddEpicDialog(true)}
              hasUsers={hasUsers}
              readOnly={readOnly}
            />

            <MindmapContent
              nodes={nodes}
              onToggleExpand={toggleExpand}
              onSetSelectedParent={(nodeId) => handleSetSelectedParent(nodeId, nodes)}
              onOpenUserStoryDialog={handleOpenUserStoryDialog}
              onDeleteNode={deleteNode}
              readOnly={readOnly}
            />

            <MindmapTips readOnly={readOnly} />
          </div>
        </CardContent>
      </Card>

      {!readOnly && (
        <>
          <AddChildItemDialog
            open={showAddChildDialog}
            onOpenChange={setShowAddChildDialog}
            parentNode={selectedParentNode}
            onAddChild={addChildItem}
          />

          <AddEpicDialog
            open={showAddEpicDialog}
            onOpenChange={setShowAddEpicDialog}
            users={userNodes}
            onAddEpic={addEpicToUsers}
          />

          <UserStoryDialog
            open={showUserStoryDialog}
            onOpenChange={setShowUserStoryDialog}
            selectedNode={selectedNode}
            userStoryData={userStoryData}
            onUserStoryDataChange={setUserStoryData}
            onAddToBacklog={handleAddToBacklog}
          />
        </>
      )}
    </>
  );
};
