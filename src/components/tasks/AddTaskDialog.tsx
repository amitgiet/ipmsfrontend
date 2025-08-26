
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';
import { useUserRole } from '@/hooks/useUserRole';
import { useTestCaseNotifications } from '@/hooks/useTestCaseNotifications';
import { useParams } from 'react-router-dom';
  
interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (taskData: { title: string; description: string; assignedTo?: string }) => Promise<void>;
  projectId?: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  open,
  onClose,
  onAdd,

}) => {
  const { projectId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userRole, currentUser } = useUserRole();
  const { createTaskAssignmentNotification } = useTestCaseNotifications();

  // Check if user can assign tasks to others (only team leads can)
  const canAssignToOthers = userRole === 'team_lead';

  useEffect(() => {
    if (open && projectId) {
      if (canAssignToOthers) {
        loadProjectTeamMembers();
      } else {
        // For developers and QA, only show self-assignment option
        setSelfAssignmentOption();
      }
    }
  }, [open, canAssignToOthers, projectId]);

  const setSelfAssignmentOption = () => {
    if (currentUser && currentUser.id) {
      const selfOption: TeamMember = {
        id: currentUser.id,
        name: 'Myself',
        email: currentUser.email,
        role: userRole || ''
      };
      setTeamMembers([selfOption]);
      setAssignedTo(currentUser.id); // Set to actual email instead of 'self'
    }
  };

  
  const loadProjectTeamMembers = async () => {
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
    
    if (!title.trim()) return;

    // For developers and QA, ensure they can only assign to themselves
    if ((userRole === 'developer' || userRole === 'qa') && currentUser?.id) {
      // For non-team leads, always assign to themselves
      if (assignedTo !== currentUser.id) {
        console.log('🔄 Auto-assigning task to current user for developer/QA');
        setAssignedTo(currentUser.id);
      }
    }

    setIsSubmitting(true);
    try {
      // Use the assignedTo value directly (already set to email for developers/QA)
      const finalAssignedTo = assignedTo || undefined;

      console.log('🔄 Creating task with assignment:', finalAssignedTo);

      await onAdd({
        title: title.trim(),
        description: description.trim(),
        assignedTo: finalAssignedTo
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setAssignedTo('');
      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setAssignedTo('');
    onClose();
  };

  const getAssignmentLabel = () => {
    if (canAssignToOthers) {
      return "Assign to";
    }
    return "Assigned to"; // For developers/QA who can only assign to themselves
  };

  const getAssignmentPlaceholder = () => {
    if (canAssignToOthers) {
      return "Select team member (optional)...";
    }
    return "Automatically assigned to you";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task for this user story. Tasks help break down the work into manageable pieces.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description..."
                rows={3}
              />
            </div>

            {canAssignToOthers && (
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">{getAssignmentLabel()}</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder={getAssignmentPlaceholder()} />
                  </SelectTrigger>
                  <SelectContent 
                    position="popper" 
                    side="bottom" 
                    align="start"
                    className="max-h-[150px] overflow-y-auto z-[9999] bg-popover border shadow-md"
                    sideOffset={4}
                    avoidCollisions={true}
                    sticky="always"
                  >
                    {teamMembers.map((member) => (
                      <SelectItem 
                        key={member.id} 
                        value={member.id}
                        className="cursor-pointer"
                      >
                        {member.name} ({member.role.toUpperCase()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {!canAssignToOthers && (
              <div className="grid gap-2">
                <Label htmlFor="assignedTo">{getAssignmentLabel()}</Label>
                <div className="p-2 bg-gray-100 rounded border text-sm text-gray-700">
                  Assigned to: {currentUser?.name || currentUser?.email || 'You'}
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
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
