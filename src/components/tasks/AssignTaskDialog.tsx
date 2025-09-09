
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, X, User, Check } from 'lucide-react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
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
  email: string;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  useEffect(() => {
    if (open) {
      loadProjectTeamMembers();
      setSelectedAssignee(currentAssignee || '');
    }
  }, [open]);

  console.log(selectedAssignee)
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
    setSearchQuery('');
    onClose();
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
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription>
            Assign "{taskTitle}" to a team member.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="assignee">Assign to *</Label>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search team members by name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 px-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {/* Search Results Info */}
              {searchQuery && (
                <div className="text-xs text-gray-500">
                  Found {getFilteredTeamMembers().length} member(s) matching "{searchQuery}"
                </div>
              )}
              
              {/* Team Members List */}
              <div className="border rounded-lg max-h-60 overflow-y-auto">
                {getFilteredTeamMembers().length > 0 ? (
                  <div className="p-2">
                    {getFilteredTeamMembers().map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedAssignee === member.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                        onClick={() => setSelectedAssignee(member.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{member.name}</div>
                            <div className="text-xs text-gray-500">
                              {member.email} • {member.role.toUpperCase()}  
                            </div>
                          </div>
                        </div>
                        {selectedAssignee === member.id && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No members found matching "{searchQuery}"</p>
                    <p className="text-xs">Try adjusting your search terms</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No team members available</p>
                  </div>
                )}
              </div>
              
              {/* Selected Member Display */}
              {selectedAssignee && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Selected: {teamMembers.find(m => m.id === selectedAssignee)?.name}
                    </span>
                  </div>
                </div>
              )}
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
