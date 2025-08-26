
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

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

  const fetchQAStories = async () => {
    try {
      if (!currentUserEmail) {
        setStories([]);
        setLoading(false);
        return;
      }

      console.log('🔄 Fetching QA stories for:', currentUserEmail);

      // First, get the team member data
      const { data: teamMemberData, error: teamMemberError } = await apiCall(allRoutes.auth.get_team_member, 'get', { email: currentUserEmail.toLowerCase() });

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
      const { data: assignmentData, error: assignmentError } = await apiCall(allRoutes.projects.get_assigned_projects, 'get', { team_member_id: teamMemberData.id });

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
      const { data: storiesData, error: storiesError } = await apiCall(allRoutes.stories.getStoriesByProjectIds(projectIds), 'get');

      console.log('📥 Raw API response:', storiesData.data);

      if (storiesError) {
        console.error('❌ Error fetching stories:', storiesError);
        throw storiesError;
      }

      // Transform the data to include project_name
      // const transformedStories = (storiesData || []).map(story => ({
      //   ...story,
      //   project_name: story.projects?.project_name
      // }));

      console.log('✅ QA stories fetched:', storiesData.data.length);
      setStories(storiesData);
    } catch (error) {
      console.error('❌ Error in fetchQAStories:', error);
      toast.error("Failed to fetch QA stories");
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
