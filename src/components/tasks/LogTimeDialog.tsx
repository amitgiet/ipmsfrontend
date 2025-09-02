
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

interface LogTimeDialogProps {
  open: boolean;
  onClose: () => void;
  onLogTime: (timeData: { startTime: string; endTime: string; timeSpentMinutes: number; taskId: string }) => Promise<void>;
  taskTitle: string;
  taskAssignedTo?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  currentUserEmail: string;
  userRole: string;
  sprintStatus?: 'created' | 'running' | 'completed';
  projectStatus?: string; // Add project status prop
  taskId: string;
}

export const LogTimeDialog: React.FC<LogTimeDialogProps> = ({
  open,
  onClose,
  onLogTime,
  taskTitle,
  taskAssignedTo,
  sprintStatus,
  projectStatus,
  taskId
}) => {
    const { user } = useAuth();
    const userRole = user?.role;
    const currentUserEmail = user?.email;
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    if (!startTime || !endTime || timeSpentMinutes <= 0) return;

    setIsSubmitting(true);
    try {
      await onLogTime({
        startTime,
        endTime,
        timeSpentMinutes,
        taskId: taskId
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
