
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { calculateDurationMinutes, formatDurationDisplay } from '@/utils/timeCalculations';

interface Project {
  id: string;
  project_name: string;
}

interface ProductOwnerTimeLogFormProps {
  projects: Project[];
  projectId: string;
  setProjectId: (value: string) => void;
  activityType: string;
  setActivityType: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ProductOwnerTimeLogForm: React.FC<ProductOwnerTimeLogFormProps> = ({
  projects,
  projectId,
  setProjectId,
  activityType,
  setActivityType,
  description,
  setDescription,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isSubmitting,
  onSubmit,
  onCancel
}) => {
  const durationMinutes = calculateDurationMinutes(startTime, endTime);
  const durationFormatted = formatDurationDisplay(durationMinutes);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="project">Project *</Label>
            <Select 
              value={projectId} 
              onValueChange={setProjectId}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.project_name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-projects" disabled>
                    No projects available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="activityType">Activity Type *</Label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger id="activityType">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grooming">Grooming</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="sprint_management">Sprint Management</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="review">Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="startTime">Start Time *</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="endTime">End Time *</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          {durationMinutes > 0 && (
            <div className="grid gap-2">
              <Label>Duration</Label>
              <div className="p-2 bg-gray-50 rounded border text-sm font-medium">
                {durationFormatted}
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional description of the activity..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </ScrollArea>
      
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 mt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!projectId || !activityType || !startTime || !endTime || durationMinutes <= 0 || isSubmitting}
        >
          {isSubmitting ? 'Logging...' : 'Log Time'}
        </Button>
      </div>
    </form>
  );
};
