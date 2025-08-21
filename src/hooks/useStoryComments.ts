import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'react-router-dom';

interface UserStory {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate';
  storyPoints?: number;
  projectId: string;
}

export const useStoryComments = (
  story: UserStory | null,
  loadComments: () => Promise<void>
) => {
  const {storyId, projectId} = useParams();
  const { user, teamUser } = useAuth();
  const currentUser = user || teamUser;

  const addComment = async (newComment: string, setNewComment: (comment: string) => void) => {
    if (!newComment.trim() || !story || !currentUser) return;

    try {
        const { error } = await apiCall(allRoutes.comments.store, 'post', {
          user_story_id: storyId,
          type: 'user_story',
          content: newComment.trim(),
          project_id: projectId
      });
      if (error) {
        throw error;
      }

      setNewComment('');
      loadComments();
      toast.success("Comment added successfully");
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error("Failed to add comment");
    }
  };

  return {
    addComment
  };
};
