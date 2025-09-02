
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Eye, Calendar, DollarSign } from 'lucide-react';
import { formatBudget, formatDate, statusColors, priorityColors } from '@/utils/projectFormatters';

interface Project {
  id: string;
  name: string;
  project_id: string | null;
  client_name: string | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  estimated_budget: number | null;
  budget_currency: string | null;
  progress_percent: number | null;
  priority: string | null;
  client_email: string | null;
}

interface ProjectTableRowProps {
  project: Project;
  onViewProject: (project: Project) => void;
}

export const ProjectTableRow = ({ project, onViewProject }: ProjectTableRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className="max-w-[200px]">
          <div className="font-medium truncate" title={project.name}>{project.name}</div>
          {project.id && (
            <div className="text-sm text-gray-500 truncate" title={`Code: ${project.project_code}`}>Code: {project.project_code}</div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-[150px]">
          <div className="font-medium truncate" title={project.client_name || 'Not assigned'}>{project.client_name || 'Not assigned'}</div>
          {project.client_email && (
            <div className="text-sm text-gray-500 truncate" title={project.client_email}>{project.client_email}</div>
          )}
        </div>
      </TableCell>
      <TableCell>
          <Badge className={statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
          {project.status?.slice(0, 1).toUpperCase() + project.status?.slice(1).replace('_', ' ').toUpperCase() || 'Unknown'}
        </Badge>
      </TableCell>
      <TableCell>
        {project.priority && (
          <Badge variant="outline" className={priorityColors[project.priority as keyof typeof priorityColors]}>
            {project.priority.toUpperCase()}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 max-w-[120px]">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${project.progress_percent || 0}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600 min-w-[3rem] flex-shrink-0">
            {project.progress_percent || 0}%
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 max-w-[100px]">
          <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm truncate" title={formatBudget(project.estimated_budget, project.budget_currency)}>
            {project.estimated_budget}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm max-w-[160px]">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="truncate" title={`Start: ${formatDate(project.start_date)}`}>Start: {formatDate(project.start_date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="truncate" title={`End: ${formatDate(project.end_date)}`}>End: {formatDate(project.end_date)}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProject(project)}
          className="gap-2 flex-shrink-0"
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">View</span>
        </Button>
      </TableCell>
    </TableRow>
  );
};
