
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, DollarSignIcon, Eye, BarChart3Icon } from 'lucide-react';

interface ClientProject {
  id: string;
  name: string;
  project_id: string | null;
  client_name: string | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  estimated_budget: number | null;
  budget_currency: string | null;
  progress: number | null;
  priority: string | null;
  type: string | null;
  created_at: string;
}

interface ClientProjectCardProps {
  project: ClientProject;
  onViewProject: () => void;
}

export const ClientProjectCard: React.FC<ClientProjectCardProps> = ({ project, onViewProject }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'in_progress':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'planned':
        return 'bg-purple-100 text-purple-800';
      case 'on_hold':
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          {project.status && (
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace('_', ' ')}
            </Badge>
          )}
        </div>
        {project.type && (
          <p className="text-sm text-gray-500">{project.type}</p>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-3 text-sm">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-700">
              {project.start_date ? formatDate(project.start_date) : 'Not started'} 
              {project.end_date ? ` - ${formatDate(project.end_date)}` : ''}
            </span>
          </div>
          
          {project.estimated_budget && (
            <div className="flex items-center">
              <DollarSignIcon className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-700">
                {project.estimated_budget} {project.budget_currency || 'USD'}
              </span>
            </div>
          )}
          
          {project.progress !== null && (
            <div>
              <div className="flex items-center mb-1">
                <BarChart3Icon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700">{project.progress} complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          onClick={onViewProject}
          className="w-full"
          variant="outline"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Project Mindmap
        </Button>
      </CardFooter>
    </Card>
  );
};
