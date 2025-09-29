
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardMetrics {
  // Project Data
  totalProjects: number;
  projectsPlanned: number;
  projectsRunning: number;
  projectsOnHold: number;
  projectsCompleted: number;
  projectsWithoutSprints: number;
  projectsNeedPlanning: number;
  
  // Sprint Data
  runningSprints: number;
  overdueSprints: number;
  unhealthySprints: number;
  
  // Resource Data
  totalResources: number;
  freeResources: number;
  partialResources: number;
  totalHoursLogged: number;
  expectedHours: number;
}

export const useAdminDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics>({
    totalProjects: 0,
    projectsPlanned: 0,
    projectsRunning: 0,
    projectsOnHold: 0,
    projectsCompleted: 0,
    projectsWithoutSprints: 0,
    projectsNeedPlanning: 0,
    runningSprints: 0,
    overdueSprints: 0,
    unhealthySprints: 0,
    totalResources: 0,
    freeResources: 0,
    partialResources: 0,
    totalHoursLogged: 0,
    expectedHours: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMetrics = async () => {
    try {
      setLoading(true); 

      // Fetch all projects
      const { data: projects, error: projectsError } = await apiCall(allRoutes.projects.dashboard, 'get');

      if (projectsError) throw projectsError;

      // Calculate project metrics 
      const totalProjects = projects.data.total_project || 0;
      const projectsPlanned = projects.data.planned || 0;
      const projectsRunning = projects.data.in_progress || 0;
      const projectsOnHold = projects.data.on_hold || 0;
      const projectsCompleted = projects.data.completed || 0;

      // Projects without sprints
      // const projectIds = projects?.map(p => p.id) || [];
      // const projectsWithSprints = [...new Set(sprints?.map(s => s.project_id) || [])];
      // const projectsWithoutSprints = projectIds.filter(id => !projectsWithSprints.includes(id)).length;

      // // Projects need planning (current sprint ending in 3 days with no planned sprints)
      // const today = new Date();
      // const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
      // const projectsNeedPlanning = projects?.filter(project => {
      //   const projectSprints = sprints?.filter(s => s.project_id === project.id) || [];
      //   const runningSprint = projectSprints.find(s => s.status === 'running');
      //   const plannedSprints = projectSprints.filter(s => s.status === 'created');
        
      //   if (runningSprint && plannedSprints.length === 0) {
      //     const endDate = new Date(runningSprint.end_date);
      //     return endDate <= threeDaysFromNow;
      //   }
      //   return false;
      // }).length || 0;

      // // Calculate sprint metrics
      // const runningSprints = sprints?.filter(s => s.status === 'running').length || 0;
      
      // // Overdue sprints (past end date but not completed)
      // const overdueSprints = sprints?.filter(s => {
      //   if (s.status === 'completed') return false;
      //   const endDate = new Date(s.end_date);
      //   return endDate < today;
      // }).length || 0;

      // // Unhealthy sprints (running sprints that are overdue)
      // const unhealthySprints = sprints?.filter(s => {
      //   if (s.status !== 'running') return false;
      //   const endDate = new Date(s.end_date);
      //   return endDate < today;
      // }).length || 0;

      // // Calculate resource metrics
      // const totalResources = teamMembers?.filter(tm => tm.is_active).length || 0;
      
      // // Free resources (active team members not assigned to any project)
      // const assignedMemberIds = [...new Set(assignments?.map(a => a.team_member_id) || [])];
      // const freeResources = teamMembers?.filter(tm => 
      //   tm.is_active && !assignedMemberIds.includes(tm.id)
      // ).length || 0;

      // // Partial resources (assigned to only some projects)
      // const memberAssignmentCounts = assignments?.reduce((acc, assignment) => {
      //   acc[assignment.team_member_id] = (acc[assignment.team_member_id] || 0) + 1;
      //   return acc;
      // }, {} as Record<string, number>) || {};
      
      // const partialResources = Object.values(memberAssignmentCounts).filter(count => count === 1).length;

      // // Calculate hours
      // const totalHoursLogged = Math.round((timeLogs?.reduce((sum, log) => sum + (log.time_spent_minutes || 0), 0) || 0) / 60);
      // const expectedHours = totalResources * 40 * 4; // Assuming 40 hours/week, 4 weeks

      setMetrics({
        totalProjects,
        projectsPlanned,
        projectsRunning,
        projectsOnHold,
        projectsCompleted,
        projectsWithoutSprints:0,
        projectsNeedPlanning:0,
        runningSprints:0,
        overdueSprints:0,
        unhealthySprints:0,
        totalResources:0,
        freeResources:0,
        partialResources:0,
        totalHoursLogged:0,
        expectedHours:0,
      });
 
    } catch (error) {
      console.error('❌ Error fetching admin dashboard metrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    loading,
    refetch: fetchMetrics
  };
};
