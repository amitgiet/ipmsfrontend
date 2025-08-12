
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { Project } from '@/types/project';

interface ProjectInfoCardProps {
  project: Project;
}

export const ProjectInfoCard = ({ project }: ProjectInfoCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Quick Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Project Timeline */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Timeline</h4>
            <div className="space-y-1 text-xs">
              <p className="text-gray-600">
                <strong>Start:</strong> {project?.start_date ? format(new Date(project?.start_date), 'MMM dd, yyyy') : 'Not set'}
              </p>
              <p className="text-gray-600">
                <strong>End:</strong> {project?.end_date ? format(new Date(project?.end_date), 'MMM dd, yyyy') : 'Not set'}
              </p>
            </div>
          </div>

          {/* Client Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Client</h4>
            {project?.client_name ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <span className="text-xs font-medium break-words">{project?.client_name}</span>
                </div>
                {project?.client_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-gray-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600 break-all">{project?.client_email}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No client assigned</p>
            )}
          </div>

          {/* Project Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Details</h4>
            <div className="space-y-1 text-xs">
              <p className="text-gray-600">
                <strong>Type:</strong> {project?.project_type || 'Not specified'}
              </p>
              {project?.tags_labels && (
                <div>
                  <strong className="text-gray-600">Tags:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Array.isArray(project.tags_labels) 
                      ? project.tags_labels.slice(0, 2).map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))
                      : project.tags_labels?.split(',').slice(0, 2).map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                            {tag.trim()}
                          </Badge>
                        ))
                    }
                    {Array.isArray(project.tags_labels) 
                      ? (project.tags_labels.length > 2 ? (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            +{project.tags_labels.length - 2}
                          </Badge>
                        ) : null)
                      : (project.tags_labels?.split(',').length > 2 ? (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            +{project.tags_labels.split(',').length - 2}
                          </Badge>
                        ) : null)
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
