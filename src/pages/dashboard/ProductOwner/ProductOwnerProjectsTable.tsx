
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { ProjectTable } from '@/components/projects/ProjectTable';

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

interface ProductOwnerProjectsTableProps {
  projects: Project[];
  loading: boolean;
  currentUserEmail: string;
}

export const ProductOwnerProjectsTable = ({ projects, loading, currentUserEmail }: ProductOwnerProjectsTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.project_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.project_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewProject = (project: Project) => {
    navigate(`/project/${project.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Projects</CardTitle>
        <CardDescription>
          Manage and track your assigned projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ProjectFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
          />

          {filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {projects.length === 0 
                ? "No projects assigned to you yet." 
                : "No projects match your search criteria."
              }
            </div>
          ) : (
            <ProjectTable 
              projects={filteredProjects}
              onViewProject={handleViewProject}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
