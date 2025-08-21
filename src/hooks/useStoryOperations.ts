
import { useStoryUpdates } from '@/hooks/useStoryUpdates';
import { useStoryDocuments } from '@/hooks/useStoryDocuments';
import { useStoryComments } from '@/hooks/useStoryComments';
import { useStoryStatusActions } from '@/hooks/useStoryStatusActions';

interface UserStory {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate';
  storyPoints?: number;
  projectId: string;
}

export const useStoryOperations = (
  story: UserStory | null,
  updateStoryStatus: (status: UserStory['status']) => Promise<void>,
  loadDocuments: () => Promise<void>,
  loadComments: () => Promise<void>,
) => {
  const { updateDescription, updateStoryPoints } = useStoryUpdates(story, updateStoryStatus);
  const { uploading, handleFileUpload, downloadDocument } = useStoryDocuments(story, updateStoryStatus, loadDocuments);
  const { addComment } = useStoryComments(story, loadComments);
  const { markAsReady, markReadyForEstimate } = useStoryStatusActions(story, updateStoryStatus);

  return {
    uploading,
    updateDescription,
    handleFileUpload,
    downloadDocument,
    addComment,
    markAsReady,
    markReadyForEstimate,
    updateStoryPoints
  };
};
