
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductOwnerSprints } from '@/hooks/useProductOwnerSprints';
import { useTeamLeadTasks } from '@/hooks/useTeamLeadTasks';

interface Project {
  id: string;
  project_status: string;
  estimated_budget: number;
  budget_currency: string;
}

interface TeamLeadStatsProps {
  projects: Project[];
  currentUserEmail?: string;
}

export const TeamLeadStats = ({ projects, currentUserEmail }: TeamLeadStatsProps) => {
  const projectIds = projects.map(p => p.id);
  const { sprintsAboutToEnd, overrunSprints } = useProductOwnerSprints(projectIds);
  const { runningTasks, assignedTasks } = useTeamLeadTasks(projectIds, currentUserEmail);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Projects Assigned</CardTitle>
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
          <CardTitle className="text-sm font-medium">Running Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{runningTasks}</div>
          <p className="text-xs text-muted-foreground">
            Tasks in progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {assignedTasks}
          </div>
          <p className="text-xs text-muted-foreground">
            Tasks assigned to you
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sprints Need Attention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {sprintsAboutToEnd.length + overrunSprints.length}
          </div>
          <p className="text-xs text-muted-foreground">
            Ending soon or overrun
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
