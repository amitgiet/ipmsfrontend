
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserStory {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate';
  storyPoints?: number;
  projectId: string;
}

export const useStoryStatusActions = (
  story: UserStory | null,
  updateStoryStatus: (status: UserStory['status']) => Promise<void>
) => {
  const { toast } = useToast();

  const markAsReady = async () => {
    if (!story) return;

    try {
      const { error } = await supabase
        .from('user_stories')
        .update({ 
          status: 'ready',
          updated_at: new Date().toISOString()
        })
        .eq('id', story.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to mark story as ready",
          variant: "destructive",
        });
        return;
      }

      await updateStoryStatus('ready');
      
      toast({
        title: "Success",
        description: "Story marked as ready",
      });
    } catch (error) {
      console.error('Error marking story as ready:', error);
      toast({
        title: "Error",
        description: "Failed to mark story as ready",
        variant: "destructive",
      });
    }
  };

  const markReadyForEstimate = async () => {
    if (!story) return;

    try {
      const { error } = await supabase
        .from('user_stories')
        .update({ 
          status: 'ready_for_estimate',
          updated_at: new Date().toISOString()
        })
        .eq('id', story.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to mark story as ready for estimate",
          variant: "destructive",
        });
        return;
      }

      await updateStoryStatus('ready_for_estimate');
      
      toast({
        title: "Success",
        description: "Story marked as ready for estimate",
      });
    } catch (error) {
      console.error('Error marking story as ready for estimate:', error);
      toast({
        title: "Error",
        description: "Failed to mark story as ready for estimate",
        variant: "destructive",
      });
    }
  };

  return {
    markAsReady,
    markReadyForEstimate
  };
};
