
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQAStoriesCount } from '@/hooks/useQAStoriesCount';

interface QAStatsProps {
  projects: any[];
  currentUserEmail: string;
}

export const QAStats: React.FC<QAStatsProps> = ({ projects, currentUserEmail }) => {
  const navigate = useNavigate();
  const totalProjects = projects.assigned_project_count || 0;
  const  storiesCount = projects.story_in_qa_count || 0;

  // const handleStoriesClick = () => {
  //   navigate('/qa/stories');
  // };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <p className="text-xs text-muted-foreground">
            Projects assigned to QA
          </p>
        </CardContent>
      </Card>

      <Card 
        className="transition-shadow"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stories</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold transition-colors">
            { storiesCount}
          </div>
          <p className="text-xs text-muted-foreground">
            Stories in QA status
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Testing Status</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.testing_status}</div>
          <p className="text-xs text-muted-foreground">
            Quality assurance ready
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Priority Tasks</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.priority_task_count}</div>
          <p className="text-xs text-muted-foreground">
            High priority items
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
