
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QAStory {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  story_points?: number;
  project_id: string;
  project_name?: string;
  updated_at: string;
  created_at: string;
}

export const useQAStories = (currentUserEmail: string) => {
  const [stories, setStories] = useState<QAStory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQAStories = async () => {
    try {
      if (!currentUserEmail) {
        setStories([]);
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching QA stories for:', currentUserEmail);

      // First, get the team member data
      const { data: teamMemberData, error: teamMemberError } = await supabase
        .from('team_members')
        .select('id')
        .eq('email', currentUserEmail.toLowerCase())
        .eq('role', 'qa')
        .eq('is_active', true)
        .maybeSingle();

      if (teamMemberError) {
        console.error('❌ Error fetching team member:', teamMemberError);
        throw teamMemberError;
      }

      if (!teamMemberData) {
        console.log('❌ No QA found with email:', currentUserEmail);
        setStories([]);
        setLoading(false);
        return;
      }

      // Get project assignments for this team member
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('project_team_members')
        .select('project_id')
        .eq('team_member_id', teamMemberData.id);

      if (assignmentError) {
        console.error('❌ Error fetching project assignments:', assignmentError);
        throw assignmentError;
      }

      if (!assignmentData || assignmentData.length === 0) {
        console.log('❌ No projects assigned to this QA');
        setStories([]);
        setLoading(false);
        return;
      }

      // Get the project IDs
      const projectIds = assignmentData.map(assignment => assignment.project_id);

      // Fetch stories with status 'qa' in these projects, joined with project info
      const { data: storiesData, error: storiesError } = await supabase
        .from('user_stories')
        .select(`
          id,
          title,
          description,
          priority,
          status,
          story_points,
          project_id,
          updated_at,
          created_at,
          projects!inner(project_name)
        `)
        .in('project_id', projectIds)
        .eq('status', 'qa')
        .order('updated_at', { ascending: false });

      if (storiesError) {
        console.error('❌ Error fetching stories:', storiesError);
        throw storiesError;
      }

      // Transform the data to include project_name
      const transformedStories = (storiesData || []).map(story => ({
        ...story,
        project_name: story.projects?.project_name
      }));

      console.log('✅ QA stories fetched:', transformedStories.length);
      setStories(transformedStories);
    } catch (error) {
      console.error('❌ Error in fetchQAStories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch QA stories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQAStories();
  }, [currentUserEmail]);

  return {
    stories,
    loading,
    refetch: fetchQAStories
  };
};
