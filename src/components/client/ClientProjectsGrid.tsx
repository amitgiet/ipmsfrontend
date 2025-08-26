
import React from 'react';
import { ClientProjectCard } from './ClientProjectCard';
import { Eye } from 'lucide-react';

interface ClientProject {
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
  project_type: string | null;
  created_at: string;
}

interface ClientProjectsGridProps {
  projects: ClientProject[];
  onViewProject: (project: ClientProject) => void;
}

const ClientProjectsGrid: React.FC<ClientProjectsGridProps> = ({ 
  projects, 
  onViewProject 
}) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Available</h3>
        <p className="text-gray-600">
          You don't have any projects assigned yet. Please contact your project manager.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Your Projects</h2>
      <p className="text-gray-600 mb-6">
        Click on a project to view its mindmap and provide feedback
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ClientProjectCard
            key={project.id}
            project={project}
            onViewProject={() => onViewProject(project)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientProjectsGrid; 