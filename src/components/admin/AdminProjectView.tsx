
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut } from 'lucide-react';
import { ProjectDashboard } from '@/components/ProjectDashboard';

interface Project {
  id: string;
  project_name: string;
  project_id: string | null;
  project_status: string | null;
  project_type: string | null;
  priority: string | null;
  client_name: string | null;
  client_email: string | null;
  client_phone: string | null;
  backup_contact: string | null;
  allow_client_access: boolean | null;
  estimated_budget: number | null;
  budget_currency: string | null;
  actual_budget_used: number | null;
  logged_hours: number | null;
  start_date: string | null;
  end_date: string | null;
  duration: number | null;
  documents: string | null;
  milestones: string | null;
  client_dependencies: string | null;
  tags_labels: string | null;
  created_at: string;
  created_by: string | null;
  progress_percent: number | null;
}

interface AdminProjectViewProps {
  project: Project;
  onBack: () => void;
  onLogout: () => void;
}

export const AdminProjectView = ({ project, onBack, onLogout }: AdminProjectViewProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Project Management</h1>
            <Badge className="bg-red-100 text-red-800 border-red-200">ADMIN</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="p-6">
        <ProjectDashboard 
          project={project} 
          onBack={onBack} 
        />
      </main>
    </div>
  );
};
