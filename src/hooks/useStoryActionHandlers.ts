
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
  setNewComment: (comment: string) => void,
) => {
  const navigate = useNavigate();
  const userStory = convertToUserStory(story);
  const handleStoryUpdate = createStoryUpdateHandler(story, setStory);

  // Create a wrapper for updateStoryStatus to handle type conversion
  const handleUpdateStoryStatus = async (status: UserStory['status']) => {
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
    navigate(-1);
  };

  const handleUpdateDescription = () => {
    updateDescription(description, handleStoryUpdate);
  };

  const handleAddComment = () => {
    addComment(newComment, setNewComment);
  };

  const handleStoryPointsChange = (points: number) => {
    
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
    if (!story?.story_points) {
      return; // This will be handled by the GroomingActions component
    }
    markAsReady();
  };

  const handleMarkReadyForEstimate = () => {
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
    downloadDocument, 
  };
};
