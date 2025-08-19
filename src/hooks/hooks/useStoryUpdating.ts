
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Story {
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

export const useStoryUpdating = () => {
  const { toast } = useToast();

  const updateStory = async (story: Story, updates: Partial<Story>, setStory: (story: Story | null) => void) => {
    if (!story) return;

    try {
      console.log('🔄 Updating story:', updates);

      const { error } = await supabase
        .from('user_stories')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', story.id);

      if (error) {
        console.error('❌ Error updating story:', error);
        toast({
          title: "Error",
          description: "Failed to update story",
          variant: "destructive",
        });
        return;
      }

      // Update local state with the updated story object
      const updatedStory = { ...story, ...updates };
      setStory(updatedStory);
      console.log('✅ Story updated successfully');
      
      toast({
        title: "Success",
        description: "Story updated successfully",
      });
    } catch (error) {
      console.error('❌ Error in updateStory:', error);
      toast({
        title: "Error",
        description: "Failed to update story",
        variant: "destructive",
      });
    }
  };

  const updateStoryStatus = async (story: Story, status: Story['status'], setStory: (story: Story | null) => void) => {
    if (!story) return;

    try {
      console.log('🔄 Updating story status to:', status);

      const { error } = await supabase
        .from('user_stories')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', story.id);

      if (error) {
        console.error('❌ Error updating story status:', error);
        toast({
          title: "Error",
          description: "Failed to update story status",
          variant: "destructive",
        });
        return;
      }

      // Update local state with the updated story object
      const updatedStory = { ...story, status };
      setStory(updatedStory);
      console.log('✅ Story status updated successfully');
    } catch (error) {
      console.error('❌ Error in updateStoryStatus:', error);
      toast({
        title: "Error",
        description: "Failed to update story status",
        variant: "destructive",
      });
    }
  };

  return {
    updateStory,
    updateStoryStatus
  };
};
