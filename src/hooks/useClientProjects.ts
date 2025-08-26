
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

interface ClientProject {
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
  project_type: string | null;
  created_at: string;
}

export const useClientProjects = (user: any) => {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadClientProjects();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadClientProjects = async () => {
    try {

      // Check current authentication status
      const { data, error: sessionError } = await apiCall(allRoutes.projects.get_assigned_projects, 'get');

      if (sessionError) {
        console.error('❌ Session error:', sessionError);
      }
      const project = data.data;
      setProjects(project || []);

      if (!project || project.length === 0) {
        toast.error("You don't have access to any projects yet. Contact your project manager for access.");
      } 
    } catch (error) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    refetch: loadClientProjects,
  };
};
