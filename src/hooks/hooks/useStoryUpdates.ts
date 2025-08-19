
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

export const useStoryUpdates = (
  story: UserStory | null,
  updateStoryStatus: (status: UserStory['status']) => Promise<void>
) => {
  const { toast } = useToast();

  const updateDescription = async (description: string, setStory: (story: UserStory | null) => void) => {
    if (!story) return;

    const trimmedDescription = description.trim();
    
    // Don't update if description is empty or hasn't changed
    if (!trimmedDescription || trimmedDescription === story.description) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_stories')
        .update({ 
          description: trimmedDescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', story.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update description",
          variant: "destructive",
        });
        return;
      }

      setStory({ ...story, description: trimmedDescription });
      
      await updateStoryStatus('in_grooming');
      
      toast({
        title: "Success",
        description: "Description updated successfully",
      });
    } catch (error) {
      console.error('Error updating description:', error);
      toast({
        title: "Error",
        description: "Failed to update description",
        variant: "destructive",
      });
    }
  };

  const updateStoryPoints = async (storyPoints: number, setStory: (story: UserStory | null) => void) => {
    if (!story) return;

    try {
      console.log('🔄 Updating story points in database:', storyPoints);
      
      const { error } = await supabase
        .from('user_stories')
        .update({ 
          story_points: storyPoints,
          updated_at: new Date().toISOString()
        })
        .eq('id', story.id);

      if (error) {
        console.error('❌ Error updating story points:', error);
        toast({
          title: "Error",
          description: "Failed to update story points",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Story points updated in database successfully');
      
      // Don't call setStory here since it's already been updated in the parent component
      // setStory({ ...story, storyPoints });
      
      // Don't change status when updating story points - removed this line:
      // await updateStoryStatus('in_grooming');
      
      toast({
        title: "Success",
        description: "Story points updated successfully",
      });
    } catch (error) {
      console.error('Error updating story points:', error);
      toast({
        title: "Error",
        description: "Failed to update story points",
        variant: "destructive",
      });
    }
  };

  return {
    updateDescription,
    updateStoryPoints
  };
};
