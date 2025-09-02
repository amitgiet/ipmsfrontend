
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

export const useQAStoriesCount = (currentUserEmail: string) => {
  const [storiesCount, setStoriesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchQAStoriesCount = async () => {
    try {
      if (!currentUserEmail) {
        setStoriesCount(0);
        setLoading(false);
        return;
      }
 

      // First, get the team member data
      const { data: teamMemberData, error: teamMemberError } = await apiCall(allRoutes.team.getTeamMemberByEmail(currentUserEmail), 'get');

      if (teamMemberError) {
        console.error('❌ Error fetching team member:', teamMemberError);
        throw teamMemberError;
      }

      if (!teamMemberData) { 
        setStoriesCount(0);
        setLoading(false);
        return;
      }

      // Get project assignments for this team member
      const { data: assignmentData, error: assignmentError } = await apiCall(allRoutes.team.getProjectAssignmentsByTeamMemberId(teamMemberData.id), 'get');

      if (assignmentError) {
        console.error('❌ Error fetching project assignments:', assignmentError);
        throw assignmentError;
      }

      if (!assignmentData || assignmentData.length === 0) { 
        setStoriesCount(0);
        setLoading(false);
        return;
      }

      // Get the project IDs
      const projectIds = assignmentData.map(assignment => assignment.project_id);

      // Count stories with status 'qa' in these projects
      const { count, error: storiesError } = await apiCall(allRoutes.stories.getStoriesByProjectIds(projectIds), 'get');

      if (storiesError) {
        console.error('❌ Error fetching stories count:', storiesError);
        throw storiesError;
      }
 
      setStoriesCount(count || 0);
    } catch (error) {
      console.error('❌ Error in fetchQAStoriesCount:', error);
      toast.error("Failed to fetch stories count");
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
