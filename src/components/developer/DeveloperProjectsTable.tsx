
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatBudget, formatDate, statusColors } from '@/utils/projectFormatters';
import { PermissionWrapper } from '@/components/common/PermissionWrapper';

interface DeveloperProjectsTableProps {
  projects: any[];
  loading: boolean;
  currentUserEmail: string;
}

export const DeveloperProjectsTable = ({ projects, loading, currentUserEmail }: DeveloperProjectsTableProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Projects</CardTitle>
          <CardDescription>Projects you're assigned to work on</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to_do':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Projects</CardTitle>
          <CardDescription>Projects you're assigned to work on</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">No projects assigned yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Projects ({projects.length})</CardTitle>
        <CardDescription>Projects you're assigned to work on</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {project.name}
                    </h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status?.slice(0, 1).toUpperCase() + project.status?.slice(1).replace('_', ' ').toUpperCase() || 'Unknown'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(project.start_date)} - {formatDate(project.end_date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Client:</span>
                      <span>{project.client_name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <PermissionWrapper action="viewProject">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </PermissionWrapper>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
