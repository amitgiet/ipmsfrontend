
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateSRSDocument } from '@/utils/srsGenerator';
import { supabase } from '@/integrations/supabase/client';

interface UserStory {
  id: string;
  storyId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate';
  storyPoints?: number;
}

interface DetailedUserStory extends UserStory {
  acceptanceCriteria?: string;
}

export const useSRSDownload = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const downloadSRS = async (projectId: string, projectName: string, userStories: UserStory[]) => {
    setIsGenerating(true);
    
    try {
      console.log('🔄 Generating SRS document...');
      
      // Fetch detailed user stories with acceptance criteria
      const { data: detailedStories, error } = await supabase
        .from('user_stories')
        .select('id, story_id, title, description, acceptance_criteria, priority, status, story_points')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching detailed stories:', error);
        throw error;
      }

      const storiesWithAcceptanceCriteria: DetailedUserStory[] = (detailedStories || []).map(story => ({
        id: story.id,
        storyId: story.story_id,
        title: story.title,
        description: story.description,
        acceptanceCriteria: story.acceptance_criteria,
        priority: story.priority as DetailedUserStory['priority'],
        status: story.status as DetailedUserStory['status'],
        storyPoints: story.story_points,
      }));

      const blob = await generateSRSDocument(storiesWithAcceptanceCriteria, projectName);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${projectName.replace(/[^a-z0-9]/gi, '_')}_SRS.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ SRS document generated and downloaded successfully');
      toast({
        title: "Success",
        description: "SRS document downloaded successfully",
      });
    } catch (error) {
      console.error('❌ Error generating SRS:', error);
      toast({
        title: "Error",
        description: "Failed to generate SRS document",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    downloadSRS,
    isGenerating
  };
};
