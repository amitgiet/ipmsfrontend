import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProductOwnerHeader } from '@/components/ProductOwnerHeader';
import { ProductOwnerStats } from '@/components/ProductOwnerStats';
import { ProductOwnerProjectsTable } from '@/components/ProductOwnerProjectsTable';
import { ProductOwnerTimeLog } from '@/components/ProductOwnerTimeLog';
import { ProductOwnerTimeLogTable } from '@/components/ProductOwnerTimeLogTable';
import { useProductOwnerProjects } from '@/hooks/useProductOwnerProjects';
import { useProductOwnerTimeLogs } from '@/hooks/useProductOwnerTimeLogs';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export const ProductOwnerDashboard = () => {
  const { user, teamUser, logout } = useAuth();
  const currentUser = user || teamUser;
  const [showTimeLogDialog, setShowTimeLogDialog] = useState(false);
  
  const { projects, loading, refetch } = useProductOwnerProjects(currentUser);
  const { timeLogs, refetch: refetchTimeLogs } = useProductOwnerTimeLogs(currentUser?.email || '');

  if (!currentUser) {
    return null;
  }

  const handleTimeLogged = () => {
    // Refetch both projects and time logs data when a new time log is added
    refetch();
    refetchTimeLogs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductOwnerHeader currentUser={currentUser} onLogout={logout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Manage your projects and track your time</p>
          </div>
          <Button onClick={() => setShowTimeLogDialog(true)} className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Log Time
          </Button>
        </div>

        <ProductOwnerStats projects={projects} />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
          <ProductOwnerProjectsTable 
            projects={projects} 
            loading={loading} 
            currentUserEmail={currentUser.email} 
          />
          <ProductOwnerTimeLogTable 
            productOwnerEmail={currentUser.email} 
            timeLogsList={timeLogs}
            refetchTimeLogs={refetchTimeLogs}
          />
        </div>

        <ProductOwnerTimeLog
          open={showTimeLogDialog}
          onClose={() => setShowTimeLogDialog(false)}
          projects={projects.map(p => ({ id: p.id, project_name: p.project_name }))}
          productOwnerEmail={currentUser.email}
          onTimeLogged={handleTimeLogged}
        />
      </main>
    </div>
  );
}; 