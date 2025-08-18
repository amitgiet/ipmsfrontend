import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
  updateStoryStatus: (status: UserStory['status']) => Promise<void>,
  loadComments: () => Promise<void>
) => {
  const { toast } = useToast();
  const { user, teamUser } = useAuth();
  const currentUser = user || teamUser;
  const userRole = currentUser?.role || null;

  const addComment = async (newComment: string, setNewComment: (comment: string) => void) => {
    if (!newComment.trim() || !story || !currentUser) return;

    const authorName = `${currentUser.name} (${userRole?.replace('_', ' ').toUpperCase()})`;

    try {
        const { error } = await apiCall(allRoutes.comments.store, 'post', {
        story_id: story.id,
        content: newComment.trim(),
        author_name: authorName
      });
      if (error) {
        throw error;
      }

      await updateStoryStatus('in_grooming');

      setNewComment('');
      loadComments();
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  return {
    addComment
  };
};
