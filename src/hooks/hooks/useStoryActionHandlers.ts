
import { useNavigate } from 'react-router-dom';
import { useStoryOperations } from '@/hooks/useStoryOperations';
import { convertToUserStory, createStoryUpdateHandler } from '@/utils/storyTypeConversion';

interface UserStory {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate';
  storyPoints?: number;
  projectId: string;
}

interface DatabaseStory {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_progress' | 'qa' | 'done' | 'ready' | 'in_grooming' | 'ready_for_estimate';
  story_points?: number;
  project_id: string;
  created_at: string;
  updated_at: string;
}

export const useStoryActionHandlers = (
  story: DatabaseStory | null,
  setStory: (story: DatabaseStory | null) => void,
  updateStoryStatus: (status: DatabaseStory['status']) => Promise<void>,
  loadDocuments: () => Promise<void>,
  loadComments: () => Promise<void>,
  description: string,
  newComment: string,
  setNewComment: (comment: string) => void
) => {
  const navigate = useNavigate();
  const userStory = convertToUserStory(story);
  const handleStoryUpdate = createStoryUpdateHandler(story, setStory);

  // Create a wrapper for updateStoryStatus to handle type conversion
  const handleUpdateStoryStatus = async (status: UserStory['status']) => {
    console.log('🔄 Debug - handleUpdateStoryStatus called with status:', status);
    await updateStoryStatus(status as typeof story.status);
  };

  const {
    uploading,
    updateDescription,
    handleFileUpload,
    downloadDocument,
    addComment,
    markAsReady,
    markReadyForEstimate,
    updateStoryPoints
  } = useStoryOperations(userStory, handleUpdateStoryStatus, loadDocuments, loadComments);

  const goBack = () => {
    console.log('🔄 Going back to previous page');
    navigate(`/project/${userStory.projectId}`);
  };

  const handleUpdateDescription = () => {
    console.log('🔄 Debug - handleUpdateDescription called with description:', description);
    updateDescription(description, handleStoryUpdate);
  };

  const handleAddComment = () => {
    console.log('🔄 Debug - handleAddComment called with comment:', newComment);
    addComment(newComment, setNewComment);
  };

  const handleStoryPointsChange = (points: number) => {
    console.log('🔄 Debug - handleStoryPointsChange called with points:', points);
    
    // Update local state immediately for instant UI feedback
    if (story) {
      const updatedStory = {
        ...story,
        story_points: points
      };
      setStory(updatedStory);
    }
    
    // Then update the database
    updateStoryPoints(points, handleStoryUpdate);
  };

  const handleMarkAsReady = () => {
    console.log('🔄 Debug - handleMarkAsReady called');
    if (!story?.story_points) {
      console.log('❌ Debug - Cannot mark as ready: no story points');
      return; // This will be handled by the GroomingActions component
    }
    console.log('✅ Debug - Marking story as ready');
    markAsReady();
  };

  const handleMarkReadyForEstimate = () => {
    console.log('🔄 Debug - handleMarkReadyForEstimate called');
    markReadyForEstimate();
  };

  return {
    uploading,
    goBack,
    handleUpdateDescription,
    handleAddComment,
    handleStoryPointsChange,
    handleMarkAsReady,
    handleMarkReadyForEstimate,
    handleFileUpload,
    downloadDocument
  };
};
