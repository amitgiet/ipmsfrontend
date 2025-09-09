
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductOwnerSprints } from '@/hooks/useProductOwnerSprints';
import { useTeamLeadTasks } from '@/hooks/useTeamLeadTasks';



interface TeamLeadStatsProps {
  projects: any;
  currentUserEmail?: string;
}

export const TeamLeadStats = ({ projects, currentUserEmail }: TeamLeadStatsProps) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Projects Assigned</CardTitle>
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
          <CardTitle className="text-sm font-medium">Running Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.my_tasks_in_progress_count}</div>
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
            {projects.my_tasks_to_do_count}
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
            {projects.sprints_need_attention_count ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Ending soon or overrun
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
