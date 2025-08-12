
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  project_status: string;
  estimated_budget: number;
  budget_currency: string;
}

interface ProductOwnerStatsProps {
  projects: Project[];
}

export const ProductOwnerStats = ({ projects }: ProductOwnerStatsProps) => {
  // Memoize projectIds to prevent unnecessary re-renders
  const projectIds = useMemo(() => projects.map(p => p.id), [projects]);
  
  // Demo data instead of hook
  const demoData = {
    sprints: [
      { id: '1', name: 'Sprint 1', status: 'active', end_date: '2024-01-15' },
      { id: '2', name: 'Sprint 2', status: 'active', end_date: '2024-01-22' },
      { id: '3', name: 'Sprint 3', status: 'active', end_date: '2024-01-29' }
    ],
    sprintsAboutToEnd: [
      { id: '1', name: 'Sprint 1', status: 'ending_soon', end_date: '2024-01-15' }
    ],
    overrunSprints: [
      { id: '4', name: 'Sprint 4', status: 'overrun', end_date: '2024-01-10' }
    ],
    loading: false
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const handleRefresh = () => {
    // Demo refresh - just log to console
    console.log('Refreshing Product Owner stats...');
    // In a real app, this would trigger a data refetch
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Projects Assigned</CardTitle>
          {projectIds.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              title="Refresh stats"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.length}</div>
          <p className="text-xs text-muted-foreground">
            Assigned to you
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Running Sprints</CardTitle>
        </CardHeader>
        <CardContent>
          {demoData.loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {demoData.sprints.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sprints About to End</CardTitle>
        </CardHeader>
        <CardContent>
          {demoData.loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {demoData.sprintsAboutToEnd.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Ending in next 72 hours
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Overrun Sprints</CardTitle>
        </CardHeader>
        <CardContent>
          {demoData.loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {demoData.overrunSprints.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Past end date, not completed
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
