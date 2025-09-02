
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Users, Clock, FolderOpen, Settings } from 'lucide-react';
import { formatBudget, formatDate, statusColors, priorityColors } from '@/utils/projectFormatters';
import { useNavigate } from 'react-router-dom';

interface QAProjectsSectionProps {
  projects: any[];
  loading: boolean;
}

export const QAProjectsSection: React.FC<QAProjectsSectionProps> = ({ projects, loading }) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleManageProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My Projects</CardTitle>
          <Badge variant="outline" className="text-sm">
            {projects.length} projects
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={statusColors[project.status as keyof typeof statusColors] || statusColors['planned']}>
                        {project.status?.replace('_', ' ').toUpperCase() || 'PLANNED'}
                      </Badge>
                      {project.priority && (
                        <Badge variant="outline" className={priorityColors[project.priority as keyof typeof priorityColors]}>
                          {project.priority.toUpperCase()} PRIORITY
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleManageProject(project.id)}
                    className="ml-4"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{project.client_name || 'No client'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(project.start_date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>{project.estimated_budget}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{project.duration_days ? `${project.duration_days} days` : 'No duration'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No projects assigned</p>
            <p className="text-sm">You will see projects here once they are assigned to you</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
