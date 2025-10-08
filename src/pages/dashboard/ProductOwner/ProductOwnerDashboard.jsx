import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProductOwnerHeader } from '@/pages/dashboard/ProductOwner/ProductOwnerHeader';
import { ProductOwnerStats } from '@/pages/dashboard/ProductOwner/ProductOwnerStats';
import { ProductOwnerProjectsTable } from '@/pages/dashboard/ProductOwner/ProductOwnerProjectsTable';
import { ProductOwnerTimeLog } from '@/pages/dashboard/ProductOwner/ProductOwnerTimeLog';
import { ProductOwnerTimeLogTable } from '@/pages/dashboard/ProductOwner/ProductOwnerTimeLogTable';
// import { useProductOwnerTimeLogs } from '@/hooks/useProductOwnerTimeLogs';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { productOwnerService } from '@/services/ProductOwner/productOwner';

export const ProductOwnerDashboard = () => {
  const { user, teamUser, logout } = useAuth();
  const currentUser = user || teamUser;
  const [showTimeLogDialog, setShowTimeLogDialog] = useState(false);
  const [timeLogs, setTimeLogs] = useState([]);
  const [dashboard, setDashboard] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);

  if (!currentUser) {
    return null;
  }

  const fetchTimeLogs = async () => {
    const result = await productOwnerService.getTimeLogs(0);
    setTimeLogs(result.data.data);
  };

  const fetchDashboardCardsData = async () => {
    const result = await productOwnerService.getDashboard();
    setDashboard(result.data.data);
  };
  
  const fetchAssignedProjects = async () => {
    const result = await productOwnerService.getAssignedProjects();
    setAssignedProjects(result.data.data);
  };

  const handleTimeLogged = () => {
    // Demo function - just log to console 
    // In a real app, this would refetch both projects and time logs data
  };

  useEffect(() => {
    fetchTimeLogs();
    fetchDashboardCardsData();
    fetchAssignedProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <ProductOwnerHeader currentUser={currentUser} onLogout={logout} /> */}

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

        <ProductOwnerStats projects={dashboard} />
        
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-8 mt-8">
          <ProductOwnerProjectsTable 
            projects={assignedProjects} 
            loading={false} 
            currentUserEmail={currentUser.email} 
          />
          <ProductOwnerTimeLogTable 
            timeLogsList={timeLogs}  // Empty array will trigger demo data display
            refetchTimeLogs={fetchTimeLogs} 
          />
        </div>

        <ProductOwnerTimeLog
          open={showTimeLogDialog}
          onClose={() => setShowTimeLogDialog(false)}
          projects={assignedProjects.map(p => ({ id: p.id, project_name: p.name }))}
          productOwnerEmail={currentUser.email}
          refetchTimeLogs={fetchTimeLogs}
          onTimeLogged={handleTimeLogged}
        />
      </main>
    </div>
  );
}; 