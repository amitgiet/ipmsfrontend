
import React from 'react';
import { ProjectMindmap } from '@/components/projects/ProjectMindmap';
import { ProjectBacklog } from '@/components/projects/ProjectBacklog';
import { SprintsSection } from '@/components/sprints/SprintsSection';
import { MindmapComments } from '@/components/mindmap/MindmapComments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, FileText, Calendar } from 'lucide-react';

interface ClientMindmapViewProps {
  projectId: string;
  projectName: string;
}

export const ClientMindmapView = ({ projectId, projectName }: ClientMindmapViewProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {projectName}
          </CardTitle>
          <CardDescription>
            Project overview - you can view the mindmap, backlog, sprints, and submit change requests
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="mindmap" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mindmap" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Mindmap
          </TabsTrigger>
          <TabsTrigger value="backlog" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Backlog & Change Requests
          </TabsTrigger>
          <TabsTrigger value="sprints" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Sprints
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="mindmap" className="space-y-4">
          <ProjectMindmap projectId={projectId} readOnly={true} />
          <MindmapComments projectId={projectId} />
        </TabsContent>
        
        <TabsContent value="backlog" className="space-y-4">
          <ProjectBacklog projectId={projectId} readOnly={false} />
        </TabsContent>
        
        <TabsContent value="sprints" className="space-y-4">
          <SprintsSection projectId={projectId} readOnly={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
