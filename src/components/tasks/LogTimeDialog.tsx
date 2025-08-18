
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LogTimeDialogProps {
  open: boolean;
  onClose: () => void;
  onLogTime: (timeData: { startTime: string; endTime: string; timeSpentMinutes: number }) => Promise<void>;
  taskTitle: string;
  taskAssignedTo?: string;
  currentUserEmail: string;
  userRole: string;
  sprintStatus?: 'created' | 'running' | 'completed';
  projectStatus?: string; // Add project status prop
}

export const LogTimeDialog: React.FC<LogTimeDialogProps> = ({
  open,
  onClose,
  onLogTime,
  taskTitle,
  taskAssignedTo,
  currentUserEmail,
  userRole,
  sprintStatus,
  projectStatus
}) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTimeSpent = (start: string, end: string): number => {
    if (!start || !end) return 0;
    
    const startDate = new Date(`1970-01-01T${start}:00`);
    const endDate = new Date(`1970-01-01T${end}:00`);
    
    // Handle case where end time is next day
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.round(diffMs / (1000 * 60)); // Convert to minutes
  };

  const timeSpentMinutes = calculateTimeSpent(startTime, endTime);
  const timeSpentFormatted = timeSpentMinutes > 0 
    ? `${Math.floor(timeSpentMinutes / 60)}h ${timeSpentMinutes % 60}m`
    : '0h 0m';

  // Check if the current user can log time to this task
  const canLogTime = () => {
    // Check if project is in progress
    if (projectStatus && projectStatus !== 'in-progress') {
      return false;
    }

    // Only allow time logging if sprint is running
    if (sprintStatus && sprintStatus !== 'running') {
      return false;
    }

    // Team leads can log time to any task
    if (userRole === 'team_lead') return true;
    
    // QA and developers can only log time to tasks assigned to them
    if ((userRole === 'qa' || userRole === 'developer') && taskAssignedTo) {
      return taskAssignedTo === currentUserEmail;
    }
    
    // If no assignment, allow (for backward compatibility)
    return !taskAssignedTo;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canLogTime()) {
      return;
    }
    
    if (!startTime || !endTime || timeSpentMinutes <= 0) return;

    setIsSubmitting(true);
    try {
      await onLogTime({
        startTime,
        endTime,
        timeSpentMinutes
      });
      
      // Reset form
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error('Error logging time:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStartTime('');
    setEndTime('');
    onClose();
  };

  if (!canLogTime()) {
    let errorMessage = "You can only log time to tasks assigned to you.";
    let details = `This task is assigned to: ${taskAssignedTo || 'No one'}`;
    
    if (projectStatus && projectStatus !== 'in-progress') {
      errorMessage = "Time logging is only available when the project is in progress.";
      details = `Project status: ${projectStatus}`;
    } else if (sprintStatus && sprintStatus !== 'running') {
      errorMessage = "Time logging is only available when the sprint is in progress.";
      details = `Sprint status: ${sprintStatus}`;
    }

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cannot Log Time</DialogTitle>
            <DialogDescription>
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {details}
            </p>
            {projectStatus !== 'in-progress' ? (
              <p className="text-sm text-gray-600 mt-2">
                Time logging is only allowed when the project is in progress.
              </p>
            ) : sprintStatus !== 'running' ? (
              <p className="text-sm text-gray-600 mt-2">
                Time logging is only allowed during active sprints.
              </p>
            ) : (
              <p className="text-sm text-gray-600 mt-2">
                Only the assigned team member can log time to this task.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log Time</DialogTitle>
          <DialogDescription>
            Log time spent on task: {taskTitle}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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

            {timeSpentMinutes > 0 && (
              <div className="grid gap-2">
                <Label>Time Spent</Label>
                <div className="p-2 bg-gray-50 rounded border text-sm font-medium">
                  {timeSpentFormatted}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!startTime || !endTime || timeSpentMinutes <= 0 || isSubmitting}
            >
              {isSubmitting ? 'Logging...' : 'Log Time'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
