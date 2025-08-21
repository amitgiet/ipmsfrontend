
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeveloperTasks } from '@/hooks/useDeveloperTasks';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  project_status: string;
  estimated_budget: number;
  budget_currency: string;
}

interface DeveloperStatsProps {
  projects: Project[];
  currentUserEmail?: string;
}

export const DeveloperStats = ({ projects, currentUserEmail }: DeveloperStatsProps) => {
  const { tasks } = useDeveloperTasks(currentUserEmail || '');
  const navigate = useNavigate();

  console.log('🎯 DeveloperStats - currentUserEmail:', currentUserEmail);
  console.log('🎯 DeveloperStats - tasks received:', tasks);
  console.log('🎯 DeveloperStats - tasks length:', tasks.length);

  // Count tasks by status
  const activeTasks = projects.my_tasks_to_do_count;
  const inProgressTasks = projects.my_tasks_in_progress_count;
  const completedTasks = projects.my_tasks_completed_count;


  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Projects Assigned</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.assigned_project_count}</div>
          <p className="text-xs text-muted-foreground">
            Active projects
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => navigate('/my-tasks')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTasks}</div>
          <p className="text-xs text-muted-foreground">
            Tasks to do and in progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressTasks}</div>
          <p className="text-xs text-muted-foreground">
            Currently working on
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks}</div>
          <p className="text-xs text-muted-foreground">
            Tasks completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
