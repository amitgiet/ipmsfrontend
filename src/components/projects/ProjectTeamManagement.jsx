
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Plus, X, Users, Check, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useAuth } from '@/hooks/useAuth';

export const ProjectTeamManagement = ({ projectId }) => {
  const { user } = useAuth();
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchProjectTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await apiCall(allRoutes.projects.getAssignedUsers(projectId), 'get');
      if (error) {
        console.error('Error fetching project team members:', error);
        toast.error("Failed to fetch project team members");
        return;
      }
      setAssignedMembers(data.data);

      if (data.data.length === 0) {
        setAssignedMembers([]);
        return;
      }

      // Get team member details and combine with assignment data

      setAssignedMembers(data.data);
    } catch (error) {
      console.error('Error fetching project team members:', error);
      toast.error("Failed to fetch project team members");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await apiCall(allRoutes.projects.getTeamMembersDropdown(projectId), 'get');
      if (error) {
        console.error('Error fetching available team members:', error);
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

  const assignTeamMembers = async () => {
    if (selectedMemberIds.length === 0) {
      console.warn('No team members selected');
      return;
    }

    try {
      setLoading(true);
      
      // Assign multiple team members sequentially
      const promises = selectedMemberIds.map(memberId => 
        apiCall(allRoutes.projects.addTeamMember, 'post', {
          project_id: projectId,
          user_id: memberId
        })
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        console.error('Some team members failed to assign:', errors);
        toast.error(`${errors.length} team member(s) failed to assign`);
      }
      
      if (results.length - errors.length > 0) {
        toast.success(`${results.length - errors.length} team member(s) assigned to project successfully`);
      }

      setSelectedMemberIds([]);
      setSearchQuery('');
      setDialogOpen(false);
      fetchProjectTeamMembers();
    } catch (error) {
      console.error('Error assigning team members:', error);
      toast.error("Failed to assign team members to project");
    } finally {
      setLoading(false);
    }
  };

  const removeTeamMember = async (teamMemberId) => {
    try {
      const { error } = await apiCall(allRoutes.projects.removeTeamMember(projectId, teamMemberId), 'delete');
      if (!error) {
        toast.success("Team member removed from project successfully");
        fetchProjectTeamMembers();
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error("Failed to remove team member from project");
    }
  };

  const getUnassignedMembers = () => {
    const assignedMemberIds = assignedMembers.map(member => member.id);
    const unassigned = availableMembers.filter(member => !assignedMemberIds.includes(member.id));
    return unassigned;
  };

  const getFilteredUnassignedMembers = () => {
    const unassigned = getUnassignedMembers();
    if (!searchQuery.trim()) return unassigned;
    
    const query = searchQuery.toLowerCase();
    return unassigned.filter(member => 
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    );
  };

  const handleMemberSelection = (memberId, checked) => {
    if (checked) {
      setSelectedMemberIds(prev => [...prev, memberId]);
    } else {
      setSelectedMemberIds(prev => prev.filter(id => id !== memberId));
    }
  };

  const getSelectedMembersCount = () => {
    return selectedMemberIds.length;
  };

  const getSelectedMembersNames = () => {
    const selectedMembers = availableMembers.filter(member => selectedMemberIds.includes(member.id));
    return selectedMembers.map(member => member.name).join(', ');
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'client':
        return 'bg-blue-100 text-blue-800';
      case 'product_owner':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchProjectTeamMembers();
    if (user.role === 'admin' || user.role === 'super-admin' || user.role === 'team_lead' || user.role === 'product_owner') {
      fetchAvailableTeamMembers();
    }
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
          {(user.role === 'admin' || user.role === 'super-admin' || user.role === 'team_lead' || user.role === 'product_owner') && <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="self-start sm:self-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Team Members to Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                                  <div>
                    <label className="text-sm font-medium">Select Team Members</label>
                    
                    {/* Selected Members Display */}
                    {getSelectedMembersCount() > 0 && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              {getSelectedMembersCount()} member(s) selected
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMemberIds([])}
                            className="h-6 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          >
                            Clear
                          </Button>
                        </div>
                        <p className="text-xs text-blue-700 break-words">
                          {getSelectedMembersNames()}
                        </p>
                      </div>
                    )}
                    
                    {/* Search Bar */}
                    <div className="mt-3 relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search team members by name, email, or role..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        {searchQuery && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSearch}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 px-2 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Search Results Info */}
                    {searchQuery && (
                      <div className="mt-2 text-xs text-gray-500">
                        Found {getFilteredUnassignedMembers().length} member(s) matching "{searchQuery}"
                      </div>
                    )}
                    
                    {/* Multi-Select Checkbox List */}
                    <div className="mt-3 max-h-[300px] overflow-y-auto border rounded-lg p-2 space-y-2">
                      {getFilteredUnassignedMembers().map((member) => (
                        <div key={member.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                          <Checkbox
                            id={`member-${member.id}`}
                            checked={selectedMemberIds.includes(member.id)}
                            onCheckedChange={(checked) => handleMemberSelection(member.id, checked)}
                          />
                          <label htmlFor={`member-${member.id}`} className="flex-1 cursor-pointer">
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{member.name}</span>
                              <span className="text-xs text-gray-500">
                                {member.role.replace('_', ' ').toUpperCase()} • {member.email}
                              </span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    {getFilteredUnassignedMembers().length === 0 && searchQuery && (
                      <div className="text-center py-4 text-gray-500">
                        <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No members found matching "{searchQuery}"</p>
                        <p className="text-xs">Try adjusting your search terms</p>
                      </div>
                    )}
                    
                    {getFilteredUnassignedMembers().length === 0 && !searchQuery && (
                      <p className="text-sm text-gray-500 mt-2">
                        All active team members are already assigned to this project.
                      </p>
                    )}
                  </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={assignTeamMembers}
                    disabled={getSelectedMembersCount() === 0}
                    className="flex-1"
                  >
                    Assign {getSelectedMembersCount() > 0 ? `${getSelectedMembersCount()} Member(s)` : 'Members'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      setSelectedMemberIds([]);
                      setSearchQuery('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>}
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
                    <Badge variant="outline" className={`text-xs ${getRoleBadgeColor(member.role)}`}>
                      {member.role.replace('_', ' ').toUpperCase()}
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
                    Assigned: {new Date(member.created_at).toLocaleDateString()}
                  </p>
                </div>
                {member.id !== user.id && (user.role === 'admin' || user.role === 'super-admin' || user.role === 'team_lead' || user.role === 'product_owner') && <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTeamMember(member.id)}
                  className="ml-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>}
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
