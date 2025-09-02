
import { useStoryState } from '@/hooks/useStoryState';
import { useStoryPermissions } from '@/hooks/useStoryPermissions';
import { useStoryActionHandlers } from '@/hooks/useStoryActionHandlers';
import { convertToUserStory } from '@/utils/storyTypeConversion';
import { useStoryDetailsData } from '@/hooks/useStoryDetailsData';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export const useStoryGrooming = () => {
  const { storyId, projectId } = useParams();
  
  // Use the useStoryDetailsData hook to get the story with acceptance_criteria
  const { story1, loading: detailedLoading, refetch: refetchDetailedStory } = useStoryDetailsData(storyId, projectId);
  
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
    updateStoryStatus,
    refetch: refetchStory
  } = useStoryState();

  // Use the detailed story if available, otherwise fall back to the basic story
  const storyToUse = story1 || story; // Prioritize story1 (detailed story)
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
    storyToUse as any, // Use the original story from useStoryState which has the correct DatabaseStory format
    setStory as any, // Type assertion to resolve compatibility issue
    updateStoryStatus,
    loadDocuments,
    loadComments,
    description,
    newComment,
    setNewComment, 
  );

  // Convert story to the format expected by components with real-time updates
  const storyForComponents = convertToUserStory(storyToUse as any);  

  // Enhanced refetch function that updates both story sources
  const handleRefetch = async () => {
    try {
      // Refetch both story sources
      await Promise.all([
        refetchStory(),
        refetchDetailedStory()
      ]);
    } catch (error) {
      console.error('❌ Error in useStoryGrooming refetch:', error);
    }
  };

  return {
    story: storyToUse, // Return the story that the UI is actually displaying
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
    refetch: handleRefetch, // Use our enhanced refetch function
    setStory
  };
};
