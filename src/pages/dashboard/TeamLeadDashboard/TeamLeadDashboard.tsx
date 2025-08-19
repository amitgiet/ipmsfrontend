
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { TeamLeadHeader } from '@/components/teamLead/TeamLeadHeader';
import { TeamLeadStats } from '@/components/teamLead/TeamLeadStats';
import { TeamLeadProjectsTable } from '@/components/teamLead/TeamLeadProjectsTable';
import { TeamLeadTasksSection } from '@/components/teamLead/TeamLeadTasksSection';
import { useTeamLeadProjects } from '@/hooks/useTeamLeadProjects';
// import { PermissionWrapper } from '@/components/common/PermissionWrapper';

export const TeamLeadDashboard = () => {
  const { user, teamUser, logout } = useAuth();
  const currentUser = user || teamUser;
  
  const { projects, loading, refetch } = useTeamLeadProjects(currentUser);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeamLeadHeader currentUser={currentUser} onLogout={logout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Lead your team and manage project deliverables</p>
          </div>
        </div>

        <TeamLeadStats projects={projects} currentUserEmail={currentUser.email} />
        
        <div className="grid grid-cols-1 gap-8 mt-8">
          {/* <TeamLeadProjectsTable 
            projects={projects} 
            loading={loading} 
            currentUserEmail={currentUser.email} 
          />
          
          <TeamLeadTasksSection currentUserEmail={currentUser.email} /> */}
        </div>
      </main>
    </div>
  );
};
