
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectMindmap } from '@/components/projects/ProjectMindmap';
import { ProjectBacklog } from '@/components/projects/ProjectBacklog';
import { SprintsSection } from '@/components/sprints/SprintsSection';
import { ProjectTeamManagement } from '@/components/projects/ProjectTeamManagement';
import { useSearchParams } from 'react-router-dom';
import { hasPermission } from '@/utils/permissions';
import { MindmapComments } from '@/components/mindmap/MindmapComments';
import { useAuth } from '@/hooks/useAuth';

export const ProjectTabs = ({ projectId }) => {
  const { user, teamUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const isClient = user?.role === 'client' || teamUser?.role === 'client';
  
  // Get current tab from URL parameter, default to 'mindmap'
  const currentTab = searchParams.get('tab') || 'mindmap';
  
  // Safety check for projectId prop
  if (!projectId) {
    return (
      <div className="overflow-hidden">
        <div className="text-center py-8 text-gray-500">
          <p>No project ID available</p>
        </div>
      </div>
    );
  }

  const userRole = user?.role || teamUser?.role;
  
  // Check if user can edit mindmap (only product owners can edit)
  const canEditMindmap = hasPermission(userRole, 'editMindmap');
  
  // Handle tab change and update URL parameter
  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
  };
  
  // For clients, show mindmap, backlog, and sprints tabs (all read-only)
  if (isClient) {
    return (
      <div className="overflow-hidden">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-3 min-w-max">
              <TabsTrigger value="mindmap" className="px-3 py-2 text-sm">Mindmap</TabsTrigger>
              <TabsTrigger value="backlog" className="px-3 py-2 text-sm">Backlog</TabsTrigger>
              <TabsTrigger value="sprints" className="px-3 py-2 text-sm">Sprints</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="mindmap" className="space-y-4">
            <ProjectMindmap projectId={projectId} readOnly={true} />
            <MindmapComments projectId={projectId} />
          </TabsContent>
          
          <TabsContent value="backlog" className="space-y-4">
            <ProjectBacklog projectId={projectId} readOnly={true} />
          </TabsContent>
          
          <TabsContent value="sprints" className="space-y-4">
            <SprintsSection projectId={projectId} readOnly={true} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-4 min-w-max">
            <TabsTrigger value="mindmap" className="px-3 py-2 text-sm">Mindmap</TabsTrigger>
            <TabsTrigger value="backlog" className="px-3 py-2 text-sm">Backlog</TabsTrigger>
            <TabsTrigger value="sprints" className="px-3 py-2 text-sm">Sprints</TabsTrigger>
            <TabsTrigger value="team" className="px-3 py-2 text-sm">Team</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="mindmap" className="space-y-4">
          <ProjectMindmap projectId={projectId} readOnly={!canEditMindmap} />
          <MindmapComments projectId={projectId} />
        </TabsContent>
        
        <TabsContent value="backlog" className="space-y-4">
          <ProjectBacklog projectId={projectId} readOnly={!canEditMindmap} />
        </TabsContent>
        
        <TabsContent value="sprints" className="space-y-4">
          <SprintsSection projectId={projectId} readOnly={!canEditMindmap} />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <ProjectTeamManagement projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
