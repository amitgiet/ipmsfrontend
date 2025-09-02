
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

interface AssignTaskDialogProps {
  open: boolean;
  taskTitle: string;
  currentAssignee?: string;
  onClose: () => void;
  onAssign: (assignedTo: string) => Promise<void>;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export const AssignTaskDialog: React.FC<AssignTaskDialogProps> = ({
  open,
  taskTitle,
  currentAssignee,
  onClose,
  onAssign
}) => {
  const { projectId } = useParams();
  const [selectedAssignee, setSelectedAssignee] = useState(currentAssignee || '');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      loadTeamMembers();
    }
  }, [open]);

  const loadTeamMembers = async () => {
    try {
        const { data, error } = await apiCall(allRoutes.projects.getTeamMembersDropdown(projectId), 'get');

      if (error) {
        console.error('Error loading team members:', error);
        return;
      }

      if (data) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssignee) return;

    setIsSubmitting(true);
    try {
      await onAssign(selectedAssignee);
    } catch (error) {
      console.error('Error assigning task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedAssignee(currentAssignee || '');
    onClose();
  };
 
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription>
            Assign "{taskTitle}" to a team member.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="assignee">Assign to *</Label>
              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member..." />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.role.replace('_', ' ').toUpperCase()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedAssignee || isSubmitting}
            >
              {isSubmitting ? 'Assigning...' : 'Assign Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
