
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
import { Search, X } from 'lucide-react';
  
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
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
    setLoadingTeamMembers(true);
    try {
      let allTeamMembers: TeamMember[] = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const { data, error } = await apiCall(
          `${allRoutes.projects.getTeamMembersDropdown(projectId)}?page=${currentPage}&per_page=100&for_task=1`, 
          'get'
        );

        if (error) {
          console.error('Error loading team members:', error);
          break;
        }

        if (data && data.data) {
          allTeamMembers = [...allTeamMembers, ...data.data];
          
          // Check if there are more pages
          if (data.meta && currentPage < data.meta.last_page) {
            currentPage++;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
      }

      setTeamMembers(allTeamMembers);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoadingTeamMembers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    // For developers and QA, ensure they can only assign to themselves
    if ((userRole === 'developer' || userRole === 'qa') && currentUser?.id) {
      // For non-team leads, always assign to themselves
      if (assignedTo !== currentUser.id) { 
        setAssignedTo(currentUser.id);
      }
    }

    setIsSubmitting(true);
    try {
      // Use the assignedTo value directly (already set to email for developers/QA)
      const finalAssignedTo = assignedTo || undefined;
 

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
    setSearchQuery('');
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

  const getSelectedMemberName = () => {
    if (!assignedTo) return "";
    const selectedMember = teamMembers.find(member => member.id == assignedTo);
    return selectedMember ? `${selectedMember.name} (${selectedMember.role.toUpperCase()})` : "";
  };

  const getFilteredTeamMembers = () => {
    if (!searchQuery.trim()) return teamMembers;
    
    const query = searchQuery.toLowerCase();
    return teamMembers.filter(member => 
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
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
                <Select value={assignedTo} onValueChange={setAssignedTo} disabled={loadingTeamMembers}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingTeamMembers ? "Loading team members..." : getAssignmentPlaceholder()}>
                      {assignedTo ? getSelectedMemberName() : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent 
                    position="popper" 
                    side="bottom" 
                    align="start"
                    className="max-h-[300px] overflow-y-auto z-[9999] bg-popover border shadow-md"
                    sideOffset={4}
                    avoidCollisions={true}
                    sticky="always"
                  >
                    {loadingTeamMembers ? (
                      <div className="p-2 text-center text-sm text-gray-500">
                        Loading team members...
                      </div>
                    ) : (
                      <>
                        {/* Search Input */}
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search team members..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-8 pr-8 h-8 text-sm"
                            />
                            {searchQuery && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearSearch}
                                className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-gray-100"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Team Members List */}
                        <div className="max-h-[200px] overflow-y-auto">
                          {getFilteredTeamMembers().length > 0 ? (
                            getFilteredTeamMembers().map((member) => (
                              <SelectItem 
                                key={member.id} 
                                value={member.id}
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{member.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {member.email} • {member.role.toUpperCase()}
                                  </span>
                                </div>
                              </SelectItem>
                            ))
                          ) : searchQuery ? (
                            <div className="p-2 text-center text-sm text-gray-500">
                              No team members found matching "{searchQuery}"
                            </div>
                          ) : (
                            <div className="p-2 text-center text-sm text-gray-500">
                              No team members found
                            </div>
                          )}
                        </div>
                      </>
                    )}
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
