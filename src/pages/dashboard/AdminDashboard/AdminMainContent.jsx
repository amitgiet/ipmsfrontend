import React from 'react';
import { AdminDashboardStats } from '@/components/admin/AdminDashboardStats';
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity';
import { AdminSkillsSection } from '@/components/admin/AdminSkillsSection';
import { AdminProjectsSection } from '@/components/admin/AdminProjectsSection';
import { AdminTimesheetSection } from '@/components/admin/AdminTimesheetSection'; 
import { TeamManagement } from './TeamManagement';
// import { useAdminDashboardMetrics } from '@/hooks/useAdminDashboardMetrics';

export const AdminMainContent = ({
  activeSection,
  projects,
  loading,
  filteredProjects,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  clientFilter,
  setClientFilter,
  projectIdFilter,
  setProjectIdFilter,
  filtersOpen,
  setFiltersOpen,
  skills,
  setSkills,
  setActiveSection,
  onAddProject,
  onEditProject,
  onManageProject,
  onRefreshProjects,
  onClearFilters
}) => {
  // const { metrics, loading: metricsLoading } = useAdminDashboardMetrics();

  switch (activeSection) {
    case 'projects':
      return (
        <AdminProjectsSection
          projects={projects}
          loading={loading}
          filteredProjects={filteredProjects}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          clientFilter={clientFilter}
          setClientFilter={setClientFilter}
          projectIdFilter={projectIdFilter}
          setProjectIdFilter={setProjectIdFilter}
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          onAddProject={onAddProject}
          onEditProject={onEditProject}
          onManageProject={onManageProject}
          onRefreshProjects={onRefreshProjects}
          onClearFilters={onClearFilters}
        />
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
            metrics={[]}
            loading={false}
            onProjectsClick={() => setActiveSection('projects')}
          />

          <AdminRecentActivity projects={projects} />
        </div>
      );
  }
}; 