
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SprintKanbanView } from '../SprintKanbanView';
import { SprintBurndownChart } from '../SprintBurndownChart';
import { SprintIssuesView } from '../issues/SprintIssuesView';
import { useUserRole } from '@/hooks/useUserRole';

interface Story {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_progress' | 'qa' | 'done';
  story_points?: number;
  project_id: string;
  created_at: string;
  updated_at: string;
}

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

interface SprintTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sprint: Sprint;
  stories: Story[];
  targetStoryPoints: number;
  onStoryUpdate: (updatedStories: Story[]) => void;
}

export const SprintTabs: React.FC<SprintTabsProps> = ({
  activeTab,
  onTabChange,
  sprint,
  stories,
  targetStoryPoints,
  onStoryUpdate
}) => {
  const { isClient } = useUserRole();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mt-6">
      <TabsList className={`grid w-full ${isClient ? 'grid-cols-3' : 'grid-cols-4'}`}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        <TabsTrigger value="burndown">Burndown Chart</TabsTrigger>
        {!isClient && <TabsTrigger value="issues">Issues</TabsTrigger>}
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Sprint Progress</h3>
              <p className="text-sm text-gray-600 mb-4">
                Track your sprint progress and story completion.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stories Completed</span>
                  <span>{stories.filter(s => s.status === 'done').length} / {stories.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Story Points Completed</span>
                  <span>{stories.filter(s => s.status === 'done').reduce((sum, s) => sum + (s.story_points || 0), 0)} / {targetStoryPoints}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Sprint Status</h3>
              <p className="text-sm text-gray-600 mb-4">
                Current sprint status and duration.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status</span>
                  <span className="capitalize">{sprint.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duration</span>
                  <span>{sprint.duration} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="kanban" className="mt-6">
        <SprintKanbanView
          stories={stories}
          sprintId={sprint.id}
          sprintStatus={sprint.status}
          onStoryUpdate={onStoryUpdate}
          sprint={sprint}
        />
      </TabsContent>

      <TabsContent value="burndown" className="mt-6">
        <SprintBurndownChart 
          sprint={sprint}
          stories={stories}
          targetStoryPoints={targetStoryPoints}
        />
      </TabsContent>

      {!isClient && (
        <TabsContent value="issues" className="mt-6">
          <SprintIssuesView 
            sprintId={sprint.id} 
            stories={stories}
          />
        </TabsContent>
      )}
    </Tabs>
  );
};
