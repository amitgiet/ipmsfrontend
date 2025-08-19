
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

export const ProjectTeamManagement = ({ projectId }) => {
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjectTeamMembers();
    fetchAvailableTeamMembers();
  }, [projectId]);

  const fetchProjectTeamMembers = async () => {
    try {
      const { data, error } = await apiCall(allRoutes.projects.getAssignedUsers(projectId), 'get');
      if (error) {
        console.error('Error fetching project team members:', error);
        toast.error("Failed to fetch project team members");
        return;
      }
      setAssignedMembers(data.data);

      if (data.data.length === 0) {
        console.log('No team members assigned to this project');
        setAssignedMembers([]);
        return;
      }

      // Get team member details and combine with assignment data

      console.log('Formatted assigned members:', data.data);
      setAssignedMembers(data.data);
    } catch (error) {
      console.error('Error fetching project team members:', error);
      toast.error("Failed to fetch project team members");
    }
  };

  const fetchAvailableTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await apiCall(allRoutes.projects.getTeamMembersDropdown(projectId), 'get');
      if (error) {
        console.error('Error fetching available team members:', error);
        toast.error("Failed to fetch available team members");
        return;
      }
      setAvailableMembers(data.data);
    } catch (error) {
      console.error('Error fetching available team members:', error);
      toast.error("Failed to fetch available team members");
    } finally {
      setLoading(false);
    }
  };

  const assignTeamMember = async () => {
    if (!selectedMemberId) {
      console.warn('No team member selected');
      return;
    }

    try {
      const { error } = await apiCall(allRoutes.projects.addTeamMember, 'post', {
        project_id: projectId,
        user_id: selectedMemberId
      });
      if (error) {
        console.error('Error assigning team member:', error);
        toast.error("Failed to assign team member to project");
        return;
      }
      toast.success("Team member assigned to project successfully");

      setSelectedMemberId('');
      setDialogOpen(false);
      fetchProjectTeamMembers();
    } catch (error) {
      console.error('Error assigning team member:', error);
      toast.error("Failed to assign team member to project");
    }
  };

  const removeTeamMember = async (teamMemberId) => {
    try {
      console.log('Removing team member:', { projectId, teamMemberId });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Remove assignment from demo data
      const assignmentIndex = demoProjectAssignments.findIndex(
        assignment => assignment.project_id === projectId && assignment.team_member_id === teamMemberId
      );

      if (assignmentIndex !== -1) {
        demoProjectAssignments.splice(assignmentIndex, 1);
      }

      toast.success("Team member removed from project successfully");

      fetchProjectTeamMembers();
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error("Failed to remove team member from project");
    }
  };

  const getUnassignedMembers = () => {
    const assignedMemberIds = assignedMembers.map(member => member.id);
    const unassigned = availableMembers.filter(member => !assignedMemberIds.includes(member.id));
    console.log('Unassigned members:', unassigned);
    return unassigned;
  };

  useEffect(() => {
    fetchProjectTeamMembers();
    fetchAvailableTeamMembers();
  }, [projectId]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Manage team members assigned to this project
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="self-start sm:self-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Team Member to Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Team Member</label>
                  <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a team member" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      side="bottom"
                      align="start"
                      className="max-h-[200px] overflow-y-auto z-[9999] bg-popover border shadow-md"
                      sideOffset={4}
                      avoidCollisions={true}
                      sticky="always"
                    >
                      {getUnassignedMembers().map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{member.name}</span>
                            <span className="text-xs text-gray-500">{member.role} • {member.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getUnassignedMembers().length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      All active team members are already assigned to this project.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={assignTeamMember}
                    disabled={!selectedMemberId}
                    className="flex-1"
                  >
                    Assign Member
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading team members...</p>
          </div>
        ) : assignedMembers.length > 0 ? (
          <div className="space-y-3">
            {assignedMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm break-words">{member.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 break-all">{member.email}</p>
                  {member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {member.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{member.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Assigned: {new Date(member.assigned_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTeamMember(member.id)}
                  className="ml-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No team members assigned yet</p>
            <p className="text-sm mt-2">Add team members to start collaborating on this project.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
