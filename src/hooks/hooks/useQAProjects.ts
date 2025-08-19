
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  project_name: string;
  project_id: string | null;
  client_name: string | null;
  project_status: string | null;
  start_date: string | null;
  end_date: string | null;
  estimated_budget: number | null;
  budget_currency: string | null;
  progress_percent: number | null;
  priority: string | null;
  created_at: string;
  project_type: string | null;
  client_email: string | null;
  allow_client_access: boolean | null;
  actual_budget_used: number | null;
  logged_hours: number | null;
  duration: number | null;
  documents: string | null;
  milestones: string | null;
  client_dependencies: string | null;
  tags_labels: string | null;
  created_by: string | null;
}

export const useQAProjects = (currentUser: any) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMyProjects = async () => {
    try {
      console.log('🔄 Fetching projects for QA:', currentUser?.email);
      setLoading(true);
      
      if (!currentUser?.email) {
        console.log('❌ No current user email');
        setProjects([]);
        setLoading(false);
        return;
      }
      
      // Find the team member with qa role
      const { data: teamMemberData, error: teamMemberError } = await supabase
        .from('team_members')
        .select('id, name, email, role, is_active')
        .eq('email', currentUser.email.toLowerCase())
        .eq('role', 'qa')
        .eq('is_active', true)
        .maybeSingle();

      console.log('🔍 Team member lookup:', { teamMemberData, teamMemberError });

      if (teamMemberError) {
        console.error('❌ Error fetching team member:', teamMemberError);
        throw teamMemberError;
      }

      if (!teamMemberData) {
        console.log('❌ No QA found with email:', currentUser.email);
        toast({
          title: "Access Denied", 
          description: `No QA found with email ${currentUser.email}. Please contact administrator.`,
          variant: "destructive",
        });
        setProjects([]);
        setLoading(false);
        return;
      }

      console.log('✅ Found QA:', teamMemberData);

      // Get project assignments for this team member
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('project_team_members')
        .select('project_id')
        .eq('team_member_id', teamMemberData.id);

      console.log('🔍 Project assignments:', { assignmentData, assignmentError });

      if (assignmentError) {
        console.error('❌ Error fetching project assignments:', assignmentError);
        throw assignmentError;
      }

      if (!assignmentData || assignmentData.length === 0) {
        console.log('❌ No projects assigned to this QA');
        setProjects([]);
        setLoading(false);
        return;
      }

      // Get the project IDs
      const projectIds = assignmentData.map(assignment => assignment.project_id);
      console.log('✅ Project IDs to fetch:', projectIds);

      // Fetch the actual project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .in('id', projectIds)
        .order('created_at', { ascending: false });

      console.log('🔍 Projects query result:', { projectData, projectError });

      if (projectError) {
        console.error('❌ Error fetching projects:', projectError);
        throw projectError;
      }

      console.log('✅ Successfully fetched projects:', projectData?.length || 0);
      setProjects(projectData || []);
    } catch (error) {
      console.error('❌ Error in fetchMyProjects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      fetchMyProjects();
    } else {
      setLoading(false);
    }
  }, [currentUser?.email]);

  return {
    projects,
    loading,
    refetch: fetchMyProjects
  };
};
