import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';    
import { useClientProjects } from '@/hooks/useClientProjects';
import ClientDashboardHeader from '@/components/client/ClientDashboardHeader';
import ClientProjectsGrid from '@/components/client/ClientProjectsGrid';
import ClientMindmapView from '@/components/mindmap/ClientMindmapView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Milestones from '@/components/projects/Milestones';

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
 const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const tab = searchParams[0].get('tab') || 'mindmap';
  const projectId = params?.projectId;
  const { projects, loading } = useClientProjects(user);
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const navigate = useNavigate();

  const handleViewProject = (project: ClientProject) => {
    localStorage.setItem('selectedProject_name', project.name);
    navigate(`/client-project/${project.id}?tab=${tab}`);
  };

  const handleBackToProjects = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <ClientDashboardHeader user={user} onLogout={logout} /> */}
      
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {projectId ? (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              onClick={handleBackToProjects}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            
            <ClientMindmapView 
              projectId={projectId} 
            />
   
            
          </div>
        ) : (
          <ClientProjectsGrid 
            projects={projects} 
            onViewProject={handleViewProject} 
          />
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;