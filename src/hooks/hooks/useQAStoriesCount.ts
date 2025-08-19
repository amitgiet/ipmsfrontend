
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useQAStoriesCount = (currentUserEmail: string) => {
  const [storiesCount, setStoriesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchQAStoriesCount = async () => {
    try {
      if (!currentUserEmail) {
        setStoriesCount(0);
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching QA stories count for:', currentUserEmail);

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
        setStoriesCount(0);
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
        setStoriesCount(0);
        setLoading(false);
        return;
      }

      // Get the project IDs
      const projectIds = assignmentData.map(assignment => assignment.project_id);

      // Count stories with status 'qa' in these projects
      const { count, error: storiesError } = await supabase
        .from('user_stories')
        .select('*', { count: 'exact', head: true })
        .in('project_id', projectIds)
        .eq('status', 'qa');

      if (storiesError) {
        console.error('❌ Error fetching stories count:', storiesError);
        throw storiesError;
      }

      console.log('✅ QA stories count:', count || 0);
      setStoriesCount(count || 0);
    } catch (error) {
      console.error('❌ Error in fetchQAStoriesCount:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stories count",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQAStoriesCount();
  }, [currentUserEmail]);

  return {
    storiesCount,
    loading,
    refetch: fetchQAStoriesCount
  };
};
