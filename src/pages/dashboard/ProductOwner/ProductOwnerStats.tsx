
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
  projects: {
    assigned_project_count: number;
    running_sprint_count: number;
    sprint_about_to_end: number;
    overrun_sprint_count: number;
  };
}

export const ProductOwnerStats = ({ projects }: ProductOwnerStatsProps) => {
 

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
          {/* {projects.assigned_project_count > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              title="Refresh stats"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )} */}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.assigned_project_count}</div>
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
         
            <>
              <div className="text-2xl font-bold">
                {projects.running_sprint_count}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </>
         
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sprints About to End</CardTitle>
        </CardHeader>
        <CardContent>
         
            <>
              <div className="text-2xl font-bold">
                {projects.sprint_about_to_end}
              </div>
              <p className="text-xs text-muted-foreground">
                Ending in next 72 hours
              </p>
            </>
          
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Overrun Sprints</CardTitle>
        </CardHeader>
        <CardContent>
            <>
              <div className="text-2xl font-bold">
                {projects.overrun_sprint_count}
              </div>
              <p className="text-xs text-muted-foreground">
                Past end date, not completed
              </p>
            </>
        </CardContent>
      </Card>
    </div>
  );
};
