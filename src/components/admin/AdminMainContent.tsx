
import React from 'react';
import { AdminDashboardStats } from '@/components/admin/AdminDashboardStats';
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity';
import { AdminSkillsSection } from '@/components/admin/AdminSkillsSection';
import { AdminProjectsSection } from '@/components/admin/AdminProjectsSection';
import { AdminTimesheetSection } from '@/components/admin/AdminTimesheetSection';
import { TeamManagement } from '@/pages/dashboard/AdminDashboard/TeamManagement';
// import { useAdminDashboardMetrics } from '@/hooks/useAdminDashboardMetrics';
// import { Project } from '@/types/project';

interface AdminMainContentProps {
  activeSection: string;
  skills: string[];
  setSkills: (skills: string[]) => void;
  setActiveSection: (section: string) => void;
}

export const AdminMainContent = ({
  activeSection,
  skills,
  setSkills,
  setActiveSection
}: AdminMainContentProps) => {
  const { metrics, loading: metricsLoading } = useAdminDashboardMetrics();

  switch (activeSection) {
    case 'projects':
      return (
        <AdminProjectsSection />
      );
    
    case 'skills':
      return (
        <AdminSkillsSection
          skills={skills}
          setSkills={setSkills}
        />
      );
    
    case 'team':
      return <TeamManagement />;
    
    case 'timesheets':
      return <AdminTimesheetSection />;
    
    default:
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          
          <AdminDashboardStats
            metrics={metrics}
            loading={metricsLoading}
            onProjectsClick={() => setActiveSection('projects')}
          />

          <AdminRecentActivity projects={[]} />
        </div>
      );
  }
};
