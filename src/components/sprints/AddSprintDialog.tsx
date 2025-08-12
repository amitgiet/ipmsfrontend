
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddSprintDialogProps {
  projectId: string;
  onCreateSprint: (sprintData: any) => Promise<any>;
}

type SprintStatus = 'created' | 'running' | 'completed';

export const AddSprintDialog = ({ projectId, onCreateSprint }: AddSprintDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<{
    sprint_name: string;
    start_date: Date | null;
    duration: number;
    status: SprintStatus;
  }>({
    sprint_name: '',
    start_date: null,
    duration: 14,
    status: 'created'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sprint_name || !formData.start_date) {
      return;
    }

    const end_date = addDays(formData.start_date, formData.duration);

    const sprintData = {
      project_id: projectId,
      sprint_name: formData.sprint_name,
      start_date: format(formData.start_date, 'yyyy-MM-dd'),
      end_date: format(end_date, 'yyyy-MM-dd'),
      duration: formData.duration,
      status: formData.status
    };

    const result = await onCreateSprint(sprintData);
    if (result) {
      setFormData({
        sprint_name: '',
        start_date: null,
        duration: 14,
        status: 'created'
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Sprint
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Sprint</DialogTitle>
          <DialogDescription>
            Create a new sprint for this project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sprint_name">Sprint Name</Label>
            <Input
              id="sprint_name"
              value={formData.sprint_name}
              onChange={(e) => setFormData(prev => ({ ...prev, sprint_name: e.target.value }))}
              placeholder="e.g., Sprint 1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start_date ? format(formData.start_date, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.start_date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, start_date: date }))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 14 }))}
              min="1"
              max="90"
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: SprintStatus) => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Sprint</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
