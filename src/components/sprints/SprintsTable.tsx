import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Sprint {
  id: string;
  project_id: string;
  sprint_name: string;
  start_date: string;
  end_date: string;
  duration: number;
  status: 'created' | 'running' | 'completed';
  created_at: string;
  updated_at: string;
}

interface SprintsTableProps {
  sprints: Sprint[];
  loading?: boolean;
  onManageSprint: (sprintId: string) => void;
  readOnly?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'created':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'running':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const SprintsTable = ({ sprints, loading = false, onManageSprint, readOnly = false }: SprintsTableProps) => {
  const navigate = useNavigate();

  const handleManageSprint = (sprint: Sprint) => {
    // Allow all roles to navigate to sprint management page
    navigate(`/project/${sprint.project_id}/sprint/${sprint.id}/manage`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (sprints.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No sprints found for this project.</p>
        <p className="text-sm">Create your first sprint to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sprint Name</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sprints.map((sprint) => (
            <TableRow key={sprint.id}>
              <TableCell className="font-medium">{sprint.sprint_name}</TableCell>
              <TableCell>{format(new Date(sprint.start_date), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{format(new Date(sprint.end_date), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{sprint.duration} days</TableCell>
              <TableCell>
                <Badge className={getStatusColor(sprint.status)}>
                  {sprint.status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleManageSprint(sprint)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {readOnly ? 'View' : 'Manage'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
