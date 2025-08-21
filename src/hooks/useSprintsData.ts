
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

interface Sprint {
  id: string;
  project_id: string;
  sprint_name: string;
  start_date: string;
  end_date: string;
  duration: number;
  status: 'created' | 'running' | 'completed';
  created_at: string;
  updated_at: string;
}

export const useSprintsData = (projectId: string) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('ipms_user') || '{}');

  const fetchSprints = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching sprints for project:', projectId);
      
      const { data, error } = await apiCall(allRoutes.sprints.list(projectId), 'get');

      if (error) {
        console.error('❌ Error fetching sprints:', error);
        toast.error("Failed to fetch sprints");
        return;
      }

      console.log('✅ Fetched sprints:', data);

      // Type assertion to ensure proper typing
      const typedSprints: Sprint[] = (data || []).map(sprint => ({
        ...sprint,
        status: sprint.status as 'created' | 'running' | 'completed'
      }));

      setSprints(typedSprints);
    } catch (error) {
      console.error('❌ Error fetching sprints:', error);
      toast.error("Failed to fetch sprints");
    } finally {
      setLoading(false);
    }
  };

  const createSprint = async (sprintData: Omit<Sprint, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Check if user has permission to create sprints
      if (!user) {
        toast.error("Please log in to create sprints");
        return null;
      }

      // Check user role
      const allowedRoles = ['product_owner', 'project_manager', 'admin'];
      if (!allowedRoles.includes(user.role)) {
        toast.error(`Only product owners, project managers, and admins can create sprints. Your role: ${user.role}`);
        return null;
      }

      const { data, error } = await apiCall(allRoutes.sprints.create(projectId), 'post', sprintData);

      if (error) {
        console.error('❌ Error creating sprint:', error);
        toast.error("Failed to create sprint: " + error.message);
        return null;
      }

      console.log('✅ Sprint created successfully:', data);
      
      toast.success("Sprint created successfully");

      fetchSprints(); // Refresh the list
      return data;
    } catch (error) {
      console.error('❌ Error creating sprint:', error);
      toast.error("Failed to create sprint");
      return null;
    }
  };

  const updateSprint = async (sprintId: string, updates: Partial<Sprint>) => {
    try {
        const { error } = await apiCall(allRoutes.sprints.update(sprintId), 'post', updates);

      if (error) {
        console.error('Error updating sprint:', error);
        toast.error("Failed to update sprint");
        return false;
      }

      toast({
        title: "Success",
        description: "Sprint updated successfully",
      });

      fetchSprints(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating sprint:', error);
      toast({
        title: "Error",
        description: "Failed to update sprint",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchSprints();
    }
  }, [projectId]);

  return {
    sprints,
    loading,
    fetchSprints,
    createSprint,
    updateSprint
  };
};
