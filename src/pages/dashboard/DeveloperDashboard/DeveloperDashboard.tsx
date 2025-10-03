
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DeveloperHeader } from '@/components/developer/DeveloperHeader';
import { DeveloperStats } from '@/components/developer/DeveloperStats';
import { DeveloperProjectsTable } from '@/components/developer/DeveloperProjectsTable';
import { DeveloperTasksSection } from '@/components/developer/DeveloperTasksSection';
import { useDeveloperProjects } from '@/hooks/useDeveloperProjects';
import { LogTimeDialog } from '@/components/tasks/LogTimeDialog';
import { useTaskTimeLogs } from '@/hooks/useTaskTimeLogs';
import { ProductOwnerProjectsTable } from '../ProductOwner/ProductOwnerProjectsTable';

export const DeveloperDashboard = () => {
  const { user, teamUser, logout } = useAuth();
  const currentUser = user || teamUser;
  const [showTimeLogDialog, setShowTimeLogDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
  const { projects, dashboardData,  loading, refetch } = useDeveloperProjects(currentUser);

  if (!currentUser) {
    return null;
  }

  const handleLogTime = async (timeData: { startTime: string; endTime: string; timeSpentMinutes: number }) => {
    if (!selectedTask) return;
    
    const { logTime } = useTaskTimeLogs(selectedTask.story_id);
    await logTime(selectedTask.id, timeData);
    
    setShowTimeLogDialog(false);
    setSelectedTask(null);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DeveloperHeader currentUser={currentUser} onLogout={logout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Manage your assigned tasks and track your development work</p>
          </div>
        </div>

        <DeveloperStats projects={dashboardData} currentUserEmail={currentUser.email} />
        
        <div className="grid grid-cols-1 gap-8 mt-8">
          <ProductOwnerProjectsTable 
            projects={projects} 
            loading={loading} 
            currentUserEmail={currentUser.email} 
          />
           {/* <DeveloperProjectsTable 
            projects={projects} 
            loading={loading} 
            currentUserEmail={currentUser.email} 
          /> */}
          
          <DeveloperTasksSection 
            currentUserEmail={currentUser.email}
            onLogTimeClick={(task) => {
              setSelectedTask(task);
              setShowTimeLogDialog(true);
            }}
          />
        </div>

        {showTimeLogDialog && selectedTask && currentUser && (
          <LogTimeDialog
            open={showTimeLogDialog}
            onClose={() => {
              setShowTimeLogDialog(false);
              setSelectedTask(null);
            }}
            onLogTime={handleLogTime}
            taskTitle={selectedTask.title || "Selected Task"}
            taskAssignedTo={selectedTask.assignedTo}
            currentUserEmail={currentUser.email || currentUser.name || ''}
            userRole="developer"
          />
        )}
      </main>
    </div>
  );
};
