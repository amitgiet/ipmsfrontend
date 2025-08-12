
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useSprintManagement } from '@/hooks/useSprintManagement';
import { SprintHeader } from './management/SprintHeader';
import { SprintSummaryCards } from './management/SprintSummaryCards';
import { SprintDetailsCard } from './management/SprintDetailsCard';
import { SprintTabs } from './management/SprintTabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const SprintManagementPage = () => {
  const { sprintId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

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
  } = useSprintManagement(sprintId);

  const moveStoriesToBacklog = async (storyIds: string[]) => {
    try {
      console.log('🔄 Moving stories to backlog:', storyIds);

      // Remove stories from sprint backlog
      const { error: removeError } = await supabase
        .from('sprint_backlog')
        .delete()
        .in('story_id', storyIds)
        .eq('sprint_id', sprintId!);

      if (removeError) {
        console.error('❌ Error removing stories from sprint:', removeError);
        toast({
          title: "Error",
          description: "Failed to move stories to backlog",
          variant: "destructive",
        });
        return;
      }

      // Update story status back to 'ready' (backlog status)
      const { error: updateError } = await supabase
        .from('user_stories')
        .update({ status: 'ready' })
        .in('id', storyIds);

      if (updateError) {
        console.error('❌ Error updating story status:', updateError);
        toast({
          title: "Warning",
          description: "Stories removed from sprint but status may need manual update",
          variant: "destructive",
        });
      }

      console.log('✅ Successfully moved stories to backlog');
      toast({
        title: "Success",
        description: `${storyIds.length} story(ies) moved back to backlog`,
      });

      // Refresh sprint data
      await fetchSprintData();
    } catch (error) {
      console.error('❌ Error in moveStoriesToBacklog:', error);
      toast({
        title: "Error",
        description: "Failed to move stories to backlog",
        variant: "destructive",
      });
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
      updateSprintStatus('running');
    } else if (sprint.status === 'running') {
      updateSprintStatus('completed');
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
          targetStoryPoints={targetStoryPoints}
          completedStoryPoints={completedStoryPoints}
        />

        <SprintDetailsCard
          sprint={sprint}
          stories={stories}
        />

        <SprintTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sprint={sprint}
          stories={stories}
          targetStoryPoints={targetStoryPoints}
          onStoryUpdate={updateStories}
        />
      </div>
    </div>
  );
};
