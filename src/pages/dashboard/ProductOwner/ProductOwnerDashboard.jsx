import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProductOwnerHeader } from '@/pages/dashboard/ProductOwner/ProductOwnerHeader';
import { ProductOwnerStats } from '@/pages/dashboard/ProductOwner/ProductOwnerStats';
import { ProductOwnerProjectsTable } from '@/pages/dashboard/ProductOwner/ProductOwnerProjectsTable';
import { ProductOwnerTimeLog } from '@/pages/dashboard/ProductOwner/ProductOwnerTimeLog';
import { ProductOwnerTimeLogTable } from '@/pages/dashboard/ProductOwner/ProductOwnerTimeLogTable';
// import { useProductOwnerTimeLogs } from '@/hooks/useProductOwnerTimeLogs';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export const ProductOwnerDashboard = () => {
  const { user, teamUser, logout } = useAuth();
  const currentUser = user || teamUser;
  const [showTimeLogDialog, setShowTimeLogDialog] = useState(false);
  
  // Demo data instead of hooks
  const demoProjects = [
    {
      id: '1',
      project_name: 'E-commerce Platform',
      project_status: 'in_progress',
      estimated_budget: 50000,
      budget_currency: 'USD'
    },
    {
      id: '2',
      project_name: 'Mobile App Development',
      project_status: 'planned',
      estimated_budget: 35000,
      budget_currency: 'USD'
    },
    {
      id: '3',
      project_name: 'Website Redesign',
      project_status: 'completed',
      estimated_budget: 25000,
      budget_currency: 'USD'
    }
  ];

  if (!currentUser) {
    return null;
  }

  const handleTimeLogged = () => {
    // Demo function - just log to console
    console.log('Time logged - would refetch data in real app');
    // In a real app, this would refetch both projects and time logs data
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

        <ProductOwnerStats projects={demoProjects} />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
          <ProductOwnerProjectsTable 
            projects={demoProjects} 
            loading={false} 
            currentUserEmail={currentUser.email} 
          />
          <ProductOwnerTimeLogTable 
            productOwnerEmail={currentUser.email} 
            timeLogsList={[]}  // Empty array will trigger demo data display
            refetchTimeLogs={() => {}} 
          />
        </div>

        {/* <ProductOwnerTimeLog
          open={showTimeLogDialog}
          onClose={() => setShowTimeLogDialog(false)}
          projects={demoProjects.map(p => ({ id: p.id, project_name: p.project_name }))}
          productOwnerEmail={currentUser.email}
          onTimeLogged={handleTimeLogged}
        /> */}
        <ProductOwnerTimeLog
          open={showTimeLogDialog}
          onClose={() => setShowTimeLogDialog(false)}
          projects={demoProjects.map(p => ({ id: p.id, project_name: p.project_name }))}
          productOwnerEmail={currentUser.email}
          onTimeLogged={handleTimeLogged}
        />
      </main>
    </div>
  );
}; 