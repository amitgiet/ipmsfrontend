
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { calculateEndDate } from '@/utils/dateCalculations';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';
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

        const { data: allStories, error: storiesError } = await apiCall(allRoutes.stories.list(projectId, null, 'for_sprint'), 'get');

        if (storiesError) {
          toast.error("Failed to load user stories");
          return;
        }

        const mappedStories: UserStory[] = allStories.data.map((story: any) => ({
          id: story.id,
          title: story.title,
          description: story.description,
          priority: story.priority,
          status: story.status,
          storyPoints: story.story_point
        }));

        setReadyStories(mappedStories);
      } catch (error) {
        console.error("Failed to load user stories", error);
        toast.error("Failed to load available user stories");
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
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedStories.length === 0) {
      toast.error("Please select at least one user story for the sprint");
      return;
    }

    try {
      setCreating(true);
      // Create the sprint
      const sprintData = new FormData();

      sprintData.append('project_id', projectId);
      sprintData.append('name', sprintName);
      sprintData.append('start_date', format(startDate, 'yyyy-MM-dd'));
      sprintData.append('end_date', format(endDate, 'yyyy-MM-dd'));
      sprintData.append('duration', duration.toString());
      selectedStories.forEach(storyId => {
        sprintData.append('user_stories[]', storyId);
      });

      const { data: sprint, error: sprintError } = await apiCall(allRoutes.sprints.create, 'post', sprintData);
      if (!sprintError) {
        toast.success(`Sprint "${sprint.data.name}" created successfully`);
        onSprintCreated();
      }


    } catch (error) {
      console.error("Failed to create sprint", error);
      toast.error("Failed to create sprint");
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
          loading={false}
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
