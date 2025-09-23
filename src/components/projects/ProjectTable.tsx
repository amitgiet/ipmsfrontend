
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProjectTableRow } from './ProjectTableRow';
import { TableLoader, TableEmptyState } from '@/components/common/TableLoader';

interface Project {
  id: string;
  project_name: string;
  project_id: string | null;
  client_name: string | null;
  project_status: string | null;
  start_date: string | null;
  end_date: string | null;
  estimated_budget: number | null;
  budget_currency: string | null;
  progress_percent: number | null;
  priority: string | null;
  created_at: string;
  project_type: string | null;
  client_email: string | null;
  allow_client_access: boolean | null;
  actual_budget_used: number | null;
  logged_hours: number | null;
  duration: number | null;
  documents: string | null;
  milestones: string | null;
  client_dependencies: string | null;
  tags_labels: string | null;
  created_by: string | null;
}

interface ProjectTableProps {
  projects: Project[];
  loading?: boolean;
  onViewProject: (project: Project) => void;
}

export const ProjectTable = ({ projects, loading = false, onViewProject }: ProjectTableProps) => {
  return (
    <TableLoader loading={loading} loadingMessage="Loading projects...">
      {!projects || projects.length === 0 ? (
        <TableEmptyState message="No projects found" />
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Project</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[80px]">Priority</TableHead>
                  <TableHead className="min-w-[120px]">Progress</TableHead>
                  <TableHead className="min-w-[160px]">Timeline</TableHead>
                  <TableHead className="min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <ProjectTableRow 
                    key={project.id} 
                    project={project} 
                    onViewProject={onViewProject} 
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </TableLoader>
  );
};
