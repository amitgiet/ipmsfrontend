
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

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
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProjects = async () => {
    try {
      setLoading(true);
      
      if (!currentUser?.email) {
        setProjects([]);
        setLoading(false);
        return;
      }
      
      // Find the team member with qa role
      const { data } = await apiCall(allRoutes.projects.dashboard, 'get');

      setDashboardData(data.data || []);
    } catch (error) {
      console.error('❌ Error in fetchMyProjects:', error);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedProjects = async () => {
    const { data } = await apiCall(allRoutes.projects.get_assigned_projects, 'get');
    setProjects(data.data || []);
  };

  useEffect(() => {
    if (currentUser?.email) {
      fetchMyProjects();
      fetchAssignedProjects();
    } else {
      setLoading(false);
    }
  }, [currentUser?.email]);

  return {
    dashboardData,
    projects,
    loading,
    refetch: fetchMyProjects
  };
};
