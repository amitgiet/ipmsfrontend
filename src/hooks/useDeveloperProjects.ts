
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

export const useDeveloperProjects = (currentUser: any) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    const { data: dashboardData, error: dashboardError } = await apiCall(allRoutes.projects.dashboard, 'get');
    if (dashboardError) {
      console.error('❌ Error fetching dashboard data:', dashboardError);
      toast.error("Failed to load dashboard data");
    } else {
      setDashboardData(dashboardData.data);
    }
  };

  const fetchProjects = async () => {
    if (!currentUser?.email) {
      setLoading(false);
      return;
    }

    try {

      // First approach: Check if developer has direct project membership
      const { data, error } = await apiCall(allRoutes.projects.get_assigned_projects, 'get');
      
      if (error) {
        console.error('❌ Error fetching team member:', error);
        toast.error("Failed to check team membership");
        return;
      }
      setProjects(data.data);
    } catch (error) {
      console.error('❌ Error in fetchProjects:', error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    setLoading(true);
    fetchProjects();
    fetchDashboardData();
  };

  useEffect(() => {
    refetch();
  }, [currentUser?.email]);

  return {
    projects,
    loading,
    refetch,
    dashboardData
  };
};
