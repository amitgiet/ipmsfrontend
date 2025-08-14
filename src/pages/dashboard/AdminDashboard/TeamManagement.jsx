import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TeamMemberForm } from '@/components/team/TeamMemberForm.tsx';
import { TeamMembersTable } from '@/components/team/TeamMembersTable';
// import { ExcelImportDialog } from '@/components/team/ExcelImportDialog';
import { useToast } from '@/hooks/use-toast';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

export const TeamManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_no: '',
    emergency_contact: '',
    password: '',
    role: 'developer',
    skills: [],
    is_active: true,
  });

  // Fetch team members on component mount
  useEffect(() => {
    fetchTeamMembers(1);
  }, []);

  const fetchTeamMembers = async (page = 1) => {
    setLoading(true);
    try {
      const result = await apiCall(`${allRoutes.teams.list}?page=${page}`, 'get');
      
      if (result.success) {
        const members = result.data.data || result.data || [];
        const meta = result.data.meta || {};
        
        setTeamMembers(members);
        setPagination({
          current_page: meta.current_page || 1,
          last_page: meta.last_page || 1,
          per_page: meta.per_page || 10,
          total: meta.total || 0
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch team members. Please try again.",
          variant: "destructive",
        });
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch team members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchTeamMembers(newPage);
    }
  };

  const saveTeamMember = async (memberData, editingMember) => {
    setSaving(true);
    try {
      // Transform the data to match API expectations
      const transformedData = {
        ...memberData,
        phone: memberData.mobile_no, // Transform mobile_no to phone
        // Remove mobile_no if it exists to avoid confusion
        mobile_no: undefined
      };
      
      // Remove undefined fields
      Object.keys(transformedData).forEach(key => {
        if (transformedData[key] === undefined) {
          delete transformedData[key];
        }
      });

      console.log('Sending team member data:', transformedData);

      let result;
      if (editingMember) {
        // Update existing team member
        result = await apiCall(
          allRoutes.teams.update(editingMember.id),
          'put',
          transformedData
        );
      } else {
        // Create new team member
        result = await apiCall(
          allRoutes.teams.create,
          'post',
          transformedData
        );
      }

      if (result.success) {
        toast({
          title: "Success",
          description: editingMember 
            ? "Team member updated successfully" 
            : "Team member created successfully",
        });
        
        // Refresh the team members list
        await fetchTeamMembers(pagination.current_page);
        return true;
      } 
    } catch (error) {
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteTeamMember = async (memberId) => {
    try {
      const result = await apiCall(
        allRoutes.teams.delete(memberId),
        'delete'
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Team member deleted successfully",
        });
        
        // Refresh the team members list
        await fetchTeamMembers(pagination.current_page);
      } else {
        toast({
          title: "Error",
          description: result.error?.message || "Failed to delete team member. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (memberId, currentStatus) => {
    try {
      const result = await apiCall(
        allRoutes.teams.update(memberId),
        'put',
        { is_active: !currentStatus }
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `Team member ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
        });
        
        // Refresh the team members list
        await fetchTeamMembers(pagination.current_page);
      } else {
        toast({
          title: "Error",
          description: result.error?.message || "Failed to update team member status. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team member status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile_no: '',
      emergency_contact: '',
      password: '',
      role: 'developer',
      skills: [],
      is_active: true,
    });
    setEditingMember(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveTeamMember(formData, editingMember);
    if (success) {
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const handleEdit = (member) => {
    console.log('Raw member data from API:', member);
    console.log('Editing member skills:', member.skills);
    
    // Handle different skills data structures
    let extractedSkills = [];
    if (member.skills && Array.isArray(member.skills)) {
      extractedSkills = member.skills.map(skill => {
        if (typeof skill === 'object' && skill.id !== undefined) {
          console.log('Skill object with ID:', skill);
          return skill.id;
        } else if (typeof skill === 'object' && skill.skill_id !== undefined) {
          console.log('Skill object with skill_id:', skill);
          return skill.skill_id;
        } else if (typeof skill === 'string' || typeof skill === 'number') {
          console.log('Skill primitive:', skill);
          return skill;
        }
        console.log('Unknown skill format:', skill);
        return skill;
      });
    }
    
    console.log('Extracted skill IDs:', extractedSkills);
    
    const formDataToSet = {
      name: member.name,
      email: member.email,
      mobile_no: member.phone || member.mobile_no || '', // Handle both phone and mobile_no
      emergency_contact: member.emergency_contact || '',
      password: '',
      role: member.role,
      skills: extractedSkills,
      is_active: member.is_active,
    };
    
    console.log('Setting form data:', formDataToSet);
    setFormData(formDataToSet);
    setEditingMember(member);
    setIsAddDialogOpen(true);
  };

  const handleBulkImport = async (importedMembers) => {
    let successCount = 0;
    let errorCount = 0;

    for (const member of importedMembers) {
      const success = await saveTeamMember(member, null);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    if (errorCount > 0) {
      toast({
        title: 'Partial Import',
        description: `Imported ${successCount} members successfully. ${errorCount} failed.`,
        variant: errorCount > successCount ? 'destructive' : 'default',
      });
    }

    return successCount > 0;
  };


  return (
      <div className="space-y-6 w-full p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-gray-600">Manage your team members and their access</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                </DialogTitle>
                <DialogDescription>
                  {editingMember
                    ? 'Update team member information and permissions'
                    : 'Add a new team member to your organization'}
                </DialogDescription>
              </DialogHeader>
              <TeamMemberForm
                formData={formData}
                editingMember={editingMember}
                onFormDataChange={setFormData}
                onSubmit={handleSubmit}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members ({pagination.total})</CardTitle>
          <CardDescription>Manage team member access and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamMembersTable
            teamMembers={teamMembers}
            onEdit={handleEdit}
            onDelete={deleteTeamMember}
            onToggleActive={toggleActive}
          />
          {teamMembers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No team members found. Add your first team member to get started.
            </div>
          )}
          
          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === pagination.current_page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page >= pagination.last_page}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* <ExcelImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleBulkImport}
      /> */}
    </div>
  );
};
