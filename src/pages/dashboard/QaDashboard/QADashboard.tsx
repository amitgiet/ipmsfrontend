
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { QAHeader } from '@/components/qa/QAHeader';
import { QAStats } from '@/components/qa/QAStats';
import { QATasksSection } from '@/components/qa/QATasksSection';
import { QAProjectsSection } from '@/components/qa/QAProjectsSection';
import { useQAProjects } from '@/hooks/useQAProjects';
import { ProductOwnerProjectsTable } from '../ProductOwner/ProductOwnerProjectsTable';

export const QADashboard = () => {
  const { user, teamUser, logout } = useAuth();
  const currentUser = user || teamUser;
  
  const { dashboardData, projects, loading, refetch } = useQAProjects(currentUser);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <QAHeader currentUser={currentUser} onLogout={logout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QA Dashboard</h1>
            <p className="text-gray-600">Manage quality assurance tasks and testing activities</p>
          </div>
        </div>

        <QAStats projects={dashboardData} currentUserEmail={currentUser.email} />
        
        <div className="grid grid-cols-1 gap-8 mt-8">
          {/* <QAProjectsSection projects={projects} loading={loading} currentUserEmail={currentUser.email} /> */}
          <ProductOwnerProjectsTable 
            projects={projects} 
            loading={loading} 
            currentUserEmail={currentUser.email} 
          />  
          <QATasksSection currentUserEmail={currentUser.email} />
        </div>
      </main>
    </div>
  );
};
