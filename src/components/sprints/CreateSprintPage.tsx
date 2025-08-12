
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { calculateEndDate } from '@/utils/dateCalculations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SprintDetailsForm } from './SprintDetailsForm';
import { SprintBacklogSelector } from './SprintBacklogSelector';
import { CreateSprintActions } from './CreateSprintActions';

interface UserStory {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready';
  storyPoints?: number;
}

interface CreateSprintPageProps {
  projectId: string;
  onBack: () => void;
  onSprintCreated: () => void;
}

export const CreateSprintPage = ({ projectId, onBack, onSprintCreated }: CreateSprintPageProps) => {
  const [sprintName, setSprintName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState(14);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [readyStories, setReadyStories] = useState<UserStory[]>([]);
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  // Calculate end date when start date or duration changes
  useEffect(() => {
    if (startDate && duration > 0) {
      const calculatedEndDate = calculateEndDate(startDate, duration);
      setEndDate(calculatedEndDate);
    }
  }, [startDate, duration]);

  // Load ready user stories that are not already assigned to any sprint
  useEffect(() => {
    const loadUnassignedStories = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading unassigned ready stories for project:', projectId);
        
        // Get all ready stories for this project
        const { data: allStories, error: storiesError } = await supabase
          .from('user_stories')
          .select('*')
          .eq('project_id', projectId)
          .eq('status', 'ready')
          .order('priority', { ascending: false });

        if (storiesError) {
          console.error('❌ Error loading stories:', storiesError);
          toast({
            title: "Error",
            description: "Failed to load user stories",
            variant: "destructive",
          });
          return;
        }

        // Get all story IDs that are already assigned to sprints
        const { data: assignedStories, error: assignedError } = await supabase
          .from('sprint_backlog')
          .select('story_id');

        if (assignedError) {
          console.error('❌ Error loading assigned stories:', assignedError);
          toast({
            title: "Error",
            description: "Failed to check assigned stories",
            variant: "destructive",
          });
          return;
        }

        // Filter out already assigned stories
        const assignedStoryIds = new Set(assignedStories?.map(item => item.story_id) || []);
        const unassignedStories = allStories?.filter(story => !assignedStoryIds.has(story.id)) || [];

        console.log('✅ Found unassigned stories:', unassignedStories.length);

        const mappedStories: UserStory[] = unassignedStories.map(story => ({
          id: story.id,
          title: story.title,
          description: story.description || undefined,
          priority: story.priority as 'low' | 'medium' | 'high' | 'urgent',
          status: story.status as 'to_do' | 'in_grooming' | 'ready',
          storyPoints: story.story_points || undefined,
        }));

        setReadyStories(mappedStories);
      } catch (error) {
        console.error('❌ Error loading unassigned stories:', error);
        toast({
          title: "Error",
          description: "Failed to load available user stories",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUnassignedStories();
  }, [projectId]);

  const handleStorySelection = (storyId: string, checked: boolean) => {
    if (checked) {
      setSelectedStories(prev => [...prev, storyId]);
    } else {
      setSelectedStories(prev => prev.filter(id => id !== storyId));
    }
  };

  const handleCreateSprint = async () => {
    if (!sprintName.trim() || !startDate || !endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (selectedStories.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one user story for the sprint",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreating(true);
      console.log('🔄 Creating sprint:', { sprintName, startDate, endDate, duration, selectedStories });

      // Create the sprint
      const sprintData = {
        project_id: projectId,
        sprint_name: sprintName,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
        duration: duration,
        status: 'created' as const
      };

      const { data: sprint, error: sprintError } = await supabase
        .from('sprints')
        .insert([sprintData])
        .select()
        .single();

      if (sprintError) {
        console.error('❌ Error creating sprint:', sprintError);
        
        if (sprintError.code === '42501') {
          toast({
            title: "Permission Error",
            description: "You don't have permission to create sprints. Please contact your administrator.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to create sprint: " + sprintError.message,
            variant: "destructive",
          });
        }
        return;
      }

      console.log('✅ Sprint created successfully:', sprint);

      // Add selected stories to the sprint backlog
      const sprintBacklogEntries = selectedStories.map(storyId => ({
        sprint_id: sprint.id,
        story_id: storyId
      }));

      const { error: backlogError } = await supabase
        .from('sprint_backlog')
        .insert(sprintBacklogEntries);

      if (backlogError) {
        console.error('❌ Error adding stories to sprint:', backlogError);
        toast({
          title: "Warning",
          description: "Sprint created but failed to add some stories. You can add them later.",
          variant: "destructive",
        });
      } else {
        console.log('✅ Added stories to sprint backlog');
      }

      toast({
        title: "Success",
        description: `Sprint "${sprintName}" created successfully with ${selectedStories.length} user stories`,
      });

      onSprintCreated();
    } catch (error) {
      console.error('❌ Error creating sprint:', error);
      toast({
        title: "Error",
        description: "Failed to create sprint",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sprints
        </Button>
        <h1 className="text-2xl font-bold">Create New Sprint</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SprintDetailsForm
          sprintName={sprintName}
          setSprintName={setSprintName}
          startDate={startDate}
          setStartDate={setStartDate}
          duration={duration}
          setDuration={setDuration}
          endDate={endDate}
        />

        <SprintBacklogSelector
          loading={loading}
          readyStories={readyStories}
          selectedStories={selectedStories}
          onStorySelection={handleStorySelection}
        />
      </div>

      <CreateSprintActions
        onBack={onBack}
        onCreateSprint={handleCreateSprint}
        creating={creating}
        sprintName={sprintName}
        startDate={startDate}
        selectedStories={selectedStories}
      />
    </div>
  );
};
