
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useSprintManagement } from '@/hooks/useSprintManagement';
import { SprintHeader } from './management/SprintHeader';
import { SprintSummaryCards } from './management/SprintSummaryCards';
import { SprintDetailsCard } from './management/SprintDetailsCard';
import { SprintTabs } from './management/SprintTabs';
import { apiCall } from '@/services/apiCall';
import { toast } from 'react-toastify';
import { allRoutes } from '@/services/routes';

  const SprintManagementPage = () => {
  const { sprintId, projectId } = useParams();

  const {
    sprint,
    stories,
    targetStoryPoints,
    completedStoryPoints,
    loading,
    goBack,
    updateStories,
    updateSprintStatus,
    fetchSprintData
  } = useSprintManagement(sprintId, projectId);
  const moveStoriesToBacklog = async (storyIds: string[]) => {
    try {
      // Remove stories from sprint backlog
      const { error: removeError } = await apiCall(allRoutes.sprints.removeTask(sprintId!, storyIds), 'DELETE');

      if (removeError) {
        toast.error("Failed to move stories to backlog");
        return;
      }

      // Update story status back to 'ready' (backlog status)
      const { error: updateError } = await apiCall(allRoutes.stories.update(storyIds), 'PUT', { status: 'ready' });

      if (updateError) {
        toast.error("Stories removed from sprint but status may need manual update");
      }

      toast.success(`${storyIds.length} story(ies) moved back to backlog`);

      // Refresh sprint data
      await fetchSprintData();
    } catch (error) {
      toast.error("Failed to move stories to backlog");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Sprint Not Found</CardTitle>
            <CardDescription>The requested sprint could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleStatusChange = () => {
    if (sprint.status === 'created') {
      updateSprintStatus('start');
    } else if (sprint.status === 'running') {
      updateSprintStatus('complete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SprintHeader
          sprint={sprint}
          stories={stories}
          onGoBack={goBack}
          onStatusChange={handleStatusChange}
          onMoveStoriesToBacklog={moveStoriesToBacklog}
        />

        <SprintSummaryCards
          duration={sprint.duration}
          targetStoryPoints={sprint.user_story_story_point_sum}
          progress={sprint.progress}
          completedStoryPoints={sprint.user_stories_completed_story_point_sum}
        />

        <SprintDetailsCard
          sprint={sprint}
          stories={stories}
        />

        <SprintTabs
          sprint={sprint}
          stories={stories}
          targetStoryPoints={targetStoryPoints}
          onStoryUpdate={updateStories}
        />
      </div>
    </div>
  );
};

export default SprintManagementPage;