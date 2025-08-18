
import { useStoryState } from '@/hooks/useStoryState';
import { useStoryPermissions } from '@/hooks/useStoryPermissions';
import { useStoryActionHandlers } from '@/hooks/useStoryActionHandlers';
import { convertToUserStory } from '@/utils/storyTypeConversion.ts';
import { useStoryDetailsData } from '@/hooks/useStoryDetailsData';
import { useParams } from 'react-router-dom';

export const useStoryGrooming = () => {
  const { storyId } = useParams();
  
  // Use the useStoryDetailsData hook to get the story with acceptance_criteria
  const { story: detailedStory, loading: detailedLoading, refetch } = useStoryDetailsData(storyId);
  
  const {
    story,
    setStory,
    documents,
    comments,
    loading,
    description,
    setDescription,
    newComment,
    setNewComment,
    loadDocuments,
    loadComments,
    updateStoryStatus
  } = useStoryState();

  // Use the detailed story if available, otherwise fall back to the basic story
  const storyToUse = detailedStory || story;
  const loadingToUse = detailedLoading || loading;

  // Safe access to story points - handle both property names
  const storyPoints = storyToUse ? 
    ('story_points' in storyToUse ? storyToUse.story_points : 
     'storyPoints' in storyToUse ? storyToUse.storyPoints : undefined) : undefined;

  // Check if story is ready (locked for editing)
  const isStoryReady = storyToUse?.status === 'ready';
  const isReadyForEstimate = storyToUse?.status === 'ready_for_estimate';

  const {
    userRole,
    canAddComments,
    canEditContent,
    canEditStoryPoints
  } = useStoryPermissions(isStoryReady);

  // Only use story handlers if we have a database story format
  const {
    uploading,
    goBack,
    handleUpdateDescription,
    handleAddComment,
    handleStoryPointsChange,
    handleMarkAsReady,
    handleMarkReadyForEstimate,
    handleFileUpload,
    downloadDocument
  } = useStoryActionHandlers(
    story, // Use the original story from useStoryState which has the correct DatabaseStory format
    setStory,
    updateStoryStatus,
    loadDocuments,
    loadComments,
    description,
    newComment,
    setNewComment
  );

  // Convert story to the format expected by components with real-time updates
  const storyForComponents = convertToUserStory(storyToUse);  

  return {
    story: storyToUse, // Return the detailed story for display
    storyForComponents,
    documents,
    comments,
    loading: loadingToUse,
    description,
    setDescription,
    newComment,
    setNewComment,
    userRole,
    isStoryReady,
    isReadyForEstimate,
    canAddComments,
    canEditContent,
    canEditStoryPoints,
    uploading,
    goBack,
    handleUpdateDescription,
    handleAddComment,
    handleStoryPointsChange,
    handleMarkAsReady,
    handleMarkReadyForEstimate,
    handleFileUpload,
    downloadDocument,
    refetch
  };
};
